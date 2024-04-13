import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function CameraControl() {
  const { camera } = useThree();

  useEffect(() => {
    let lastTouchY = 0;

    const handleWheelScroll = (event) => {
      event.preventDefault();

      // Reverse the scroll direction here by negating the deltaY
      const scrollDelta = event.deltaY ? -event.deltaY * 0.01 : 0;
      let newPosZ = camera.position.z + scrollDelta;

      handleCameraPosition(newPosZ);
    };

    const handleTouchScroll = (event) => {
      event.preventDefault();

      const touchY = event.touches[0]?.clientY || lastTouchY;
      // Reverse the scroll direction here as well
      const scrollDelta = (touchY - lastTouchY) * 0.1;
      lastTouchY = touchY;

      let newPosZ = camera.position.z + scrollDelta;

      handleCameraPosition(newPosZ);
    };

    const handleCameraPosition = (newPosZ) => {
      const minPosZ = -70;
      const maxPosZ = 15;

      if (newPosZ < minPosZ) {
        newPosZ = minPosZ;
      } else if (newPosZ > maxPosZ) {
        newPosZ = maxPosZ;
      }

      camera.position.z = newPosZ;
    };

    const handleTouchStart = (event) => {
      lastTouchY = event.touches[0].clientY;
    };

    // Attach the event listeners for both wheel and touch events
    window.addEventListener("wheel", handleWheelScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchScroll, { passive: false });

    // Clean up by removing the event listeners when component unmounts
    return () => {
      window.removeEventListener("wheel", handleWheelScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchScroll);
    };
  }, [camera]); // Dependency array includes camera to ensure it's captured in the effect scope

  return null;
}
