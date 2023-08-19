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

export default async function (req, res) {
  console.log("Generate Briefing Suggestions");
  console.log("res");
  //   res.status(200);
  // console.log(res.send(200));
  if (req.method === "POST") {
    let expertiseString = req.body.expertises[0];

    if (req.body.expertises.length > 1) {
      expertiseString += " and " + req.body.expertises[1];
    }
    if (req.body.expertises.length > 2) {
      expertiseString += " and " + req.body.expertises[2];
    }
    let specializedTrainingString = "";
    if (req.body.specializedTraining) {
      specializedTrainingString += `${req.body.specializedTraining}.`;
    }
    console.log("expertiseString");
    console.log(specializedTrainingString);
    let messages = [
      {
        role: "system",
        content: `You are an expert at generating an interesting research report for given prompt in the areas of ${expertiseString}. You always return answers with no explanation. You always return responses in html format inside a <div></div>. The report title is always in an <h2></h2> within the <div> ${specializedTrainingString}`,
      },
      {
        role: "user",
        content: `what are the applications of Natural Language Processing in the modern digital landscape?`,
      },
      {
        role: "assistant",
        content: `<div>
        <h2>Report on Natural Language Processing (NLP) in the Modern Digital Landscape</h2>
        
        <h3>Introduction:</h3>
        <p>Natural Language Processing, a subfield of AI, focuses on enabling machines to understand and interpret human language. Its applications in the digital landscape are vast and transformative.</p>
        
        <h3>Applications:</h3>
        <ul>
            <li><strong>Search Engines:</strong> Major search engines like Google leverage NLP to provide more accurate and context-aware search results.</li>
            <li><strong>Chatbots and Virtual Assistants:</strong> Siri, Alexa, and Google Assistant, among others, use NLP to understand user queries and provide relevant responses.</li>
            <li><strong>Sentiment Analysis:</strong> Businesses analyze customer reviews and feedback using NLP to gain insights into consumer sentiments.</li>
            <li><strong>Content Recommendations:</strong> Platforms like Netflix and Spotify utilize NLP to analyze user preferences and deliver tailored content.</li>
            <li><strong>Translation Services:</strong> Real-time translation and transcription services, such as Google Translate, use NLP for accurate translations.</li>
        </ul>
        
        <h3>Conclusion:</h3>
        <p>NLP's applications are vast and integral to many services in the modern digital age. Its capabilities have transformed how businesses interact with consumers and how users access and interpret information.</p>
    </div>`,
      },
    ];

    messages.push({
      role: "user",
      content: `${req.body.briefing}?`,
    });
    const feedback = req.body.feedback;
    if (feedback && feedback.length > 0) {
      messages = [...messages, ...feedback];
    }
    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });
    const draftResponseContent =
      chat_completion.data.choices[0].message.content;
    if (draftResponseContent) {
      console.log("write draft endpoint");
      console.log(draftResponseContent);

      // const imageDescriptionResponseContent =
      //   imageDescriptionCompletion.data.choices[0].message.content;
      res.status(200).json({ message: "Success", data: draftResponseContent });
    } // Process a POST request
  } else {
    return res.send(500);
    // Handle any other HTTP method
  }
}
