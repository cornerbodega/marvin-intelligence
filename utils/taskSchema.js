// import { goToAgentProfile } from "../pages/agents/add-agent";
// // import {
// //   addAgentFunction,
// //   generateExpertiseFunction,
// //   generateAgentNameFunction,
// // } from "../pages/api/agents/add-agent/add-agent";
// // import { generateExpertiseFunction } from "../pages/api/agents/add-agent";
// export default function taskSchema() {
//   return {
//     addAgent: {
//       inputs: ["userId"],
//       outputs: [],
//       subtasks: [
//         {
//           taskName: "generateExpertise",
//           endpoint: "/api/agents/add-agent/generate-expertise",
//           inputs: ["expertiseInput", "specializedTraining", "userId"],
//           outputs: ["expertiseOutput"],
//         },
//         {
//           taskName: "generateAgentName",
//           endpoint: "/api/agents/add-agent/generate-agent-name",
//           inputs: ["expertiseOutput", "specializedTraining", "userId"],
//           outputs: ["agentName", "bio"],
//         },
//         {
//           taskName: "generateAgentProfilePic",
//           endpoint: "/api/agents/add-agent/generate-agent-profile-pic",
//           inputs: ["agentName", "userId"],
//           outputs: ["imageUrl"],
//         },
//         {
//           taskName: "uploadAgentProfilePic",
//           endpoint: "/api/agents/add-agent/upload-agent-profile-pic",
//           inputs: ["imageUrl", "userId"],
//           outputs: ["profilePicUrl"],
//         },
//         {
//           taskName: "saveAgent",
//           endpoint: "/api/agents/add-agent/save-agent-to-supabase",
//           inputs: [
//             "profilePicUrl",
//             "agentName",
//             "bio",
//             "expertiseOutput",
//             "userId",
//           ],
//           outputs: ["agentId"],
//         },
//         // replace calling this client-side routing task function with listening to firebase and changing the route as part of the UX routing early painting system
//         // {
//         //   taskName: "goToAgentProfile",
//         //   function: goToAgentProfile,
//         //   inputs: ["agentId", "userId"],
//         //   outputs: [],
//         // },
//       ],
//     },
//     // writeDraftReport: {
//     //   endpoint: "/api/reports/draft-report/draft-report",
//     //   inputs: ["briefing", "expertises", "specializedTraining", "feedback"],
//     //   outputs: ["draftResponseContent"],
//     // },
//     // saveReport: {
//     //   inputs: [
//     //     "draft",
//     //     "agentId",
//     //     "expertises",
//     //     "specializedTraining",
//     //     "parentReportId",
//     //     "userId",
//     //     "maxGenerations",
//     //     "currentGeneration",
//     //     "draft1",
//     //     "draft2",
//     //     "draft3",
//     //     "researchLink1",
//     //     "researchLink2",
//     //     "researchLink3",
//     //   ],
//     //   outputs: [],
//     //   subtasks: [
//     //     {
//     //       taskName: "getImagePromptForReport",
//     //       endpoint: "/api/reports/save-report/generate-image-prompt-for-report",
//     //       inputs: ["draft"],
//     //       outputs: ["imageDescriptionResponseContent"],
//     //     },
//     //     {
//     //       taskName: "generateReportImage",
//     //       endpoint: "/api/reports/save-report/generate-report-image",
//     //       inputs: ["imageDescriptionResponseContent", "userId"],
//     //       outputs: ["imageUrl, draftTitle"],
//     //     },
//     //     {
//     //       taskName: "uploadReportImageToCloudinary",
//     //       endpoint:
//     //         "/api/reports/save-report/upload-report-image-to-cloudinary",
//     //       inputs: ["imageUrl"],
//     //       outputs: ["reportPicUrl"],
//     //     },
//     //     {
//     //       taskName: "getReportSummary",
//     //       endpoint: "/api/reports/save-report/generate-report-summary",
//     //       inputs: ["draft"],
//     //       outputs: ["reportSummary"],
//     //     },
//     //     {
//     //       taskName: "saveReportToSupabase",
//     //       endpoint: "/api/reports/save-report/save-report-to-supabase",
//     //       inputs: [
//     //         "draft",
//     //         "agentId",
//     //         "userId",
//     //         "reportPicUrl",
//     //         "reportSummary",
//     //         "briefing",
//     //         "draftTitle",
//     //       ],
//     //       outputs: ["childReportId"],
//     //     },

