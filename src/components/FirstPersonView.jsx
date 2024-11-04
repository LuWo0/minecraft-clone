import { PointerLockControls as DreiPointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber"

export const FirstPersonView = () => {
    const { camera, gl } = useThree();

    return (
        <DreiPointerLockControls args={[camera, gl.domElement]} />
    )
}