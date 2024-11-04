import { useFrame, useThree } from "@react-three/fiber"
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useKeyboard } from "../hooks/useKeyboard";

const JUMP_FORCE = 3;
const SPEED = 4;

export const Player = () => {
    const {moveBackward, moveForward, moveLeft, moveRight, jump} = useKeyboard();
    
    const { camera } = useThree();

    const [ref, api] = useSphere(() => ({
        mass:1,
        type: "Dynamic",
        position: [0,1,10]
    }))

    // setting up a reference to the velocity that subscribes to the velocity of the sphere
    const vel = useRef([0,0,0]);
    useEffect(()=> {
        api.velocity.subscribe((v) => vel.current = v );
    }, [api.velocity]);

    // Setting the player to some coordinates of the sphere 
    const position = useRef([0,0,0]);

    // rerun the sphere every time the sphere api's position changes
    useEffect(()=> {
        api.position.subscribe((pos) => position.current = pos );
    }, [api.position]);

    // on every frame, camera will follow the reference sphere
    useFrame(() => {
        camera.position.copy(new Vector3(position.current[0], position.current[1], position.current[2]));

        const direction = new Vector3( 
        );

        const frontVector = new Vector3(
            0,
            0,
            (moveBackward ? 1 : 0) - (moveForward ? 1 : 0) // when both w and s are pressed together, they cancel each other out
        );

        const sideVector = new Vector3(
            (moveLeft ? 1 : 0) - (moveRight ? 1 : 0), // when both a and d are pressed together, they cancel each other out
            0,
            0,
        );
        
        
        direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED)
        .applyEuler(camera.rotation);
        
        api.velocity.set(direction.x, vel.current[1], direction.z);

        if (jump && Math.abs(vel.current[1]) < 0.05){
            api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
        }
    })

    return (
        <mesh ref={ref}></mesh>
    )
}