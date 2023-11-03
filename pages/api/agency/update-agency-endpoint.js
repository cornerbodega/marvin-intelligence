import { getSupabase } from "../../../utils/supabase";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "dcf11wsow",
  api_key: "525679258926845",
  api_secret: "GfxhZesKW1PXljRLIh5Dz6-3XgM",
  secure: true,
});
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  console.log("Update AN AGENCY");
  const supabase = getSupabase();

  if (req.method === "POST") {
    console.log("req");
    console.log(req);
    // const { user, error, isLoading } = useUser();
    console.log("user");
    console.log(req.body.user);
    const userId = req.body.user.sub;
    const updatedAgencyModel = { agencyName: req.body.agencyName };
    // const saveAgencyData = await saveToSupabase("agencies", newAgencyModel);
    // update agency with agency name
    const saveAgencyData = await supabase
      .from("users")
      .update(updatedAgencyModel)
      .eq("userId", userId);

    console.log("saveAgencyData");
    console.log(saveAgencyData);
    if (saveAgencyData) {
      res.send(saveAgencyData);
    } else {
      res.send(500);
    }
  } else {
    return res.sendStatus(500);
    // Handle any other HTTP method
  }
}
