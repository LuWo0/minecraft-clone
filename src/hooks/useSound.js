import { create } from "zustand";
import bgMusic from "../public/sounds/bg_calm.mp3";
import dirtPlaceSound from "../public/sounds/dirt.mp3";
import glassPlaceSound from "../public/sounds/glass.mp3";
import grassPlaceSound from "../public/sounds/grass.mp3";
import logPlaceSound from "../public/sounds/log.mp3";
import woodPlaceSound from "../public/sounds/wood.mp3";
import breakSound from "../public/sounds/break.mp3";
import walkSound from "../public/sounds/walk.mp3";
import rainSound from "../public/sounds/rain.mp3";
import rain2Sound from "../public/sounds/rain2.mp3";
import rain3Sound from "../public/sounds/rain3.mp3";
import rain4Sound from "../public/sounds/rain4.mp3";
import thunder1Sound from "../public/sounds/thunder1.mp3";
import thunder2Sound from "../public/sounds/thunder2.mp3";
import thunder3Sound from "../public/sounds/thunder3.mp3";


// Helper functions
const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) ?? 0.5;
const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const soundFiles = {
  bgMusic,
  dirtPlace: dirtPlaceSound,
  glassPlace: glassPlaceSound,
  grassPlace: grassPlaceSound,
  logPlace: logPlaceSound,
  woodPlace: woodPlaceSound,
  break: breakSound,
  walk: walkSound,
  rain: rainSound,
  rain2: rain2Sound,
  rain3: rain3Sound,
  rain4: rain4Sound,
  thunder1: thunder1Sound,
  thunder2: thunder2Sound,
  thunder3: thunder3Sound,
};

// Create a single background music instance
const bgMusicAudio = new Audio(bgMusic);
bgMusicAudio.loop = true;
bgMusicAudio.volume = getLocalStorage("musicVolume");

// Create separate audio instances for walking to allow overlapping
const walkAudio1 = new Audio(walkSound);
const walkAudio2 = new Audio(walkSound);
let lastWalkSound = walkAudio1;

// Create a class to manage overlapping rain sound
class RainSoundManager {
    constructor(soundSrc, volume = 0) {
        // Create more instances for better overlapping
        this.audioPool = [
            new Audio(soundSrc),
            new Audio(soundSrc),
            new Audio(soundSrc),
            new Audio(soundSrc)  // Four instances for better overlap
        ];
        
        this.audioPool.forEach(audio => {
            audio.loop = false;
            audio.volume = volume;
        });
        
        this.currentIndex = 0;
        this.isPlaying = false;
        this.overlap = 0.5; // 50% overlap between sounds
    }

    play(volume) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.audioPool.forEach(audio => audio.volume = volume);

        // Start playing all instances with offset
        const startStaggeredPlayback = () => {
            this.audioPool.forEach((audio, index) => {
                const delay = (index * (audio.duration || 1) * (1 - this.overlap));
                setTimeout(() => {
                    if (this.isPlaying) {
                        audio.currentTime = 0;
                        audio.play().catch(error => console.error('Audio play failed:', error));
                        
                        // Set up looping for this instance
                        audio.onended = () => {
                            if (this.isPlaying) {
                                audio.currentTime = 0;
                                audio.play().catch(error => console.error('Audio loop failed:', error));
                            }
                        };
                    }
                }, delay * 1000);
            });
        };

        // Load audio duration first if needed
        if (!this.audioPool[0].duration) {
            this.audioPool[0].addEventListener('loadedmetadata', () => {
                startStaggeredPlayback();
            }, { once: true });
        } else {
            startStaggeredPlayback();
        }
    }

    setVolume(volume) {
        this.audioPool.forEach(audio => audio.volume = volume);
    }

    stop() {
        this.isPlaying = false;
        this.audioPool.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            audio.onended = null;
        });
    }
}

// Create managers for each rain sound
const rain1Manager = new RainSoundManager(rainSound);
const rain2Manager = new RainSoundManager(rain2Sound);
const rain3Manager = new RainSoundManager(rain3Sound);
const rain4Manager = new RainSoundManager(rain4Sound);

// Create a class to manage thunder sounds
class ThunderManager {
    constructor() {
        // Create audio instances for each thunder sound
        this.thunderSounds = [
            new Audio(thunder1Sound),
            new Audio(thunder2Sound),
            new Audio(thunder3Sound)
        ];
        
        this.isEnabled = false;
        this.timeoutId = null;
        this.minDelay = 10000;  // Minimum 10 seconds between thunder
        this.maxDelay = 45000;  // Maximum 45 seconds between thunder
    }

    start(baseVolume) {
        this.isEnabled = true;
        this.scheduleNextThunder(baseVolume);
    }

