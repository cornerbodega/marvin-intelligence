import { getSupabase } from "../../../utils/supabase";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function getSuggestion(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const { expertiseString, parentReportId, agentId, highlightedText } =
    req.body;
  const supabase = getSupabase();
  const responseObj = {};

  // #######################
  // # Get agent reports
  // #######################
  let { data: agentMissionHistory, error } = await supabase
    .from("reports")
    .select("reportTitle, reportSummary, reportId")
    .eq("agentId", agentId)
    .limit(3);
  // let { data: agentReports, agentReportsError } = await supabase
  //   .from("reports")
  //   .select("reportTitle, reportSummary, reportId")
  //   .eq("agentId", agentId);
  // if (!agentReports)
  //   return res.status(500).json({
  //     error: `Internal Server Error. No reports for agent ${agentId} returned in get-suggestions`,
  //   });
  // if (reports.length > 0) {
  //   if (reports[0].reportSummary) {
  //     parentReportSummary = reports[0].reportSummary;
  //   }
  // }
  console.log("agentMissionHistory");
  console.log(agentMissionHistory);
  if (agentMissionHistory.length > 0) {
    responseObj.agentMissionHistory = agentMissionHistory;
  }
  const agentReportTitles = agentMissionHistory.map(
    (mission) => mission.reportTitle
  );

  // #######################
  // # Get parent report summary
  // #######################
  let parentReportSummary = undefined;
  if (parentReportId) {
    let { data: reports, error } = await supabase
      .from("reports")
      .select("reportSummary")
      .eq("reportId", parentReportId);
    if (!reports)
      return res.status(500).json({
        error: "Internal Server Error. No reports returned in get-suggestions",
      });
    if (reports.length > 0) {
      if (reports[0].reportSummary) {
        parentReportSummary = reports[0].reportSummary;
      }
    }
  }
  let getSuggestionQuestionText = `You are an expert in ${expertiseString}.  `;
  if (agentReportTitles.length > 0) {
    getSuggestionQuestionText += `We've already written reports on ${agentReportTitles.join(
      ", "
    )}.`;
  }
  if (parentReportSummary) {
    getSuggestionQuestionText += `We need a new research question that will be linked to from this report: ${parentReportSummary}. The text of the link will be ${highlightedText}. Bring an inspirational, creative, and interesting angle from your expertise in ${expertiseString} whenever possible.`;
  }
  getSuggestionQuestionText += `What is an interesting research question for further research?`;
  try {
    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at generating an interesting research question for given areas of study. You always return exactly one answer in less than 300 characters.",
        },
        {
          role: "user",
          content: `Generate AI, Machine Learning, and Natural Language Processing. Return only the results in the following JSON format: {suggestion}`,
        },
        {
          role: "assistant",
          content: `{
                  "suggestion": "I need a comprehensive report on the applications of Natural Language Processing in the modern digital landscape."
              }`,
        },
        {
          role: "user",
          content: getSuggestionQuestionText,
        },
      ],
    });
    let briefingSuggestion = "";
    const suggestionResponseContent =
      chat_completion.data.choices[0].message.content;
    if (suggestionResponseContent) {
      console.log("suggestionResponseContent");
      console.log(suggestionResponseContent);
      console.log("typeof suggestionResponseContent");
      console.log(typeof suggestionResponseContent);
      if (typeof suggestionResponseContent === "object") {
        briefingSuggestion = suggestionResponseContent.suggestion;
      } else if (
        typeof suggestionResponseContent === "string" &&
        suggestionResponseContent.includes(`"suggestion":`)
      ) {
        const parsedSuggestionContent = JSON.parse(suggestionResponseContent);
        if (parsedSuggestionContent) {
          briefingSuggestion = parsedSuggestionContent.suggestion;
        }
      } else if (typeof suggestionResponseContent === "string") {
        briefingSuggestion = suggestionResponseContent;
      }

      // briefingSuggestion = suggestionResponseContent.split("suggestion:")[1];
    }
    if (briefingSuggestion) {
      responseObj.briefingSuggestion = briefingSuggestion;
    }
    // Extract and process the suggestion as you were doing before...
    if (parentReportSummary) {
      responseObj.parentReportSummary = parentReportSummary;
    }
    res.status(200).json(responseObj);
  } catch (error) {
    console.error("getSuggestion error");
    console.log(error);
    if (error.response) {
      const errorObject = error.response.data.error;
      console.log(errorObject); // this will log the error object
    } else {
      console.log("1234error");
      console.log(error);
      // Handle other types of errors (e.g., network errors)
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
}
