export default function getCloudinaryImageUrlForHeight(url, height) {
  return url;
  // if (!url) return console.log("error! trying to resize a null image");
  // // Split the URL into parts
  // const urlParts = url.split("/");

  // // Locate the position of 'upload' in the array
  // const uploadIndex = urlParts.indexOf("upload");

  // if (uploadIndex === -1) {
  //   return null; // 'upload' not found in URL
  // }

  // // Insert the height parameter after 'upload'
  // urlParts.splice(uploadIndex + 1, 0, `h_${height}`);

  // // Reconstruct the URL
  // const newUrl = urlParts.join("/");

  // return newUrl;
}
