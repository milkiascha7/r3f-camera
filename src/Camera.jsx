import { PerspectiveCamera, useHelper } from '@react-three/drei'
import React, { useRef } from 'react'
import { CameraHelper } from 'three'

const Camera = () => {
  const cameraRef = useRef()
  useHelper(cameraRef, CameraHelper, 'red')
  return (
    <>
      <PerspectiveCamera position={[10, 10, 10]} makeDefault ref={cameraRef} />
    </>
  )
}

export default Camera
