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
  console.log("Save Report Endpoint");
  console.log("res");
  //   res.status(200);
  // console.log(res.send(200));
  if (req.method === "POST") {
    const draft = req.body.draft;
    console.log("req.body");
    console.log(req.body);
    const newReportModel = {};
    if (draft) {
      console.log("save draft endpoint");
      console.log(draft);
      // describe this article as a photograph of place on earth in less than 300 characters: Research Report: Impact of Persistence and Goal-Setting on Project Success and Performance in Different Industries
      const draftTitle = draft.split(`<h2>`)[1].split(`</h2>`)[0];
      // describe this article as a photograph of place on earth in less than 300 characters: Research Report: Impact of Persistence and Goal-Setting on Project Success and Performance in Different Industries
      const getDraftImageMessages = [
        {
          role: "system",
          content:
            "You are an expert an designing photographs of places and describing them in less than 300 characters.",
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
          content: `describe this article as a photograph of place on earth in less than 300 characters:${draftTitle}`,
        },
      ];
      const imageDescriptionCompletion = await openai
        .createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: getDraftImageMessages,
        })
        .catch((error) => console.log(error));
      const imageDescriptionResponseContent =
        imageDescriptionCompletion.data.choices[0].message.content;
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
      // Save to Supabase reports table
      // Go to report detail page and see image :D
      console.log("SAVE REPORT TO SUPABASE");
      console.log(newReportModel);
      res.status(200).json({ message: "Success" });
    } // Process a POST request
  } else {
    return res.send(500).json({ error: "Something went wrong." });
    // Handle any other HTTP method
  }
}
