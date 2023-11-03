import { getSupabase } from "../../../utils/supabase";
import { v2 as cloudinary } from "cloudinary";
import { saveToSupabase } from "../../../utils/saveToSupabase";
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
  console.log("CREATE AN AGENCY");
  const supabase = getSupabase();

  if (req.method === "POST") {
    console.log("req");
    console.log(req);
    // const { user, error, isLoading } = useUser();
    console.log("user");
    console.log(req.body.user);
    console.log("user");
    console.log(req.body.user);
    const createUserModel = {
      userId: req.body.user.sub,
      email: req.body.user.email,
      agencyName: req.body.agencyName,
    };
    const savedUsersData = await saveToSupabase("users", createUserModel);
    console.log("savedUsersData");
    console.log(savedUsersData);
    // Add user with user id as sub from auth0
    // Add agency with agency name
    // Add agenciesUsers with agency id and user id

    const newAgencyModel = { agencyName: req.body.agencyName };
    const saveAgencyData = await saveToSupabase("agencies", newAgencyModel);
    console.log("saveAgencyData");
    console.log(saveAgencyData);

    // Assign the first 25 tokens
    const newTokensModel = { tokens: 25, userId: req.body.user.sub };
    const saveTokensData = await saveToSupabase("tokens", newTokensModel);

    if (saveTokensData) {
      res.send(saveAgencyData);
    } else {
      res.send(500);
    }
  } else {
    return res.sendStatus(500);
    // Handle any other HTTP method
  }
}
