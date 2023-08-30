import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardGroup,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
// import { parse } from "node-html-parser";
const { JSDOM } = require("jsdom");

import { slugify } from "../../../utils/slugify";
// import { remark } from "remark";
// import html from "remark-html";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

import Image from "next/image";

import { useRouter } from "next/router";
import { useContext, useRef, useEffect } from "react";
import { object } from "prop-types";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import IntelliFab from "../../../components/IntelliFab";
import { getSupabase } from "../../../utils/supabase";
import { useState } from "react";
import { set } from "lodash";
import { log } from "../../../utils/log";
// import missingsBriefingHandler from "../../api/missions/generate-briefing-suggestions-endpoint";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const reportId = context.params.reportSlug.split("-")[0];
    const supabase = getSupabase();

    let { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .eq("reportId", reportId);

    if (error) console.log(error);

    if (!reports || reports.length === 0) {
      return {
        redirect: {
          permanent: false,
          destination: "/missions/view-missions",
        },
        props: {},
      };
    }

    let report = reports[0];
    // Fetch the agent's profilePicUrl based on report.agentId
    let { data: agents, error: agentError } = await supabase
      .from("agents")
      .select("profilePicUrl, agentName")
      .eq("agentId", report.agentId);

    if (agentError) console.log(agentError);

    if (!agents || agents.length === 0) {
      // Handle the case where the agent is not found, if necessary
    }

    let agent = agents[0];
    let profilePicUrl = agent.profilePicUrl;

    // Now you have profilePicUrl and can add it to the report object or use it as needed.
    report.profilePicUrl = profilePicUrl;
    // console.log("agent");
    // console.log(agent);
    report.agentName = agent.agentName;

    let { data: links, error: linksError } = await supabase
      .from("links")
      .select("*")
      .eq("parentReportId", reportId);
    log("links");
    log(links);
    if (linksError) console.log(linksError);

    if (links && links.length > 0) {
      const dom = new JSDOM(report.reportContent);
      const document = dom.window.document;

      links.forEach((link) => {
        const element = document.getElementById(link.elementId);
        const highlightedText = JSON.parse(link.highlightedText);
        if (element) {
          const newLink = `<a href="/missions/report/${link.childReportId}-">${highlightedText}</a>`;
          console.log("highlightedText");
          console.log(element.innerHTML);
          const updatedHTML = element.innerHTML.replace(
            highlightedText,
            newLink
          );
          element.innerHTML = updatedHTML;
          // console.log("element");
          // console.log(element.innerHTML);
        }
      });

      report.reportContent = dom.serialize();
    }

    return {
      props: { report },
    };
  },
});
// export const getServerSideProps = withPageAuthRequired({
//   async getServerSideProps(context) {
//     // const dom = new JSDOM(htmlString);
//     const reportId = context.params.reportSlug.split("-")[0];
//     console.log("context.params");
//     console.log(context.params);
//     const supabase = getSupabase();
//     console.log("reportId");
//     console.log(reportId);
//     let { data: missions, error } = await supabase
//       .from("reports")
//       .select("*")
//       .eq("reportId", reportId);
//     if (error) {
//       console.log(error);
//     }
//     if (!missions || missions.length === 0) {
//       return {
//         redirect: {
//           permanent: false,
//           destination: "/missions/view-missions",
//         },
//         props: {},
//       };
//     }
//     let report = missions[0];

//     let { data: links, linksError } = await supabase
//       .from("links")
//       .select("*")
//       .eq("parentReportId", reportId);
//     if (error) {
//       console.log(error);
//     }
//     console.log("links");
//     log(links);

//     if (links && links.length > 0) {
//       // report.reportContent = parseLinks(report.reportContent, links);
//     }
//     // function parseLinks(htmlString, linksArray) {
//     //   const document = dom.window.document;

//     //   // linksArray.forEach((link) => {
//     //   //   try {
//     //   //     const xpath = link.xpath;
//     //   //     // const xpath = "./div[1]/ul[1]/li[3]/strong[1]"; // Updated XPath query
//     //   //     const xpathResult = dom.window.document.evaluate(
//     //   //       xpath,
//     //   //       dom.window.document,
//     //   //       null,
//     //   //       dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE,
//     //   //       null
//     //   //     );
//     //   //     const node = xpathResult.singleNodeValue;

//     //   //     if (node) {
//     //   //       const newElement = document.createElement("a");
//     //   //       newElement.setAttribute(
//     //   //         "href",
//     //   //         `/path/to/child/report/${link.childReportId}`
//     //   //       );
//     //   //       newElement.textContent = link.highlightedText;

