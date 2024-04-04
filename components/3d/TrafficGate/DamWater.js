import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxGeometry, MeshStandardMaterial } from "three";

export default function DamWater() {
  const waterFallRef = useRef();
  const cubes = useMemo(() => {
    // Generate positions for the water fall cubes
    const positions = [];
    for (let i = 0; i < 300; i++) {
      positions.push({
        x: Math.random() * 100 - 50, // Spread across the width of the dam
        y: Math.random() * 100 - 50, // Spread vertically
        z: Math.random() * 100 - 50, // Spread in depth
        speed: Math.random() * 0.02 + 0.01, // Random falling speed
      });
    }
    return positions;
  }, []);

  useFrame(() => {
    // Animate each cube to fall and reset its position to create a loop
    cubes.forEach((cube, index) => {
      cube.y -= cube.speed;
      if (cube.y < -2.5) {
        // Reset the cube to the top once it falls beyond a certain point
        cubes[index].y = 5;
      }
      // Update the position of each cube in the waterfall
      waterFallRef.current.children[index].position.set(cube.x, cube.y, cube.z);
    });
  });

  return (
    <group>
      {/* Static water body on the left */}
      <mesh position={[-40, -0.5, -1]}>
        <boxGeometry args={[80, 0.5, 100]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      {/* Static water body on the right */}
      <mesh position={[40, -12.5, -1]}>
        <boxGeometry args={[80, 0.5, 100]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      {/* Animated falling water on the right using cubes */}
      <group ref={waterFallRef}>
        {cubes.map((cube, index) => (
          <mesh
            key={index}
            position={[cube.x, cube.y, cube.z]}
            geometry={new BoxGeometry(0.1, 0.1, 0.1)}
            material={new MeshStandardMaterial({ color: "white" })}
          />
        ))}
      </group>
    </group>
  );
}
