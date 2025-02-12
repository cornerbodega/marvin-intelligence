import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import React from "react";

export default React.memo(function Mtree() {
  const modelRef = useRef();
  const gltf = useLoader(GLTFLoader, "/mtree.glb"); // Adjust the path as necessary

  // Memorize the original Y position (if any) of the model
  const originalY = useMemo(() => {
    return gltf.scene.position.y;
  }, [gltf.scene.position.y]);

  // Use the useFrame hook to animate the model
  useFrame((state) => {
    // Calculate a floating effect using sine wave oscillation
    // The `state.clock.elapsedTime` provides the elapsed time since the start of the app
    // Adjust the multiplier for the sine function to control the speed of the oscillation
    // Adjust the amplitude (0.1 in this case) to control the height of the oscillation
    const floatEffect = Math.sin(state.clock.elapsedTime) * 0.05;
    // orbit it over the top
    // modelRef.current.rotation.y +=
    // Math.sin(state.clock.elapsedTime * 2) * 0.001;
    // modelRef.current.rotation.x += 0.01;
    // modelRef.current.rotation.z +=
    // Math.sin(state.clock.elapsedTime * 2) * 0.001;

    // Apply the calculated position to the model
    // This will add the oscillation effect on top of the original Y position
    modelRef.current.position.y = originalY + floatEffect;
  });

  return <primitive ref={modelRef} object={gltf.scene} scale={1} />;
});
