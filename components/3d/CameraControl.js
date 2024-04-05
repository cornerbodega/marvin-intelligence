import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function CameraControl() {
  const { camera } = useThree();

  useEffect(() => {
    let lastTouchY = 0;

    const handleScroll = (event) => {
      event.preventDefault();
      const scrollDelta = event.deltaY
        ? event.deltaY * 0.01
        : (lastTouchY - event.touches[0].clientY) * 0.1;
      lastTouchY = event.touches?.[0]?.clientY || lastTouchY;

      // Calculate the new position
      let newPosZ = camera.position.z + scrollDelta;

      // Define the limits for the camera position
      const minPosZ = -70;
      const maxPosZ = 15;

      // Check if the new position is beyond the limits
      if (newPosZ < minPosZ) {
        newPosZ = minPosZ;
      } else if (newPosZ > maxPosZ) {
        newPosZ = maxPosZ;
      }

      // Update the camera position
      camera.position.z = newPosZ;
    };

    const handleTouchStart = (event) => {
      lastTouchY = event.touches[0].clientY;
    };

    // Attach the event listeners for both wheel and touch events
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleScroll, { passive: false });

    // Clean up by removing the event listeners when component unmounts
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [camera]); // Dependency array includes camera to ensure it's captured in the effect scope

  return null;
}
