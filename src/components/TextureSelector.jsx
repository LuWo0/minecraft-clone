import { useEffect } from "react";
import { useState } from "react";
import { useKeyboard } from "../hooks/useKeyboard";
import { useStore } from "../hooks/useStore";
import { dirtImg, grassImg, glassImg, woodImg, logImg } from "../public/images/images";

const images = {
    dirt: dirtImg,
    grass: grassImg,
    glass: glassImg,
    wood: woodImg,
    log: logImg,
};

export const TextureSelector = () => {
    const [visible, setVisible] = useState(false);
    const activeTexture = useStore((state) => state.texture);
    const setTexture = useStore((state) => state.setTexture);
    
    const {
        dirt,
        grass,
        glass,
        wood,
        log,
    } = useKeyboard();

    useEffect(() => {
        const textures = {
            dirt, 
            grass, 
            glass, 
            wood, 
            log,
        }

        const pressedTexture = Object.entries(textures).find(([k, v]) => v);
        if (pressedTexture){
            setTexture(pressedTexture[0]);
        }
    },[setTexture, dirt, grass, glass, wood, log]);

    useEffect(() => {
        const visibilityTimeout = setTimeout(() => {
            setVisible(false);
        }, 2000);
        setVisible(true);
        return () => {
            clearTimeout(visibilityTimeout);
        }
    },[activeTexture])

    return visible && (
        <div className="absolute centered texture-selector">
            {Object.entries(images).map(([key, src]) => (
                <img 
                    key={key} 
                    src={src} 
                    alt={key}
                    className={`${key === activeTexture ? "active" : ""}`}
                />
            ))}
        </div>
    )
};