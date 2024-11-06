import { useFrame } from "@react-three/fiber";
import { useGameTime } from "../hooks/useGameTime";

export const DayNightCycle = () => {
    const { time, updateTime } = useGameTime();

    useFrame(() => {
        updateTime();
    });

    // Calculate sun position based on time
    const theta = time * Math.PI * 2;
    const phi = Math.PI * 0.5;

    const sunX = Math.cos(theta) * 100;
    const sunY = Math.sin(theta) * 100;
    const sunZ = Math.sin(phi) * 100;

    // Calculate ambient light intensity based on time
    // Brightest at noon (0.25), darkest at midnight (0.75)
    const ambientIntensity = Math.sin(time * Math.PI * 2) * 0.3 + 0.5;
    
    // Calculate sun color based on time
    const sunColor = time > 0.25 && time < 0.75 
        ? '#ff8844' // Sunset/sunrise color
        : '#ffffff'; // Normal sun color

    return (
        <>
            <ambientLight intensity={ambientIntensity} />
            <directionalLight 
                position={[sunX, sunY, sunZ]} 
                intensity={1.5}
                color={sunColor}
                castShadow
            />
        </>
    );
}; 