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
  console.log("GENERATE AGENT PROFILE PIC ENDPOINT");
  console.log("Input:");
  console.log(req.body);
  const agentName = get(req, "body.agentName");
  const aiImageResponse = await openai.createImage({
    prompt: `front facing photograph of a wild ${agentName}`,
    n: 1,
    size: "1024x1024",
  });
  const imageUrl = aiImageResponse.data.data[0].url;
  res.status(200).json({ imageUrl });
}
