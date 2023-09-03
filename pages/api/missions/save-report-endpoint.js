// @author Marvin-Rhone
// This file is the endpoint for saving a report. It is called from the /missions/create-mission/.../dispatch.js page in the handleAcceptReport function.
import { AuthUnknownError } from "@supabase/supabase-js";
import { getSupabase } from "../../../utils/supabase";
import { v2 as cloudinary } from "cloudinary";
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
    console.log(`${table} ${JSON.stringify(dataToSave)}}`);
    console.log(response);

    return response;
  }

  console.log("Save Report Endpoint");
  console.log(req.body.draft);
  if (req.method === "POST") {
    const draft = req.body.draft;
    const briefing = req.body.briefing;
    const userId = req.body.userId;
    const agentId = req.body.agentId;
    let existingFolderId = req.body.existingFolderId;
    // #####################################
    // Save Report to Reports Table
    // #####################################

    const newReportModel = {};
    if (draft) {
      console.log("save draft endpoint");

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
      const draftImageMessagesResponse = await getFromOpenAI(
        getDraftImageMessages
      );
      const reportSummaryResponse = await getFromOpenAI(reportSummaryMessages);

      async function getFromOpenAI(messages) {
        return await openai
          .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
          })
          .catch((error) => {
            console.log("error");
            console.log(error);
          });
      }

      if (!draftImageMessagesResponse) {
        console.log("ERROR! NO draftImageMessagesResponse");
        return;
      }
      const imageDescriptionResponseContent =
        draftImageMessagesResponse.data.choices[0].message.content;
      const reportSummary =
        reportSummaryResponse.data.choices[0].message.content;

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

      // #####################################
      // Save Link to Links Table
      // #####################################
      console.log("saveReportData");
      console.log("req.body");
      console.log(req.body);
      const reportId = saveReportData.data[0].reportId;
      const parentReportId = req.body.parentReportId;
      if (parentReportId) {
        const childReportId = saveReportData.data[0].reportId;
        const highlightedText = req.body.highlightedText;
        const startIndex = req.body.startIndex;
        const endIndex = req.body.endIndex;
        const range = JSON.stringify({ startIndex, endIndex });
        const elementId = req.body.elementId;
        const newLinkModel = {
          childReportId,
          parentReportId,
          range,
          highlightedText,
          elementId,
        };
        // if (parentReportId) {
        //   newLinkModel.parentReportId = parentReportId;
        // }
        const saveLinkData = await saveToSupabase("links", newLinkModel).catch(
          (error) => console.log(error)
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

      if (parentReportId) {
        if (!existingFolderId) {
          // create a folder id
          const newFolderModel = { userId };
          // generate folder name based on constituent report titles
          // const folderNameAndImage = generateFolderNameAndImage({
          //   reportTitles,
          // });
          // newFolderModel.folderName = folderNameAndImage.folderName;
          // generate a folder pic url based on the agent hunting and the briefing

          // newFolderModel.folderPicUrl = folderNameAndImage.folderPicUrl;
          const saveFolderData = await saveToSupabase(
            "folders",
            newFolderModel
          ).catch((error) => console.log(error));
          console.log("saveFolderData");
          console.log(saveFolderData);
          existingFolderId = saveFolderData.data[0].folderId;
        }
        // check whether the parent report has a folder
        // if it doesn't, add the parent report to the folder
        // getFromSupabase("reports", { userId, reportId: parentReportId }).then();
        let { data: reportFolderResponse, error } = await supabase
          .from("reportFolders")
          .select("folderId")
          .eq("reportId", parentReportId);
        console.log("reportFolder");
        console.log(reportFolderResponse);
        if (reportFolderResponse && reportFolderResponse.length > 0) {
          existingFolderId = reportFolderResponse[0].folderId;
        }
        // reportFolder[{ folderId: 12 }];
        console.log("existingFolderId");
        console.log(existingFolderId);
        let newReportFolderModel = {};
        if (!existingFolderId) {
          // add the parent report to the folder
          newReportFolderModel = {
            reportId: parentReportId,
            folderId: existingFolderId,
          };
          const saveReportFolderData = await saveNewFolderModel(
            newReportFolderModel
          );
          console.log("saveReportFolderData");
          console.log(saveReportFolderData);
        }

        // add the child report to the folder
        newReportFolderModel = {
          reportId,
          folderId: existingFolderId,
        };
        const saveReportFolderData = await saveNewFolderModel(
          newReportFolderModel
        );
        console.log("saveReportFolderData");
        console.log(saveReportFolderData);
        async function saveNewFolderModel(newReportFolderModel) {
          return await saveToSupabase(
            "reportFolders",
            newReportFolderModel
          ).catch((error) => console.log(error));
        }

        // Now that the folder has been created
        // and the reportFolder relationship has been created
        // we need to regenerate the folder name and image
        const folderNameAndImage = await regenerateFolderNameAndImage(
          existingFolderId
        );
        console.log("folderNameAndImage");
        console.log(folderNameAndImage);
        // const updateFolderData = await updateSupabase("folders", {
        //   folderId: existingFolderId,
        //   folderName: folderNameAndImage.folderName,
        //   folderPicUrl: folderNameAndImage.folderPicUrl,
        // }).catch((error) => console.log(error));
        const updateFolderData = async () => {
          try {
            const { data, error } = await supabase
              .from("folders")
              .update({
                folderName: folderNameAndImage.folderName,
                folderPicUrl: folderNameAndImage.folderPicUrl,
                folderDescription: folderNameAndImage.folderDescription,
              })
              .eq("folderId", existingFolderId);

            if (error) {
              console.log(error);
            }

            return data;
          } catch (error) {
            console.log(error);
          }
        };

        const updatedFolderData = updateFolderData();
        console.log("updatedFolderData");
        console.log(updatedFolderData);
        //
        // .limit(3);
        // add the child report to the folder
      }
      // console.log("saveReportData");
      // console.log(saveReportData);

      // // This will be passed in from the report detail page
      // let existingFolderId = undefined;
      // if (!existingFolderId) {
      //   // create a folder id
      //   const newFolderModel = { userId };
      //   // generate folder name based on briefing and report title
      //   newFolderModel.folderName = "Test folder Name";
      //   // generate a folder pic url based on the agent hunting and the briefing
      //   let reportPicUrl = "Test Url";
      //   newFolderModel.folderPicUrl = reportPicUrl;
      //   const saveFolderData = await saveToSupabase(
      //     "folders",
      //     newFolderModel
      //   ).catch((error) => console.log(error));
      //   console.log("saveFolderData");
      //   console.log(saveFolderData);
      //   existingFolderId = saveFolderData.data[0].folderId;
      // }

      // // save the folder report association
      // const newFolderReportModel = {
      //   folderId: existingFolderId,
      //   reportId: saveReportData.data[0].reportId,
      // };
      // const saveFolderReportData = await saveToSupabase(
      //   "folderReportPos",
      //   newFolderReportModel
      // ).catch((error) => console.log(error));

      res.status(200).json({ reportId });
    } // Process a POST request
  } else {
    return res.send(500).json({ error: "Something went wrong." });
    // Handle any other HTTP method
  }
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
