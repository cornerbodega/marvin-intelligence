import { getSupabase } from "../../../utils/supabase";

export default async function getChildrenOfReport(req, res) {
  const { parentReportId } = req.body;
  // console.log("getChildrenOfReport");
  // console.log("parentReportId");
  // console.log(parentReportId);
  const supabase = getSupabase();
  // let { data: childReports, error } = await supabase
  //   .from("links")
  //   .select("childReportId")
  //   .eq("parentReportId", parentReportId);
  // if (error) {
  //   console.log(error);
  // }
  let { data: childReports, error } = await supabase
    .from("links")
    .select(
      `
      childReportId,
      reports:childReportId (
          availability
      )
  `
    )
    .eq("parentReportId", parentReportId);
  // .not("reports.availability", "eq", "DELETED");

  if (!error) {
    // filtering out the reports marked as DELETED, if needed
    childReports = childReports.filter((report) => {
      console.log("report");
      console.log(report);
      return report.reports.availability != "DELETED";
      // report.reports.availability !== "DELETED" || !report.reports.availability;
    });

    console.log("Filtered childReports", childReports);
  } else {
    console.error("Error fetching child reports:", error);
  }

  console.log(childReports);
  res.send({ childReports });
  // res.send(200).json({ childReports });
}
