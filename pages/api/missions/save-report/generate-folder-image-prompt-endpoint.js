// @author Marvin-Rhone
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function handler(req, res) {
  const { folderDescription } = req.body;
  const imageType = "realist painting";
  // "realist painting",
  // "impressionist painting",

  try {
    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at describing visually captivating artworks based on a report title. The artwork will performed by a realist painter.You never explain your answer. All your answers are less than 300 characters.",
        },
        {
          role: "user",
          content: `reportTitle: ${folderDescription}, imageType: ${imageType}`,
        },
      ],
    });

    const folderImageResponse = chat_completion.data.choices[0].message.content;
    console.log("folderImageResponse");
    console.log(folderImageResponse);
    res.status(200).json({ folderImageResponse });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error });
  }
  // await saveToLinksTableFunction();
}
