// @author Marvin-Rhone
// @author Marvin-Rhone
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function handler(req, res) {
  console.log("GENERATE FOLDER IMAGE ENDPOINT");
  const folderImageResponse = req.body.folderImageResponse;

  const aiImageResponse = await openai.createImage({
    prompt: folderImageResponse,
    n: 1,
    size: "1024x1024",
  });
  const imageUrl = aiImageResponse.data.data[0].url;
  //   Upload Image to Cloudinary and receive Url
  // const cloudinaryImageUploadResult = await cloudinary.uploader
  //   .upload(imageUrl)
  //   .catch((error) => console.log(error));
  // console.log("cloudinaryImageUploadResult");
  // console.log(cloudinaryImageUploadResult);
  // folderPicUrl = cloudinaryImageUploadResult.url;
  // return { folderName, folderPicUrl, folderDescription };

  // Get the image from Dall-E
  // Folder title x animal name

  return res.status(200).json({ imageUrl });
  // await saveToLinksTableFunction();
}
