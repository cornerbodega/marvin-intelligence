// @author Marvin-Rhone
import { getSuggestionFunction } from "../../get-suggestion";
export default async function handler(req, res) {
  console.log("GENERATE RESEARCH BRIEFINGS ENDPOINT");
  const { draft, researchLink1, researchLink2, researchLink3 } = req.body;
  console.log(req.body);

  // read the report (summary?)
  // look at each link
  // generate a research briefing for each link
  // return an object containing the research briefing associated with the link
  // {"briefing1": "research briefing 1", "briefing2": "research briefing 2", "briefing3": "research briefing 3"}

  return res.status(200).json({});
}
