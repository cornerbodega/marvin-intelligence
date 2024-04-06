import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function TrafficGate({ setGateOpened }) {
  const gateGroupRef = useRef();
  const boothRef = useRef();
  const armBaseRef = useRef();
  const snowOnArmBaseRef = useRef(); // Ref for the snow on the arm base
  const [snowKnockedOff, setSnowKnockedOff] = useState(false); // State to track if snow is knocked off
  const [snowFallProgress, setSnowFallProgress] = useState(0); // Progress of the snow falling
  const [clicked, setClick] = useState(false);
  const { camera } = useThree(); // Access the camera
  // Snow height variable
  const [snowHeight, setSnowHeight] = useState(0.2); // Initialize with default snow height

  useFrame(() => {
    if (!snowKnockedOff && gateGroupRef.current.rotation.z >= Math.PI / 4) {
      setSnowKnockedOff(true);
    }

    // Animate the snow falling off the arm base
    if (snowKnockedOff && snowFallProgress < 1) {
      const fallSpeed = 0.02; // Control the speed of the fall
      snowOnArmBaseRef.current.position.y -= fallSpeed;
      snowOnArmBaseRef.current.position.x -= fallSpeed;
      snowOnArmBaseRef.current.rotation.z += fallSpeed / 2; // Simulate rotation during the fall
      setSnowFallProgress(snowFallProgress + fallSpeed + 0.08);
    }
    // Assuming the Z-axis is the forward direction and the gate opens when the camera gets close
    const cameraDistance = Math.abs(
      camera.position.z - gateGroupRef.current.position.z
    );
    const isOpeningDistance = 5; // Distance at which the gate starts opening
    const isClosingDistance = 10; // Distance at which the gate starts closing

    if (cameraDistance < isOpeningDistance) {
      // Open the gate
      if (gateGroupRef.current.rotation.z < Math.PI / 2 - 0.1) {
        gateGroupRef.current.rotation.z += 0.2;
      } else {
        setGateOpened(true);
      }
    } else if (cameraDistance > isClosingDistance) {
      // Close the gate
      if (gateGroupRef.current.rotation.z > 0) {
        gateGroupRef.current.rotation.z -= 0.02;
      } else {
        setGateOpened(false);
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
      <mesh position={[-1.5, 1.2, 0]}>
        <boxGeometry args={[2.1, 0.4, 1.5]} />
        <meshStandardMaterial color="darkgrey" />
      </mesh>
      {/* Snow on top of the roof, using snowHeight */}
      <mesh position={[-1.5, 1.2 + 0.2 + snowHeight / 2, 0]}>
        <boxGeometry args={[2.1, snowHeight, 1.5]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Window of the booth */}
      <mesh position={[-1.5, 0.65, 0.51]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="darkblue" transparent opacity={0.5} />
      </mesh>

      <mesh position={[-2.25, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="darkblue" transparent opacity={0.5} />
      </mesh>
      {/* Arm base of the gate, positioned to the side of the booth */}
      <mesh ref={armBaseRef} position={[-0.36, 0.4, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="grey" />
      </mesh>
      {/* Snow on the arm base */}
      <mesh
        ref={snowOnArmBaseRef}
        position={[-0.36, 0.4 + 0.4 / 2 + snowHeight / 2, 0]}
        rotation={[0, 0, snowKnockedOff ? Math.PI / 4 : 0]} // Rotate when knocked off
      >
        <boxGeometry args={[0.2, snowHeight, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Pivot group for the gate pole with applied rotation */}
      <group
        ref={gateGroupRef}
        position={[-0.35, 0.4, 0]}
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
