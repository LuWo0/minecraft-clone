import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeather } from '../hooks/useWeather';
import { useSound } from '../hooks/useSound';

export const Rain = () => {
    const rainCount = 10000;
    const rainGeometry = useRef();
    const isRaining = useWeather((state) => state.isRaining);
    const rainIntensity = useWeather((state) => state.rainIntensity);
    const { playRain, stopRain, updateRainVolume } = useSound();

    // Simple effect for rain sound control
    useEffect(() => {
        if (isRaining) {
            playRain();
        } else {
            stopRain();
        }

        return () => stopRain();
    }, [isRaining]);

    // Effect for volume updates
    useEffect(() => {
        if (isRaining) {
            updateRainVolume(rainIntensity);
        }
    }, [isRaining, rainIntensity]);

    // Create rain drop positions
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount);
    
    for (let i = 0; i < rainCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100; // x
        positions[i * 3 + 1] = Math.random() * 50; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
        velocities[i] = 0.1 + Math.random() * 0.3; // Random fall speed
    }

    useFrame(() => {
        if (!isRaining) return;
        
        const positions = rainGeometry.current.attributes.position.array;
        
        for (let i = 0; i < rainCount; i++) {
            positions[i * 3 + 1] -= velocities[i]; // Move raindrop down

            // Reset raindrop to top when it hits bottom
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = 50;
                positions[i * 3] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            }
        }

        rainGeometry.current.attributes.position.needsUpdate = true;
    });

    if (!isRaining) return null;

    return (
        <points>
            <bufferGeometry ref={rainGeometry}>
                <bufferAttribute
                    attach="attributes-position"
                    count={rainCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                color="#aaddff"
                size={0.1}
                transparent
                opacity={rainIntensity}
                sizeAttenuation
            />
        </points>
    );
}; 