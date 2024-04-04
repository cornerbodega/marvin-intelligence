import React, { useState, useRef } from "react";
import {
  ConeGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";

export default function MountainRange() {
  const { camera } = useThree();
  const [doorPosition, setDoorPosition] = useState({ x: 0, y: -10, z: -50 });
  const doorOpenThreshold = -30;
  const doorOpenSpeed = 0.1;
  const doorUpperLimit = 10;

  // This will hold refs for all mountains to control their visibility individually
  const mountainsRef = useRef([]);

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
        const hideThreshold = 20;
        mountain.visible = doorDistance > hideThreshold;
      }
    });
  });

  const mountainHeights = [60, 50, 70, 55, 65, 75, 50, 60, 70, 55];
  const mountains = mountainHeights.map((height, i) => {
    const positionX = i * 20 - 80;
    const positionZ = -50;
    // Adjust condition for placing the door one mountain to the left of the middle
    const isDoorMountain = i === Math.floor(mountainHeights.length / 2 - 1);

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
        <group key={i}>
          <mesh
            ref={(el) => (mountainsRef.current[i] = el)}
            position={[positionX, height / 2 - 20, positionZ - 20]}
            geometry={new ConeGeometry(20, height, 4)}
            material={new MeshStandardMaterial({ color: "green" })}
          >
            <mesh
              position={[0, height / 2 - 4, 0]}
              geometry={new ConeGeometry(5, 10, 4)}
              material={new MeshStandardMaterial({ color: "white" })}
            />
          </mesh>
          <mesh
            position={[positionX, doorPosition.y + 10, doorPosition.z - 9]}
            geometry={doorGeometry}
            material={doorMaterial}
          />
        </group>
      );
    }

    // Other mountains without the door
    return (
      <mesh
        key={i}
        ref={(el) => (mountainsRef.current[i] = el)}
        position={[positionX, height / 2 - 20, positionZ - 20]}
        geometry={new ConeGeometry(20, height, 4)}
        material={new MeshStandardMaterial({ color: "green" })}
      >
        <mesh
          position={[0, height / 2 - 4, 0]}
          geometry={new ConeGeometry(5, 10, 4)}
          material={new MeshStandardMaterial({ color: "white" })}
        />
      </mesh>
    );
  });

  return <group>{mountains}</group>;
}
