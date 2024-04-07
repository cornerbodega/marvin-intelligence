import React, { useMemo, useState } from "react";
import { BoxGeometry, MeshStandardMaterial, PlaneGeometry, Mesh } from "three";

export default function Road() {
  const [snowPoleHeight, setSnowPoleHeight] = useState(0.15); // Snow height for poles
  const [snowLineHeight, setSnowLineHeight] = useState(0.15); // Snow height for lines

  const fencePolePositions = useMemo(
    () => Array.from({ length: 30 }, (_, index) => -150 + index * 10),
    []
  );

  const boxGeometry = useMemo(() => new BoxGeometry(0.1, 1, 0.1), []);
  const snowPoleGeometry = useMemo(
    () => new BoxGeometry(0.12, snowPoleHeight, 0.12),
    [snowPoleHeight]
  ); // Use snowPoleHeight here
  const lineGeometry = useMemo(() => new BoxGeometry(0.05, 0.1, 10), []);
  const snowLineGeometry = useMemo(
    () => new BoxGeometry(0.07, snowLineHeight, 10),
    [snowLineHeight]
  ); // Use snowLineHeight here
  // const planeGeometry = useMemo(() => new PlaneGeometry(5, 350), []);
  const whitePlaneGeometry = useMemo(() => new PlaneGeometry(5, 110), []);
  const darkGrayPlaneGeometry = useMemo(() => new PlaneGeometry(5, 250), []);
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
  const whiteMaterial = useMemo(
    () => new MeshStandardMaterial({ color: "white" }),
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
          {/* Conditionally render snow on the line */}
          {midPointZ > -50 && (
            <mesh
              position={[xOffset, 0.4 + snowLineHeight / 2, midPointZ]} // Adjusted for snow height
              geometry={snowLineGeometry}
              material={snowMaterial}
            />
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <group>
      <group>
        {/* Dark gray road segment */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, -75]} // Positioned to start at z = -50, considering its height
          geometry={darkGrayPlaneGeometry}
          material={darkGrayMaterial}
        />
        {/* White road segment */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]} // Slightly raised to avoid z-fighting
          geometry={whitePlaneGeometry}
          material={whiteMaterial}
        />
        {/* Fence poles and lines */}
      </group>
      {/* <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={planeGeometry}
        material={darkGrayMaterial}
      /> */}
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
          {/* Conditionally render snow on top of the pole */}
          {position > -50 && (
            <>
              <mesh
                position={[-3, 0.7 + snowPoleHeight / 2, position]} // Adjusted for snow height
                geometry={snowPoleGeometry}
                material={snowMaterial}
              />
              <mesh
                position={[3, 0.7 + snowPoleHeight / 2, position]} // Adjusted for snow height
                geometry={snowPoleGeometry}
                material={snowMaterial}
              />
            </>
          )}
        </React.Fragment>
      ))}
      {createFenceLines(fencePolePositions, -3)}
      {createFenceLines(fencePolePositions, 3)}
    </group>
  );
}
