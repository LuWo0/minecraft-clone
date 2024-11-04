import { useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { useKeyboard } from "../hooks/useKeyboard";
import { dirtImg, grassImg, glassImg, woodImg, logImg } from "../images/images";

const items = [
  { id: 'dirt', name: 'Dirt', texture: dirtImg },
  { id: 'grass', name: 'Grass', texture: grassImg },
  { id: 'glass', name: 'Glass', texture: glassImg },
  { id: 'wood', name: 'Wood', texture: woodImg },
  { id: 'log', name: 'Log', texture: logImg },
];

export const PlayerUI = () => {
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

    const pressedTexture = Object.entries(textures).find(([_, isPressed]) => isPressed);
    if (pressedTexture) {
      setTexture(pressedTexture[0]);
    }
  }, [setTexture, dirt, grass, glass, wood, log]);

  return (
    <div className="player-ui">
      <div className="hotbar">
        {items.map((item) => (
          <div 
            key={item.id}
            className={`hotbar-slot ${activeTexture === item.id ? 'active' : ''}`}
            onClick={() => setTexture(item.id)}
          >
            <img src={item.texture} alt={item.name} />
            <span className="hotbar-number">{items.indexOf(item) + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 