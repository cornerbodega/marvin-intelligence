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

export default async function writeDraftEndpoint(req, res) {
  console.log("Write Draft Endpoint");
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
    // agents' areas of expertise
    // agents' specialized training
    // parent report summary aka "context"
    // parent report sanitized briefing
    // highlighted text
    // previous reports titles

    let messages = [
      {
        role: "system",
        content: `You are an expert at generating an interesting research report for given prompt in the areas of ${expertiseString}. You always return answers with no explanation. You always return responses in html format inside a <div id="report"></div>. The report title is always in an <h2 id="reportTitle"> within the <div id="report">. Each tag within the <div id="report"> has a unique 12-digit id attribute. ${specializedTrainingString}`,
      },
      {
        role: "user",
        content: `what are the applications of Natural Language Processing in the modern digital landscape?`,
      },
      {
        role: "assistant",
        content: `<div>
        <h2 id="reportTitle">Natural Language Processing (NLP) in the Modern Digital Landscape</h2>
        
        <h3 id="9c9ca07111eb">Introduction:</h3>
        <p id="28f78c385a9a">Natural Language Processing, a subfield of AI, focuses on enabling machines to understand and interpret human language. Its applications in the digital landscape are vast and transformative.</p>
        
        <h3 id="c8b9a046b431">Applications:</h3>
        <ul id="3b69f6431ac4">
            <li id="8419e7469eda"><strong>Search Engines:</strong> Major search engines like Google leverage NLP to provide more accurate and context-aware search results.</li>
            <li id="4eb2fbe321bf"><strong>Chatbots and Virtual Assistants:</strong> Siri, Alexa, and Google Assistant, among others, use NLP to understand user queries and provide relevant responses.</li>
            <li id="77268c0b4b94"><strong>Sentiment Analysis:</strong> Businesses analyze customer reviews and feedback using NLP to gain insights into consumer sentiments.</li>
            <li id="44889e11afd4"><strong>Content Recommendations:</strong> Platforms like Netflix and Spotify utilize NLP to analyze user preferences and deliver tailored content.</li>
            <li id="63d46aa75b84"><strong>Translation Services:</strong> Real-time translation and transcription services, such as Google Translate, use NLP for accurate translations.</li>
        </ul>
        
        <h3 id="6ffce604686a">Conclusion:</h3>
        <p id="c5d65052fa0f">NLP's applications are vast and integral to many services in the modern digital age. Its capabilities have transformed how businesses interact with consumers and how users access and interpret information.</p>
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
