import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

export default function TrafficGate() {
  const gateGroupRef = useRef();
  const boothRef = useRef();
  const armBaseRef = useRef();

  const [clicked, setClick] = useState(false);

  // Rotate the gate group to simulate opening and closing on click
  useFrame(() => {
    const targetZRotation = Math.PI / 2; // Rotate 90 degrees to open
    if (clicked) {
      if (gateGroupRef.current.rotation.z < targetZRotation) {
        gateGroupRef.current.rotation.z += 0.02;
      }
    } else {
      if (gateGroupRef.current.rotation.z > 0) {
        gateGroupRef.current.rotation.z -= 0.02;
      }
    }
  });

  return (
    <group>
      {/* Security booth */}
      <mesh ref={boothRef} position={[-1.5, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="lightgrey" />
      </mesh>
      {/* Roof of the booth */}
      <mesh position={[-1.5, 1.1, 0]}>
        <boxGeometry args={[1.6, 0.1, 1.1]} />
        <meshStandardMaterial color="darkgrey" />
      </mesh>
      {/* Window of the booth */}
      <mesh position={[-1.5, 0.7, 0.51]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="black" transparent opacity={0.5} />
      </mesh>
      {/* Door of the booth */}
      <mesh position={[-0.7, 0.6, 0.51]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshStandardMaterial color="darkgrey" />
      </mesh>
      {/* Arm base of the gate, positioned to the side of the booth */}
      <mesh ref={armBaseRef} position={[-0.5, 0.4, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="grey" />
      </mesh>
      {/* Pivot group for the gate pole with applied rotation */}
      <group
        ref={gateGroupRef}
        position={[-0.5, 0.4, 0]}
        onClick={() => setClick(!clicked)}
      >
        {/* The pole of the gate, position adjusted to rotate around the left end */}
        <mesh
          position={[0.9, 0, 0]} // Keep the pole's position so it rotates around its left end
        >
          <boxGeometry args={[2, 0.1, 0.1]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      </group>
    </group>
  );
}
