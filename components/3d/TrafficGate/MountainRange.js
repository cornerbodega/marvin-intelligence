import React, { useState, useRef } from "react";
import {
  ConeGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
  ShaderMaterial,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";

export default function MountainRange() {
  const { camera } = useThree();
  const [doorPosition, setDoorPosition] = useState({ x: 0, y: -10, z: -47 });
  const [showMoon, setShowMoon] = useState(true);
  const doorOpenThreshold = -20;
  const doorOpenSpeed = 0.1;
  const doorUpperLimit = 2;
  const doorRef = useRef();
  const mountainShaderMaterial = new ShaderMaterial({
    uniforms: {
      color1: { value: new Vector3(0, 0, 0) }, // Base color set to black
      color2: { value: new Vector3(0.8, 0.8, 0.8) }, // Soft gray for the snow
      snowLine: { value: 0.5 },
      opacity: { value: 0.0 }, // Base opacity for full transparency
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float snowLine;
      uniform float opacity;
      varying vec3 vPosition;
      void main() {
        float mixFactor = smoothstep(snowLine - 0.1, snowLine, vPosition.y / 50.0);
        vec3 color = mix(color1, color2, mixFactor);
        float finalOpacity = mix(opacity, 1.0, mixFactor); // Adjust opacity for snow
        gl_FragColor = vec4(color, finalOpacity);
      }
    `,
    transparent: true,
  });

  // This will hold refs for all mountains to control their visibility individually
  const mountainsRef = useRef([]);
  useFrame(() => {
    // Update the door's visibility based on its position
    if (doorRef.current) {
      doorRef.current.visible = doorPosition.y < Math.abs(doorUpperLimit - 2);
    }
    // Calculate the distance from the camera to the door
    const doorDistance = camera.position.distanceTo(
      new Vector3(doorPosition.x, doorPosition.y, doorPosition.z)
    );
    const closeDoorThreshold = -1 * doorOpenThreshold; // Adjust based on when you want the door to close

    if (doorDistance > closeDoorThreshold && doorPosition.y > -10) {
      // Close the door if we are far from it
      setDoorPosition((prevState) => ({
        ...prevState,
        y: Math.max(prevState.y - doorOpenSpeed * 4, -10), // Adjust -10 to wherever the door's closed position is
      }));
    }
  });
  useFrame(() => {
    if (
      camera.position.z < doorOpenThreshold &&
      doorPosition.y < doorUpperLimit
    ) {
      setDoorPosition((prevState) => ({
        ...prevState,
        y: Math.min(prevState.y + doorOpenSpeed, doorUpperLimit),
      }));
    }

    // Adjust index for visibility check to target the mountain one to the left of the middle
    const targetMountainIndex = Math.floor(mountainHeights.length / 2 - 1); // "middle - 1"
    mountainsRef.current.forEach((mountain, index) => {
      if (mountain && index === targetMountainIndex) {
        const doorDistance = camera.position.distanceTo(
          new Vector3(doorPosition.x, doorPosition.y, doorPosition.z)
        );
        const hideThreshold = 18;
        mountain.visible = doorDistance > hideThreshold;
        const shouldHideMoon = doorDistance > hideThreshold + 10;
        if (!shouldHideMoon) {
          setShowMoon(false);
        } else {
          setShowMoon(true);
        }
      }
    });
  });

  const mountainHeights = [
    54, 60, 50, 70, 55, 65, 75, 50, 60, 70, 55, 65, 75, 43,
  ];
  const mountains = mountainHeights.map((height, i) => {
    const positionX = i * 20 - 120; // X position for the mountain
    const positionZ = -50; // Z position for the mountain
    const isDoorMountain = i === Math.floor(mountainHeights.length / 2 - 1); // Check if it's the door mountain

    // Base mesh for the mountain using MeshStandardMaterial for realistic lighting
    const baseMesh = (
      <mesh
        key={`base-${i}`}
        position={[positionX, height / 2 - 4 * (i + 1), positionZ - 20]}
        geometry={new ConeGeometry(20, height, 4)}
        scale={[1, 1, 1]}
        material={new MeshStandardMaterial({ color: "white" })}
      />
    );

    // Overlay mesh for the snow effect using the custom ShaderMaterial
    const overlayMesh = (
      <mesh
        key={`overlay-${i}`}
        position={[positionX, height / 2 - 4 * (i + 1), positionZ - 20]}
        // Increase size by 0.1 for radius and height to make overlay slightly larger
        geometry={new ConeGeometry(20.2, height + 0.2, 4)}
        material={mountainShaderMaterial}
      />
    );

    // Special treatment for the mountain with the door, including both base and overlay meshes
    if (isDoorMountain) {
      const doorGeometry = new SphereGeometry(
        3,
        32,
        32,
        Math.PI,
        Math.PI * 2,
        0,
        Math.PI
      );
      const doorMaterial = new MeshStandardMaterial({ color: "grey" });

      return (
        <>
          <group
            key={`group-${i}`}
            ref={(el) => (mountainsRef.current[i] = el)}
          >
            {baseMesh}
            {overlayMesh}
          </group>
          <mesh
            position={[positionX, doorPosition.y + 10, doorPosition.z - 9]}
            geometry={doorGeometry}
            material={doorMaterial}
          />
        </>
      );
    }

    // Return the base and overlay meshes for mountains without the door
    return (
      <group key={`group-${i}`} ref={(el) => (mountainsRef.current[i] = el)}>
        {baseMesh}
        {overlayMesh}
      </group>
    );
  });

  return (
    <>
      {showMoon && (
        <mesh position={[20, 40, -200]}>
          <sphereGeometry args={[30, 32, 32]} />
          <meshBasicMaterial color="white" />
        </mesh>
      )}
      <group>{mountains}</group>
    </>
  );
}
