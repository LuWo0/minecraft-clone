import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Ground } from "./components/Ground";
import { Player } from "./components/Player";
import { FirstPersonView } from "./components/FirstPersonView";
import { Cubes } from "./components/Cubes";
import { PlayerUI } from "./components/PlayerUI";
import { Crosshair } from "./components/Crosshair";
import { Menu } from "./components/Menu";
import { DayNightCycle } from "./components/DayNightCycle";
import { useAutoMusic } from "./hooks/useAutoMusic";
import { useGameTime } from "./hooks/useGameTime";

function App() {
  useAutoMusic();
  const time = useGameTime((state) => state.time);

  return (
    <>
      <Canvas shadows>
        <Sky 
          sunPosition={[
            Math.cos(time * Math.PI * 2) * 100,
            Math.sin(time * Math.PI * 2) * 100,
            20
          ]} 
          mieCoefficient={0.001} 
          mieDirectionalG={0.99}
          rayleigh={0.2}
          turbidity={10}
        />
        <DayNightCycle />
        <FirstPersonView />
        <Physics>
          <Player />
          <Cubes />
          <Ground />
        </Physics>
      </Canvas>
      <Crosshair />
      <PlayerUI />
      <Menu />
    </>
  );
}

export default App;
