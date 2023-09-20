// @author Marvin-Rhone

import { getFromOpenAi } from "../../../../../utils/getFromOpenAi";

// import { getSuggestionFunction } from "../../get-suggestion";

export default async function handler(req, res) {
  console.log("GENERATE RESEARCH BRIEFINGS ENDPOINT");
  // const { draft, researchLink1, researchLink2, researchLink3 } = req.body;
  const { draft, researchLinks } = req.body;
  console.log(req.body);
  if (!researchLinks) {
    console.log("2WHERE IS RESEARCHI LINK!!?");
    res.status(500);
    return;
  }
  // read the report (summary?)
  // look at each link
  // generate a research briefing for each link
  // return an object containing the research briefing associated with the link
  // {"briefing1": "research briefing 1", "briefing2": "research briefing 2", "briefing3": "research briefing 3"}

  const { briefing1, briefing2, briefing3 } = await generateResearchBriefings({
    draft,
    researchLinks,
  });

  async function generateResearchBriefings({ draft, researchLinks }) {
    // const researchLinks = [researchLink1, researchLink2, researchLink3];
    const briefingsExample = {
      briefing1:
        "Given the highlighted text 'Data Ownership and Control,' what are the potential shifts in traditional notions of data ownership and control when implementing blockchain and differential privacy in personalized healthcare recommendations?",
      briefing2:
        "Considering the emphasis on 'Transparency and Accountability,' how can we ensure transparency in the algorithms used for personalized healthcare recommendations on blockchain and how can we hold them accountable to prevent biases?",
      briefing3:
        "Regarding 'Privacy-Preserving Techniques,' what are the most effective privacy-preserving techniques based on differential privacy that can be employed to anonymize and aggregate healthcare data while still extracting valuable insights for personalized recommendations?",
    };
    const linksExample = [
      {
        childReportId: "508",
        createdAt: "2023-09-11T03:11:23.338643+00:00",
        elementId: "nynf911g4",
        highlightedText: '"Data Ownership and Control"',
        linkId: "317",
        parentReportId: "507",
      },

      {
        childReportId: "509",
        createdAt: "2023-09-11T03:13:01.191382+00:00",
        elementId: "qyld7glm7",
        highlightedText: '"Transparency and Accountability"',
        linkId: "318",
        parentReportId: "507",
      },
      {
        childReportId: "510",
        createdAt: "2023-09-11T03:14:56.940684+00:00",
        elementId: "heg23wht7",
        highlightedText: '"Privacy-Preserving Techniques"',
        linkId: "319",
        parentReportId: "507",
      },
    ];
    const reportExample = `<div>
      <h2 id="reportTitle">Ethical Implications and Challenges in Implementing Blockchain and Differential Privacy for Compliance, Data Security, and Privacy in Personalized Healthcare Recommendations</h2>
      
      <h3 id="8fog5y9k1">Introduction:</h3>
      <p id="576rsg6eb">The implementation of blockchain and differential privacy in personalized healthcare recommendations brings numerous benefits, but it also raises ethical implications and challenges that need to be addressed effectively.</p>
      
      <h3 id="0lre6xzsg">Ethical Implications:</h3>
      <ul id="j2vuh2p8u">
          <li id="eln3y6nt5"><strong id="nynf911g4">Data Ownership and Control:</strong> Blockchain and differential privacy may challenge the traditional notions of data ownership and control, leading to ethical dilemmas.</li>
          <li id="8yzqgjezx"><strong id="xut6xumv1">Informed Consent:</strong> Collecting and processing personal health data for personalized recommendations may require explicit informed consent from individuals, raising concerns about privacy and autonomy.</li>
          <li id="8xakszpb9"><strong id="qyld7glm7">Transparency and Accountability:</strong> Ensuring transparency and accountability in algorithms used for personalized healthcare recommendations is crucial to prevent biases and ensure fair treatment.</li>
      </ul>
      
      <h3 id="lu9kztj67">Challenges and Addressing Strategies:</h3>
      <ul id="4y4b4mizg">
          <li id="ov5wdhiwb"><strong id="46f17xwpf">Data Security:</strong> Implementing robust security measures, such as encryption and access controls, can protect the confidentiality and integrity of healthcare data on blockchain.</li>
          <li id="qf7kdk8yn"><strong id="heg23wht7">Privacy-Preserving Techniques:</strong> Utilizing differential privacy techniques can help anonymize and aggregate data to protect individuals' privacy while still extracting useful insights.</li>
          <li id="q781pyob8"><strong id="6pgt7lcir">Ethics in Algorithm Design:</strong> Adhering to ethical guidelines in algorithm design, ensuring fairness, explainability, and accountability can address potential biases and ethical concerns.</li>
      </ul>
      
      <h3 id="ps8nniif9">Conclusion:</h3>
      <p id="39agxlrc6">Implementing blockchain and differential privacy in personalized healthcare recommendations offers great potential but requires careful consideration of ethical implications and effective strategies to address challenges. Ensuring data security, privacy, transparency, and accountability are crucial for responsible implementation.</p>
  </div>`;
    // this function will be called for each continuum iteration to generate the research questions and links
    const messages = [
      {
        role: "system",
        content: `Please provide a JSON-only response containing a keyed JSON object containing strings with the following format: { briefing1, briefing2, briefing3 }. Your task is to read the report, and for each highlighted area, provide the most interesting and relevant question for further research. This briefing question will be used to generate future reports on these linked subjects. Provide the JSON object directly without additional explanations. Provide the JSON object with the following format: { briefing1, briefing2, briefing3 } that describe the most interesting ideas for further research given the highlighted text and report context.`,
      },
      {
        role: "user",
        content: `{ report: ${reportExample}, links: ${JSON.stringify(
          linksExample
        )} }`,
      },
      { role: "assistant", content: JSON.stringify(briefingsExample) },
      {
        role: "user",
        content: `report: ${draft}, links: ${JSON.stringify(researchLinks)}`,
      },
    ];
    const briefingsResponse = await getFromOpenAi(messages);
    console.log("generateResearchLinks briefingsResponse");
    console.log(briefingsResponse);
    let briefings = briefingsResponse;
    if (typeof briefingsResponse === "string") {
      briefings = (() => {
        try {
          return JSON.parse(briefingsResponse);
        } catch {
          return briefingsResponse;
        }
      })();
    }
    // return researchLinks;

    console.log("save report briefingsResponse briefings");
    console.log(briefings);
    // return researchLinksR
    // let researchLinksArray = researchLinks;
    // // if JSON.parse(researchLinks)
    // if (typeof researchLinks === "array") {
    //   researchLinksArray = researchLinks;
    // } else if (typeof suggestionResponseContent === "string") {
    //   researchLinksArray = JSON.parse(researchLinks);
    // }
    return briefings;
  }
  console.log("generate research briefings");
  console.log(briefing1);
  console.log(briefing2);
  console.log(briefing3);
  return res.status(200).json({ briefing1, briefing2, briefing3 });
}
