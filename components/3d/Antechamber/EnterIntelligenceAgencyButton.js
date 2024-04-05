import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import { useRouter } from "next/router"; // Import useRouter from next/router if you're using Next.js

export default function EnterIntelligenceAgencyButton() {
  const buttonMesh = useRef();
  const router = useRouter(); // Initialize useRouter for navigation

  // Animation logic for floating effect
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    buttonMesh.current.position.y = Math.sin(t) * 0.5;
  });

  // Function to handle the click event
  const handleClick = () => {
    router.push("/reports/folders/view-folders"); // Route the user to the specified path
  };

  return (
    <group ref={buttonMesh}>
      {/* Button background */}
      <Box
        args={[20, 5, 1]} // Size of the box
        position={[0, 3, -81]} // Position of the box
        rotation={[Math.PI / 8, 0, 0]} // Rotation of the box
        onClick={handleClick} // Attach the click event handler
      >
        <meshStandardMaterial
          attach="material"
          color="royalblue"
          emissive="blue" // Makes the material "glow" by itself
          emissiveIntensity={0.5} // Adjust the intensity of the glow
        />
      </Box>
      {/* Text for the button */}
      <Text
        position={[0, 3, -80]}
        rotation={[Math.PI / 8, 0, 0]}
        fontSize={1}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        Enter Intelligence Agency
      </Text>
    </group>
  );
}
