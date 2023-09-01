import { log } from "../../../utils/log";

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  console.log("SAVE REPORT AGENT NOTIFICATION ENDOIINT");
  const briefing = req.body.briefing;
  const agentName = req.body.agentName;
  if (req.method === "POST") {
    console.log("POST");

    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at generating world-building loading notifications for a game. In this game, the AI Agent (named after an animal) is saving a report that they've just written and the user has just approved. The finalized report will include artwork based on the report. You return your results in the form of a JSON array of strings. You never explain your answer.",
        },
        {
          role: "user",
          content:
            "what are 6 humorous steps describing Agent Alpine Ibex finalizing a research report with the following title: Impact of Blending and Layering Techniques with Oil Pastels on Depth Perception and Emotional Response in Artwork",
        },
        {
          role: "assistant",
          content: `["Ibex Framing Masterpiece","Rendering Artistic Layers", "Ibex Sealing the Canvas","Art Reveal Countdown",,"Masterpiece Going Public","Ibex Signing the Canvas"]`,
        },
        {
          role: "user",
          content: `what are 6 humorous steps describing ${agentName} finalizing a research report with the following briefing: ${briefing}`,
        },
      ],
    });

    // res.sendStatus(200);
    console.log("res");
    console.log(chat_completion.data.choices[0].message.content);
    res.send(chat_completion.data.choices[0].message.content);
    // console.log(res.send(200));
  } else {
    return res.sendStatus(500);
    // Handle any other HTTP method
  }
}
