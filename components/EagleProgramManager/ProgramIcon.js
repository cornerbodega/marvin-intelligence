import React from "react";

function programIconStyle(position = [0, 0], customStyle = {}) {
  return {
    width: "90px",
    height: "170px",
    margin: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    cursor: "pointer",
    position: "absolute",
    top: `${position?.[1] ?? 0}px`,
    left: `${position?.[0] ?? 0}px`,
    padding: "10px",
    fontFamily: "'MS Sans Serif', sans-serif",
    fontSize: "16px",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    border: "1px solid transparent",
    ...customStyle,
  };
}

export default function ProgramIcon({
  icon,
  position,
  onClick,
  style,
}) {
  const iconStyle = {
    ...programIconStyle(position, style),
  };

  const imageStyle = {
    width: "115%",
    height: "75px",
    marginBottom: "13px",
    marginTop: "-5px",
    pointerEvents: "none",
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      style={iconStyle}
    >
      <img src={icon.image} alt={icon.name} style={imageStyle} />
      <div style={icon.path ? { color: "black" } : { color: "grey" }}>
        <div style={{ fontSize: "1em" }}>{icon.name}</div>
        {icon.description && (
          <div style={{ fontSize: "0.75em", color: "#555", marginTop: "2px" }}>
            {icon.description}
          </div>
        )}
      </div>
    </div>
  );
}
