export default function LoadingDots() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div class="loading-indicator">
        <svg class="dot" viewBox="0 0 10 10" width="10" height="10">
          <circle cx="5" cy="5" r="5" fill="white"></circle>
        </svg>
        <svg class="dot" viewBox="0 0 10 10" width="10" height="10">
          <circle cx="5" cy="5" r="5" fill="white"></circle>
        </svg>
        <svg class="dot" viewBox="0 0 10 10" width="10" height="10">
          <circle cx="5" cy="5" r="5" fill="white"></circle>
        </svg>
      </div>
    </div>
  );
}