    stop() {
        this.isEnabled = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.thunderSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    scheduleNextThunder(baseVolume) {
        if (!this.isEnabled) return;

        const delay = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
        
        this.timeoutId = setTimeout(() => {
            if (this.isEnabled) {
                this.playRandomThunder(baseVolume);
                this.scheduleNextThunder(baseVolume);
            }
        }, delay);
    }

    playRandomThunder(baseVolume) {
        const thunderSound = this.thunderSounds[Math.floor(Math.random() * this.thunderSounds.length)];
        thunderSound.volume = baseVolume * (0.7 + Math.random() * 0.3); // Random volume variation
        thunderSound.currentTime = 0;
        thunderSound.play().catch(error => console.error('Thunder play failed:', error));
    }

    setVolume(baseVolume) {
        this.thunderSounds.forEach(sound => {
            sound.volume = baseVolume;
        });
    }
}

// Create thunder manager instance
const thunderManager = new ThunderManager();

export const useSound = create((set, get) => ({
  isMusicPlaying: false,
  musicVolume: getLocalStorage("musicVolume"),
  effectsVolume: getLocalStorage("effectsVolume"),
  isRainPlaying: false,
  rainVolume: 0,
  activeRainInstance: 1, // Track which instance is currently active
  isThunderEnabled: false,

  setMusicVolume: (volume) => {
    bgMusicAudio.volume = volume;
    setLocalStorage("musicVolume", volume);
    set({ musicVolume: volume });
  },

  setEffectsVolume: (volume) => {
    setLocalStorage("effectsVolume", volume);
    set({ effectsVolume: volume });
    
    if (get().isRainPlaying) {
      const baseVolume = volume * 0.3;
      rain1Manager.setVolume(baseVolume * 0.8);
      rain2Manager.setVolume(baseVolume * 0.6);
      rain3Manager.setVolume(baseVolume * 0.7);
      rain4Manager.setVolume(baseVolume * 0.5);
    }
  },

  playSound: (soundName) => {
    if (!soundFiles[soundName]) {
      console.error(`Sound ${soundName} not found`);
      return;
    }

    const effectsVolume = get().effectsVolume;

    if (soundName === "walk") {
      lastWalkSound = lastWalkSound === walkAudio1 ? walkAudio2 : walkAudio1;
      lastWalkSound.currentTime = 0;
      lastWalkSound.volume = 0.3 * effectsVolume;
      lastWalkSound.play().catch(err => {
        console.error("Error playing walk sound:", err.message);
      });
      return;
    }

    const sound = new Audio(soundFiles[soundName]);
    sound.volume = effectsVolume;
    sound.play().catch(err => {
      console.error(`Error playing ${soundName}:`, err.message);
    });
  },

  toggleMusic: () => {
    set((state) => {
      const newIsPlaying = !state.isMusicPlaying;
      if (newIsPlaying) {
        const playPromise = bgMusicAudio.play();
        if (playPromise) {
          playPromise.catch((err) => {
            console.error("Error playing background music:", err.message);
            set({ isMusicPlaying: false });
          });
        }
      } else {
        bgMusicAudio.pause();
      }
      return { isMusicPlaying: newIsPlaying };
    });
  },

  playRain: () => {
    const state = get();
    if (!state.isRainPlaying) {
      const baseVolume = state.effectsVolume * 0.3;
      
      // Start rain sounds
      rain1Manager.play(baseVolume * 0.8);
      setTimeout(() => rain2Manager.play(baseVolume * 0.6), 100);
      setTimeout(() => rain3Manager.play(baseVolume * 0.7), 200);
      setTimeout(() => rain4Manager.play(baseVolume * 0.5), 300);

      // Start thunder if enabled
      if (state.isThunderEnabled) {
        thunderManager.start(baseVolume * 1.2); // Slightly louder than rain
      }

      set({ isRainPlaying: true });
    }
  },

  stopRain: () => {
    rain1Manager.stop();
    rain2Manager.stop();
    rain3Manager.stop();
    rain4Manager.stop();
    thunderManager.stop();
    set({ isRainPlaying: false });
  },

  toggleThunder: () => {
    const state = get();
    const newThunderState = !state.isThunderEnabled;
    
    if (newThunderState && state.isRainPlaying) {
      thunderManager.start(state.effectsVolume * 0.3 * 1.2);
    } else {
      thunderManager.stop();
    }
    
    set({ isThunderEnabled: newThunderState });
  },

  updateRainVolume: (intensity) => {
    const state = get();
    if (state.isRainPlaying) {
      const baseVolume = state.effectsVolume * 0.3;
      
      rain1Manager.setVolume(baseVolume * 0.8 * intensity);
      rain2Manager.setVolume(baseVolume * 0.6 * intensity);
      rain3Manager.setVolume(baseVolume * 0.7 * intensity);
      rain4Manager.setVolume(baseVolume * 0.5 * intensity);
      
      if (state.isThunderEnabled) {
        thunderManager.setVolume(baseVolume * 1.2 * intensity);
      }
    }
  },

  // Enhanced sync method for all rain sounds
  syncRainAudio: () => {
    if (get().isRainPlaying) {
      Object.values(allRainGroups).forEach(group => {
        const mainTime = group[0].currentTime;
        
        // Sync other instances in the group
        group.slice(1).forEach(audio => {
          if (Math.abs(audio.currentTime - mainTime) > 0.1) {
            audio.currentTime = mainTime;
          }
          // Restart if paused
          if (audio.paused) {
            audio.currentTime = mainTime;
            audio.play().catch(error => 
              console.error('Error restarting audio:', error)
            );
          }
        });
      });
    }
  }
}));
