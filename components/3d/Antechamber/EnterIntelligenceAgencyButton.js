import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import { useRouter } from "next/router"; // Import useRouter from next/router if you're using Next.js

export default function EnterIntelligenceAgencyButton() {
  const [buttonText, setButtonText] = useState("Enter Intelligence Agency");
  const buttonMesh = useRef();
  const router = useRouter(); // Initialize useRouter for navigation
  const { camera } = useThree();
  // Animation logic for floating effect
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    buttonMesh.current.position.y = (Math.sin(t) * 0.5 + 0.45) * 0.5;

    if (camera.position.z < -60) {
      handleClick();
    }
  });

  // Function to handle the click event
  const handleClick = () => {
    setButtonText("Entering..."); // Update the text displayed on the button
    router.push("/intelnet/folders/view-intelnet"); // Route the user to the specified path
  };

  return (
    <group ref={buttonMesh}>
      {/* Button background */}
      <Box
        args={[20, 5, 1]} // Size of the box
        position={[0, 3, -81]} // Position of the box
        rotation={[Math.PI / 8, 0, 0]} // Rotation of the box
        onClick={handleClick} // Attach the click event handler
        onPointerOver={() => (document.body.style.cursor = "pointer")} // Change cursor to pointer on hover
        onPointerOut={() => (document.body.style.cursor = "auto")} // Change cursor back to default on mouse leave
      >
        <meshStandardMaterial
          attach="material"
          color="royalblue"
          emissive="blue" // Makes the material "glow" by itself
          emissiveIntensity={0.5} // Adjust the intensity of the glow
        />
      </Box>

      <spotLight position={[0, 0.5, -80]} intensity={4} />
      {/* Dynamic text for the button */}
      <Text
        position={[0, 3, -80]}
        rotation={[Math.PI / 8, 0, 0]}
        fontSize={1}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {buttonText}
      </Text>
    </group>
  );
}
