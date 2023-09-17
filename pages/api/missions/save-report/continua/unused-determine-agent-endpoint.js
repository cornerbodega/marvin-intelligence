// @author Marvin-Rhone

export default async function handler(req, res) {
  console.log("DETERMINE AGENT ENDPOINT");
  const { childReportId, researchLinks } = req.body;
  console.log(req.body);

  if (researchLinks && researchLinks.length > 0) {
    const researchLink = researchLinks[maxGenerations - currentGeneration - 1];

    const generateExpertiseInputObj = {
      researchLink,
      currentReport,
    };

    const expertiseInput = await generateExpertiseInput(
      generateExpertiseInputObj
    );

    async function generateExpertiseInput({ researchLink, currentReport }) {
      console.log("researchLink", researchLink);
      console.log("currentReport", currentReport);
      // this function will be called for each continuum iteration to generate the research questions and links
      const messages = [
        {
          role: "system",
          content: `Please provide a JSON-only response containing JSON strings in the following format: [expertise1, expertise2, expertise3]. Your task is to read the research topic and determine ideal areas of expertise for further research. Provide the JSON object directly without additional explanations.
              example:
              user: How does the integration of contract negotiation strategies impact project management success and business development outcomes?
              assistant: ["Project management", "Contract negotiation", "Business development"]`,
        },
        {
          role: "user",
          content: `please identify areas of expertise for investigating the following topic: ${researchLink.highlightedText} in the context of ${currentReport.reportSummary}"

              `,
        },
      ];
      const expertises = await getFromOpenAi(messages);
      return JSON.parse(expertises);
    }
  }
  return res.status(200).json({});
}
