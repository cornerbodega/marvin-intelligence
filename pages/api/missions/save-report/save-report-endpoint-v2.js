// @author Marvin-Rhone

export default async function handler(req, res) {
  console.log("SAVE REPORT ENDPOINT V2");
  console.log(req.body);
  return res.status(200).json(req.body);
}
