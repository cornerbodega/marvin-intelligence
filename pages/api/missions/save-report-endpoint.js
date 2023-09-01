// @author Marvin-Rhone
// This file is the endpoint for saving a report. It is called from the /missions/create-mission/.../dispatch.js page in the handleAcceptReport function.
import { AuthUnknownError } from "@supabase/supabase-js";
import { getSupabase } from "../../../utils/supabase";
import { v2 as cloudinary } from "cloudinary";
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
      const imageTypes = [
        // "photograph",
        "realist painting",
        "impressionist painting",
      ];
      const imageType = getRandomInt(0, imageTypes.length - 1);
      const getDraftImageMessages = [
        {
          role: "system",
          content:
            "You are an expert an designing images of places and describing them in less than 300 characters.",
        },
        {
          role: "user",
          content:
            "describe this article as a photograph of place on earth in less than 300 characters: Research Report: Impact of Persistence and Goal-Setting on Project Success and Performance in Different Industries",
        },
        {
          role: "assistant",
          content:
            "A photograph of a bustling crossroads in a city, where diverse pathways converge symbolizing various industries. At its center stands a towering goal, surrounded by people navigating the paths, depicting the impact of persistence and goal-setting on project success.",
        },
        {
          role: "user",
          content: `describe this article as a ${imageType} of place on earth in less than 300 characters:${draftTitle}`,
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
        prompt: imageDescriptionResponseContent,
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
