import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function Sky() {
  const lightRef = useRef()
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.1
    lightRef.current.position.x = Math.cos(time) * 100
    lightRef.current.position.y = Math.sin(time) * 100
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        ref={lightRef}
        intensity={1} 
        castShadow 
      />
      <mesh>
        <sphereGeometry args={[500, 32, 32]} />
        <meshBasicMaterial color="#87CEEB" side={2} />
      </mesh>
    </>
  )
} 