//     //     {
//     //       taskName: "saveLinks",
//     //       endpoint: "/api/reports/save-report/save-links",
//     //       inputs: [
//     //         "parentReportId",
//     //         "childReportId",
//     //         "highlightedText",
//     //         "elementId",
//     //         "userId",
//     //       ],
//     //       outputs: ["saveLinksData"],
//     //     },
//     //     {
//     //       taskName: "handleReportFoldering",
//     //       endpoint: "/api/reports/save-report/handle-report-foldering",
//     //       inputs: ["childReportId", "parentReportId", "userId"],
//     //       outputs: ["folderId"],
//     //     },
//     //     {
//     //       taskName: "regenerateFolderName",
//     //       endpoint: "/api/reports/save-report/regenerate-folder-name",
//     //       inputs: ["folderId"],
//     //       outputs: ["folderName, folderDescription"],
//     //     },
//     //     {
//     //       taskName: "generateFolderImagePrompt",
//     //       endpoint: "/api/reports/save-report/generate-folder-image-prompt",
//     //       inputs: ["folderDescription", "userId"],
//     //       outputs: ["folderImageResponse"],
//     //     },
//     //     {
//     //       taskName: "generateFolderImage",
//     //       endpoint: "/api/reports/save-report/generate-folder-image",
//     //       inputs: ["folderImageResponse", "userId"],
//     //       outputs: ["imageUrl"],
//     //     },

//     //     {
//     //       taskName: "uploadFolderImageToCloudinary",
//     //       endpoint:
//     //         "/api/reports/save-report/upload-folder-image-to-cloudinary",
//     //       inputs: ["imageUrl"],
//     //       outputs: ["folderPicUrl"],
//     //     },
//     //     {
//     //       taskName: "saveFolderNameAndImage",
//     //       endpoint: "/api/reports/save-report/save-folder-name-and-image",
//     //       inputs: [
//     //         "folderPicUrl",
//     //         "folderId",
//     //         "folderName",
//     //         "folderDescription",
//     //       ],
//     //       outputs: [],
//     //     },
//     //     {
//     //       taskName: "startGenerateContinuumTasks",
//     //       endpoint: "/api/reports/save-report/start-generate-continua-tasks",
//     //       inputs: [
//     //         "childReportId",
//     //         "parentReportId",
//     //         "draft",
//     //         "userId",
//     //         "maxGenerations",
//     //         "currentGeneration",
//     //         "reportSummary",
//     //         "expertises",
//     //         "specializedTraining",
//     //         "agentId",
//     //       ],
//     //       outputs: [],
//     //     },
//     //     // subtask to generate links for continua!
//     //   ],
//     // },
//     // doContinuum: {
//     //   inputs: [
//     //     "draft",
//     //     "agentId",
//     //     "expertises",
//     //     "reportSummary",
//     //     "userId",
//     //     "maxGenerations",
//     //     "currentGeneration",
//     //     "parentReportId",
//     //     "childReportId",
//     //   ],
//     //   outputs: [], // Specify outputs
//     //   subtasks: [
//     //     {
//     //       taskName: "generateResearchLinks",
//     //       endpoint: "/api/reports/continua/generate-research-links",
//     //       inputs: ["parentReportId", "childReportId", "draft"],
//     //       //   outputs: ["researchLinks"],
//     //       outputs: ["researchLink1", "researchLink2", "researchLink3"],
//     //     },

//     //     // write drafts 1, 2, and 3 in separate tasks
//     //     // save drafts 1, 2, and 3 in separate tasks
//     //     // make sure generations is passed and updated to avoid infinite loop

