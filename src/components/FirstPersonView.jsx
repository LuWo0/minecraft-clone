import { PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export const FirstPersonView = () => {
    const { camera, gl } = useThree();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyM') {
                // Release pointer lock when menu is opened
                document.exitPointerLock();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <PointerLockControls args={[camera, gl.domElement]} />
    );
};