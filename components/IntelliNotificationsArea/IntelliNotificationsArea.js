import { useUser } from "@auth0/nextjs-auth0/client";
import getEnv from "../../utils/getEnv";
import { useFirebaseListener } from "../../utils/useFirebaseListener";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function IntelliNotificationsArea() {
  let { user } = useUser();
  let userId = user?.sub;
  const router = useRouter();
  if (!userId) {
    userId = router.query.userId;
  }

  const numberOfFinalizeAndVisualizeReportSubtasks = 13;
  const numberOfContinuumSubtasks = 11;

  const [notifications, setNotifications] = useState([]);
  const defaultLoadingMessage = "Loading"; // Set a default loading message
  const [notificationString, setNotificationString] = useState(
    defaultLoadingMessage
  );
  const [loadingDots, setLoadingDots] = useState("");
  const [briefingInput, setBriefingInput] = useState("");
  // Firebase listeners - always called
  const firebaseContinuumStatus = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_serverUid}/${
      userId || "default"
    }/continuum/status`
  );
  const firebaseVisualizeAndSaveStatus = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_serverUid}/${
      userId || "default"
    }/finalizeAndVisualizeReport/status`
  );
  const firebaseContinuumBriefingInput = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_serverUid}/${
      userId || "default"
    }/continuum/context/briefingInput`
  );
  const firebaseVisualizeAndSaveBriefingInput = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_serverUid}/${
      userId || "default"
    }/continuum/context/briefingInput`
  );
  const firebaseVisualizeAndSaveSubtasks = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_serverUid}/${
      userId || "default"
    }/finalizeAndVisualizeReport/subtasks`
  );
  const firebaseContinuumSubtasks = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_serverUid}/${
      userId || "default"
    }/continuum/subtasks`
  );
  useEffect(() => {
    if (firebaseContinuumBriefingInput) {
      setBriefingInput(firebaseContinuumBriefingInput);
    } else if (firebaseVisualizeAndSaveBriefingInput) {
      setBriefingInput(firebaseVisualizeAndSaveBriefingInput);
    }
  }, [firebaseContinuumBriefingInput, firebaseVisualizeAndSaveBriefingInput]);
  useEffect(() => {
    if (
      userId &&
      (firebaseVisualizeAndSaveStatus === "in-progress" ||
        firebaseContinuumStatus === "in-progress")
    ) {
      const number =
        firebaseVisualizeAndSaveStatus === "in-progress"
          ? numberOfFinalizeAndVisualizeReportSubtasks
          : numberOfContinuumSubtasks;

      console.log("Sending Fetch Request with briefingInput:", briefingInput);

      fetch("/api/notifications/generate-loading-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ briefingInput, userId, number }),
      })
        .then((response) => response.json())
        .then((data) => {
          const loadingNotifications = JSON.parse(data.loadingNotifications);
          setNotifications(loadingNotifications);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }
  }, [userId, firebaseVisualizeAndSaveStatus, firebaseContinuumStatus]);

  useEffect(() => {
    const subtasks =
      firebaseVisualizeAndSaveStatus === "in-progress"
        ? firebaseVisualizeAndSaveSubtasks
        : firebaseContinuumSubtasks;

    if (subtasks && notifications.length) {
      const totalSubtasks =
        firebaseVisualizeAndSaveStatus === "in-progress"
          ? numberOfFinalizeAndVisualizeReportSubtasks
          : numberOfContinuumSubtasks;

      const completedSubtasks = Object.values(subtasks).filter(
        (subtask) => subtask.completedAt
      ).length;

      if (completedSubtasks >= totalSubtasks) {
        setNotificationString("All tasks completed.");
        return;
      }

      const currentSubtaskIndex = Math.min(
        completedSubtasks,
        notifications.length - 1
      );
      const percentage = ((completedSubtasks / totalSubtasks) * 100).toFixed(2);

      setNotificationString(
        `${completedSubtasks + 1}/${totalSubtasks} (${percentage}%) ${
          notifications[currentSubtaskIndex]
        }`
      );
    }
  }, [
    firebaseVisualizeAndSaveSubtasks,
    firebaseContinuumSubtasks,
    notifications,
  ]);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 3000); // Adjust for fade duration
    return () => clearTimeout(timeout);
  }, [notificationString]);
  // useEffect(() => {
  //   const dotInterval = setInterval(() => {
  //     setLoadingDots((dots) => (dots.length < 3 ? dots + "." : ""));
  //   }, 500); // Adjust timing as needed

  //   return () => clearInterval(dotInterval);
  // }, []);

  if (notificationString === "All tasks completed.") {
    return null;
  }

  return (
    <>
      {notifications.length > 0 && (
        <div
          className={`notification-area ${animate ? "animate" : ""}`}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "black",
            display: "flex",
            color: "white",
            paddingTop: "10px",
            paddingBottom: "10px",
            fontSize: "3vw",
            "@media (max-width: 768px)": {
              fontSize: "5vw",
            },
          }}
        >
          {notifications.length > 0 && `${notificationString}${loadingDots}`}
        </div>
      )}
    </>
  );
}
