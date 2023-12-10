import { getSupabase } from "../../../utils/supabase";
import { saveToSupabase } from "../../../utils/saveToSupabase";

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Assign the first 25 tokens
    const newTokensModel = { tokens: 25, userId: req.body.user.sub };
    const saveTokensData = await saveToSupabase("tokens", newTokensModel);

    if (savedUsersData) {
      res.send(savedUsersData);
    } else {
      res.send(500);
    }
  } else {
    return res.sendStatus(500);
    // Handle any other HTTP method
  }
}
