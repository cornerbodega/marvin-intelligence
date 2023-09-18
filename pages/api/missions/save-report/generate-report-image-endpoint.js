// @author Marvin-Rhone
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function handler(req, res) {
  console.log("GENERATE REPORT IMAGE ENDPOINT");
  console.log(req.body);
  const { imageDescriptionResponseContent } = req.body;
  const aiImageResponse = await openai
    .createImage({
      prompt: `${imageDescriptionResponseContent}`,
      n: 1,
      size: "1024x1024",
    })
    .catch((error) => {
      console.log(error);
    });
  const imageUrl = aiImageResponse.data.data[0].url;
  return res.status(200).json({ imageUrl });
}
