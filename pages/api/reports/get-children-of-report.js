import { getSupabase } from "../../../utils/supabase";

export default async function getChildrenOfReport(req, res) {
  const { parentReportId } = req.body;
  // console.log("getChildrenOfReport");
  // console.log("parentReportId");
  // console.log(parentReportId);
  const supabase = getSupabase();
  let { data: childReports, error } = await supabase
    .from("links")
    .select("childReportId")
    .eq("parentReportId", parentReportId);
  if (error) {
    console.log(error);
  }
  console.log("childReports");
  console.log(childReports);
  res.send({ childReports });
  // res.send(200).json({ childReports });
}
