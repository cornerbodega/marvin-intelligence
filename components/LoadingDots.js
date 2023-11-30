import HourglassAnimation from "./Hourglass";
import Image from "next/image";
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
        <div
          style={{
            position: "relative",
            width: "auto",
            height: "337px",
            textAlign: "center",
          }}
        >
          <Image
            src="/library.png"
            fill={true}
            // style={{ width: "500px", height: "500px" }}
          />
        </div>
        {/* <HourglassAnimation /> */}
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
