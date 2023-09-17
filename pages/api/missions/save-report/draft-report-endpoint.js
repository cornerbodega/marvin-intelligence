const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function writeDraftFunction(req) {
  let expertiseString = req.body.expertises[0];

  if (req.body.expertises.length > 1) {
    expertiseString += " and " + req.body.expertises[1];
  }
  if (req.body.expertises.length > 2) {
    expertiseString += " and " + req.body.expertises[2];
  }
  let specializedTrainingString = "";
  if (req.body.specializedTraining) {
    specializedTrainingString += `${req.body.specializedTraining}.`;
  }
  console.log("expertiseString");
  console.log(specializedTrainingString);
  // agents' areas of expertise
  // agents' specialized training
  // parent report summary aka "context"
  // parent report sanitized briefing
  // highlighted text
  // previous reports titles

  let messages = [
    {
      role: "system",
      content: `You are an expert at generating an interesting research report for given prompt in the areas of ${expertiseString}. You always return answers with no explanation. You always return responses in html format inside a <div id="report"></div>. The report title is always in an <h2 id="reportTitle"> within the <div id="report">. Each tag within the <div id="report"> has a unique 12-digit id attribute. ${specializedTrainingString}`,
    },
    {
      role: "user",
      content: `what are the applications of Natural Language Processing in the modern digital landscape?`,
    },
    {
      role: "assistant",
      content: `<div>
        <h2 id="reportTitle">Natural Language Processing (NLP) in the Modern Digital Landscape</h2>
        
        <h3 id="${generateUniqueID()}">Introduction:</h3>
        <p id="${generateUniqueID()}">Natural Language Processing, a subfield of AI, focuses on enabling machines to understand and interpret human language. Its applications in the digital landscape are vast and transformative.</p>
        
        <h3 id="${generateUniqueID()}">Applications:</h3>
        <ul id="${generateUniqueID()}">
            <li id="${generateUniqueID()}"><strong id="${generateUniqueID()}">Search Engines:</strong> Major search engines like Google leverage NLP to provide more accurate and context-aware search results.</li>
            <li id="${generateUniqueID()}"><strong id="${generateUniqueID()}">Chatbots and Virtual Assistants:</strong> Siri, Alexa, and Google Assistant, among others, use NLP to understand user queries and provide relevant responses.</li>
            <li id="${generateUniqueID()}"><strong id="${generateUniqueID()}">Sentiment Analysis:</strong> Businesses analyze customer reviews and feedback using NLP to gain insights into consumer sentiments.</li>
            <li id="${generateUniqueID()}"><strong id="${generateUniqueID()}">Content Recommendations:</strong> Platforms like Netflix and Spotify utilize NLP to analyze user preferences and deliver tailored content.</li>
            <li id="${generateUniqueID()}"><strong id="${generateUniqueID()}">Translation Services:</strong> Real-time translation and transcription services, such as Google Translate, use NLP for accurate translations.</li>
        </ul>
        
        <h3 id="${generateUniqueID()}">Conclusion:</h3>
        <p id="${generateUniqueID()}">NLP's applications are vast and integral to many services in the modern digital age. Its capabilities have transformed how businesses interact with consumers and how users access and interpret information.</p>
    </div>`,
    },
  ];

  messages.push({
    role: "user",
    content: `${req.body.briefing}?`,
  });
  const feedback = req.body.feedback;
  if (feedback && feedback.length > 0) {
    messages = [...messages, ...feedback];
  }
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });
  const draftResponseContent = chat_completion.data.choices[0].message.content;
  return draftResponseContent;
}
export default async function writeDraftEndpoint(req, res) {
  console.log("Write Draft Endpoint");

  if (req.method === "POST") {
    const draftResponseContent = await writeDraftFunction(req);
    if (draftResponseContent) {
      // console.log("write draft endpoint");
      // console.log(draftResponseContent);

      res.status(200).json({ message: "Success", data: draftResponseContent });
    } // Process a POST request
  } else {
    return res.send(500);
    // Handle any other HTTP method
  }
}
function generateUniqueID() {
  return Math.random().toString(36).substr(2, 9);
}
