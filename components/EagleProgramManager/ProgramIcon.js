import React, { useState, useRef } from "react";
import { useDrag } from "@use-gesture/react";

function programIconStyle(position, customStyle = {}) {
  return {
    width: "90px",
    height: "145px",
    margin: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    cursor: "pointer",
    position: "absolute",
    top: `${position[1]}px`,
    left: `${position[0]}px`,
    padding: "5px",
    fontFamily: "'MS Sans Serif', sans-serif",
    fontSize: "16px",
    textAlign: "center",
    touchAction: "none",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: "10px",

    ...customStyle,
  };
}

export default function ProgramIcon({
  icon,
  position,
  onDrag,
  onDoubleClick,
  onClick,
  style,
}) {
  const [lastTap, setLastTap] = useState(0);
  const tapTimeout = useRef(null);

  const bind = useDrag(
    (params) => {
      onDrag(params.offset[0], params.offset[1]);
      params.event.stopPropagation();
    },
    {
      from: () => position,
    }
  );

  const handleTouchEnd = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
      }
      onDoubleClick();
    } else {
      setLastTap(now);
      tapTimeout.current = setTimeout(() => {
        onClick && onClick(e);
      }, DOUBLE_TAP_DELAY);
    }
  };

  const iconStyle = {
    ...programIconStyle(position, style),
  };

  const imageStyle = {
    width: "115%",
    height: "75px",
    marginBottom: "13px",
    marginTop: "-5px",

    // disable click
    pointerEvents: "none",
  };

  return (
    <div
      {...bind()}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      style={iconStyle}
    >
      <img src={icon.image} alt={icon.name} style={imageStyle} />
      <div style={icon.path ? { color: "black" } : { color: "grey" }}>
        <div style={{ fontSize: "1em" }}>{icon.name}</div>
      </div>
    </div>
  );
}
