import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function generateCreateEpisodeScriptFormJson(req, res) {
  console.log("generateCreateEpisodeScriptFormJson REACHED");
  const { createEpisodeScriptFormInput } = req.body;

  const response = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You take in text and convert it to JSON in the following format: {companyName: ``, companyTicker: ``, stockPrice: ``, stockShares: ``, yahooFinanceRatios: JSON.stringify(``), tea: ``, snack: ``, nextStock: ``, nextTea: ``, nextSnack: `` }. Return only your answer in valid JSON format.",
        },

        {
          role: "user",
          content: createEpisodeScriptFormInput,
        },
      ],
    })
    .catch((error) => {
      console.log("generateCreateEpisodeScriptFormJson error");
      // console.log(error);
      console.log(error.response);
    });
  console.log("generateCreateEpisodeScriptFormJson response");
  // console.log(response);

  // Process the response and extract the desired information
  const createEpisodeFormJson = response.data.choices[0].message.content.trim();
  console.log("generateCreateEpisodeScriptFormJson createEpisodeFormJson");
  console.log(createEpisodeFormJson);
  // Return the result as a JSON response
  res.status(200).json({ createEpisodeFormJson });
}
