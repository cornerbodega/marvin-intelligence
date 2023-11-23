import { JSDOM } from "jsdom";
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export default async function getPriceHistoryJson(req, res) {
  console.log("getPriceHistoryJson REACHED");
  const { stockAndIndexPriceHistoryInput } = req.body;

  const systemMessage =
    "You are an agent that can process financial stock data in a detailed format and transform it into a simplified, month-wise JSON representation. The agent should create a JSON object where each month is represented by a key, and the value should be the closing price for that month. If there is a dividend in a particular month, instead of the closing price, the value should be the dividend amount. For example, '..., Jun 2023: 252.17, Jun 2023 Dividend: 0.633, ...' The output should be a clean, easy-to-read JSON format with each month having a single numeric value representing either the closing price or the dividend. JSON format: { stockHistory, russell1000History }";

  const userMessage = stockAndIndexPriceHistoryInput; // Assuming the detailed stock data is sent in the request body

  const response = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
    })
    .catch((error) => {
      console.error("Error in OpenAI completion:", error);
      throw error;
    });

  const priceHistoryJson = response.data.choices[0].message.content.trim();
  console.log("priceHistoryJson");
  console.log(priceHistoryJson);
  res.status(200).json({ priceHistoryJson });
  // res.json({ priceHistoryJson });
}