//     //   //       node.innerHTML = ""; // Empty the existing content
//     //   //       node.appendChild(newElement); // Append the new <a> element
//     //   //     }
//     //   //   } catch (error) {
//     //   //     console.error(
//     //   //       `Failed to process link with ID ${link.linkId}:`,
//     //   //       error
//     //   //     );
//     //   //   }
//     //   // });
//     //   console.log("dom.serialize");
//     //   console.log(dom.serialize());
//     //   return dom.serialize(); // This will return the modified HTML as a string.
//     // }
//     // function parseLinks(htmlString, linksArray) {
//     //   const dom = new JSDOM(htmlString);
//     //   const document = dom.window.document;

//     //   linksArray.forEach((link) => {
//     //     try {
//     //       const xpath = link.xpath;
//     //       const xpathResult = dom.window.document.evaluate(
//     //         xpath,
//     //         dom.window.document,
//     //         null,
//     //         dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE,
//     //         null
//     //       );
//     //       const node = xpathResult.singleNodeValue; // Note the change here from iterateNext() to singleNodeValue

//     //       if (node) {
//     //         const newElement = document.createElement("a");
//     //         newElement.setAttribute(
//     //           "href",
//     //           `/path/to/child/report/${link.childReportId}`
//     //         );
//     //         newElement.textContent = link.highlightedText;

//     //         // Assuming the node's parent exists and is capable of replacing the child.
//     //         node.parentNode.replaceChild(newElement, node);
//     //       }
//     //     } catch (error) {
//     //       console.error(
//     //         `Failed to process link with ID ${link.linkId}:`,
//     //         error
//     //       );
//     //     }
//     //   });

//     //   return dom.serialize(); // This will return the modified HTML as a string.
//     // }
//     // function parseLinks(htmlString, linksArray) {
//     //   const dom = new JSDOM(htmlString);
//     //   const document = dom.window.document;

//     //   linksArray.forEach((link) => {
//     //     try {
//     //       const xpath = link.xpath;
//     //       const xpathResult = document.evaluate(
//     //         xpath,
//     //         dom.window.document,
//     //         null,
//     //         dom.window.XPathResult.ANY_TYPE,
//     //         null
//     //       );
//     //       const node = xpathResult.iterateNext();

//     //       if (node) {
//     //         const newElement = document.createElement("a");
//     //         newElement.setAttribute(
//     //           "href",
//     //           `/path/to/child/report/${link.childReportId}`
//     //         );
//     //         newElement.textContent = link.highlightedText;

//     //         // Assuming the node's parent exists and is capable of replacing the child.
//     //         node.parentNode.replaceChild(newElement, node);
//     //       }
//     //     } catch (error) {
//     //       console.error(
//     //         `Failed to process link with ID ${link.linkId}:`,
//     //         error
//     //       );
//     //     }
//     //   });
//     //   console.log("dom.serialize()");
//     //   console.log(dom.serialize());
//     //   return dom.serialize(); // This will be the new HTML string with all the links inserted
//     // }

//     // function parseLinks(report, links) {
//     //   log("links");
//     //   log(links);
//     //   if (!links || links.length === 0) {
//     //     return report;
//     //   }
//     //   const originalHtml = report.reportContent;
//     //   let newHtml = originalHtml;
//     //   // for (link of links) {
//     //   const doc = parse(originalHtml, "text/html");

//     //   // Find the root node first
//     //   const reportRoot = doc.getElementById("reportRoot");

//     //   const xpathExpression = JSON.parse(links[0].xpath);
//     //   // XPath expression
//     //   // const xpathExpression = "./div[1]/ul[1]/li[4]/text()[1]"; // Replace with the XPath you get

//     //   // Evaluate XPath starting from reportRoot
//     //   const xpathResult = doc.evaluate(
//     //     xpathExpression,
//     //     reportRoot,
//     //     null,
//     //     XPathResult.ANY_TYPE,
//     //     null
//     //   );

//     //   const foundNode = xpathResult.iterateNext();

//     //   if (foundNode) {
//     //     console.log(foundNode.nodeValue);
//     //     // return foundNode.nodeValue;
//     //   } else {
//     //     console.log("No node found");
//     //   }
//     //   // }

//     //   return report;
//     // }
//     return {
//       props: { report: report || {} },
//     };
//   },
// });

