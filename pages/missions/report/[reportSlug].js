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
// const { JSDOM } = require("jsdom");

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
import getCloudinaryImageUrlForHeight from "../../../utils/getCloudinaryImageUrlForHeight";
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
    if (agents && agents.length > 0) {
      let agent = agents[0];
      let profilePicUrl = agent.profilePicUrl;

      // Now you have profilePicUrl and can add it to the report object or use it as needed.
      report.profilePicUrl = profilePicUrl;
      // console.log("agent");
      // console.log(agent);
      report.agentName = agent.agentName;
    }

    return {
      props: { report },
    };
  },
});

const ReportDetailPage = ({ report }) => {
  const router = useRouter();
  // console.log("report");
  // console.log(report);
  const [reportContent, setReportContent] = useState(report.reportContent);
  // useEffect(() => { }, [reportContent]);
  const { user, error, isLoading } = useUser();
  const [highlight, setHighlight] = useState({
    text: "",
    startIndex: undefined,
    endIndex: undefined,
  });
  const supabase = getSupabase();
  useEffect(() => {
    async function getLinks() {
      let { data: links, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("parentReportId", report.reportId);

      if (linksError) {
        console.log("linksError", linksError);
        return;
      }

      if (links && links.length > 0) {
        const container = document.createElement("div");
        container.innerHTML = report.reportContent;
        console.log("report.reportContent");
        console.log(report.reportContent);
        links.forEach((link) => {
          const element = container.querySelector(`[id="${link.elementId}"]`);

          const highlightedText = JSON.parse(link.highlightedText);

          if (element) {
            const newLink = `<a href="/missions/report/${link.childReportId}-">${highlightedText}</a>`;
            const updatedHTML = element.innerHTML.replace(
              highlightedText,
              newLink
            );
            element.innerHTML = updatedHTML;
          }
        });

        setReportContent(container.innerHTML);
      }
    }

    getLinks();
  }, [report]);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const reportRef = useRef();
  useEffect(() => {
    if (isFirstLoad) {
      // reportRef.current.scrollIntoView({
      //   behavior: "smooth",
      //   block: "start",
      // });
      const reportPosition =
        reportRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: reportPosition - 5, // 10px offset from the top
        behavior: "smooth",
      });
    }
  }, [isFirstLoad]);
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
  const [ancestry, setAncestry] = useState([]);

  useEffect(() => {
    async function fetchAncestry() {
      const ancestryResponse = await fetch(
        "/api/missions/get-report-ancestry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reportId: report.reportId }),
        }
      );

      if (ancestryResponse.ok) {
        const data = await ancestryResponse.json();
        console.log("Ancestry response data:", data);

        // Update the state variable with the received ancestry data
        if (data.ancestry) {
          setAncestry(data.ancestry);
        }
      } else {
        console.error("Failed to fetch ancestry");
      }
    }

    fetchAncestry();
  }, [report]);

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
        {ancestry &&
          ancestry.map((ancestor, index) => (
            <BreadcrumbItem className="text-white" key={index}>
              <Link
                href={`/missions/report/${ancestor.reportId}-${slugify(
                  ancestor.reportTitle
                )}`}
                style={{
                  textDecoration: "none",
                  fontSize: "0.75em",
                  fontWeight: "200",
                }}
                className="text-white"
              >
                {ancestor.reportTitle}
              </Link>
            </BreadcrumbItem>
          ))}
        <BreadcrumbItem>
          <div
            className="text-white"
            href={`/missions/report/${report.reportId}-${slugify(
              report.reportTitle
            )}`}
            style={{ textDecoration: "none", fontWeight: "800" }}
          >
            {report.reportTitle}
          </div>
        </BreadcrumbItem>
      </Breadcrumb>

      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <div>
            <Card className="cardShadow">
              <img
                ref={reportRef}
                style={{
                  borderTopLeftRadius: "7px",
                  borderTopRightRadius: "7px",
                }}
                src={report.reportPicUrl}
              ></img>
              <CardBody>
                {reportContent && (
                  <Card>
                    <CardBody style={{ marginTop: "-33px" }}>
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
                              src={
                                (getCloudinaryImageUrlForHeight(
                                  report.profilePicUrl
                                ),
                                250)
                              }
                              style={{
                                borderRadius: "50%",
                                height: "250px",
                                marginBottom: "-10px",
                              }}
                            />
                            <div
                              style={{
                                marginTop: "16px",
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
                    </CardBody>
                  </Card>
                )}
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ReportDetailPage;
