import { Stats, OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { useControls, button } from 'leva'
import annotations from './annotations.json'
import TWEEN from '@tweenjs/tween.js'

function Arena({ controls }) {
  const { nodes, materials } = useGLTF(
    'https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@camera/public/models/collision-world.glb'
  )
  const { camera } = useThree()

  useControls('Camera', () => {
    console.log('creating buttons')

    // using reduce
    const _buttons = annotations.reduce(
      (acc, { title, position, lookAt }) =>
        Object.assign(acc, {
          [title]: button(() => {
            // change target
            new TWEEN.Tween(controls.current.target)
              .to(
                {
                  x: lookAt.x,
                  y: lookAt.y,
                  z: lookAt.z
                },
                2100
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start()

            // change camera position
            new TWEEN.Tween(camera.position)
              .to(
                {
                  x: position.x,
                  y: position.y,
                  z: position.z
                },
                2000
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start()
          })
        }),
      {}
    )
    return _buttons
  })

  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.Cube004.geometry}
        material={materials['Material.001']}
        position={[7.68, -5.59, 26.38]}
        scale={0.5}
        castShadow
        receiveShadow
        material-envMapIntensity={0.4}
        onDoubleClick={({ point }) => {
          new TWEEN.Tween(controls.current.target)
            .to(
              {
                x: point.x,
                y: point.y,
                z: point.z
              },
              1000
            )
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
        }}
      />
    </group>
  )
}

function Tween() {
  useFrame(() => {
    TWEEN.update()
  })
}

export default function App() {
  const ref = useRef()

  return (
    <Canvas camera={{ position: [10, 10, 10] }} shadows>
      <directionalLight
        intensity={1}
        castShadow={true}
        shadow-bias={-0.0002}
        shadow-mapSize={[2048, 2048]}
        position={[85.0, 80.0, 70.0]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <Environment
        files="https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@camera/public/img/drakensberg_solitary_mountain_1k.hdr"
        background
      />
      <OrbitControls ref={ref} target={[0, 1, 0]} />
      <Arena controls={ref} />
      <Tween />
      <Stats />
    </Canvas>
  )
}
