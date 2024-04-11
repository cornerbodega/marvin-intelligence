import React, { useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { ShaderMaterial, Color } from "three";
import { useEffect } from "react";

// Define a custom shader material
class SynthwaveShaderMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 1.0 },
        color1: { value: new Color(0x8a00d4) }, // Deep Purple
        color2: { value: new Color(0xd9004c) }, // Vibrant Pink
        color3: { value: new Color(0x007fff) }, // Electric Blue for depth
        color4: { value: new Color(0xc70066) }, // Vibrant Red for light streaks
        color5: { value: new Color(0x00ffff) }, // Electric Cyan for late 80s early 90s feel
        scaleX: { value: 1.0 },
        scaleY: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        uniform vec3 color5; // New electric cyan color
        uniform float scaleX;
        uniform float scaleY;
        varying vec2 vUv;

        void main() {
          float x = vUv.x * scaleX;
          float y = vUv.y * scaleY;
          // Enhanced Gradient with more colors and patterns
          vec3 colorGradient = mix(color1, color2, sin(vUv.x * 6.0 + time * 0.5) * 0.5 + 0.5);
          colorGradient += mix(color3, color4, cos(vUv.y * 4.0 - time * 0.3) * 0.5 + 0.5);
          colorGradient = mix(colorGradient, color5, sin(time) * 0.5 + 0.5); // Adding electric cyan into the mix
          // Geometric patterns (simple stripes for demonstration)
          float stripes = sin(vUv.x * 20.0 + time) * cos(vUv.y * 20.0 + time);
          vec3 color = mix(colorGradient, vec3(1.0, 1.0, 1.0), stripes * 0.05);
          // Light streaks
          float streaks = sin(vUv.y * 25.0 + time * 3.0) * 0.5 + 0.5;
          color = mix(color, mix(color4, color5, 0.5), streaks * 0.2); // Blending red and cyan for light streaks
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }
}

extend({ SynthwaveShaderMaterial });

function Cube({ speedFactor }) {
  const meshRef = useRef();

  // Animation loop
  useFrame((state, delta) => {
    const speedAdjustment = window.innerWidth < 768 ? 30 : 1; // Example: slower on smaller screens

    const scale =
      (state.clock.getElapsedTime() + speedAdjustment) * speedFactor;
    meshRef.current.scale.x = scale; // Apply scale to x-axis
  });
  // Update the shader material time uniform in the animation loop
  useFrame((state) => {
    const material = meshRef.current.material;
    material.uniforms.time.value = state.clock.getElapsedTime();
  });
  3;
  return (
    <mesh position={[-30, 0, 0]} ref={meshRef} scale={[0, 1, 1]}>
      <boxGeometry args={[1, 1, 0]} />
      <synthwaveShaderMaterial />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
}

function IntelliLoadingBar({ speedFactor }) {
  return (
    <Canvas>
      <Lights />
      <Cube speedFactor={speedFactor} />
    </Canvas>
  );
}

export default IntelliLoadingBar;
