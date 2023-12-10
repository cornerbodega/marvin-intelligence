import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  console.log("generate-loading-notifications called");
  console.log("req.body");
  console.log(req.body);
  const { briefingInput, number } = req.body;
  // Load your OpenAI API key from environment variables for security
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const prompt = `Generate ${number} loading notifications for ${briefingInput}.`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a creative assistant. Your task is to generate unique and funny loading messages. You return the loading messages as an unnamed JSON array of strings",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const loadingNotifications =
      response.data.choices[0].message.content.trim();
    console.log("Generated loading notifications", loadingNotifications);
    res.status(200).json({ loadingNotifications });
  } catch (error) {
    console.error("Error in generateFunnyAgencyName:", error);
    res.status(500).json({ error: "Error generating funny agency name" });
  }
}
