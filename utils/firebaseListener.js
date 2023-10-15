// import { db, ref } from "./firebase";
// import { onValue, set } from "firebase/database";
// import taskSchema from "./taskSchema";
// import { taskExecutor } from "./taskExecutor";
// // import { isActiveTab } from "./activeTab";

// export default function setupFirebaseListener(user) {
//   console.log("SETUP FIREBASE LISTENER");

//   const taskRef = ref(db, `/${process.env.VERCEL_ENV === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}`);

//   onValue(taskRef, async (snapshot) => {
//     if (!snapshot.val()) {
//       return;
//     }
//     // console.log("Object.keys(snapshot.val())");
//     // console.log(Object.keys(snapshot.val()));
//     if (Object.keys(snapshot.val()).length === 0) {
//       return;
//     }
//     // console.log("snapshot.val()");
//     // console.log(snapshot.val());
//     const asyncTasks = snapshot.val();
//     const taskNames = Object.keys(asyncTasks);
//     console.log(taskNames);
//     console.log(taskNames.length);
//     for (let i = 0; i < taskNames.length; i++) {
//       const taskData = asyncTasks[taskNames[i]];
//       // if (i > 0) {
//       //   console.log("taskData loop");
//       //   console.log(taskData);
//       // }
//       const taskType = taskData.type; // Assuming task type is stored as the key
//       const taskDefinition = taskSchema()[taskType];
//       console.log("taskData.status");
//       console.log(taskData.status);
//       if (taskData.status === "queued") {
//         console.log("FIREBASE LISTENER ACTIVATED");
//         console.log("taskData", taskData);
//         console.log("taskType", taskType);
//         console.log("firebase context", taskData.context);

//         console.log("taskDefinition", taskDefinition);
//         if (!taskDefinition) {
//           console.error(`Task definition not found for task type: ${taskType}`);
//           return;
//         }

//         const updatedStatusToInProgress = await set(
//           ref(db, `/${process.env.VERCEL_ENV === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/${taskType}/status`),
//           "in-progress"
//         );
//         try {
//           const updatedContext = await taskExecutor({
//             taskName: taskType,
//             taskData: taskData,
//             taskContext: {},
//             taskDefinition,
//           });
//           console.log("updatedContext");
//           console.log(updatedContext);
//           if (!updatedContext) {
//             return console.log(
//               "Nothing returned from task executor. This is not an active tab."
//             );
//           }
//           if (
//             JSON.stringify(taskData.context) === JSON.stringify(updatedContext)
//           ) {
//             return console.log(
//               "No changed context returned from task executor. This is not an active tab."
//             );
//           }
//           const updatedStatusToComplete = await set(
//             ref(db, `/${process.env.VERCEL_ENV === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/${taskType}/status`),
//             "complete"
//           );

//           const updatedStatusCompletedAt = await set(
//             ref(db, `/${process.env.VERCEL_ENV === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/${taskType}/completedAt`),
//             new Date().toISOString()
//           );
//           const updatedStatusContext = await set(
//             ref(db, `/${process.env.VERCEL_ENV === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/${taskType}/context`),
//             updatedContext
//           );

//           // The Next.js client queries Supabase to retrieve updated data
//           // await querySupabase(taskType, updatedContext);
//         } catch (error) {
//           const updatedStatusError = await set(
//             ref(db, `/${process.env.VERCEL_ENV === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/${taskType}/status`),
//             "error"
//           );
//           console.log("firebase listener error");
//           console.log(error);
//           const updatedStatusErrorMessage = await set(
//             ref(db, `/${process.env.VERCEL_ENV === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/${taskType}/errorMessage`),
//             error
//           );
//         }
//       }
//     }
//   });
// }
