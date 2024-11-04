import { create } from "zustand";
import { nanoid } from "nanoid";

const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key));
const setLocalStorage = (key, value) =>
  window.localStorage.setItem(key, JSON.stringify(value));

export const useStore = create((set) => ({
  texture: "dirt",
  cubes: getLocalStorage("cubes") || [],

  addCube: (x, y, z) => {
    set((prev) => ({
      cubes: [
        ...prev.cubes,
        {
          key: nanoid(),
          pos: [x, y, z],
          texture: prev.texture,
        },
      ],
    }));
  },
  removeCube: (x, y, z) => {
    set((prev) => ({
      cubes: prev.cubes.filter((cube) => {
        const [X, Y, Z] = cube.pos;
        return X !== x || Y !== y || Z !== z;
      }),
    }));
  },
  setTexture: (t) => {
    set(() => ({
      texture: t,
    }));
  },
  saveWorld: () => {
    const state = useStore.getState()
    localStorage.setItem('minecraft-world', JSON.stringify(state.cubes))
  },
  loadWorld: () => {
    const saved = localStorage.getItem('minecraft-world')
    if (saved) {
      set({ cubes: JSON.parse(saved) })
    }
  },
  resetWorld: () => {
    set(() => ({
      cubes: [],
    }));
  },
}));
