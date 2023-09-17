import { db, ref } from "./firebase";
import { onValue, set } from "firebase/database";
import taskSchema from "./taskSchema";
import { taskExecutor } from "./taskExecutor";
export function setupFirebaseListener(user) {
  console.log("SETUP FIREBASE LISTENER");
  const taskRef = ref(db, `asyncTasks/${user.sub}`);
  //         onValue(starCountRef, (snapshot) => {
  //   const data = snapshot.val();
  //   updateStarCount(postElement, data);
  // });
  // .on("child_added", async (snapshot) => {})
  onValue(taskRef, async (snapshot) => {
    // const data = snapshot.val();
    // updateStarCount(postElement, data);
    if (!snapshot.val()) {
      return;
    }
    console.log("Object.keys(snapshot.val())");
    console.log(Object.keys(snapshot.val()));
    if (Object.keys(snapshot.val()).length === 0) {
      return;
    }
    console.log("snapshot.val()");
    console.log(snapshot.val());
    const asyncTasks = snapshot.val();
    const taskNames = Object.keys(asyncTasks);
    console.log(taskNames);
    console.log(taskNames.length);
    for (let i = 0; i < taskNames.length; i++) {
      console.log("i");
      console.log(i);

      const taskData = asyncTasks[taskNames[i]];
      if (i > 0) {
        console.log("taskData loopp");
        console.log(taskData);
      }
      const taskType = taskData.type; // Assuming task type is stored as the key
      const taskDefinition = taskSchema()[taskType];
      console.log("taskData.status");
      console.log(taskData.status);
      if (taskData.status === "queued") {
        console.log("FIREBASE LISTENER ACTIVATED");
        console.log("taskData", taskData);
        console.log("taskType", taskType);
        console.log("firebase context", taskData.context);

        console.log("taskDefinition", taskDefinition);
        if (!taskDefinition) {
          console.error(`Task definition not found for task type: ${taskType}`);
          return;
        }
        //   onValue(starCountRef, (snapshot) => {
        //     const data = snapshot.val();
        //     updateStarCount(postElement, data);
        //   });
        const updatedStatusToInProgress = await set(
          ref(db, `/asyncTasks/${user.sub}/${taskType}/status`),
          "in-progress"
        );
        try {
          // const updatedContext = await taskExecutor({
          //   taskName: taskType,
          //   taskData: taskData.context,
          //   taskContext: {},
          //   taskDefinition,
          // });
          const updatedContext = await taskExecutor({
            taskName: taskType,
            taskData: taskData, // This is where you might want to pass taskData without the context property
            taskContext: {}, // You might want to populate this with necessary data instead of an empty object
            taskDefinition,
          });
          console.log("updatedContext");
          console.log(updatedContext);
          // return;
          const updatedStatusToComplete = await set(
            ref(db, `/asyncTasks/${user.sub}/${taskType}/status`),
            "complete"
          );

          const updatedStatusCompletedAt = await set(
            ref(db, `/asyncTasks/${user.sub}/${taskType}/completedAt`),
            new Date().toISOString()
          );
          const updatedStatusContext = await set(
            ref(db, `/asyncTasks/${user.sub}/${taskType}/context`),
            updatedContext
          );
          // await snapshot.ref.update({
          //   status: "completed",
          //   context: updatedContext,
          //   completedAt: new Date().toISOString(),
          // });

          // The Next.js client queries Supabase to retrieve updated data
          // await querySupabase(taskType, updatedContext);
        } catch (error) {
          const updatedStatusError = await set(
            ref(db, `/asyncTasks/${user.sub}/${taskType}/status`),
            "error"
          );
          console.log("firebase listener error");
          console.log(error);
          const updatedStatusErrorMessage = await set(
            ref(db, `/asyncTasks/${user.sub}/${taskType}/errorMessage`),
            error
          );
          //   );
          // await snapshot.ref.update({
          //   status: "error",
          //   errorMessage: error.message,
          //   completedAt: new Date().toISOString(),
          // });
        }
      }
    }
  });
  // });
}
