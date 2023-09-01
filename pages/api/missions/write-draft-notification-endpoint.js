import { log } from "../../../utils/log";

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  console.log("WRITE DRAFT NOTIFICATION ENDOIINT");
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
            "You are an expert at generating world-building loading notifications for a game. In this game, the AI Agent (named after an animal) is writing a draft report for the user's review. You return your results in the form of a JSON array of strings. You never explain your answer.",
        },
        {
          role: "user",
          content:
            "what are 6 humorous steps describing Agent Alpine Ibex researching and writing a draft report with the following prompt: What is the impact of different blending and layering techniques with oil pastels on the perception of depth and emotional response in artwork?",
        },
        {
          role: "assistant",
          content: `["Nibbling Abstract Concepts","Hoof-Painting Oil Pastel Layers", "Head-Butting Depth Illusions","Leaping Over Artistic Blocks","Summiting Emotional Peaks","Scaling Final Draft Cliff"]`,
        },
        {
          role: "user",
          content: `what are 6 humorous steps describing ${agentName}Ibex researching and writing a draft report with the following prompt: ${briefing}`,
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
