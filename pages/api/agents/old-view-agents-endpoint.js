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
  console.log("VIEW AGENTS");
  const supabase = getSupabase();
  if (req.method === "POST") {
    console.log("POST");
    const supabase = getSupabase();

    let { data: agents, error } = await supabase
      .from("agents")
      .select(
        "agentId, expertise1, expertise2, expertise3, agentName, profilePicUrl, bio"
      );
    let { data: agency, agencyError } = await supabase
      .from("users")
      .select("agencyName")
      .eq("userId", user.sub);

    // other pages will redirect here if they're empty
    // If no agency, go to create agency page
    // If no agents, go to crete agent page
    // let agency;
  }
}
