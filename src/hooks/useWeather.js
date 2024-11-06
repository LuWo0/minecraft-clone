import { create } from 'zustand';

export const useWeather = create((set) => ({
    isRaining: false,
    rainIntensity: 0.5, // 0 to 1
    
    startRain: () => set({ isRaining: true }),
    stopRain: () => set({ isRaining: false }),
    setRainIntensity: (intensity) => set({ rainIntensity: intensity }),
    
    toggleRain: () => set((state) => ({ isRaining: !state.isRaining })),
})); 