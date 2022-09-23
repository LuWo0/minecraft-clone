import create from "zustand";
import { nanoid } from "nanoid";

export const useStore = create((set) => ({
    texture: "dirt",
    cubes: [
        {
        key: nanoid(),
        pos: [1,1,1],
        texture: "dirt",
        },
        {
            key: nanoid(),
            pos: [2,1,1],
            texture: "glass",
        },
        {
            key: nanoid(),
            pos: [3,1,1],
            texture: "wood",
        }
    ],

    addCube: (x, y, z) => {
        set((prev) => ({
            cubes: [
                ...prev.cubes,
                {
                    key: nanoid(),
                    pos: [x,y,z],
                    texture: prev.texture
                }
            ]
        }));
    },
    removeCube: () => {},
    setTexture: () => {},
    saveWorld: () => {},
    resetWorld: () => {},
}));