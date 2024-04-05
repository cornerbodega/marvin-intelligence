import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import TrafficGateScene from "../components/3d/TrafficGate/TrafficGateScene";
import { OrbitControls } from "@react-three/drei";
// import CameraController from "../components/3d/CameraController";
import CameraControl from "../components/3d/CameraControl";
// Cube component
import EnterIntelligenceAgencyButton from "../components/3d/Antechamber/EnterIntelligenceAgencyButton";
import StreetLight from "../components/3d/TrafficGate/StreetLight";
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
        <CameraControl />
        <pointLight position={[0, 0, -70]} />
        {/* add ambient light */}
        <ambientLight intensity={0.5} />
        {/* add directional light */}
        {/* <pointLight position={[0, 0, -90]} /> */}
        <pointLight position={[0.6, 2.19, 0]} />
        {/* <CameraController gateOpened={gateOpened} /> */}
        {/* <OrbitControls /> */}
        <TrafficGateScene setGateOpened={setGateOpened} />
        <EnterIntelligenceAgencyButton />
        <StreetLight />
      </Canvas>
    </div>
  );
}
