import { useFrame, useThree } from "@react-three/fiber"
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useKeyBoard } from "../hooks/useKeyboard";

export const Player = () => {
    const actions = useKeyBoard();
    console.log('actions', Object.entries(actions).filter(([ket, val]) => val));

    const { camera } = useThree();

    const [ref, api] = useSphere(() => ({
        mass:1,
        type: "Dynamic",
        position: [0,1,10]
    }))

    // setting up a reference to the velocity that subscribes to the velocity of the sphere
    const velocity = useRef([0,0,0]);
    useEffect(()=> {
        api.velocity.subscribe((vel) => velocity.current = vel );
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

        api.velocity.set(0, 0, 0);
    })

    return (
        <mesh ref={ref}></mesh>
    )
}