import React, { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial, PlaneGeometry, Mesh } from "three";

export default function Road() {
  const fencePolePositions = useMemo(
    () => Array.from({ length: 30 }, (_, index) => -150 + index * 10),
    []
  );

  const boxGeometry = useMemo(() => new BoxGeometry(0.1, 1, 0.1), []);
  const snowPoleGeometry = useMemo(() => new BoxGeometry(0.12, 0.07, 0.12), []); // Slightly larger to cover the pole top
  const lineGeometry = useMemo(() => new BoxGeometry(0.05, 0.1, 10), []);
  const snowLineGeometry = useMemo(() => new BoxGeometry(0.07, 0.05, 10), []); // Slightly larger and flatter for snow on lines
  const planeGeometry = useMemo(() => new PlaneGeometry(5, 300), []);
  const silverMaterial = useMemo(
    () => new MeshStandardMaterial({ color: "silver" }),
    []
  );
  const snowMaterial = useMemo(
    () => new MeshStandardMaterial({ color: "white" }),
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

      return (
        <React.Fragment key={`line-${xOffset}-${index}`}>
          <mesh
            position={[xOffset, 0.35, midPointZ]}
            geometry={lineGeometry}
            material={silverMaterial}
          />
          {/* Snow on the line */}
          <mesh
            position={[xOffset, 0.4, midPointZ]} // Slightly higher to sit on top of the line
            geometry={snowLineGeometry}
            material={snowMaterial}
          />
        </React.Fragment>
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
          {/* Snow on top of the fence pole */}
          <mesh
            position={[-3, 0.7, position]} // Positioned to sit on top of the pole
            geometry={snowPoleGeometry}
            material={snowMaterial}
          />
          <mesh
            position={[3, 0.7, position]} // Positioned to sit on top of the pole
            geometry={snowPoleGeometry}
            material={snowMaterial}
          />
        </React.Fragment>
      ))}
      {createFenceLines(fencePolePositions, -3)}
      {createFenceLines(fencePolePositions, 3)}
    </group>
  );
}
