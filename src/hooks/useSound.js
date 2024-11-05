import { create } from "zustand";
import bgMusic from "../public/sounds/bg_calm.mp3";
import dirtPlaceSound from "../public/sounds/dirt.mp3";
import glassPlaceSound from "../public/sounds/glass.mp3";
import grassPlaceSound from "../public/sounds/grass.mp3";
import logPlaceSound from "../public/sounds/log.mp3";
import woodPlaceSound from "../public/sounds/wood.mp3";

const soundFiles = {
  bgMusic,
  dirtPlace: dirtPlaceSound,
  glassPlace: glassPlaceSound,
  grassPlace: grassPlaceSound,
  logPlace: logPlaceSound,
  woodPlace: woodPlaceSound
};

// Create a single background music instance
const bgMusicAudio = new Audio(bgMusic);
bgMusicAudio.loop = true;

export const useSound = create((set) => ({
  isMusicPlaying: false,
  playSound: (soundName) => {
    if (!soundFiles[soundName]) {
      console.error(`Sound ${soundName} not found`);
      return;
    }
    // Create a new audio instance each time
    const sound = new Audio(soundFiles[soundName]);
    const playPromise = sound.play();
    if (playPromise) {
      playPromise.catch(err => {
        console.error(`Error playing ${soundName}:`, err.message);
      });
    }
  },
  toggleMusic: () => {
    set((state) => {
      const newIsPlaying = !state.isMusicPlaying;
      if (newIsPlaying) {
        const playPromise = bgMusicAudio.play();
        if (playPromise) {
          playPromise.catch(err => {
            console.error('Error playing background music:', err.message);
            set({ isMusicPlaying: false });
          });
        }
      } else {
        bgMusicAudio.pause();
      }
      return { isMusicPlaying: newIsPlaying };
    });
  }
}));
