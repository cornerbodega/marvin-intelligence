import { goToAgentProfile } from "../pages/agents/add-agent";
// import {
//   addAgentFunction,
//   generateExpertiseFunction,
//   generateAgentNameFunction,
// } from "../pages/api/agents/add-agent/add-agent-endpoint";
// import { generateExpertiseFunction } from "../pages/api/agents/add-agent-endpoint";
export default function taskSchema() {
  return {
    addAgent: {
      endpoint: "/api/agents/add-agent/add-agent-endpoint",
      inputs: ["userId"],
      outputs: [],
      subtasks: [
        {
          taskName: "generateExpertise",
          endpoint: "/api/agents/add-agent/generate-expertise-endpoint",
          inputs: ["expertiseInput", "specializedTraining", "userId"],
          outputs: ["expertiseOutput"],
        },
        {
          taskName: "generateAgentName",
          endpoint: "/api/agents/add-agent/generate-agent-name-endpoint",
          inputs: ["expertiseOutput", "specializedTraining", "userId"],
          outputs: ["agentName", "bio"],
        },
        {
          taskName: "generateAgentProfilePic",
          endpoint: "/api/agents/add-agent/generate-agent-profile-pic-endpoint",
          inputs: ["agentName", "userId"],
          outputs: ["imageUrl"],
        },
        {
          taskName: "uploadAgentProfilePic",
          endpoint: "/api/agents/add-agent/upload-agent-profile-pic-endpoint",
          inputs: ["imageUrl", "userId"],
          outputs: ["profilePicUrl"],
        },
        {
          taskName: "saveAgent",
          endpoint: "/api/agents/add-agent/save-agent-to-supabase-endpoint",
          inputs: [
            "profilePicUrl",
            "agentName",
            "bio",
            "expertiseOutput",
            "userId",
          ],
          outputs: ["agentId"],
        },
        {
          taskName: "goToAgentProfile",
          function: goToAgentProfile,
          inputs: ["agentId", "userId"],
          outputs: [],
        },
      ],
    },
    writeDraftReport: {
      endpoint: "/api/missions/save-report/draft-report-endpoint",
      inputs: ["briefing", "expertises", "specializedTraining", "feedback"],
      outputs: ["draftResponseContent"],
    },
    saveReport: {
      endpoint: "/api/missions/save-report/save-report-endpoint-v2",
      inputs: [
        "draft",
        "agentId",
        "expertises",
        "specializedTraining",
        "parentReportId",
        "userId",
        "maxGenerations",
        "currentGeneration",
      ],
      outputs: [],
      subtasks: [
        {
          taskName: "getImagePromptForReport",
          endpoint:
            "/api/missions/save-report/get-image-prompt-for-report-endpoint",
          inputs: ["draft"],
          outputs: ["imageDescriptionResponseContent"],
        },
        {
          taskName: "generateReportImage",
          endpoint: "/api/missions/save-report/generate-report-image-endpoint",
          inputs: ["imageDescriptionResponseContent", "userId"],
          outputs: ["imageUrl, draftTitle"],
        },
        {
          taskName: "uploadReportImageToCloudinary",
          endpoint:
            "/api/missions/save-report/upload-report-image-to-cloudinary-endpoint",
          inputs: ["imageUrl"],
          outputs: ["reportPicUrl"],
        },
        {
          taskName: "getReportSummary",
          endpoint:
            "/api/missions/save-report/generate-report-summary-endpoint",
          inputs: ["draft"],
          outputs: ["reportSummary"],
        },
        {
          taskName: "saveReportToSupabase",
          endpoint:
            "/api/missions/save-report/save-report-to-supabase-endpoint",
          inputs: [
            "draft",
            "agentId",
            "userId",
            "reportPicUrl",
            "reportSummary",
            "briefing",
            "draftTitle",
          ],
          outputs: ["childReportId"],
        },

        {
          taskName: "saveLinks",
          endpoint: "/api/missions/save-report/save-links-endpoint",
          inputs: [
            "parentReportId",
            "childReportId",
            "highlightedText",
            "elementId",
            "userId",
          ],
          outputs: ["saveLinksData"],
        },
        {
          taskName: "handleReportFoldering",
          endpoint:
            "/api/missions/save-report/handle-report-foldering-endpoint",
          inputs: ["childReportId", "parentReportId", "userId"],
          outputs: ["folderId"],
        },
        {
          taskName: "regenerateFolderName",
          endpoint: "/api/missions/save-report/regenerate-folder-name-endpoint",
          inputs: ["folderId"],
          outputs: ["folderName, folderDescription"],
        },
        {
          taskName: "generateFolderImagePrompt",
          endpoint:
            "/api/missions/save-report/generate-folder-image-prompt-endpoint",
          inputs: ["folderDescription", "userId"],
          outputs: ["folderImageResponse"],
        },
        {
          taskName: "generateFolderImage",
          endpoint: "/api/missions/save-report/generate-folder-image-endpoint",
          inputs: ["folderImageResponse", "userId"],
          outputs: ["imageUrl"],
        },

        {
          taskName: "uploadFolderImageToCloudinary",
          endpoint:
            "/api/missions/save-report/upload-folder-image-to-cloudinary-endpoint",
          inputs: ["imageUrl"],
          outputs: ["folderPicUrl"],
        },
        {
          taskName: "saveFolderNameAndImage",
          endpoint:
            "/api/missions/save-report/save-folder-name-and-image-endpoint",
          inputs: [
            "folderPicUrl",
            "folderId",
            "folderName",
            "folderDescription",
          ],
          outputs: [],
        },
        {
          taskName: "startGenerateContinuumTasks",
          endpoint:
            "/api/missions/save-report/start-generate-continua-tasks-endpoint",
          inputs: [
            "childReportId",
            "draft",
            "userId",
            "maxGenerations",
            "currentGeneration",
            "reportSummary",
          ],
          outputs: [],
        },
        // subtask to generate links for continua!
      ],
    },
    doContinuum: {
      endpoint: "/api/missions/save-report/do-continuum-endpoint",
      inputs: [
        "draft",
        "agentId",
        "reportSummary",
        "userId",
        "maxGenerations",
        "currentGeneration",
      ],
      outputs: [], // Specify outputs
      subtasks: [
        {
          taskName: "generateResearchLinks",
          endpoint:
            "/api/missions/save-report/continua/read-child-report-endpoint",
          inputs: ["childReportId", "draft"],
          outputs: ["researchLink1", "researchLink2", "researchLink3"],
        },
        {
          taskName: "generateResearchBriefings",
          endpoint:
            "/api/missions/save-report/continua/generate-research-briefings-endpoint",
          inputs: ["draft", "researchLink1, researchLink2, researchLink3"],
          outputs: ["briefing1, briefing2, briefing3"],
        },
        // write drafts 1, 2, and 3 in separate tasks
        // save drafts 1, 2, and 3 in separate tasks
        // make sure generations is passed and updated to avoid infinite loop

        {
          taskName: "writeDraftReport1",
          endpoint: "/api/missions/save-report/draft-report-endpoint", // using the existing task endpoint here
          inputs: [
            "selectedAgent",
            "areasForFurtherResearch",
            "briefing",
            "expertises",
            "specializedTraining",
            "feedback",
          ],
          outputs: ["draftReport", "draftResponseContent"], // outputs should match the existing task outputs
        },
        // {
        //     taskName: "determineAgentForLinkedReport1",
        //     endpoint: "/api/missions/save-report/determine-agent-endpoint",
        //     inputs: ["researchLink1", "userId", "reportSummary"],
        //     outputs: ["selectedAgent1"],
        //   },
        //   {
        //     taskName: "determineAgentForLinkedReport2",
        //     endpoint: "/api/missions/save-report/determine-agent-endpoint",
        //     inputs: ["researchLink2", "userId", "reportSummary"],
        //     outputs: ["selectedAgent2"],
        //   },
        // },
        // {
        //   taskName: "saveReport", // using the existing task here
        //   endpoint: "/api/missions/save-report/save-report-endpoint-v2",
        //   inputs: [
        //     "draftReport",
        //     "agentId",
        //     "parentReportId",
        //     "userId",
        //     "currentGeneration",
        //   ],
        //   outputs: [], // outputs should match the existing task outputs
        //   subtasks: [
        //     /* ... add the relevant subtasks here just as defined in the saveReport task ... */
        //   ],
        // },
        // You can add more existing tasks here, as necessary
      ],
    },
    // generateContinuumTasks: {
    //   endpoint: "/api/missions/save-report/generate-continuum-tasks-endpoint",
    //   inputs: ["childReportId", "userId", "generationsRemaining"],
    //   outputs: [], // Specify outputs
    //   subtasks: [
    //     {
    //       taskName: "readChildReport",
    //       endpoint: "/api/missions/save-report/read-child-report-endpoint",
    //       inputs: ["childReportId"],
    //       outputs: ["areasForFurtherResearch"], // Specify outputs
    //     },
    //     {
    //       taskName: "determineAgent",
    //       endpoint: "/api/missions/save-report/determine-agent-endpoint",
    //       inputs: ["areasForFurtherResearch", "userId"],
    //       outputs: ["selectedAgent"], // Specify outputs
    //     },
    //     {
    //       taskName: "writeDraftReport",
    //       endpoint: "/api/missions/save-report/write-draft-report-endpoint",
    //       inputs: ["selectedAgent", "areasForFurtherResearch"],
    //       outputs: ["draftReport"], // Specify outputs
    //     },
    //     {
    //       taskName: "saveDraftReport",
    //       endpoint: "/api/missions/save-report/save-draft-report-endpoint",
    //       inputs: ["draftReport"],
    //       outputs: ["savedDraftReport"], // Specify outputs
    //     },
    //     // go to next generation
    //   ],
    // },
  };
}

// export default function taskSchema() {
//   return {
//     addAgent: {
//       function: addAgentFunction,
//       inputs: ["expertiseInput", "userId"],
//       outputs: ["agentId"],
//       subtasks: [
//         {
//           generateExpertise: {
//             function: generateExpertiseFunction,
//             inputs: ["expertiseInput"],
//             outputs: ["expertiseOutput"],
//           },
//         },
//       ],
//     },
//   };
// }
