import { getSupabase } from "../../../utils/supabase";

// Function to fetch parent report ID and Title given a child report ID
async function fetchParentId(childReportId, supabase) {
  const { data: linkData, error: linkError } = await supabase
    .from("links")
    .select("parentReportId")
    .eq("childReportId", childReportId)
    .single();

  if (linkError) {
    console.error("Error fetching parentReportId:", linkError.message);
    console.log("childReportId");
    console.log(childReportId);
    return null;
  }

  // Use parentReportId to fetch reportTitle
  const { data: reportData, error: reportError } = await supabase
    .from("reports")
    .select("reportTitle")
    .eq("reportId", linkData.parentReportId)
    .single();

  if (reportError) {
    console.error("Error fetching reportTitle:", reportError.message);
    return null;
  }

  return {
    reportId: linkData.parentReportId,
    reportTitle: reportData ? reportData.reportTitle : null,
  };
}

// Function to recursively fetch all parent reports
async function getAllParentReports(childReportId, supabase) {
  const parentReports = [];
  let currentId = childReportId;

  while (currentId) {
    const parentData = await fetchParentId(currentId, supabase);

    if (parentData) {
      parentReports.push(parentData);
      currentId = parentData.reportId; // Updated this line
    } else {
      currentId = null;
    }
  }

  return parentReports;
}

export default async function getReportAncestry(req, res) {
  const supabase = getSupabase();

  if (req.method === "POST") {
    console.log("GET REPORT ANCESTRY ENDPOINT");
    const reportId = req.body.reportId;

    try {
      const parentReports = await getAllParentReports(reportId, supabase);
      res.status(200).json({ ancestry: parentReports });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Something went wrong." });
    }
  } else {
    res.status(500).json({ error: "Invalid HTTP method" });
  }
}
