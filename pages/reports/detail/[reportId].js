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
    let { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .eq("reportId", reportId);
    if (error) {
      console.log(error);
    }
    if (!reports || reports.length === 0) {
      return {
        redirect: {
          permanent: false,
          destination: "/reports/view-reports",
        },
        props: {},
      };
    }
    const report = reports[0];

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

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <i className="bi bi-body-text"></i>
          &nbsp;
          <Link href="/reports/view-reports">Reports</Link>
        </BreadcrumbItem>
        <BreadcrumbItem className="">
          <Link href={`/reports/detail/${report.reportId}`}>
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
                        className="text-primary"
                        dangerouslySetInnerHTML={{ __html: reportContent }}
                      />
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
