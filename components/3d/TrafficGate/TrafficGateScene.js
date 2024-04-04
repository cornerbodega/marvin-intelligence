import DamWater from "./DamWater";
import MountainRange from "./MountainRange";
import Road from "./Road";
import TrafficGate from "./TrafficGate";

export default function TrafficGateScene({ setGateOpened }) {
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <TrafficGate setGateOpened={setGateOpened} />
      <Road />
      <DamWater />
      <MountainRange />
    </>
  );
}
