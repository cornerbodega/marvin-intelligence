// export const config = {
//   runtime: "edge",
// };
import { get } from "lodash";
import { log } from "../../../../utils/log";
import { getSupabase } from "../../../../utils/supabase";
// import { saveAsyncTask } from "../../../utils/saveAsyncTask";
// import { v2 as cloudinary } from "cloudinary";
// cloudinary.config({
//   cloud_name: "dcf11wsow",
//   api_key: "525679258926845",
//   api_secret: "GfxhZesKW1PXljRLIh5Dz6-3XgM",
//   secure: true,
// });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  console.log("GENERATE EXPERTISE ENDPOINT");
  console.log("Input:");
  console.log(req.body);
  const expertiseInput = get(req, "body.expertiseInput");
  console.log("GENERATE EXPERTISE FUNCTION");
  console.log("Input");
  console.log(expertiseInput);
  // return { expertiseOutput: ["test"] };
  const expertiseCompletion = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        // {
        //   role: "system",
        //   content:
        //     "You are an expert at identifying areas of expertise that will be beneficial for further research on a given topic. You always return results as a JSON array of strings. Arrays have at least one element and can have up to three. Provide the JSON objects directly without additional explanations.",
        // },
        {
          role: "system",
          content:
            "Your task is to identify up to three areas of expertise beneficial for further research on a given topic. Always return the results directly as a raw JSON array of strings, containing between one and three elements. Do not wrap the array in an object or provide any additional explanations or keys. Respond directly with the array.",
        },
        {
          role: "user",
          content: `making software that makes millions of dollars`,
        },

        {
          role: "assistant",
          content: `["Software development", "Entrepreneurship", "Product management"]`,
        },
        {
          role: "user",
          content: `${expertiseInput} `,
        },
      ],
    })
    .catch((error) => console.error(error));

  const expertiseResponse = JSON.parse(
    expertiseCompletion.data.choices[0].message.content
  );
  console.log("Output: create agent expertiseResponse");
  console.log(expertiseResponse);
  const expertiseOutput = [
    "test",
  ]; /* Logic to generate expertiseOutput using expertiseInput */

  // return { expertiseOutput: expertiseResponse };

  res.status(200).json({ expertiseOutput: expertiseResponse });
}
