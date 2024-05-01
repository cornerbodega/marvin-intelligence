// File: /pages/api/editReport.js

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Assuming you send 'reportId' and 'newContent' in the request body
    const { reportId, newContent, reportContent } = req.body;

    // Database update logic here
    // Example: save to reportHistory supabase table
    // Example: update report.reportContent with newContent

    // Define serverUrl, possibly from environment variables or static
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

    // Send a message to /api/reports/edit-report
    try {
      const response = await fetch(`${serverUrl}/api/reports/edit-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId, newContent, reportContent }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Edit report response:", data);

      // Sending a success response
      res
        .status(200)
        .json({ message: "Report updated successfully", details: data });
    } catch (error) {
      console.error("Error updating report:", error);
      res
        .status(500)
        .json({ message: "Failed to update report", error: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
