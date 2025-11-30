import React, { useState } from "react";
import ProgramIcon from "./ProgramIcon";

const folderContentStyle = {
  display: "flex",
  flexWrap: "wrap",
  position: "relative",
  width: "100%",
  height: "100%",
};

export default function EagleOptixFolder({ icons, windowId }) {
  const verticalSpacing = 160; // Adjust vertical spacing between rows
  const horizontalSpacing = 100; // Adjust horizontal spacing between columns

  const initialPositions = icons.map((_, index) => [
    20 + (index % 3) * horizontalSpacing,
    20 + Math.floor(index / 3) * verticalSpacing,
  ]);

  const [positions, setPositions] = useState(initialPositions);
  const handleClick = (icon) => {
    if (icon.onDoubleClick) {
      icon.onDoubleClick();
    } else {
      if (icon.path) {
        window.open(icon.path, "_blank");
      } else {
        alert(`${icon.name} under construction!`);
      }
    }
  };

  return (
    <div style={folderContentStyle}>
      {icons.map((icon, index) => (
        <ProgramIcon
          key={icon.name}
          icon={icon}
          position={positions[index]}
          onClick={() => handleClick(icon)}
        />
      ))}
    </div>
  );
}
