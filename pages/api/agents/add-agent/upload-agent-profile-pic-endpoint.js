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
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "dcf11wsow",
  api_key: "525679258926845",
  api_secret: "GfxhZesKW1PXljRLIh5Dz6-3XgM",
  secure: true,
});
export default async function handler(req, res) {
  console.log("UPLOAD AGENT PROFILE PIC ENDPOINT");
  console.log("Input:");
  console.log(req.body);
  const imageUrl = get(req, "body.imageUrl");
  const cloudinaryImageUploadResult = await cloudinary.uploader
    .upload(imageUrl)
    .catch((error) => console.log(error));
  // console.log("cloudinaryImageUploadResult");
  const profilePicUrl = cloudinaryImageUploadResult.url;
  // newAgentModel.profilePicUrl = profilePicUrl;
  res.status(200).json({ profilePicUrl });
}
