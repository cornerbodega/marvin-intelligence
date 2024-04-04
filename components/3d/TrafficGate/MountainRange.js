import React, { useState, useRef, useEffect } from "react";
import {
  ConeGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from "three";
import { useFrame, useThree, extend } from "@react-three/fiber";

// Custom Shader Material for the Waterfall
const WaterfallShader = {
  uniforms: {
    time: { value: 0.0 },
    color: { value: new Vector3(0.2, 0.5, 1) }, // Water-like color
  },
  vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            // Increase the time factor to make the water flow faster
            float speedFactor = 10.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
  fragmentShader: `
          uniform float time;
          uniform vec3 color;
          varying vec2 vUv;
          void main() {
            // Enhanced wave effect with multiple frequencies
            float wave1 = sin(vUv.y * 20.0 + time * 5.0) * 0.025;
            float wave2 = sin(vUv.y * 25.0 + time * 4.5 + 1.5) * 0.015;
            float combinedWave = wave1 + wave2;
    
            // Simulate water depth and motion more realistically
            float depth = smoothstep(0.0, 1.0, vUv.y);
            vec3 finalColor = mix(color + combinedWave, vec3(0.0, 0.3, 0.6), depth);
    
            // Reflection effect
            float reflection = pow(1.0 - vUv.y, 2.0); // Simulate reflection towards the top
            finalColor += reflection * 0.1; // Slightly increase brightness at the top for reflection
    
            // Ripple effect at the bottom
            if (vUv.y < 0.1) {
              float ripple = sin(vUv.x * 50.0 + time * 20.0) * (0.1 - vUv.y); // Increase the time factor to make the water flow faster
              finalColor += ripple;
            }
    
            gl_FragColor = vec4(finalColor, 0.7); // Semi-transparent with depth-based color blending
          }
        `,
};

extend({ ShaderMaterial });

export default function MountainRange() {
  const { camera } = useThree();

  const [doorPosition, setDoorPosition] = useState({ x: 0, y: -10, z: -100 });
  const doorOpenThreshold = -80;
  const doorOpenSpeed = 0.1;
  const doorUpperLimit = 10;

  // Initialize mountainsRef with an empty array
  const mountainsRef = useRef([]);

  useFrame((state, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value += delta;
    }
  });

  // Use useRef for the shader material to access its properties
  const shaderRef = useRef();

  useFrame((state) => {
    shaderRef.current.uniforms.time.value += state.clock.getDelta();

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
          new Vector3(doorPosition.x, doorPosition.y, doorPosition.z + 50)
        );
        const hideThreshold = 17;
        console.log(
          `Door distance: ${doorDistance} units threshold: ${hideThreshold}`
        );
        mountain.visible = doorDistance > hideThreshold;
      }
    });
  });

  const mountainHeights = [60, 50, 70, 55, 65, 75, 50, 60, 70, 55];
  const mountains = mountainHeights.map((height, i) => {
    const positionX = i * 20 - 80;
    const positionZ = -46;
    // Adjust condition for placing the door one mountain to the left of the middle
    const isDoorMountain = i === Math.floor(mountainHeights.length / 2 - 1);

    if (isDoorMountain) {
      const doorGeometry = new SphereGeometry(
        6,
        32,
        32,
        Math.PI,
        Math.PI * 2,
        0,
        Math.PI
      );
      const doorMaterial = new MeshStandardMaterial({ color: "darkgrey" });
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
            position={[positionX, doorPosition.y + 10, doorPosition.z]}
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

  // Customized PlaneGeometry for waterfall
  // Customized PlaneGeometry for waterfall
  const planeWidth = 9;
  const planeHeight = 20;
  const planeSegmentsX = 10;
  const planeSegmentsY = 20;

  // Create custom geometry
  const customPlaneGeometry = new PlaneGeometry(
    planeWidth,
    planeHeight,
    planeSegmentsX,
    planeSegmentsY
  );

  // Calculate tapering factor for each row of vertices
  const positionAttribute = customPlaneGeometry.getAttribute("position");
  if (positionAttribute) {
    const positions = positionAttribute.array;
    const numVertices = positions.length / 3; // Each vertex has 3 components (x, y, z)

    for (let i = 0; i < numVertices; i++) {
      const vertexIndex = i * 3;
      const vertexY = positions[vertexIndex + 1]; // Get y-coordinate of the vertex

      // Calculate tapering factor based on the vertex's y-coordinate
      const taperFactor = 1 - Math.abs(vertexY / (planeHeight / 2));

      // Apply tapering to the z-coordinate
      positions[vertexIndex + 2] = vertexY * 0.5 * taperFactor;
    }

    // Update buffer attribute
    positionAttribute.needsUpdate = true;
  }

  return (
    <group>
      {mountains}
      {/* Waterfall right in front of the door */}
      {/* Static Waterfall in front of the door using the shader material */}
      <mesh
        position={[doorPosition.x, 5, doorPosition.z + 50]} // Adjust Y position as needed but keep it static relative to the world
        geometry={customPlaneGeometry}
        rotation={[-Math.PI / 4, Math.PI / 64, 0]} // Rotate the plane to face the camera
      >
        <shaderMaterial
          ref={shaderRef}
          attach="material"
          args={[WaterfallShader]}
        />
      </mesh>
    </group>
  );
}
