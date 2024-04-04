import React from "react";
import { useFrame } from "@react-three/fiber";

const CameraController = ({ gateOpened }) => {
  useFrame(({ camera }) => {
    if (gateOpened) {
      camera.position.z -= 0.05; // Adjust this value as needed
    }
  });

  return null; // This component does not render anything
};

export default CameraController;
