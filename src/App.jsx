import {
  Stats,
  OrbitControls,
  useGLTF,
  Environment,
  Html
} from '@react-three/drei'
import { Canvas, useFrame, useHelper } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useControls, button } from 'leva'
import { Vector3, CameraHelper } from 'three'
import annotations from './annotations.json'
import Camera from './Camera'

function Arena({ controls, lerping, setLerping, to, target }) {
  const { scene } = useGLTF(
    'https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@camera/public/models/collision-world.glb'
  )
  //   const [to, setTo] = useState(new Vector3(10, 10, 10))
  //   const [target, setTarget] = useState()

  useFrame(({ camera }, delta) => {
    if (lerping) {
      camera.position.lerp(to, delta * 0.9, 0.2)
      controls.current.target.lerp(target, delta * 0.9, 0.2)
    }
  })

  return (
    <>
      <primitive
        object={scene.children[0]}
        castShadow
        receiveShadow
        material-envMapIntensity={0.4}
        onDoubleClick={(e) => {
          to(e.camera.position.clone())
          target(e.intersections[0].point.clone())
          setLerping(true)
        }}
      />
    </>
  )
}

function Annotations({ selected, gotoAnnotation }) {
  return (
    <>
      {annotations.map((a, i) => {
        return (
          <Html key={i} position={[a.lookAt.x, a.lookAt.y, a.lookAt.z]}>
            <svg
              height="34"
              width="34"
              transform="translate(-16 -16)"
              style={{ cursor: 'pointer' }}>
              <circle
                cx="17"
                cy="17"
                r="16"
                stroke="white"
                strokeWidth="2"
                fill="rgba(0,0,0,.66)"
                onClick={() => gotoAnnotation(i)}
              />
              <text
                x="12"
                y="22"
                fill="white"
                fontSize={17}
                fontFamily="monospace"
                style={{ pointerEvents: 'none' }}>
                {i + 1}
              </text>
            </svg>
            {a.description && i === selected && (
              <div
                id={'desc_' + i}
                className="annotationDescription"
                dangerouslySetInnerHTML={{ __html: a.description }}
              />
            )}
          </Html>
        )
      })}
    </>
  )
}

export default function App() {
  const ref = useRef()
  const [lerping, setLerping] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [to, setTo] = useState(new Vector3(10, 10, 10))
  const [target, setTarget] = useState(new Vector3(0, 1, 0))

  useControls('Camera', () => {
    console.log('creating buttons')

    // using forEach
    // const _buttons = {}
    // annotations.forEach((a) => {
    //   _buttons[a.title] = button(() => {
    //     setTo(a.position)
    //     setTarget(a.lookAt)
    //     setLerping(true)
    //   })
    // })
    // return _buttons

    // using reduce
    const _buttons = annotations.reduce(
      (acc, a) =>
        Object.assign(acc, {
          [a.title]: button(() => {
            setTo(a.position)
            setTarget(a.lookAt)
            setLerping(true)
          })
        }),
      {}
    )
    return _buttons
  })

  function gotoAnnotation(idx) {
    setTo(annotations[idx].position)
    setTarget(annotations[idx].lookAt)
    setSelected(idx)
    setLerping(true)
  }

  return (
    <Canvas
      //   camera={{ position: [10, 10, 10] }}
      onPointerDown={() => setLerping(false)}
      onWheel={() => setLerping(false)}
      shadows>
      <Camera />
      <directionalLight
        intensity={1}
        castShadow
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
      <Arena
        controls={ref}
        lerping={lerping}
        // setLerping={setLerping}
        to={to}
        target={target}
      />
      <Annotations selected={selected} gotoAnnotation={gotoAnnotation} />

      <Stats />
    </Canvas>
  )
}
