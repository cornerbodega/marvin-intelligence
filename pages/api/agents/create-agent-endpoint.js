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
  console.log("CREATE AN AGENT");
  const supabase = getSupabase();
  if (req.method === "POST") {
    console.log("POST");

    let newAgentModel = {
      //   agentName: req.body.animalName,
      userId: req.body.userId,
      expertise1: req.body.expertises[0],
    };
    if (req.body.expertises.length > 1) {
      newAgentModel.expertise2 = req.body.expertises[1];
    }
    if (req.body.expertises.length > 2) {
      newAgentModel.expertise3 = req.body.expertises[2];
    }

    async function generateAnimalName() {
      console.log("Start generate Animal Name");
      let result = {
        animalName: "API Erorr 1: Generate Animal Name",
        bio: "API Error 2: Unable to Generate Animal Bio",
      };
      const cannotBeAnimalsString = "Cannot be: Otter, Fox";
      let expertiseString = req.body.expertises[0];
      if (req.body.expertises.length > 1) {
        expertiseString += " and " + req.body.expertises[1];
      }
      if (req.body.expertises.length > 2) {
        expertiseString += " and " + req.body.expertises[2];
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
                  "bio": "When she's not pollinating projects with fresh insights or navigating the intricacies of the digital realm, Agent Honeybee can be found analyzing the patterns of her fellow agents to improve collective efficiency. With a codebase that draws inspiration from one of nature's most impressive architects, she’s here to ensure your tech solutions are nothing short of hive-quality excellence. Approach with curiosity, leave with clarity."
              }`,
          },
          {
            role: "user",
            content: `Which animal embodies the characteristics of ${expertiseString}? ${cannotBeAnimalsString}`,
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
    const agentNameResponse = await generateAnimalName();
    const agentName = agentNameResponse.animalName;
    const bio = agentNameResponse.bio;
    newAgentModel.agentName = agentName;
    newAgentModel.bio = bio;
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
    //   .then((result) => console.log(result))
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
      res.send(saveAgentData);
    } else {
      res.send(500);
    }
    // const { saveAgentData, saveAgentError } = await supabase
    //   .from("agents")
    //   .insert(newAgentModel);
    // console.log("saveAgentError");
    // console.log(saveAgentError);
    // // if (saveAgentError) {
    // //   console.error(saveAgentError);
    // //   return res.sendStatus(500);
    // // }
    // if (saveAgentError) {
    //   console.error("Error inserting record:", error);
    //   return res.sendStatus(500);
    // } else {
    //   console.log("saveAgentData");
    //   console.log(saveAgentData);
    //   // console.log("Inserted record with ID:", saveAgentData[0].id);
    //   res.send(200);
    // }
    async function saveToSupabase(table, dataToSave) {
      const response = await supabase.from(table).insert(dataToSave).select();
      console.log("response");
      console.log(response);
      // if (error) {
      //   console.log("error");
      //   console.log(error);
      //   return;
      // }
      // console.log("savedData");
      // console.log(savedData);
      return response;
      // return new Promise((resolve, reject) => {
      // supabase
      //   .from(table)
      //   .insert(data)
      //   .then((response) => {
      //     const { data, error } = response;
      //     if (error) {
      //       console.error("Error:", error.message);
      //       reject(error);
      //     } else {
      //       console.log("Inserted record:", data);
      //       resolve(data);
      //     }
      //   })
      //   .catch((e) => {
      //     console.error("Unexpected error:", e);
      //     reject(e);
      //   });
      // });
    }

    // return res.sendStatus(200);
    // const response = await fetch(
    //   "https://jsonplaceholder.typicode.com/todos/1"
    // );
    // res.send(response);
    // Process a POST request
  } else {
    return res.sendStatus(500);
    // Handle any other HTTP method
  }
}
