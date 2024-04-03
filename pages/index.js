import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import AgencyBuilding from "../components/3d/AgencyBuilding";

// Cube component

// Home component
export default function Home() {
  // Assuming the top nav height and side nav width
  const topNavHeight = 60; // Adjust as needed
  const sideNavWidth = 50; // Adjust as needed

  return (
    <div
      style={{
        height: `calc(100vh - ${topNavHeight}px)`,
        width: `calc(100vw - ${sideNavWidth}px)`,
        position: "absolute", // This makes it fill the exact remaining space
        top: `${topNavHeight}px`, // Start below the top nav
        left: `${sideNavWidth}px`, // Start to the right of the side nav
      }}
    >
      <Canvas style={{ height: "100%", width: "100%" }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <AgencyBuilding />
      </Canvas>
    </div>
  );
}
