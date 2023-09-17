// @author Marvin-Rhone
import { saveToSupabase } from "../../../../utils/saveToSupabase";
export default async function handler(req, res) {
  const parentReportId = req.body.parentReportId;
  if (parentReportId) {
    const childReportId = req.body.childReportId;
    const highlightedText = req.body.highlightedText;
    // const startIndex = req.body.startIndex;
    // const endIndex = req.body.endIndex;
    // const range = JSON.stringify({ startIndex, endIndex });
    const elementId = req.body.elementId;
    const saveLinksObj = {
      body: {
        childReportId,
        parentReportId,
        highlightedText,
        // range,
        elementId,
      },
    };
    const saveLinksData = await saveToLinksTableFunction(saveLinksObj).catch(
      (error) => {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    );
    return res.status(200).json({ saveLinksData });
    // await saveToLinksTableFunction();
  } else {
    res.status(200).json({});
  }
  async function saveToLinksTableFunction(req) {
    console.log("saveToLinksTableFunction saveReportData");
    console.log("saveToLinksTableFunction req.body");
    console.log(req.body);
    // const reportId = req.body.reportId;
    const parentReportId = req.body.parentReportId;

    const childReportId = req.body.childReportId;
    const highlightedText = req.body.highlightedText;
    // const startIndex = req.body.startIndex;
    // const endIndex = req.body.endIndex;
    // const range = JSON.stringify({ startIndex, endIndex });
    // const range = req.body.range;
    const elementId = req.body.elementId;
    const newLinkModel = {
      childReportId,
      parentReportId,
      // range,
      highlightedText,
      elementId,
    };
    // if (parentReportId) {
    //   newLinkModel.parentReportId = parentReportId;
    // }
    console.log("newLinkModel");
    console.log(newLinkModel);
    return await saveToSupabase("links", newLinkModel);
  }
}
