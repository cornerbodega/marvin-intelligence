import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Text, Plane } from "@react-three/drei";

// MessageOverlay Component
// MessageOverlay Component
export default function MessageOverlay({ messages }) {
  const overlayRef = useRef();
  const { camera } = useThree();
  const [currentMessage, setCurrentMessage] = useState("");
  const thresholds = useRef(
    Object.keys(messages)
      .map(Number)
      .sort((a, b) => a - b)
  );

  // Function to update message based on camera position
  const updateMessage = () => {
    const cameraZ = camera.position.z;
    const closestThreshold = thresholds.current.reduce((prev, curr) =>
      Math.abs(curr - cameraZ) < Math.abs(prev - cameraZ) ? curr : prev
    );
    setCurrentMessage(messages[closestThreshold]);
  };

  // Use useEffect to initialize the message
  useEffect(() => {
    overlayRef.current.renderOrder = 1000; // Set a high render order value
    // Apply this to all relevant children, as the renderOrder needs to be set individually
    overlayRef.current.children.forEach((child) => {
      child.renderOrder = 1000;
    });
    updateMessage();
  }, []); // Empty array ensures this runs once on mount

  useFrame(() => {
    updateMessage();
    // Position the overlay
    const cameraPosition = camera.position.clone();
    overlayRef.current.position.set(
      cameraPosition.x,
      cameraPosition.y - 1.2,
      cameraPosition.z - 2
    );
    overlayRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={overlayRef}>
      {/* Overlay Plane */}
      {currentMessage != "" && (
        <>
          <Plane args={[2, 0.5]} position={[0, 0.5, 0]}>
            <meshBasicMaterial
              color="lightgray"
              opacity={1}
              depthTest={false}
              transparent
            />
          </Plane>
          {/* shadow pane */}
          <Plane args={[2.1, 0.6]} position={[0, 0.5, -0.01]}>
            <meshBasicMaterial
              color="black"
              opacity={0.8}
              depthTest={false}
              transparent
            />
          </Plane>
          {/* Text Message */}
          <Text
            position={[0, 0.6, 0.01]}
            fontSize={0.1}
            color="black"
            anchorX="center"
            anchorY="middle"
            material-toneMapped={false}
            material-depthTest={false}
          >
            {currentMessage}
          </Text>
          {/* Down Arrow indicating to scroll */}

          <Text
            position={[0, 0.4, 0.01]}
            fontSize={0.08}
            color="black"
            anchorX="center"
            anchorY="middle"
            material-toneMapped={false}
            material-depthTest={false}
          >
            (scroll to proceed)
          </Text>
        </>
      )}
    </group>
  );
}
