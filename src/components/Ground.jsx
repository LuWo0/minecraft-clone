import { usePlane } from "@react-three/cannon";
import { groundTexture } from "../public/images/textures";
import { useStore } from "../hooks/useStore";
import { useSound } from "../hooks/useSound";


export const Ground = () => {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2,0,0], //rotating 90 deg, flattening the ground 
        position: [0, -0.5, 0],
    }));

    const addCube = useStore((state) => state.addCube);
    const { playSound } = useSound();

    groundTexture.repeat.set(100, 100);

    return (
        <mesh 
        onClick={(event) => {
            event.stopPropagation();
            const [x, y, z] = Object.values(event.point).map(value => Math.ceil(value));
            addCube(x, y, z);
            const currentTexture = useStore.getState().texture;
            playSound(`${currentTexture}Place`);
        }}
        ref={ref}>
            <planeGeometry attach="geometry" args={[100, 100]}/>
            <meshStandardMaterial attach="material" map={groundTexture}/>
        </mesh>
    )
}