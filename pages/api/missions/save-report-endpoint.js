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
  // console.log("res");

  //   res.status(200);
  // console.log(res.send(200));
  if (req.method === "POST") {
    const draft = req.body.draft;
    const briefing = req.body.briefing;
    const userId = req.body.userId;
    const agentId = req.body.agentId;
    // console.log("req.body");
    // console.log(req.body);
    const newReportModel = {};
    if (draft) {
      console.log("save draft endpoint");
      // console.log(draft);
      // describe this article as a photograph of place on earth in less than 300 characters: Research Report: Impact of Persistence and Goal-Setting on Project Success and Performance in Different Industries
      const draftTitle = draft.split(`<h2>`)[1].split(`</h2>`)[0];
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
      // const getBriefingSummary = [
      //   {
      //     role: "system",
      //     content:
      //       "You are an expert at summarizing text in less than 300 characters. You never explain your answers. You return answers in the style of a research question.",
      //   },
      //   {
      //     role: "user",
      //     content: `how can music help peope with parkinsins or dimentia?`,
      //   },
      //   {
      //     role: "assistant",
      //     content:
      //       "What is the impact of music therapy on reducing symptoms and improving the quality of life for patients with neurological disorders such as Parkinson's disease or dementia?",
      //   },
      //   {
      //     role: "user",
      //     content: `${briefing}`,
      //   },
      // ];
      // const getReportSummary = [
      //   {
      //     role: "system",
      //     content:
      //       "You are an expert at summarizing text in less than 300 characters. You never explain your answers. You will receive html and return plain text.",
      //   },
      //   {
      //     role: "user",
      //     content: `please summarize this report in less than 300 characters: ${draft}`,
      //   },
      // ];
      // const stringifiedPromptsArray = [
      //   JSON.stringify(getDraftImageMessages),
      //   JSON.stringify(getBriefingSummary),
      //   JSON.stringify(getReportSummary),
      // ];
      // let prompts = [
      //   {
      //     role: "user",
      //     content: stringifiedPromptsArray,
      //   },
      //   {
      //     role: "system",
      //     content:
      //       "Complete every element of the array. Reply with an array of all completions.",
      //   },
      // ];
      // console.log("prompts");
      // console.log(prompts);

      // return;
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
      // const briefingSummaryMessages = [
      //   {
      //     role: "system",
      //     content:
      //       "You are an expert at summarizing mission briefings. You change as little as possible, only correcting for spelling or grammar, never content. You always return less than 300 characters in plain text.",
      //   },
      //   {
      //     role: "user",
      //     content: `please edit the following briefing for spelling and grammar in the style of an intelligence agency research question: ${briefing}`,
      //   },
      // ];
      const draftImageMessagesResponse = await getFromOpenAI(
        getDraftImageMessages
      );
      const reportSummaryResponse = await getFromOpenAI(reportSummaryMessages);

      // const briefingSummaryResponse = await getFromOpenAI(
      //   briefingSummaryMessages
      // );
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
      // console.log("draftImageMessagesResponse");
      // console.log(draftImageMessagesResponse);

      if (!draftImageMessagesResponse) {
        console.log("ERROR! NO draftImageMessagesResponse");
        return;
      }
      const imageDescriptionResponseContent =
        draftImageMessagesResponse.data.choices[0].message.content;
      // console.log("draftImageMessagesResponse");
      // console.log(draftImageMessagesResponsreportSummaryAndBriefingResponse);

      // return;

      // const briefingSummary =
      //   briefingSummaryResponse.data.choices[0].message.content;
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
      // Batch calls to the API to save requests/min

      // const chat_completion = await openai.createChatCompletion({
      //   model: "gpt-3.5-turbo",
      //   messages,
      // });

      // Save to Supabase missions table
      // Go to report detail page and see image :D
      console.log("SAVE REPORT TO SUPABASE");
      console.log(newReportModel);

      const saveReportData = await saveToSupabase(
        "reports",
        newReportModel
      ).catch((error) => console.log(error));

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

      res.status(200).json({ message: "Success" });
    } // Process a POST request
  } else {
    return res.send(500).json({ error: "Something went wrong." });
    // Handle any other HTTP method
  }
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
