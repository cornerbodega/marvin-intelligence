import { get } from "lodash";
import { log } from "../../../utils/log";
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
export async function createAgentFunction({
  expertiseInput,
  userId,
  existingAgentNames,
  specializedTraining,
}) {
  const req = {
    body: {
      expertiseInput,
      userId,
      existingAgentNames,
      specializedTraining,
    },
  };
  const existingAgentsArray = req.body.existingAgentNames;
  console.log("existingAgentsArray");
  const expertiseCompletion = await openai.createChatCompletion({
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
        content: `${req.body.expertiseInput} `,
      },
    ],
  });

  const expertiseResponse = JSON.parse(
    expertiseCompletion.data.choices[0].message.content
  );
  console.log("expertiseCompletion");
  console.log(expertiseCompletion.data.choices[0].message.content);
  const expertises = expertiseResponse.filter((str) => str !== "");

  const supabase = getSupabase();
  console.log("POST");
  let cannotBeAnimalsString = "";
  let newAgentModel = {
    //   agentName: req.body.animalName,
    userId: req.body.userId,
    expertise1: expertises[0],
  };
  if (expertises.length > 1) {
    newAgentModel.expertise2 = expertises[1];
  }
  if (expertises.length > 2) {
    newAgentModel.expertise3 = expertises[2];
  }

  async function generateAnimalName() {
    console.log("Start generate Animal Name");
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
    const chat_completion = await openai.createChatCompletion({
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
          content: `Which animal embodies the characteristics of ${expertiseString}? ${specializedTrainingString} ${cannotBeAnimalsString}. Return your answer in the following JSON format: {animal: "Animal Name", bio: "Animal Bio"}`,
        },
      ],
    });
    const animalNameResponseContent =
      chat_completion.data.choices[0].message.content;
    if (animalNameResponseContent) {
      console.log("animalNameResponseContent");
      console.log(animalNameResponseContent);
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
    console.log(JSON.stringify(chat_completion.data.choices[0]));
    console.log("End Generate Animal Name");
    return result;
  }
  // function getAgentName() {
  //   if (!checkForDuplicateNames()) {
  //   }
  //   return agentNameResponse;
  // }
  // let existingAgentsArray = req.body.existingAgentNames;
  async function getAgentName() {
    let agentNameResponse = await generateAnimalName();
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
  const agentNameResponse = await getAgentName();
  // console.log(`existingAgentsArray.includes(agentNameResponse.animalName)`);
  // console.log(
  // `${existingAgentsArray}.includes(${agentNameResponse.animalName})`
  // );
  // console.log(`${existingAgentsArray.includes(agentNameResponse.animalName)}`);
  const agentName = agentNameResponse.animalName;
  const bio = agentNameResponse.bio;
  newAgentModel.agentName = agentName;
  newAgentModel.bio = bio;
  newAgentModel.specializedTraining = req.body.specializedTraining;
  const aiImageResponse = await openai.createImage({
    prompt: `front facing photograph of a wild ${agentName}`,
    n: 1,
    size: "1024x1024",
  });
  const imageUrl = aiImageResponse.data.data[0].url;
  //   Upload Image to Cloudinary and receive Url
  const cloudinaryImageUploadResult = await cloudinary.uploader
    .upload(imageUrl)
    .catch((error) => console.log(error));
  console.log("cloudinaryImageUploadResult");
  const profilePicUrl = cloudinaryImageUploadResult.url;
  newAgentModel.profilePicUrl = profilePicUrl;
  console.log("newAgentModel");
  console.log(newAgentModel);
  //   Save Agent to Supabase
  const saveAgentData = await saveToSupabase("agents", newAgentModel);
  console.log("saveAgentData");
  console.log(saveAgentData);
  if (saveAgentData) {
    return saveAgentData.data[0];
  } else {
    return console.log("error 3354");
  }

  async function saveToSupabase(table, dataToSave) {
    const response = await supabase.from(table).insert(dataToSave).select();
    console.log("response");
    console.log(response);

    return response;
  }
}
export default async function handler(req, res) {
  console.log("CREATE AN AGENT");
  const expertiseInput = req.body.expertiseInput;
  const userId = req.body.userId;
  const existingAgentNames = req.body.existingAgentNames;
  const specializedTraining = req.body.specializedTraining;

  const saveAgentData = await createAgentFunction({
    expertiseInput,
    userId,
    existingAgentNames,
    specializedTraining,
  }).catch((error) => console.log(error));

  res.status(200).json(saveAgentData);
}
