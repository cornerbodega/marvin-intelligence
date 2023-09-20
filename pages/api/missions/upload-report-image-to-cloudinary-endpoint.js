// @author Marvin-Rhone

export default async function handler(req, res) {
  const { imageUrl } = req.body;
  const cloudinaryImageUploadResult = await cloudinary.uploader
    .upload(imageUrl)
    .catch((error) => console.log(error));
  //   .then((result) => console.log(result))
  console.log("Report cloudinaryImageUploadResult");
  const reportPicUrl = cloudinaryImageUploadResult.url;

  return res.status(200).json({ reportPicUrl });
}
