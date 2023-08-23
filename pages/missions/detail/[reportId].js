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
// import missingsBriefingHandler from "../../api/missions/generate-briefing-suggestions-endpoint";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const reportId = context.params.reportId;
    const supabase = getSupabase();
    console.log("reportId");
    console.log(reportId);
    let { data: missions, error } = await supabase
      .from("reports")
      .select("*")
      .eq("reportId", reportId);
    if (error) {
      console.log(error);
    }
    if (!missions || missions.length === 0) {
      return {
        redirect: {
          permanent: false,
          destination: "/missions/view-missions",
        },
        props: {},
      };
    }
    const report = missions[0];

    return {
      props: { report: report || {} },
    };
  },
});

const CreateMission = ({ report, briefingSuggestion }) => {
  console.log("report");
  console.log(report);
  const [reportContent, setReportContent] = useState(report.reportContent);

  const { user, error, isLoading } = useUser();
  const [highlight, setHighlight] = useState({
    text: "",
    range: null,
    // position: { top: 0, left: 0 },
  });
  function handleFabClick() {}

  const handleTextHighlight = (event) => {
    const selection = window.getSelection();

    // Exit early if no text is selected
    if (selection.toString().trim().length === 0) {
      setHighlight({ text: "", range: null });
      return;
    }

    const range = selection.getRangeAt(0);

    // Check if the start and end nodes are within the same parent
    if (range.startContainer.parentNode !== range.endContainer.parentNode) {
      selection.removeAllRanges(); // Remove the current selection
      setHighlight({ text: "", range: null });
      return;
    }
    // const rect = range.getBoundingClientRect();

    setHighlight({
      text: selection.toString(),
      range,
      // position: { top: rect.top, left: rect.left },
    });
  };
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <i className="bi bi-body-text"></i>
          &nbsp;
          <Link
            href="/missions/view-missions"
            style={{ textDecoration: "none" }}
          >
            Missions
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link
            // className="text-white"
            href={`/missions/detail/${report.reportId}`}
            style={{ textDecoration: "none" }}
          >
            {report.reportTitle}
          </Link>
        </BreadcrumbItem>
        {/* <BreadcrumbItem className="text-white" active>
          <i className="bi bi-body-text"></i> Create Report
        </BreadcrumbItem> */}
      </Breadcrumb>

      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <div>
            <Card>
              <CardBody>
                {reportContent && (
                  <Card>
                    {/* <div className="text-white">Draft</div> */}
                    <CardBody>
                      <img src={report.reportPicUrl}></img>
                      <div
                        onMouseUp={handleTextHighlight}
                        className="text-primary"
                        dangerouslySetInnerHTML={{ __html: reportContent }}
                      />
                      {highlight.text && (
                        <IntelliFab onClick={handleFabClick} icon="+" />
                      )}
                      {JSON.stringify(highlight)}
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
