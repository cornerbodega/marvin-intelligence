import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Head from "next/head";
import Link from "next/link";
import { Sky } from "@react-three/drei";
import { getAnimalFacts } from "../../utils/animalFacts";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "20vh",
  padding: "20px",
  width: "350px",
  background: "#c0c0c0",
  fontFamily: "'Tahoma', sans-serif",
  color: "#000",
  border: "2px solid #000",
  boxShadow: "3px 3px #fff, -1px -1px #000",
  position: "relative",
  zIndex: 1,
  borderRadius: "0",
};

const headerStyle = {
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "10px",
  textShadow: "1px 1px #fff",
};

const linkButtonStyle = {
  padding: "8px 16px",
  fontSize: "14px",
  backgroundColor: "#000080",
  color: "white",
  border: "2px outset #000080",
  cursor: "pointer",
  margin: "8px 0",
  textDecoration: "none",
};

const textStyle = {
  margin: "8px 0",
  fontSize: "1.4em",
  textAlign: "center",
};

const backgroundCanvasStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 100,
};

const contentStyle = {
  position: "relative",
  zIndex: 101,
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
};

const CloudShader = {
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2() },
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
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) +
             (c - a) * u.y * (1.0 - u.x) +
             (d - b) * u.x * u.y;
    }

    void main() {
      vec2 st = vUv * 3.0;
      st = floor(st * vec2(32.0, 32.0)) / vec2(32.0, 32.0); // Pixelation effect
      float t = time * 0.2;

      float n = 0.0;
      n += 0.5 * noise(st + vec2(t, t * 0.3));
      n += 0.25 * noise(st * 2.0 + vec2(t * 1.5, t * 0.5));
      n += 0.125 * noise(st * 4.0 + vec2(t * 2.0, t * 0.7));

      vec3 color1 = vec3(sin(time * 0.1), sin(time * 0.2), sin(time * 0.3));
      vec3 color2 = vec3(sin(time * 0.4), sin(time * 0.5), sin(time * 0.6));
      vec3 finalColor = mix(color1, color2, step(0.5, n));
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

function Clouds() {
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[50, 50, 50, 50]} />
      <shaderMaterial ref={materialRef} args={[CloudShader]} />
    </mesh>
  );
}

export default function Home() {
  const [randomFact, setRandomFact] = useState("");
  useEffect(() => {
    const animalFacts = getAnimalFacts();
    const randomFact =
      animalFacts[Math.floor(Math.random() * animalFacts.length)];
    setRandomFact(randomFact);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const element = document.querySelector("a");
      if (!element) return;
      element.style.fontSize = "1.5em";
      document.querySelector("a").style.transform = "scale(1.1)";
      document.querySelector("a").style.transition = "all 0.5s ease";
    }, 2000);
  }, []);

  return (
    <>
      <Head>
        <title>Marvin's Computer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Canvas style={backgroundCanvasStyle}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Clouds />
      </Canvas>
      <div style={contentStyle}>
        <div style={containerStyle}>
          <div style={headerStyle}>Welcome to Marvin's Computer</div>
          <div style={{ height: "20px" }}> </div>
          <div style={{ ...textStyle, fontFamily: "'Tahoma', sans-serif" }}>
            Tip: {randomFact}
          </div>
          {/* <div style={{ height: "20px" }}> </div>
          <img src="/eagle.jpg" style={{ width: "100%", borderRadius: "0" }} /> */}
          <div style={{ height: "40px" }}> </div>
          <Link
            href="/my-computer/eagle-program-manager"
            style={linkButtonStyle}
          >
            Access
          </Link>
        </div>
      </div>
    </>
  );
}