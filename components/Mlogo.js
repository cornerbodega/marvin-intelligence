import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import React, { useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "/3d/m-tree-pink.gltf");
  const ref = useRef();

  // Set initial camera position
  useThree(({ camera }) => {
    camera.position.set(-20, 20, 30);
    camera.lookAt(0, 0, 0);
  });

  // Add rotation to the model
  // useFrame((state, delta) => {
  //   ref.current.rotation.y -= delta * 0.05; // Adjust rotation speed here
  //   ref.current.rotation.x -= delta * 0.05; // Adjust rotation speed here
  // });
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    ref.current.position.y = 0.1 + Math.sin(time * 0.02) * 0.5; // This will move the object up and down
    // ref.current.rotation.y += delta * 0.005; // This will continue to rotate the object
  });
  return (
    <>
      <primitive scale={0.2} ref={ref} object={gltf.scene} />
    </>
  );
};

const Mlogo = ({ onClick }) => {
  return (
    <div
      style={{
        height: "300px",
        width: "400px",
        borderRadius: "50%",
      }}
    >
      <Canvas>
        <OrbitControls minDistance={3} maxDistance={3} />
        <ambientLight intensity={2} />
        <pointLight position={[-30, -30, -30]} intensity={0.5} />
        <pointLight position={[20, 20, 20]} intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Model />
      </Canvas>
    </div>
  );
};

export default Mlogo;
