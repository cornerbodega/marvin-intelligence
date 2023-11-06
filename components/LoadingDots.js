import HourglassAnimation from "./Hourglass";

export default function LoadingDots() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HourglassAnimation />
      </div>
      {/* <div className="loading-indicator">
        <svg className="dot" viewBox="0 0 10 10" width="10" height="10">
          <circle cx="5" cy="5" r="5" fill="white"></circle>
        </svg>
        <svg className="dot" viewBox="0 0 10 10" width="10" height="10">
          <circle cx="5" cy="5" r="5" fill="white"></circle>
        </svg>
        <svg className="dot" viewBox="0 0 10 10" width="10" height="10">
          <circle cx="5" cy="5" r="5" fill="white"></circle>
        </svg>
      </div> */}
    </div>
  );
}