//     //     {
//     //       taskName: "writeDraftReport1",
//     //       endpoint: "/api/reports/draft-report/draft-report",
//     //       inputs: [
//     //         "reportSummary",
//     //         "agentId",
//     //         "researchLink1",
//     //         "expertises",
//     //         "specializedTraining",
//     //         "feedback",
//     //       ],
//     //       outputs: ["draft1"],
//     //     },
//     //     {
//     //       taskName: "writeDraftReport2",
//     //       endpoint: "/api/reports/draft-report/draft-report",
//     //       inputs: [
//     //         "reportSummary",
//     //         "agentId",
//     //         "researchLink2",
//     //         "expertises",
//     //         "specializedTraining",
//     //         "feedback",
//     //       ],
//     //       outputs: ["draft2"],
//     //     },
//     //     {
//     //       taskName: "writeDraftReport3",
//     //       endpoint: "/api/reports/draft-report/draft-report",
//     //       inputs: [
//     //         "reportSummary",
//     //         "agentId",
//     //         "researchLink3",
//     //         "expertises",
//     //         "specializedTraining",
//     //         "feedback",
//     //       ],
//     //       outputs: ["draft3"],
//     //     },
//     //     {
//     //       taskName: "queueSaveReport1Task",
//     //       endpoint: "/api/reports/continua/queue-save-report-task",
//     //       inputs: [
//     //         "draft1",
//     //         "researchLink1",
//     //         "agentId",
//     //         "expertises",
//     //         "specializedTraining",
//     //         "userId",
//     //         "maxGenerations",
//     //         "currentGeneration",
//     //       ],
//     //       outputs: [],
//     //       subtasks: [],
//     //     },
//     //     {
//     //       taskName: "queueSaveReport2Task",
//     //       endpoint: "/api/reports/continua/queue-save-report-task",
//     //       inputs: [
//     //         "draft2",
//     //         "researchLink2",
//     //         "agentId",
//     //         "expertises",
//     //         "specializedTraining",
//     //         "userId",
//     //         "maxGenerations",
//     //         "currentGeneration",
//     //       ],
//     //       outputs: [],
//     //       subtasks: [],
//     //     },
//     //     {
//     //       taskName: "queueSaveReport3Task",
//     //       endpoint: "/api/reports/continua/queue-save-report-task",
//     //       inputs: [
//     //         "draft3",
//     //         "researchLink3",
//     //         "agentId",
//     //         "expertises",
//     //         "specializedTraining",
//     //         "userId",
//     //         "maxGenerations",
//     //         "currentGeneration",
//     //       ],
//     //       outputs: [],
//     //       subtasks: [],
//     //     },
//     //   ],
//     // },
//     // {
//     //   taskName: "generateResearchBriefings",
//     //   endpoint:
//     //     "/api/reports/save-report/continua/generate-briefings",
//     //   inputs: ["draft", "researchLinks"],
//     //   //   inputs: ["draft", "researchLink1, researchLink2, researchLink3"],
//     //   outputs: ["briefing1, briefing2, briefing3"],
//     // },
//     // generateContinuumTasks: {
//     //   endpoint: "/api/reports/save-report/generate-continuum-tasks",
//     //   inputs: ["childReportId", "userId", "generationsRemaining"],
//     //   outputs: [], // Specify outputs
//     //   subtasks: [
//     //     {
//     //       taskName: "readChildReport",
//     //       endpoint: "/api/reports/save-report/read-child-report",
//     //       inputs: ["childReportId"],
//     //       outputs: ["areasForFurtherResearch"], // Specify outputs
//     //     },
//     //     {
//     //       taskName: "determineAgent",
//     //       endpoint: "/api/reports/save-report/determine-agent",
//     //       inputs: ["areasForFurtherResearch", "userId"],
//     //       outputs: ["selectedAgent"], // Specify outputs
//     //     },
//     //     {
//     //       taskName: "writeDraftReport",
//     //       endpoint: "/api/reports/save-report/write-draft-report",
//     //       inputs: ["selectedAgent", "areasForFurtherResearch"],
//     //       outputs: ["draftReport"], // Specify outputs
//     //     },
//     //     {
//     //       taskName: "saveDraftReport",
//     //       endpoint: "/api/reports/save-report/save-draft-report",
//     //       inputs: ["draftReport"],
//     //       outputs: ["savedDraftReport"], // Specify outputs
//     //     },
//     //     // go to next generation
//     //   ],
//     // },
//   };
// }

// // export default function taskSchema() {
// //   return {
// //     addAgent: {
// //       function: addAgentFunction,
// //       inputs: ["expertiseInput", "userId"],
// //       outputs: ["agentId"],
// //       subtasks: [
// //         {
// //           generateExpertise: {
// //             function: generateExpertiseFunction,
// //             inputs: ["expertiseInput"],
// //             outputs: ["expertiseOutput"],
// //           },
// //         },
// //       ],
// //     },
// //   };
// // }
