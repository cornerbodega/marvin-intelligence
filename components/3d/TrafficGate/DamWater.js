import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxGeometry, MeshStandardMaterial } from "three";

export default function DamWater() {
  const waterFallRef = useRef();
  const cubes = useMemo(() => {
    // Generate positions for the water fall cubes
    const positions = [];
    for (let i = 0; i < 1000; i++) {
      positions.push({
        x: Math.random() * 100 - 50, // Spread across the width of the dam
        y: Math.random() * 100 - 50, // Spread vertically
        z: Math.random() * 100 - 50, // Spread in depth
        speed: Math.random() * 0.02 + 0.01, // Random falling speed
      });
    }
    return positions;
  }, []);

  function WaterMaterial(props) {
    const ref = useRef();
    useFrame(() => {
      if (ref.current) {
        // Adjusting the time increment here as needed to control the speed of the water flow animation
        ref.current.uniforms.time.value += 0.01; // This value can be tweaked to speed up or slow down the flow
      }
    });

    return (
      <shaderMaterial
        ref={ref}
        attach="material"
        args={[waterShader]}
        transparent={true}
        {...props}
      />
    );
  }
  const waterShader = {
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        // Adjusting the wave to move left to right by subtracting time from the x-position
        pos.y += sin(pos.x * 0.1 - time) * 0.25; // Adjust sin multiplier for wave height
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        // Adjusting for a smoother and subtler color transition, making it consistent with the direction change
        float wave = sin(vUv.x * 5.0 - time * 2.5) * 0.05; // Adjust these for smoother color transition
        gl_FragColor = vec4(0.0, 0.4, 0.7, 1.0) + vec4(0.0, wave, wave, 0.0);
      }
    `,
    uniforms: {
      time: { value: 0 },
    },
  };

  function WaterMaterial(props) {
    const ref = useRef();
    useFrame(() => {
      if (ref.current) {
        // Adjusting the time increment here as needed to control the speed of the water flow animation
        ref.current.uniforms.time.value += 0.01; // This value can be tweaked to speed up or slow down the flow
      }
    });

    return (
      <shaderMaterial
        ref={ref}
        attach="material"
        args={[waterShader]}
        transparent={true}
        {...props}
      />
    );
  }

  return (
    <group>
      {/* Static water body on the left */}
      <mesh position={[-40, -1, -1]}>
        <boxGeometry args={[80, 0.5, 100]} />
        {/* <WaterMaterial /> */}
        <meshStandardMaterial color="#2962AB" />
      </mesh>
      {/* Static water body on the right */}

      <mesh position={[40, -12.5, -1]}>
        <boxGeometry args={[80, 0.5, 100]} />
        <WaterMaterial />
      </mesh>
    </group>
  );
}
