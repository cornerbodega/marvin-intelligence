import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const DamWater = React.memo(function DamWater() {
  // Your existing shader and material setup remains unchanged

  // Shader for high, slow-moving water on the left
  const highWaterShader = {
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.y += 0.2 * sin(pos.x * 0.2 - time * 5.0);
        pos.x += 0.1 * cos(pos.y * 0.2 - time * 5.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vec3 color = vec3(0.0, 0.3, 0.6) + vec3(0.05 * sin(vUv.x * 10.0 - time * 2.5));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      time: { value: 0 },
    },
  };

  // Shader for low, fast-moving water on the right
  const lowWaterShader = {
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.y += 0.2 * sin(pos.x * 0.1 - time * 10.0);
        pos.x += 0.1 * cos(pos.y * 0.9 - time * 10.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vec3 color = vec3(0.0, 0.3, 0.6) + vec3(0.05 * sin(vUv.x * 10.0 - time * 17.0));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      time: { value: 0 },
    },
  };

  // WaterMaterial and return statement remain unchanged
  function WaterMaterial({ shader, ...props }) {
    const ref = useRef();
    useFrame(() => {
      if (ref.current) {
        ref.current.uniforms.time.value += 0.01;
      }
    });

    return (
      <shaderMaterial
        ref={ref}
        attach="material"
        args={[shader]}
        transparent={true}
        {...props}
      />
    );
  }

  return (
    <group>
      <mesh position={[-40, -1, -1]}>
        <boxGeometry args={[80, 0.5, 100]} />
        <WaterMaterial shader={highWaterShader} />
      </mesh>
      <mesh position={[40, -12.5, -1]} rotation={[0, 0, -Math.PI / 32]}>
        <boxGeometry args={[80, 0.5, 100]} />
        <WaterMaterial shader={lowWaterShader} />
      </mesh>
    </group>
  );
});

export default DamWater;
