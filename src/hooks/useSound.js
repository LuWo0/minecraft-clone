import { create } from 'zustand'

const sounds = {
  place: new Audio('/sounds/block-place.mp3'),
  break: new Audio('/sounds/block-break.mp3'),
  walk: new Audio('/sounds/walk.mp3')
}

export const useSound = create((set) => ({
  playSound: (soundName) => {
    sounds[soundName].currentTime = 0
    sounds[soundName].play()
  }
})) 