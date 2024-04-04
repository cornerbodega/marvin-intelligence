import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import TrafficGateScene from "../components/3d/TrafficGate/TrafficGateScene";
import { OrbitControls } from "@react-three/drei";
import CameraController from "../components/3d/CameraController";
// Cube component

// Home component
// Home component
export default function Home() {
  // State to track if the gate is open
  const [gateOpened, setGateOpened] = useState(false);

  return (
    <div
      style={{
        height: `calc(100vh - 60px)`, // Assuming a fixed size for simplicity
        width: `calc(100vw - 50px)`,
        position: "absolute",
        top: "60px",
        left: "50px",
      }}
    >
      <Canvas
        camera={{ position: [0, 1.2, 5], fov: 75 }}
        style={{ height: "100%", width: "100%" }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <CameraController gateOpened={gateOpened} />{" "}
        {/* Use the CameraController here */}
        <TrafficGateScene setGateOpened={setGateOpened} />
      </Canvas>
    </div>
  );
}
