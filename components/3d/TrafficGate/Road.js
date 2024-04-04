import React, { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial, PlaneGeometry, Mesh } from "three";
console.log(`BoxGeometry: ${BoxGeometry}`);
export default function Road() {
  const fencePolePositions = useMemo(
    () => Array.from({ length: 30 }, (_, index) => -150 + index * 10),
    []
  );

  const boxGeometry = useMemo(() => new BoxGeometry(0.1, 1, 0.1), []);
  const lineGeometry = useMemo(() => new BoxGeometry(0.05, 0.1, 10), []);
  const planeGeometry = useMemo(() => new PlaneGeometry(5, 300), []);
  const silverMaterial = useMemo(
    () => new MeshStandardMaterial({ color: "silver" }),
    []
  );
  const darkGrayMaterial = useMemo(
    () => new MeshStandardMaterial({ color: "darkgray" }),
    []
  );

  const createFenceLines = (positions, xOffset) => {
    return positions.map((position, index) => {
      if (index === 0) return null;
      const prevPosition = positions[index - 1];
      const midPointZ = (position + prevPosition) / 2;
      const length = position - prevPosition;

      return (
        <mesh
          key={index}
          position={[xOffset, 0.35, midPointZ]}
          geometry={lineGeometry}
          material={silverMaterial}
        />
      );
    });
  };

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={planeGeometry}
        material={darkGrayMaterial}
      />
      {fencePolePositions.map((position, index) => (
        <React.Fragment key={`pole-${index}`}>
          <mesh
            position={[-3, 0.2, position]}
            geometry={boxGeometry}
            material={silverMaterial}
          />
          <mesh
            position={[3, 0.2, position]}
            geometry={boxGeometry}
            material={silverMaterial}
          />
        </React.Fragment>
      ))}
      {createFenceLines(fencePolePositions, -3)}
      {createFenceLines(fencePolePositions, 3)}
    </group>
  );
}
