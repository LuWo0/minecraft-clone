import { usePlane } from "@react-three/cannon";
import { NearestFilter, RepeatWrapping } from "three";
import { groundTexture } from "../images/textures";

export const Ground = () => {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2,0,0], //rotating 90 deg, flattening the ground 
        position: [0, 0, 0],
    }));

    // prevent smearing of the image
    groundTexture.magFilter = NearestFilter;
    // To prevent images from stretching
    groundTexture.wrapS = RepeatWrapping;
    groundTexture.wrapT = RepeatWrapping;
    groundTexture.repeat.set(100, 100);

    return (
        <mesh ref={ref}>
            <planeGeometry attach="geometry" args={[100, 100]}/>
            <meshStandardMaterial attach="material" map={groundTexture}/>
        </mesh>
    )
}