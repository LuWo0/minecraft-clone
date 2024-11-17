import { useBox } from "@react-three/cannon";
import * as textures from "../public/images/textures";
import { useStore } from "../hooks/useStore";
import { useState } from "react";
import { useSound } from "../hooks/useSound";

export const Cube = ({position, texture}) => {

    const [isHovered, setIsHovered] = useState(false);
    const [ref] = useBox(() => ({
        type: "Static",
        position,
        friction: 0,
        linearDamping: 0.999, 
        material: {
            friction: 0,
            restitution: 0.1
        }
    }));

    const { playSound } = useSound();
    const addCube = useStore((state) => state.addCube);
    const removeCube = useStore((state) => state.removeCube);
    const activeTexture = useStore((state) => state.texture);

    const handleCubeClick = (event) => {
        event.stopPropagation();
        const clickedFace = Math.floor(event.faceIndex / 2);
        const {x, y, z} = ref.current.position;
        
        if (event.altKey) {
            removeCube(x, y, z);
            playSound("break");
            return;
        }

        // Play sound based on the active texture being placed
        const soundName = `${activeTexture}Place`;

        if (clickedFace === 0) {
            addCube(x + 1, y, z);
            playSound(soundName);
        } else if (clickedFace === 1) {
            addCube(x - 1, y, z);
            playSound(soundName);
        } else if (clickedFace === 2) {
            addCube(x, y + 1, z);
            playSound(soundName);
        } else if (clickedFace === 3) {
            addCube(x, y - 1, z);
            playSound(soundName);
        } else if (clickedFace === 4) {
            addCube(x, y, z + 1);
            playSound(soundName);
        } else if (clickedFace === 5) {
            addCube(x, y, z - 1);
            playSound(soundName);
        }
    };

    return (
        <mesh 
            onPointerMove={(event) => {
                event.stopPropagation();
                setIsHovered(true);
            }}
            onPointerOut={(event) => {
                event.stopPropagation();
                setIsHovered(false);
            }}
            onClick={(event => {
                handleCubeClick(event);
            })}
            ref={ref}
        >
            <boxGeometry attach="geometry"/>
            <meshStandardMaterial 
                color= {isHovered ? "grey" : "white" }
                map={textures[texture + "Texture"]}  
                transparent={true}
                opacity={texture === "glass" ? 0.8 : 1}
                attach="material"
            />
        </mesh>
    );
}