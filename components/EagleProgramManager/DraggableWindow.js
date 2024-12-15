import React, { useState, useRef } from "react";
import { useDrag } from "@use-gesture/react";

const windowHeaderStyle = {
  header: {
    backgroundColor: "#0078d7", // Nice blue color
    color: "white",
    padding: "5px 5px",
    cursor: "grab",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "2px solid #808080",
    borderBottom: "none",
    fontFamily: '"MS Sans Serif", "Arial", sans-serif',
    fontSize: "1.2em",
    boxSizing: "border-box",
  },
  closeButton: {
    width: "16px",
    height: "14px",
    border: "2px solid #808080",
    backgroundColor: "#0078d7", // Nice blue color to match header
    color: "white",
    fontSize: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
};

export default function DraggableWindow({
  title,
  children,
  defaultPosition,
  defaultSize,
  initialHeight,
  onClose,
}) {
  const windowWrapperStyle = (position) => ({
    position: "absolute",
    top: `${position[1]}px`,
    left: `${position[0]}px`,
    width: `${defaultSize[0]}px`,
    height: `${initialHeight}px`,
    border: "2px solid black",
    backgroundColor: "white",
    touchAction: "none",
    zIndex: 2,
  });

  const windowContentStyle = {
    padding: "10px",
    position: "relative",
    overflow: "auto",
    height: `calc(100% - 40px)`, // Adjust for the header height
  };

  const [position, setPosition] = useState(defaultPosition);
  const [visible, setVisible] = useState(true);
  const windowRef = useRef(null);

  const bind = useDrag(
    (params) => {
      setPosition([params.offset[0], params.offset[1]]);
      params.event.stopPropagation();
    },
    {
      from: () => position,
      filterTaps: true,
    }
  );

  if (!visible) return null;

  return (
    <div ref={windowRef} {...bind()} style={windowWrapperStyle(position)}>
      <div
        style={windowHeaderStyle.header}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title}
        <button
          style={windowHeaderStyle.closeButtonStyle}
          onClick={() => onClose()}
        >
          ✖
        </button>
      </div>
      <div style={windowContentStyle}>{children}</div>
    </div>
  );
}
