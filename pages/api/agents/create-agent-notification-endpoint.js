import { log } from "../../../utils/log";

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  console.log("CREATE AGENT NOTIFICATION ENDOIINT");
  const expertises = req.body.expertises.filter((str) => str !== "");

  if (req.method === "POST") {
    console.log("POST");
    let expertiseString = expertises[0];
    if (expertises.length > 1) {
      expertiseString += " and " + expertises[1];
    }
    if (expertises.length > 2) {
      expertiseString += " and " + expertises[2];
    }

    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at generating world-building loading notifications for a game. In this game, the AI is searching for an animal that embodies various areas of expertise. You return your results in the form of a JSON array of strings. You never explain your answer.",
        },
        {
          role: "user",
          content:
            "what are 5 humorous steps searching for an animal that embodies the expertise of Soul Calibur 7, Combos, and Game Balance",
        },
        {
          role: "assistant",
          content: `["Calling All Animal Warriors—Who's Got Game?","Scouting Kangaroo Kick Combos", "Analyzing Octopus Button Mashing","Balancing Turtle Shell Defense","Gauging Falcon Reaction Time","Measuring Cobra Strike Speed"]`,
        },
        {
          role: "user",
          content: `what are 5 humorous steps searching for an animal that embodies the expertise of ${expertiseString}`,
        },
      ],
    });

    // res.sendStatus(200);
    console.log("res");
    res.send(chat_completion.data.choices[0].message.content);
    // console.log(res.send(200));
  } else {
    return res.sendStatus(500);
    // Handle any other HTTP method
  }
}
