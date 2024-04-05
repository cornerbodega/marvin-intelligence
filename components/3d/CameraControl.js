import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraControl() {
  const { camera, scene } = useThree();
  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault();
      const scrollDelta = event.deltaY * 0.01;

      // Calculate the new position
      let newPosZ = camera.position.z - scrollDelta;

      // Define the limits for the camera position
      const minPosZ = -70;
      const maxPosZ = 15;

      // Check if the new position is beyond the limits
      // If so, set it to the nearest limit; otherwise, apply the new position
      if (newPosZ < minPosZ) {
        newPosZ = minPosZ;
      } else if (newPosZ > maxPosZ) {
        newPosZ = maxPosZ;
      }

      // Update the camera position
      camera.position.z = newPosZ;
    };

    // Attach the scroll event listener
    window.addEventListener("wheel", handleScroll, { passive: false });

    // Clean up by removing the event listener when component unmounts
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []); // Empty dependency array ensures that this effect only runs once

  return null;
}
