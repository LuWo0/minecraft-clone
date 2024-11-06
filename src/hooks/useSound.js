import { create } from "zustand";
import bgMusic from "../public/sounds/bg_calm.mp3";
import dirtPlaceSound from "../public/sounds/dirt.mp3";
import glassPlaceSound from "../public/sounds/glass.mp3";
import grassPlaceSound from "../public/sounds/grass.mp3";
import logPlaceSound from "../public/sounds/log.mp3";
import woodPlaceSound from "../public/sounds/wood.mp3";
import breakSound from "../public/sounds/break.mp3";
import walkSound from "../public/sounds/walk.mp3";

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
};

// Create a single background music instance
const bgMusicAudio = new Audio(bgMusic);
bgMusicAudio.loop = true;
bgMusicAudio.volume = getLocalStorage("musicVolume");

// Create separate audio instances for walking to allow overlapping
const walkAudio1 = new Audio(walkSound);
const walkAudio2 = new Audio(walkSound);
let lastWalkSound = walkAudio1;

export const useSound = create((set, get) => ({
  isMusicPlaying: false,
  musicVolume: getLocalStorage("musicVolume"),
  effectsVolume: getLocalStorage("effectsVolume"),

  setMusicVolume: (volume) => {
    bgMusicAudio.volume = volume;
    setLocalStorage("musicVolume", volume);
    set({ musicVolume: volume });
  },

  setEffectsVolume: (volume) => {
    setLocalStorage("effectsVolume", volume);
    set({ effectsVolume: volume });
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
}));
