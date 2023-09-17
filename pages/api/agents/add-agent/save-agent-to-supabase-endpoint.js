// import saveToSupabase from "../../../../utils/saveToSupabase";
import { getSupabase } from "../../../../utils/supabase";
export default async function handler(req, res) {
  console.log("UPLOAD AGENT PROFILE PIC ENDPOINT");
  console.log("Input:");
  console.log(req.body);
  const expertise1 = req.body.expertiseOutput[0];
  let expertise2, expertise3;
  if (req.body.expertiseOutput[1]) {
    expertise2 = req.body.expertiseOutput[1];
  }
  if (req.body.expertiseOutput[2]) {
    expertise3 = req.body.expertiseOutput[2];
  }
  const newAgentModel = {
    agentName: req.body.agentName,
    userId: req.body.userId,
    expertise1,
    bio: req.body.bio,
    profilePicUrl: req.body.profilePicUrl,
    specializedTraining: req.body.specializedTraining,
  };
  if (expertise2) {
    newAgentModel.expertise2 = expertise2;
  }
  if (expertise3) {
    newAgentModel.expertise3 = expertise3;
  }
  const savedAgent = await saveToSupabase("agents", newAgentModel);
  console.log("savedAgent");
  console.log(savedAgent);
  const agentId = savedAgent[0].agentId;
  res.status(200).json({ agentId });
}

async function saveToSupabase(table, dataToSave) {
  const supabase = getSupabase();

  try {
    const response = await supabase.from(table).insert(dataToSave).select();

    if (response.error) {
      throw response.error;
    }

    // Successfully inserted data, response.data will contain the inserted data
    return response.data;
  } catch (error) {
    console.error("Error inserting data:", error.message);

    // Here you can handle different types of errors (e.g., network issues, validation errors) differently
    // if (error.code === 'some_specific_error_code') {
    //   // Handle specific error type
    // }

    // Additionally, you may want to log the error to an error tracking service
  }
}
// agentId
// :
// 689
// agentName
// :
// "Asian Elephant"
// bio
// :
// "The Asian Elephant has been an integral part of ceramic art and pottery techniques for centuries. Known for their gentle nature and intricate craftsmanship, these majestic creatures symbolize the beauty and grace in working with ceramic materials. Get inspired by the wisdom and patience of the Asian Elephant as you indulge in the artistry of ceramics."
// expertiseInput
// :
// "ceramics"
// expertiseOutput
// :
// (3) ['Ceramic art', 'Pottery techniques', 'Ceramic materials']
// generation
// :
// 2
// imageUrl
// :
// "https://oaidalleapiprodscus.blob.core.windows.net/private/org-gZxfbLjPsWlYy7t5UGUdy01m/user-8XmQY0bibwFw5mAscx6rHghG/img-8xYdhaOKg8cFT07kFDQSjMPq.png?st=2023-09-14T22%3A59%3A59Z&se=2023-09-15T00%3A59%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-09-14T00%3A09%3A10Z&ske=2023-09-15T00%3A09%3A10Z&sks=b&skv=2021-08-06&sig=vNaa0VsdSgu7Sy08fb3QN1YK3bP9gBmVHEPAjzR13Mw%3D"
// profilePicUrl
// :
// "http://res.cloudinary.com/dcf11wsow/image/upload/v1694736000/vi3w6i0czwzsctg3dubt.png"
// totalGenerations
// :
// 2
// userId
// :
// "auth0|63b127
