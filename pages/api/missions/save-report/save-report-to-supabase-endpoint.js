// import saveToSupabase from "../../../../utils/saveToSupabase";
import { getSupabase } from "../../../../utils/supabase";
export default async function handler(req, res) {
  console.log("UPLOAD AGENT PROFILE PIC ENDPOINT");
  console.log("Input:");
  console.log(req.body);
  const { draft, agentId } = req.body;
  async function saveReportFunction({ draft, agentId }) {
    console.log("save draft function");
    // console.log(draft);
    const reportPicUrl = req.body.reportPicUrl;
    const draftTitle = req.body.draftTitle;
    const briefing = req.body.briefing;
    const reportSummary = req.body.reportSummary;
    const userId = req.body.userId;

    // SAVE REPORT TO SUPABASE
    const newReportModel = {};
    newReportModel.reportPicUrl = reportPicUrl;
    newReportModel.reportTitle = draftTitle;
    newReportModel.reportContent = draft;
    newReportModel.briefing = briefing;
    newReportModel.agentId = agentId;
    newReportModel.reportSummary = reportSummary;
    newReportModel.userId = userId;

    console.log(newReportModel);
    console.log("newReportModel");
    // Generate Report Summary and Sanitize Briefing
    // Tried to Batch calls to the API to save requests/min. Did not work well. The answers were mixed together.

    // Save to Supabase missions table
    // Go to report detail page and see image :D
    console.log("SAVE REPORT TO SUPABASE");
    console.log(newReportModel);

    const saveReportData = await saveToSupabase(
      "reports",
      newReportModel
    ).catch((error) => console.log(error));
    const childReportId = saveReportData[0].reportId;
    return childReportId;
  }
  const childReportId = await saveReportFunction({ draft, agentId });
  res.status(200).json({ childReportId });
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
