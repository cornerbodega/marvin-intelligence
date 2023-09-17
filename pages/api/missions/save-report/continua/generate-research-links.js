// @author Marvin-Rhone

export default async function handler(req, res) {
  console.log("READ CHILD REPORT ENDPOINT");
  const { childReportId } = req.body;
  console.log(req.body);
  const researchLinks = await generateResearchLinks(
    currentReport.reportContent
  );
  async function generateResearchLinks(reportContent) {
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
    // this function will be called for each continuum iteration to generate the research questions and links
    const linksCount = 3;
    const messages = [
      {
        role: "system",
        content: `Please provide a JSON-only response containing JSON objects with the following format: { elementId, highlightedText }. Your task is to read the report in HTML format and determine ${linksCount} areas of further research. Provide the JSON objects directly without additional explanations. Provide the JSON objects with the following format: [{ elementId, highlightedText }] that highlight the ${linksCount} most important sections of the article for further research. highlightedText must be after the introduction and before the conclusion, and be between 1 and 3 words within the same raw text. For each link, the elementId is the id attribute of the element of the highlighted text. elementId and highlightedText must be unique in your response array. This response will be used to create hyperlinks.`,
      },
      {
        role: "user",
        content: `<div>
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
    </div>`,
      },
      { role: "assistant", content: JSON.stringify(linksExample) },
      {
        role: "user",
        content: `${reportContent}`,
      },
    ];
    const researchLinksResponse = await getFromOpenAi(messages);
    console.log("generateResearchLinks researchLinks");
    console.log(researchLinksResponse);
    let researchLinks = researchLinksResponse;
    if (typeof researchLinksResponse === "string") {
      researchLinks = (() => {
        try {
          return JSON.parse(researchLinksResponse);
        } catch {
          return researchLinksResponse;
        }
      })();
    }
    console.log("save report researchLinksResponse researchLinks");
    console.log(researchLinks);
    // return researchLinksR
    // let researchLinksArray = researchLinks;
    // // if JSON.parse(researchLinks)
    // if (typeof researchLinks === "array") {
    //   researchLinksArray = researchLinks;
    // } else if (typeof suggestionResponseContent === "string") {
    //   researchLinksArray = JSON.parse(researchLinks);
    // }
    return researchLinks;
  }
  return res.status(200).json({});
}
