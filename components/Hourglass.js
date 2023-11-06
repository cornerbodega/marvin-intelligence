import React, { useState, useEffect } from "react";

const HourglassAnimation = () => {
  const [hourglass, setHourglass] = useState("bi-hourglass-top");
  const [flip, setFlip] = useState(false);
  const [color, setColor] = useState(0); // Starting color hue

  useEffect(() => {
    const transitions = [
      { iconClass: "bi-hourglass-top", duration: 1000 },
      { iconClass: "bi-hourglass-split", duration: 1000 },
      { iconClass: "bi-hourglass-bottom", duration: 2000 },
      { iconClass: "bi-hourglass", duration: 1000 },
    ];

    let currentTransition = 0;

    const runAnimation = () => {
      setFlip(currentTransition === transitions.length - 1);
      setHourglass(transitions[currentTransition].iconClass);
      setColor((prevColor) => (prevColor + 10) % 360); // Update color hue

      let nextTransition = (currentTransition + 1) % transitions.length;
      let timeoutId = setTimeout(
        runAnimation,
        transitions[currentTransition].duration
      );

      currentTransition = nextTransition;

      return () => clearTimeout(timeoutId);
    };

    let timeoutId = setTimeout(
      runAnimation,
      transitions[currentTransition].duration
    );

    return () => clearTimeout(timeoutId);
  }, []);

  const iconStyle = {
    fontSize: "5rem",
    color: `hsl(${color}, 100%, 50%)`, // Apply dynamic color
    filter: `drop-shadow(0 0 0.75rem hsl(${color}, 100%, 50%))`, // Add a glow effect
  };

  return (
    <div className="hourglass-container">
      <i
        className={`bi ${hourglass} ${flip ? "bi-hourglass-flip" : ""}`}
        style={iconStyle}
      ></i>

      <style jsx>{`
        .hourglass-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .bi {
          font-size: 5rem;
          transition: color 2s ease;
          position: relative;
        }

        .bi-hourglass-flip {
          animation: flipAnimation 1s forwards;
        }

        @keyframes flipAnimation {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default HourglassAnimation;
