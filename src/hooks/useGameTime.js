import { create } from 'zustand';

export const useGameTime = create((set) => ({
    time: 0,
    timeSpeed: 0.0001,
    isPaused: false,

    updateTime: () => set((state) => ({
        time: state.isPaused ? state.time : (state.time + state.timeSpeed) % 1
    })),

    togglePause: () => set((state) => ({
        isPaused: !state.isPaused
    })),

    setTimeSpeed: (speed) => set({
        timeSpeed: speed
    })
})); 