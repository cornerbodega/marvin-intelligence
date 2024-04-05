// this is a streetlight component that is used in the TrafficGate component

export default function StreetLight() {
  return (
    <group>
      <mesh position={[2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.4, 5, 32]} />
        <meshStandardMaterial color="lightgrey" />
      </mesh>
      {/* //add a horizontal arm on top toward the left */}
      <mesh position={[1.2, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 32]} />
        <meshStandardMaterial color="lightgrey" />
      </mesh>
      {/* add a rectangular light bulb */}
      <mesh position={[0.6, 2.25, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}
