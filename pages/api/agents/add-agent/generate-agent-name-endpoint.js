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
  const expertiseOutput = get(req, "body.expertiseOutput");
  console.log("GENERATE AGENT NAME FUNCTION");
  console.log("input: expertiseOutput");
  console.log(expertiseOutput);
  //   const specializedTraining = get(req, "body.specializedTraining");
  //   const agentName =
  // "Test Dolphin" +
  // expertiseOutput; /* Logic to generate agentName using expertiseOutput */

  const expertises = expertiseOutput.filter((str) => str !== "");

  // console.log("POST");
  //   let cannotBeAnimalsString = "";
  //   let newAgentModel = {
  //     //   agentName: req.body.animalName,
  //     userId: req.body.userId,
  //     expertise1: expertises[0],
  //   };
  //   if (expertises.length > 1) {
  //     newAgentModel.expertise2 = expertises[1];
  //   }
  //   if (expertises.length > 2) {
  //     newAgentModel.expertise3 = expertises[2];
  //   }

  async function generateAnimalName() {
    // console.log("Start generate Animal Name");
    let result = {
      animalName: "API Erorr 1: Generate Animal Name",
      bio: "API Error 2: Unable to Generate Animal Bio",
    };

    // console.log(req.body);

    let expertiseString = expertises[0];
    if (expertises.length > 1) {
      expertiseString += " and " + expertises[1];
    }
    if (expertises.length > 2) {
      expertiseString += " and " + expertises[2];
    }
    let specializedTrainingString = "";
    if (req.body.specializedTraining) {
      specializedTrainingString = `Agent is trained to know ${req.body.specializedTraining}.`;
    }
    const chat_completion = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at knowing lots of animal names and their characteristics. You are always as specific as possible with the sub-species. Return Emperor Penuin, instead of Penguin, Golden Retriever, instead of Dog.",
          },
          {
            role: "user",
            content: `Which animal embodies the characteristics of Writing Apps, and System Design, and React? Do not explain your answer. Return only the results in the following JSON format.`,
          },
          {
            role: "assistant", //try 'assistant' as well, but this works so far
            // content: `{
            //     "animal": "Fennec Fox",
            //     "bio": "The Fennec fox is often seen as a symbol of cunning and adaptability. In the realm of business strategy and market analysis, these are crucial traits. Foxes are known to observe and analyze their environment keenly, strategize their hunt, and change tactics as necessary, demonstrating a mix of intelligence, foresight, and flexibility. In business, the ability to assess the market, anticipate changes, and adjust strategies accordingly is vital for success, much like a fox navigating its terrain and seeking its prey."
            //   }`,
            content: `{
                "animal": "Honeybee",
                "bio": "With a codebase that draws inspiration from one of nature's most impressive architects, this AI agent is here to ensure your tech solutions are nothing short of hive-quality excellence. Approach with curiosity, leave with clarity."
            }`,
          },
          {
            role: "user",
            content: `Which animal embodies the characteristics of ${expertiseString}? ${specializedTrainingString}. Return your answer in the following JSON format: {animal: "Animal Name", bio: "Animal Bio"}`,
          },
        ],
      })
      .catch((error) => console.error(error));

    const animalNameResponseContent =
      chat_completion.data.choices[0].message.content;
    if (animalNameResponseContent) {
      const animalNameResponseObject = JSON.parse(animalNameResponseContent);
      if (animalNameResponseObject) {
        if (animalNameResponseObject.animal) {
          result.animalName = animalNameResponseObject.animal;
        }
        if (animalNameResponseObject.bio) {
          result.bio = animalNameResponseObject.bio;
        }
      }
    }

    // console.log(JSON.stringify(chat_completion.data.choices[0]));
    // console.log("End Generate Animal Name");
    return result;
  }
  // function getAgentName() {
  //   if (!checkForDuplicateNames()) {
  //   }
  //   return agentNameResponse;
  // }
  // let existingAgentsArray = req.body.existingAgentNames;
  async function getAgentName() {
    let agentNameResponse = await generateAnimalName().catch((error) =>
      console.error(error)
    );
    return agentNameResponse;
    // if (existingAgentsArray) {
    //   if (existingAgentsArray.length > 0) {
    //     if (existingAgentsArray.includes(agentNameResponse.animalName)) {
    //       // agentNameResponse = await generateAnimalName();
    //       // checkForDuplicateNames(agentNameResponse);
    //       console.log("DUPLIATE AGENT NAME- TRYING AGAIN");
    //       return getAgentName();
    //     } else {
    //       return agentNameResponse;
    //     }
    //   } else {
    //     return agentNameResponse;
    //   }
    // } else {
    //   return agentNameResponse;
    // }
  }
  const agentNameResponse = await getAgentName().catch((error) =>
    console.error(error)
  );
  // console.log(`existingAgentsArray.includes(agentNameResponse.animalName)`);
  // console.log(
  // `${existingAgentsArray}.includes(${agentNameResponse.animalName})`
  // );
  // console.log(`${existingAgentsArray.includes(agentNameResponse.animalName)}`);
  const agentName = agentNameResponse.animalName;
  const bio = agentNameResponse.bio;
  console.log("output: agentName");
  console.log(agentName);
  console.log(bio);
  // return { agentName };

  res.status(200).json({ agentName, bio });
}
