import { saveToSupabase } from "../../../utils/saveToSupabase";

export default async function handler(req, res) {
  console.log("CREATE AN AGENCY");

  if (req.method === "POST") {
    const { user, agencyName } = req.body;

    // Ensure user object contains the Supabase Auth user
    const createUserModel = {
      userId: user.id, // ✅ Supabase user ID
      email: user.email,
      agencyName,
    };

    try {
      const savedUsersData = await saveToSupabase("users", createUserModel);
      console.log(`saved user data ${JSON.stringify(savedUsersData)}`);

      if (savedUsersData && !savedUsersData.error) {
        return res.status(200).json(savedUsersData);
      } else {
        return res.status(500).json({ error: savedUsersData.error });
      }
    } catch (err) {
      console.error("Error saving to Supabase:", err);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
