import {
  Canvas,
  useFrame,
  ThreeElements,
  useThree,
  useLoader,
} from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import React, { useRef } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const Model = () => {
  // Load the model from glTF 2.0 (.glb or .gltf) file in /public
  const gltf = useLoader(GLTFLoader, "/3d/m-tree-pink.gltf");
  const ref = useRef();

  // Set initial camera position
  useThree(({ camera }) => {
    camera.position.x = -20;
    camera.position.y = 20;
    camera.position.z = 30;
    camera.lookAt(0, 0, 0);
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
      // className="m-0"
      style={{
        // width: "80%",
        // display: "flex",

        borderRadius: "50%",
        // background: "red",
        height: "300px",
        width: "400px",
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
