// @author Marvin-Rhone
// This file is the endpoint for saving a report. It is called from the /missions/create-mission/.../dispatch.js page in the handleAcceptReport function.
import { AuthUnknownError } from "@supabase/supabase-js";
import { getSupabase } from "../../../utils/supabase";
import { v2 as cloudinary } from "cloudinary";
import { writeDraftFunction } from "./write-draft-endpoint";
import { log } from "../../../utils/log";
import { createAgentFunction } from "../agents/create-agent-endpoint";
import { getSuggestionFunction } from "./get-suggestion";
// import getFromSupabase from "../../../utils/supabase/getFromSupabase";
cloudinary.config({
  cloud_name: "dcf11wsow",
  api_key: "525679258926845",
  api_secret: "GfxhZesKW1PXljRLIh5Dz6-3XgM",
  secure: true,
});
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function SaveReportEndpoint(req, res) {
  const supabase = getSupabase();
  async function saveToSupabase(table, dataToSave) {
    const response = await supabase.from(table).insert(dataToSave).select();
    console.log("SaveReportEndpoint response trying to save to supabase");
    // console.log(`${table} ${JSON.stringify(dataToSave)}}`);
    // console.log(response);

    return response;
  }

  console.log("Save Report Endpoint");
  // console.log(req.body.draft);
  if (req.method === "POST") {
    const draft = req.body.draft;
    const briefing = req.body.briefing;
    const userId = req.body.userId;
    const agentId = req.body.agentId;
    let continuumEnabled = req.body.continuumEnabled;
    let numberGenerations = req.body.numberGenerations;
    let generationCount = numberGenerations;
    // #####################################
    // Save Report to Reports Table
    // #####################################

    const newReportModel = {};
    if (draft) {
      async function saveReportFunction({ draft, agentId }) {
        console.log("save draft function");
        // console.log(draft);
        // describe this article as a photograph of place on earth in less than 300 characters: Research Report: Impact of Persistence and Goal-Setting on Project Success and Performance in Different Industries
        const draftTitle = draft
          .split(`<h2 id="reportTitle">`)[1]
          .split(`</h2>`)[0];
        // describe this article as a photograph of place on earth in less than 300 characters: Research Report: Impact of Persistence and Goal-Setting on Project Success and Performance in Different Industries
        // const imageTypes = [
        //   "photograph",
        //   "realist painting",
        //   "impressionist painting",
        // ];
        // const imageType = imageTypes[getRandomInt(0, imageTypes.length - 1)];
        const imageType = "photograph";
        const getDraftImageMessages = [
          {
            role: "system",
            content:
              "You are an expert an designing images of places and describing them in less than 300 characters.",
          },
          {
            role: "user",
            content: `describe a ${imageType} of the place in nature that corresponds to this title in less than 300 characters: ${draftTitle}. The location will be the subject of a landscape photographer.`,
          },
        ];

        const reportSummaryMessages = [
          {
            role: "system",
            content:
              "You are an expert at summarizing reports. You receive html and return the summary in less than 300 characters in plain text.",
          },
          {
            role: "user",
            content: `please summarize the following report: ${draft}`,
          },
        ];
        const draftImageMessagesResponse = await getFromOpenAi(
          getDraftImageMessages
        );
        const reportSummaryResponse = await getFromOpenAi(
          reportSummaryMessages
        );

        if (!draftImageMessagesResponse) {
          console.log("ERROR! NO draftImageMessagesResponse");
          return;
        }
        const imageDescriptionResponseContent = draftImageMessagesResponse; //.data.choices[0].message.content;
        const reportSummary = reportSummaryResponse; //.data.choices[0].message.content;

        const aiImageResponse = await openai.createImage({
          prompt: `${imageDescriptionResponseContent}`,
          n: 1,
          size: "1024x1024",
        });
        const imageUrl = aiImageResponse.data.data[0].url;
        //   Upload Image to Cloudinary and receive Url
        const cloudinaryImageUploadResult = await cloudinary.uploader
          .upload(imageUrl)
          .catch((error) => console.log(error));
        //   .then((result) => console.log(result))
        console.log("Report cloudinaryImageUploadResult");
        const reportPicUrl = cloudinaryImageUploadResult.url;
        newReportModel.reportPicUrl = reportPicUrl;
        newReportModel.reportTitle = draftTitle;
        newReportModel.reportContent = draft;
        newReportModel.briefing = briefing;
        newReportModel.agentId = agentId;
        // newReportModel.briefingSummary = briefingSummary;
        newReportModel.reportSummary = reportSummary;
        // format briefing?

        // generate report summary

        newReportModel.userId = userId;
        console.log(newReportModel);
        console.log("newReportModel");
        // Generate Report Summary and Sanitize Briefing
        // Tried to Batch calls to the API to save requests/min. Did not work well. The answers were mixed together.

        // Save to Supabase missions table
        // Go to report detail page and see image :D
        console.log("SAVE REPORT TO SUPABASE");
        console.log(newReportModel);

        const saveReportData = await saveToSupabase(
          "reports",
          newReportModel
        ).catch((error) => console.log(error));
        return saveReportData;
      }
      const saveReportData = await saveReportFunction({ draft, agentId });
      // #####################################
      // Save Link to Links Table
      // #####################################

      const parentReportId = req.body.parentReportId;
      if (parentReportId) {
        const childReportId = saveReportData.data[0].reportId;
        const highlightedText = req.body.highlightedText;
        // const startIndex = req.body.startIndex;
        // const endIndex = req.body.endIndex;
        // const range = JSON.stringify({ startIndex, endIndex });
        const elementId = req.body.elementId;
        const saveLinksObj = {
          body: {
            childReportId,
            parentReportId,
            highlightedText,
            // range,
            elementId,
          },
        };
        const saveLinksData = await saveToLinksTableFunction(saveLinksObj);
        // await saveToLinksTableFunction();
      }
      async function saveToLinksTableFunction(req) {
        console.log("saveToLinksTableFunction saveReportData");
        console.log("saveToLinksTableFunction req.body");
        console.log(req.body);
        // const reportId = req.body.reportId;
        const parentReportId = req.body.parentReportId;

        const childReportId = req.body.childReportId;
        const highlightedText = req.body.highlightedText;
        // const startIndex = req.body.startIndex;
        // const endIndex = req.body.endIndex;
        // const range = JSON.stringify({ startIndex, endIndex });
        // const range = req.body.range;
        const elementId = req.body.elementId;
        const newLinkModel = {
          childReportId,
          parentReportId,
          // range,
          highlightedText,
          elementId,
        };
        // if (parentReportId) {
        //   newLinkModel.parentReportId = parentReportId;
        // }
        console.log("newLinkModel");
        console.log(newLinkModel);
        return await saveToSupabase("links", newLinkModel).catch((error) =>
          console.log(error)
        );
      }
      // #####################################
      // Folders
      // #####################################
      async function regenerateFolderNameAndImage(folderId) {
        let folderName = "";
        let folderPicUrl = "";
        let folderDescription = "";
        // get all reports in folder
        let { data: reportFolders, reportFolderError } = await supabase
          .from("reportFolders")
          .select(
            `
          *,
          reports:reportId (reportTitle)
        `
          )
          .eq("folderId", folderId);
        if (reportFolderError) {
          console.log("reportFolderError");
        }
        console.log("reportFolders");
        console.log(reportFolders);
        // let folderName = "";
        // let folderPicUrl = "";
        if (reportFolders && reportFolders.length > 0) {
          // generate folder name and image based on report contents
          // this function will be called when
          //  1. the child report is saved into new report is saved into a folder
          //  2. a new child report is saved into the folder
          // get all report titles

          // Get all the reports titles in this folder
          const reportTitles = reportFolders.map((reportFolder) => {
            return reportFolder.reports.reportTitle;
          });
          console.log("regenerateFolderNameAndImage reportTitles");
          console.log(reportTitles);
          // Make a call to the AI to generate a folder name and image
          try {
            const chat_completion = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert at generating a name and description for a folder based on titles of the reports it contains. You never explain your answer. You return results in the following JSON format: {folderName, folderDescription}",
                },
                {
                  role: "user",
                  content: reportTitles.join("\n"),
                },
              ],
            });
            // let folderName = "";

            const folderAssetResponseContent =
              chat_completion.data.choices[0].message.content;
            if (folderAssetResponseContent) {
              console.log("folderAssetResponseContent");
              console.log(folderAssetResponseContent);
              console.log("folderName");
              console.log(folderName);
              console.log("typeof folderAssetResponseContent");
              console.log(typeof folderAssetResponseContent);
              if (typeof folderAssetResponseContent === "object") {
                folderName = folderAssetResponseContent.folderName;
                folderDescription =
                  folderAssetResponseContent.folderDescription;
              } else if (
                typeof folderAssetResponseContent === "string" &&
                folderAssetResponseContent.includes(`"folderName":`)
              ) {
                const parsedFolderAssetContent = JSON.parse(
                  folderAssetResponseContent
                );
                if (parsedFolderAssetContent) {
                  folderName = parsedFolderAssetContent.folderName;
                  folderDescription =
                    parsedFolderAssetContent.folderDescription;
                }
              } else if (typeof folderAssetResponseContent === "string") {
                folderName = folderAssetResponseContent;
                folderDescription = folderAssetResponseContent;
              }
            }
            console.log("folderName2");
            console.log(folderName);
            console.log("folderDescription");
            console.log(folderDescription);
            const imageType = "realist painting";
            // "realist painting",
            // "impressionist painting",
            try {
              const chat_completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                  {
                    role: "system",
                    content:
                      "You are an expert at describing visually captivating artworks based on a report title. The artwork will performed by a realist painter.You never explain your answer. All your answers are less than 300 characters.",
                  },
                  {
                    role: "user",
                    content: `reportTitle: ${folderDescription}, imageType: ${imageType}`,
                  },
                ],
              });

              const folderImageResponse =
                chat_completion.data.choices[0].message.content;
              console.log("folderImageResponse");
              console.log(folderImageResponse);
              const aiImageResponse = await openai.createImage({
                prompt: folderImageResponse,
                n: 1,
                size: "1024x1024",
              });
              const imageUrl = aiImageResponse.data.data[0].url;
              //   Upload Image to Cloudinary and receive Url
              const cloudinaryImageUploadResult = await cloudinary.uploader
                .upload(imageUrl)
                .catch((error) => console.log(error));
              console.log("cloudinaryImageUploadResult");
              console.log(cloudinaryImageUploadResult);
              folderPicUrl = cloudinaryImageUploadResult.url;
              return { folderName, folderPicUrl, folderDescription };
            } catch (error) {
              console.error("generateFolderName error");
              console.log(error);
            }
          } catch (error) {
            console.error("generateFolderName error");
            console.log(error);
          }
          // Get the image from Dall-E
          // Folder title x animal name
        }
      }

      async function handleReportFoldering({ parentReportId, reportId }) {
        let newReportFolderModel = {};
        let existingFolderId;
        if (!continuumEnabled) {
          return { reportId };
        }

        async function saveNewFolderModel(newReportFolderModel) {
          return await saveToSupabase(
            "reportFolders",
            newReportFolderModel
          ).catch((error) => console.log(error));
        }

        async function updateFolderData(folderId, folderNameAndImage) {
          try {
            const { data, error } = await supabase
              .from("folders")
              .update({
                folderName: folderNameAndImage.folderName,
                folderPicUrl: folderNameAndImage.folderPicUrl,
                folderDescription: folderNameAndImage.folderDescription,
              })
              .eq("folderId", folderId);

            if (error) {
              console.log(error);
            }

            return data;
          } catch (error) {
            console.log(error);
          }
        }

        const createNewFolder = async () => {
          const newFolderModel = { userId };
          const saveFolderData = await saveToSupabase(
            "folders",
            newFolderModel
          ).catch((error) => console.log(error));
          console.log("saveFolderData", saveFolderData);

          return saveFolderData.data[0].folderId;
        };

        console.log("addParentToFolder parentReportId");
        console.log(parentReportId);
        await addParentToFolder(parentReportId);

        async function addParentToFolder(parentReportId) {
          if (parentReportId) {
            // Check if parent report already has a folder
            let { data: reportFolderResponse, error } = await supabase
              .from("reportFolders")
              .select("folderId")
              .eq("reportId", parentReportId);
            console.log("reportFolder", reportFolderResponse);

            if (reportFolderResponse && reportFolderResponse.length > 0) {
              existingFolderId = reportFolderResponse[0].folderId;
            } else {
              // Parent report is not in any folder, create a new folder and add parent report to it
              existingFolderId = await createNewFolder();

              newReportFolderModel = {
                reportId: parentReportId,
                folderId: existingFolderId,
              };
              await saveNewFolderModel(newReportFolderModel);
            }
          } else {
            // If there's no parent, create a new folder and add the report to it
            existingFolderId = await createNewFolder();
          }
        }
        async function addChildReportToFolder({ reportId, folderId }) {
          newReportFolderModel = {
            reportId,
            folderId,
          };
          await saveNewFolderModel(newReportFolderModel);
        }

        // Add the (child) report to the folder
        await addChildReportToFolder({
          reportId,
          folderId: existingFolderId,
        });

        /////////////////////////////////////////////
        ///////////////// CONTINUA //////////////////
        /////////////////////////////////////////////

        // Only do this at the end of the Continuum
        // Otherwise, perform the iterative Continuum action
        //  1. Determine interesting research based on the reports, including the highlighted region
        //  2. Choose or create a new agent
        //  3. Generate a new report
        //  4. Save the highlighted region and report Id to the links table
        //  5. Regenerate the folder name and image
        //  6. Each time the report is saved, the folder will update with the new report
        //  7. The user will be sent to the folder if continuum is enabled
        //  8. The UI will show Continuum Mission Progress (eg. 3/44)
        //  9. At the end of the continuum, regenerate folder name and image
        console.log("continuumEnabled");
        console.log(continuumEnabled);

        if (continuumEnabled) {
          async function getExistingAgentNames() {
            console.log("Fetching existing agent names...");
            let { data: agents, error } = await supabase
              .from("agents")
              .select("agentName")
              .eq("userId", userId);
            if (error) console.error("Error fetching agent names:", error);
            return agents.map((agent) => agent.agentName);
          }

          let existingAgentNames = await getExistingAgentNames();
          let currentReport = saveReportData.data[0];
          let currentParentReportId = parentReportId;
          // let generationCount = numberGenerations;

          console.log("CONTINUUM INITIATED");
          // console.log("Initial Report Content: ", newReportModel.reportContent);
          console.log("Generations Remaining1 :", generationCount);

          async function doContinuum(userId) {
            console.log("Generations Remaining2:", generationCount);

            generationCount--;

            console.log("doContinuum Called with userId:", userId);
            console.log("Generations Remaining3:", generationCount);

            if (generationCount <= 0) {
              console.log("Generation Count reached 0. Exiting...");
              return;
            }

            const researchLinks = await generateResearchLinks(
              currentReport.reportContent
            );
            console.log("Generations Remaining4:", generationCount);

            if (researchLinks && researchLinks.length > 0) {
              const researchLink =
                researchLinks[numberGenerations - generationCount - 1];

              const generateExpertiseInputObj = {
                researchLink,
                currentReport,
              };

              const expertiseInput = await generateExpertiseInput(
                generateExpertiseInputObj
              );
              const agent = await createNewAgent({
                expertiseInput,
                userId,
                existingAgentNames,
                specializedTraining: "",
              });

              let expertiseString = agent.expertise1;
              if (agent.expertise2) expertiseString += `, ${agent.expertise2}`;
              if (agent.expertise3) expertiseString += `, ${agent.expertise3}`;

              const researchLinkBriefing =
                await generateBriefingForResearchLink({
                  highlightedText: JSON.stringify(researchLink.highlightedText),
                  expertiseString,
                  parentReportId: currentReport.reportId,
                  agentId: agent.agentId,
                });

              const currentDraft = await generateNewDraft({
                expertises: [
                  agent.expertise1,
                  agent.expertise2,
                  agent.expertise3,
                ],
                briefing: researchLinkBriefing,
              });

              const savedReport = await saveReportFunction({
                draft: currentDraft,
                agentId: agent.agentId,
              });

              const linksObj = {
                body: {
                  parentReportId: currentReport.reportId,
                  childReportId: savedReport.data[0].reportId,
                  highlightedText: researchLink.highlightedText,
                  elementId: researchLink.elementId,
                },
              };

              console.log("doContinuum: Links Object", linksObj);

              saveToLinksTableFunction(linksObj);
              console.log("doContinuum: Saved Links to Table");

              await handleReportFoldering({
                reportId: savedReport.data[0].reportId,
                parentReportId: currentReport.reportId,
              });
              console.log("doContinuum: Handled Report Foldering");

              console.log(
                "doContinuum: Decrementing Generation Count to",
                generationCount
              );

              currentParentReportId = currentReport.reportId; // You might want to update this variable accordingly
              // console.log(
              //   "doContinuum: Updated Parent Report ID",
              //   currentParentReportId
              // );
              console.log("doContinuum: Recursing with Updated Details...");
              console.log("generationCount");
              console.log(generationCount);
              currentReport = savedReport.data[0];
              await doContinuum(userId);
            } else {
              console.log("No research links found. Exiting...");
            }
          }

          async function generateExpertiseInput({
            researchLink,
            currentReport,
          }) {
            console.log("researchLink", researchLink);
            console.log("currentReport", currentReport);
            // this function will be called for each continuum iteration to generate the research questions and links
            const messages = [
              {
                role: "system",
                content: `Please provide a JSON-only response containing JSON strings in the following format: [expertise1, expertise2, expertise3]. Your task is to read the research topic and determine ideal areas of expertise for further research. Provide the JSON object directly without additional explanations.
                  example:
                  user: How does the integration of contract negotiation strategies impact project management success and business development outcomes?
                  assistant: ["Project management", "Contract negotiation", "Business development"]`,
              },
              {
                role: "user",
                content: `please identify areas of expertise for investigating the following topic: ${researchLink.highlightedText} in the context of ${currentReport.reportSummary}"

                  `,
              },
            ];
            const expertises = await getFromOpenAi(messages);
            return JSON.parse(expertises);
          }
          async function generateResearchLinks(reportContent) {
            const linksExample = [
              {
                childReportId: "508",
                createdAt: "2023-09-11T03:11:23.338643+00:00",
                elementId: "nynf911g4",
                highlightedText: '"Data Ownership and Control"',
                linkId: "317",
                parentReportId: "507",
              },

              {
                childReportId: "509",
                createdAt: "2023-09-11T03:13:01.191382+00:00",
                elementId: "qyld7glm7",
                highlightedText: '"Transparency and Accountability"',
                linkId: "318",
                parentReportId: "507",
              },
              {
                childReportId: "510",
                createdAt: "2023-09-11T03:14:56.940684+00:00",
                elementId: "heg23wht7",
                highlightedText: '"Privacy-Preserving Techniques"',
                linkId: "319",
                parentReportId: "507",
              },
            ];
            // this function will be called for each continuum iteration to generate the research questions and links
            const linksCount = 3;
            const messages = [
              {
                role: "system",
                content: `Please provide a JSON-only response containing JSON objects with the following format: { elementId, highlightedText }. Your task is to read the report in HTML format and determine ${linksCount} areas of further research. Provide the JSON objects directly without additional explanations. Provide the JSON objects with the following format: [{ elementId, highlightedText }] that highlight the ${linksCount} most important sections of the article for further research. highlightedText must be after the introduction and before the conclusion, and be between 1 and 3 words within the same raw text. For each link, the elementId is the id attribute of the element of the highlighted text. elementId and highlightedText must be unique in your response array. This response will be used to create hyperlinks.`,
              },
              {
                role: "user",
                content: `<div>
                <h2 id="reportTitle">Ethical Implications and Challenges in Implementing Blockchain and Differential Privacy for Compliance, Data Security, and Privacy in Personalized Healthcare Recommendations</h2>
                
                <h3 id="8fog5y9k1">Introduction:</h3>
                <p id="576rsg6eb">The implementation of blockchain and differential privacy in personalized healthcare recommendations brings numerous benefits, but it also raises ethical implications and challenges that need to be addressed effectively.</p>
                
                <h3 id="0lre6xzsg">Ethical Implications:</h3>
                <ul id="j2vuh2p8u">
                    <li id="eln3y6nt5"><strong id="nynf911g4">Data Ownership and Control:</strong> Blockchain and differential privacy may challenge the traditional notions of data ownership and control, leading to ethical dilemmas.</li>
                    <li id="8yzqgjezx"><strong id="xut6xumv1">Informed Consent:</strong> Collecting and processing personal health data for personalized recommendations may require explicit informed consent from individuals, raising concerns about privacy and autonomy.</li>
                    <li id="8xakszpb9"><strong id="qyld7glm7">Transparency and Accountability:</strong> Ensuring transparency and accountability in algorithms used for personalized healthcare recommendations is crucial to prevent biases and ensure fair treatment.</li>
                </ul>
                
                <h3 id="lu9kztj67">Challenges and Addressing Strategies:</h3>
                <ul id="4y4b4mizg">
                    <li id="ov5wdhiwb"><strong id="46f17xwpf">Data Security:</strong> Implementing robust security measures, such as encryption and access controls, can protect the confidentiality and integrity of healthcare data on blockchain.</li>
                    <li id="qf7kdk8yn"><strong id="heg23wht7">Privacy-Preserving Techniques:</strong> Utilizing differential privacy techniques can help anonymize and aggregate data to protect individuals' privacy while still extracting useful insights.</li>
                    <li id="q781pyob8"><strong id="6pgt7lcir">Ethics in Algorithm Design:</strong> Adhering to ethical guidelines in algorithm design, ensuring fairness, explainability, and accountability can address potential biases and ethical concerns.</li>
                </ul>
                
                <h3 id="ps8nniif9">Conclusion:</h3>
                <p id="39agxlrc6">Implementing blockchain and differential privacy in personalized healthcare recommendations offers great potential but requires careful consideration of ethical implications and effective strategies to address challenges. Ensuring data security, privacy, transparency, and accountability are crucial for responsible implementation.</p>
            </div>`,
              },
              { role: "assistant", content: JSON.stringify(linksExample) },
              {
                role: "user",
                content: `${reportContent}`,
              },
            ];
            const researchLinksResponse = await getFromOpenAi(messages);
            console.log("generateResearchLinks researchLinks");
            console.log(researchLinksResponse);
            let researchLinks = researchLinksResponse;
            if (typeof researchLinksResponse === "string") {
              researchLinks = (() => {
                try {
                  return JSON.parse(researchLinksResponse);
                } catch {
                  return researchLinksResponse;
                }
              })();
            }
            console.log("save report researchLinksResponse researchLinks");
            console.log(researchLinks);
            // return researchLinksR
            // let researchLinksArray = researchLinks;
            // // if JSON.parse(researchLinks)
            // if (typeof researchLinks === "array") {
            //   researchLinksArray = researchLinks;
            // } else if (typeof suggestionResponseContent === "string") {
            //   researchLinksArray = JSON.parse(researchLinks);
            // }
            return researchLinks;
          }
          function generateNeededExpertiseForResearchLinks() {
            // determine what expertise is needed to answer each research question
          }
          function chooseAgentOrRecruit() {
            // determine for each report whether to use an existing agent or create a new one
          }
          async function createNewAgent({
            expertiseInput,
            userId,
            existingAgentNames,
            specializedTraining,
          }) {
            return await createAgentFunction({
              expertiseInput,
              userId,
              existingAgentNames,
              specializedTraining,
            });
          }

          async function generateNewDraft({
            expertises,
            briefing,
            specializedTraining,
          }) {
            const generateNewDraftObj = {
              expertises,
              briefing,
              specializedTraining,
            };
            console.log("generateNewDraftObj");
            // console.log(generateNewDraftObj);
            return writeDraftFunction({
              body: generateNewDraftObj,
            });
          }

          // The remaining function definitions go here...
          async function generateBriefingForResearchLink({
            expertiseString,
            parentReportId,
            agentId,
            highlightedText,
          }) {
            const suggestionResponse = await getSuggestionFunction({
              expertiseString,
              parentReportId,
              agentId,
              highlightedText,
            }).catch((error) => {
              console.log(error);
            });
            return suggestionResponse.briefingSuggestion;
          }

          console.log("doContinuum generationCount++++++++++++++++++++++++");
          console.log(generationCount);
          doContinuum(userId, generationCount);
        }

        // //////////////////////////////////
        // UPDATE FOLDER NAME AND IMAGE
        // //////////////////////////////////
        const folderNameAndImage = await regenerateFolderNameAndImage(
          existingFolderId
        );
        console.log("folderNameAndImage", folderNameAndImage);
        console.log("folderNameAndImageexistingFolderId");
        console.log(existingFolderId);
        // Update folder details
        const updatedFolderData = await updateFolderData(
          existingFolderId,
          folderNameAndImage
        );
        console.log("updatedFolderData", updatedFolderData);
        console.log("save report saveReportData.data[0].reportId");
        console.log(saveReportData.data[0].reportId);
        // res.status(200).json({
        return {
          reportId: saveReportData.data[0].reportId,
          folderId: existingFolderId,
        };
        // });
      }

      // Handle Continua
      // Save the reports to the database
      // The client will use real time reading to show reports populating into the parent folder
      // When the Continuum is complete, the folder will update with a new image and name
      const reportFolders = await handleReportFoldering({
        reportId: saveReportData.data[0].reportId,
        parentReportId,
      });
      return res.status(200).json(reportFolders);
    } // Process a POST request
  } else {
    return res.send(500).json({ error: "Something went wrong." });
    // Handle any other HTTP method
  }
  async function getFromOpenAi(messages) {
    const results = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });

    return results.data.choices[0].message.content;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
