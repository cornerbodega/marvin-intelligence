import { useUser } from "@auth0/nextjs-auth0/client";
import getEnv from "../../utils/getEnv";
import { useFirebaseListener } from "../../utils/useFirebaseListener";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import IntelliLoadingBar from "../IntelliLoadingBar/IntelliLoadingBar";

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
  const [LibraryImage, setLibraryImage] = useState("");
  const [briefingInput, setBriefingInput] = useState();
  // Firebase listeners - always called
  const firebaseContinuumStatus = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_SERVER_UID}/${
      userId || "default"
    }/continuum/status`
  );
  const firebaseVisualizeAndSaveStatus = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_SERVER_UID}/${
      userId || "default"
    }/finalizeAndVisualizeReport/status`
  );
  const firebaseContinuumBriefingInput = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_SERVER_UID}/${
      userId || "default"
    }/continuum/context/briefingInput`
  );
  const firebaseVisualizeAndSaveBriefingInput = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_SERVER_UID}/${
      userId || "default"
    }/finalizeAndVisualizeReport/context/briefingInput`
  );
  const firebaseVisualizeAndSaveSubtasks = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_SERVER_UID}/${
      userId || "default"
    }/finalizeAndVisualizeReport/subtasks`
  );
  const firebaseContinuumSubtasks = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_SERVER_UID}/${
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
  }, [
    userId,
    firebaseVisualizeAndSaveStatus,
    firebaseContinuumStatus,
    briefingInput,
  ]);

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
        `${completedSubtasks + 1}/${totalSubtasks} ${
          notifications[currentSubtaskIndex]
        } ${
          (completedSubtasks === 1 &&
            firebaseContinuumStatus === "in-progress") ||
          (completedSubtasks === 4 &&
            firebaseVisualizeAndSaveStatus === "in-progress") ||
          (completedSubtasks === 10 &&
            firebaseVisualizeAndSaveStatus === "in-progress")
            ? getThisIsTakingALongTimeMessage()
            : ""
        }`
      );
    }
  }, [
    firebaseVisualizeAndSaveSubtasks,
    firebaseContinuumSubtasks,
    notifications,
  ]);

  const isInProgress =
    firebaseVisualizeAndSaveStatus === "in-progress" ||
    firebaseContinuumStatus === "in-progress";

  useEffect(() => {
    if (isInProgress && !notifications.length) {
      setNotificationString(defaultLoadingMessage);
    }
  }, [isInProgress, notifications.length]);

  if (!isInProgress) {
    return null; // Hide the whole component if no process is in-progress
  }
  if (notificationString === "All tasks completed.") {
    return null;
  }

  return (
    <>
      {notifications.length > 0 && (
        <div
          className={`notification-area`}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center", // Centers horizontally
            alignItems: "center", // Centers vertically
            color: "white",
            paddingTop: "10px",
            paddingBottom: "10px",
            fontSize: "3vw", // Responsive font size for desktop
            minHeight: "100px",
            "@media (max-width: 768px)": {
              fontSize: "5vw", // Larger font size for mobile
            },
          }}
        >
          {`${notificationString}`}
        </div>
      )}
      <IntelliLoadingBar speedFactor={1} />
    </>
  );
}
function getThisIsTakingALongTimeMessage() {
  return `This may take a while.`;
}