const CreateMission = ({ report, briefingSuggestion }) => {
  const router = useRouter();
  console.log("report");
  console.log(report);
  const [reportContent, setReportContent] = useState(report.reportContent);

  const { user, error, isLoading } = useUser();
  const [highlight, setHighlight] = useState({
    text: "",
    startIndex: undefined,
    endIndex: undefined,
    // position: { top: 0, left: 0 },
  });
  function handleFabClick() {
    router.push(
      `/missions/create-mission/agents/view-agents?parentReportId=${
        report.reportId
      }&parentReportTitle=${JSON.stringify(
        report.reportTitle
      )}&highlightedText=${JSON.stringify(highlight.text)}&startIndex=${
        highlight.startIndex
      }&endIndex=${highlight.endIndex}&elementId=${highlight.elementId}`
    );
  }
  const handleTextHighlight = (event) => {
    const selection = window.getSelection();

    // Exit early if no text is selected
    if (selection.toString().trim().length === 0) {
      setHighlight({ text: "", range: null });
      return;
    }

    const range = selection.getRangeAt(0);
    const startIndex = range.startOffset;
    const endIndex = range.endOffset;

    // Check if the start and end nodes are within the same parent
    if (range.startContainer.parentNode !== range.endContainer.parentNode) {
      selection.removeAllRanges(); // Remove the current selection
      setHighlight({ text: "", startIndex, endIndex });
      return;
    }

    let parentNode = range.startContainer.parentNode; // Starting point
    // Traverse the parent chain to find an element with an ID
    while (parentNode && !parentNode.id && parentNode !== document.body) {
      parentNode = parentNode.parentNode;
    }
    const elementId = parentNode ? parentNode.id : null; // Retrieve the ID or null

    console.log("elementId");
    console.log(elementId); // Log for debugging

    setHighlight({
      text: selection.toString(),
      startIndex,
      endIndex,
      elementId, // Save the ID
    });
  };
  // const handleTextHighlight = (event) => {
  //   const selection = window.getSelection();

  //   // Exit early if no text is selected
  //   if (selection.toString().trim().length === 0) {
  //     setHighlight({ text: "", range: null });
  //     return;
  //   }

  //   const range = selection.getRangeAt(0);
  //   const startIndex = range.startOffset;
  //   const endIndex = range.endOffset;

  //   // Check if the start and end nodes are within the same parent
  //   if (range.startContainer.parentNode !== range.endContainer.parentNode) {
  //     selection.removeAllRanges(); // Remove the current selection
  //     setHighlight({ text: "", startIndex, endIndex });
  //     return;
  //   }

  //   const element = range.startContainer.parentNode; // Using startContainer's parent element
  //   const elementId = element.id; // Extracting the ID

  //   console.log("elementId");
  //   console.log(elementId); // Log for debugging

  //   setHighlight({
  //     text: selection.toString(),
  //     startIndex,
  //     endIndex,
  //     elementId, // Save the ID
  //   });
  // };
  // const handleTextHighlight = (event) => {
  //   const selection = window.getSelection();

  //   // Exit early if no text is selected
  //   if (selection.toString().trim().length === 0) {
  //     setHighlight({ text: "", range: null });
  //     return;
  //   }

  //   const range = selection.getRangeAt(0);
  //   const startIndex = range.startOffset;
  //   const endIndex = range.endOffset;

  //   // Check if the start and end nodes are within the same parent
  //   if (range.startContainer.parentNode !== range.endContainer.parentNode) {
  //     selection.removeAllRanges();
  //     setHighlight({ text: "", startIndex, endIndex });
  //     return;
  //   }

  //   const element = range.startContainer.parentNode; // Using startContainer's parent for XPath

  //   // const xpath = JSON.stringify(generateXPath(element));

  //   // Existing generateXPath function here...
  //   // function generateXPath(element) {
  //   //   if (element.id === "reportRoot") {
  //   //     return ".";
  //   //   }

  //   //   let ix = 1; // XPath is 1-indexed
  //   //   let siblings = element.parentNode.childNodes;

  //   //   for (let i = 0; i < siblings.length; i++) {
  //   //     const sibling = siblings[i];

  //   //     if (sibling === element) {
  //   //       const tagName =
  //   //         element.nodeType === 1 ? element.tagName.toLowerCase() : "text()";
  //   //       return (
  //   //         generateXPath(element.parentNode) + "/" + tagName + "[" + ix + "]"
  //   //       );
  //   //     }

  //   //     if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
  //   //       ix++;
  //   //     }
  //   //   }
  //   // }
  //   console.log("elementId");
  //   console.log(elementId);
  //   setHighlight({
  //     text: selection.toString(),
  //     startIndex,
  //     endIndex,
  //     xpath,
  //   });
  // };
  // const handleTextHighlight = (event) => {
  //   const selection = window.getSelection();

  //   // Exit early if no text is selected
  //   if (selection.toString().trim().length === 0) {
  //     setHighlight({ text: "", range: null });
  //     return;
  //   }

  //   const range = selection.getRangeAt(0);

  //   const startIndex = range.startOffset;
  //   const endIndex = range.endOffset;
  //   // Check if the start and end nodes are within the same parent
  //   if (range.startContainer.parentNode !== range.endContainer.parentNode) {
  //     selection.removeAllRanges(); // Remove the current selection
  //     setHighlight({ text: "", startIndex, endIndex });
  //     return;
  //   }
  //   // const rect = range.getBoundingClientRect();
  //   // const containerNode = range.startContainer.parentNode;
  //   const xpath = JSON.stringify(generateXPath(range.commonAncestorContainer));
  //   function generateXPath(element) {
  //     if (element.id === "reportRoot") {
  //       return ".";
  //     }

  //     let ix = 1; // XPath is 1-indexed
  //     let siblings = element.parentNode.childNodes;

  //     for (let i = 0; i < siblings.length; i++) {
  //       const sibling = siblings[i];

  //       if (sibling === element) {
  //         const tagName =
  //           element.nodeType === 1 ? element.tagName.toLowerCase() : "text()";
  //         return (
  //           generateXPath(element.parentNode) + "/" + tagName + "[" + ix + "]"
  //         );
  //       }

  //       if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
  //         ix++;
  //       }
  //     }
  //   }
  //   console.log("xpath");
  //   console.log(xpath);
  //   // console.log("containerNode");
  //   // console.log(JSON.stringify(containerNode));
  //   setHighlight({
  //     text: selection.toString(),
  //     startIndex,
  //     endIndex,
  //     xpath,
  //     // position: { top: rect.top, left: rect.left },
  //   });
  // };
  return (
    <div>
      <Breadcrumb style={{ fontFamily: "monospace" }}>
        <BreadcrumbItem className="text-white">
          <i className="bi bi-body-text"></i>
          &nbsp;
          <Link
            className="text-white"
            href="/missions/view-missions"
            style={{ textDecoration: "none" }}
          >
            Missions
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <div
            className="text-white"
            // className="text-white"
            // href={`/missions/report/${report.reportId}`}
            href={`/missions/report/${report.reportId}-${slugify(
              report.reportTitle
            )}`}
            style={{ textDecoration: "none" }}
          >
            {report.reportTitle}
          </div>
        </BreadcrumbItem>
        {/* <BreadcrumbItem className="text-white" active>
          <i className="bi bi-body-text"></i> Create Report
        </BreadcrumbItem> */}
      </Breadcrumb>

      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <div>
            <Card className="cardShadow">
              <img
                style={{
                  borderTopLeftRadius: "7px",
                  borderTopRightRadius: "7px",
                }}
                src={report.reportPicUrl}
              ></img>
              <CardBody>
                {reportContent && (
                  <Card>
                    {/* <div className="text-white">Draft</div> */}
                    <CardBody>
                      <div
                        id="reportRoot"
                        onMouseUp={handleTextHighlight}
                        className="text-primary reportFont"
                        dangerouslySetInnerHTML={{ __html: reportContent }}
                      />
                      <div
                        style={{
                          marginTop: "64px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {report.profilePicUrl && (
                          <Link
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                            href={`http://localhost:3000/missions/create-mission/dispatch?agentId=${report.agentId}`}
                          >
                            <img
                              src={report.profilePicUrl}
                              style={{
                                borderRadius: "50%",
                                height: "250px",
                                marginBottom: "-10px",
                              }}
                            />
                            <div
                              style={{
                                marginTop: "16px",
                                // fontWeight: "300",
                                // fontSize: "20px",
                                // marginBottom: "-20px",
                              }}
                            >
                              Agent {report.agentName}
                            </div>
                          </Link>
                        )}
                      </div>
                      {highlight.text && (
                        <IntelliFab
                          onClick={handleFabClick}
                          icon="+"
                          fabType="report"
                        />
                      )}

                      {/* {JSON.stringify(highlight)} */}
                    </CardBody>
                  </Card>
                )}
              </CardBody>
            </Card>
          </div>
          {/* <div>
              <h3>Create Mission</h3>
            </div> */}
        </Col>
      </Row>
    </div>
  );
};

export default CreateMission;
