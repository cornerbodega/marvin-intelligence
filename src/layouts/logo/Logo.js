import { useState, useEffect } from "react";
import Head from "next/head";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
// import RotatingLight from "@/components/RotatingLight";
import Mtree from "../../../components/3d/Mtree/1Mtree";
const Logo = () => {
  return (
    <>
      <Canvas style={{ width: "200px", height: "200px", marginLeft: "0" }}>
        <PerspectiveCamera makeDefault position={[-8, 10, 15]} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 10, 0]} intensity={1.5} />
        <Mtree />
        {/* <RotatingLight /> */}
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default Logo;
