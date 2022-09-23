import { usePlane } from "@react-three/cannon";
import { groundTexture } from "../images/textures";
import { useStore } from "../hooks/useStore";


export const Ground = () => {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2,0,0], //rotating 90 deg, flattening the ground 
        position: [0, -0.5, 0],
    }));

    const [addCube] = useStore((state) => [state.addCube]);

    groundTexture.repeat.set(100, 100);

    return (
        <mesh 
        onClick={(event) => {
            event.stopPropagation();
            const [x, y, z] = Object.values(event.point).map(value => Math.ceil(value));
            addCube(x, y, z);
        }}
        ref={ref}>
            <planeGeometry attach="geometry" args={[100, 100]}/>
            <meshStandardMaterial attach="material" map={groundTexture}/>
        </mesh>
    )
}