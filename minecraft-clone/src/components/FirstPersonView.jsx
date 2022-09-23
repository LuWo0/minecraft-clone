import { PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber"

export const FirstPersonView = () => {
    const { camera, gl } = useThree();

    return (
        <PointerLockControls args={[camera, gl.domElement]} />
    )
}