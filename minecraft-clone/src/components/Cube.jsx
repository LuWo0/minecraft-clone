import { useBox } from "@react-three/cannon";
import * as textures from "../images/textures";
import { useStore } from "../hooks/useStore";
import { useState } from "react";

export const Cube = ({position, texture}) => {

    const [isHovered, setIsHovered] = useState(false);
    const [ref] = useBox(() => ({
        type: "Static",
        position
    }));

    const [addCube, removeCube] = useStore((state) => [state.addCube, state.removeCube]);

    const activeTexture = textures[texture + "Texture"];

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
                event.stopPropagation();
                const clickedCubeFace = Math.floor(event.faceIndex / 2) // turns 12 sides cubes into 6 sided cubes
                const {x, y, z} = ref.current.position;
                
                if (event.altKey){
                    removeCube(x, y, z);
                    return;
                }
                else if (clickedCubeFace === 0){
                    addCube(x + 1, y, z);
                    return;
                }
                else if (clickedCubeFace === 1){
                    addCube (x - 1, y, z);
                    return;
                }
                else if (clickedCubeFace === 2){
                    addCube (x, y + 1, z);
                    return;
                }
                else if (clickedCubeFace === 3){
                    addCube (x, y - 1, z);
                    return;
                }
                else if (clickedCubeFace === 4){
                    addCube (x, y, z + 1);
                    return;
                }
                else if (clickedCubeFace === 5){
                    addCube (x, y, z - 1);
                    return;
                }
            })}
            ref={ref}
        >
            <boxGeometry attach="geometry"/>
            <meshStandardMaterial 
                color= {isHovered ? "grey" : "white" }
                map={activeTexture}  
                transparent={true}
                opacity={texture === "glass" ? 0.8 : 1}
                attach="material"
            />
        </mesh>
    );
}