// @author Marvin-Rhone
// dispatch.js is the page where the user can create a mission for an
// agent to complete.

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

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

import { useRouter } from "next/router";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
// import IntelliFab from "../components/IntelliFab";

import { getSupabase } from "../../../utils/supabase";
import { useState, useRef, useEffect } from "react";

import { slugify } from "../../../utils/slugify";

// bring in original report's summary
// bring in agent's memory of previous reports
// bring in content of link from original report
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    // const agentId = context.params.agentId;
    const { agentId, parentReportId, highlightStartIndex, highlightEndIndex } =
      context.query;
    console.log("parentReportId");
    console.log(parentReportId);
    const supabase = getSupabase();
    console.log("agentId");
    console.log(agentId);
    let { data: agents, error } = await supabase
      .from("agents")
      .select(
        "agentId, expertise1, expertise2, expertise3, agentName, profilePicUrl, bio, specializedTraining"
      )
      .eq("agentId", agentId);
    if (error) {
      console.log(error);
    }
    const agent = agents[0];

    return {
      props: { agent: agent || {} },
    };
  },
});

const CreateMission = ({ agent }) => {
  // console.log("agent");
  // console.log(agent);
  const { user, error, isLoading } = useUser();
  const [briefingSuggestion, setBriefingSuggestion] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentReportSummary, setParentReportSummary] = useState();
  const [agentMissionHistory, setAgentMissionHistory] = useState();
  const [briefing, setBriefing] = useState();
  const [showSuggestedBriefing, setShowSuggestedBriefing] = useState();
  const [draft, setDraft] = useState();
  const [feedbackInput, setFeedbackInput] = useState("");
  const router = useRouter();

  const draftRef = useRef();
  const [parentReportTitle, setParentReportTitle] = useState("");
  const [parentReportId, setParentReportId] = useState("");
  const [parentReportSlug, setParentReportSlug] = useState("");

  useEffect(() => {
    if (router.query.parentReportTitle) {
      setParentReportTitle(JSON.parse(router.query.parentReportTitle));
    }
    if (router.query.parentReportId) {
      setParentReportId(router.query.parentReportId);
    }
    if (router.query.parentReportTitle) {
      setParentReportSlug(slugify(router.query.parentReportTitle));
    }
  });
  async function handleWriteDraftReport(e) {
    console.log("create mission handleSubmit");
    console.log("draft");
    console.log(draft);
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackInput("");
    const expertises = [agent.expertise1, agent.expertise2, agent.expertise3];

    const draftData = { briefing, expertises };
    const specializedTraining = agent.specializedTraining;
    if (feedbackInput) {
      let feedback = [
        { role: "assistant", content: draft },
        {
          role: "user",
          content: `Please write the report again with the following feedback ${feedbackInput}.`,
        },
      ];
      draftData.feedback = feedback;
    }
    if (specializedTraining) {
      draftData.specializedTraining = specializedTraining;
    }

    const res = await fetch("/api/missions/write-draft-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draftData),
    });

    const draftResponseContent = await res.json();
    console.log("draftResponseContent");
    console.log(draftResponseContent.data);

    setDraft(draftResponseContent.data);

    setIsSubmitting(false);
    // write a report!
    // this will be a draft report
    // it will be saved in the database as the only draft for this mission, and will be overwritten each time the user saves a new draft
    // Once the user approves the mission, the draft will be saved as the final report
  }
  useEffect(() => {
    if (!isSubmitting && draft && draftRef.current) {
      draftRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isSubmitting, draft]);

  async function handleAcceptReport(e) {
    e.preventDefault();
    console.log("handleAcceptReport");

    const res = await fetch("/api/missions/save-report-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draft,
        briefing,
        userId: user.sub,
        agentId: agent.agentId,
        parentReportId: router.query.parentReportId,
        highlightedText: router.query.highlightedText,
        startIndex: router.query.startIndex,
        endIndex: router.query.endIndex,
        elementId: router.query.elementId,
      }),
    });

    setIsSubmitting(false);
  }
  useEffect(() => {
    async function fetchBriefingSuggestion() {
      // Logic to build expertiseString from agent prop
      const expertises = [agent.expertise1, agent.expertise2, agent.expertise3];
      let expertiseString = expertises[0];

      if (expertises.length > 1) {
        expertiseString += " and " + expertises[1];
      }
      if (expertises.length > 2) {
        expertiseString += " and " + expertises[2];
      }
      console.log("expertiseString");
      console.log(expertiseString);

      const getSuggestionParams = { expertiseString, agentId: agent.agentId };
      if (router.query.parentReportId) {
        const parentReportId = router.query.parentReportId;
        getSuggestionParams.parentReportId = parentReportId;
        getSuggestionParams.highlightedText = router.query.highlightedText;
      }
      // try {
      const briefingResponse = await fetch("/api/missions/get-suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getSuggestionParams),
      });

      if (briefingResponse.ok) {
        const data = await briefingResponse.json();
        console.log("briefing response data");
        console.log(data);
        if (data.briefingSuggestion) {
          setBriefingSuggestion(data.briefingSuggestion);
        }

        if (data.parentReportSummary) {
          setParentReportSummary(data.parentReportSummary);
        }
        if (data.agentMissionHistory) {
          setAgentMissionHistory(data.agentMissionHistory);
        }
      } else {
        console.error("Failed to fetch briefing suggestion");
      }
    }

    fetchBriefingSuggestion();
  }, [agent]);
  const currentQueryParams = router.query;
  return (
    <div>
      <Breadcrumb style={{ fontFamily: "monospace" }} className="text-white">
        <BreadcrumbItem>
          <i className="bi  bi-body-text"></i>
          &nbsp;&nbsp;
          <Link
            style={{ textDecoration: "none" }}
            className="text-white"
            href="/missions/view-missions"
          >
            Missions
          </Link>
        </BreadcrumbItem>
        {parentReportTitle && (
          <BreadcrumbItem className="text-white">
            <Link
              className="text-white"
              style={{ textDecoration: "none" }}
              href={`/missions/report/${parentReportId}-${parentReportSlug}`}
            >
              {parentReportTitle}
            </Link>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem>
          <i className="bi bi-body-text"></i>+ &nbsp;
          <Link
            className="text-white"
            style={{ textDecoration: "none" }}
            href={{
              pathname: "/missions/create-mission/agents/view-agents/",
              query: currentQueryParams,
            }}
          >
            Create Mission
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem className="">
          {" "}
          <i className={`bi-file-earmark-person-fill`}></i>&nbsp; Agent{" "}
          {agent.agentName}
        </BreadcrumbItem>
        <BreadcrumbItem className="">Dispatch</BreadcrumbItem>
      </Breadcrumb>

      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <Form onSubmit={handleWriteDraftReport}>
            <div>
              <Card className="text-primary">
                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      height: "237px",
                      objectFit: "cover",
                    }}
                  >
                    <img
                      src={`${agent.profilePicUrl}`}
                      style={{ borderRadius: "50%" }}
                      alt="agent"
                    />
                  </div>
                  <CardTitle
                    style={{
                      display: "flex",
                      marginTop: "10px",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                    }}
                    className="text-primary"
                  >
                    Agent {agent.agentName}
                  </CardTitle>
                  <CardSubtitle
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                    className="mb-2 text-muted"
                    tag="h6"
                  >
                    <Badge
                      // style={{ marginTop: "10px" }}
                      color="info"
                      className="ms-3 expertiseBadge"
                    >
                      {agent.expertise1}
                    </Badge>
                    <Badge
                      color="info"
                      // style={{ marginTop: "10px" }}
                      className="ms-3 expertiseBadge"
                    >
                      {agent.expertise2}
                    </Badge>
                    <Badge
                      color="info"
                      className="ms-3 expertiseBadge"
                      // style={{ marginTop: "10px" }}
                    >
                      {agent.expertise3}
                    </Badge>
                  </CardSubtitle>
                  <div>
                    <div>
                      <h4>Bio</h4>
                    </div>
                    <div>{agent.bio}</div>
                    {agentMissionHistory && (
                      <>
                        <div>
                          <h4>Mission History</h4>
                        </div>
                        <ul>
                          {agentMissionHistory.map((mission, index) => {
                            return (
                              <li key={index}>
                                <Link
                                  // style={{ }}
                                  className="reportFont"
                                  style={{
                                    textDecoration: "none",
                                    fontStyle: "italic",
                                    fontWeight: 300,
                                    color: "#0645ad",
                                  }}
                                  // className="text-white"
                                  href={`/missions/report/${
                                    mission.reportId
                                  }-${slugify(mission.reportTitle)}`}
                                >
                                  {mission.reportTitle}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}

                    {parentReportSummary && (
                      <div>
                        <h4>Linked Mission Context</h4>
                      </div>
                    )}
                    <div>{parentReportSummary}</div>
                    <div>
                      <h4>Briefing Suggestion</h4>
                    </div>
                    <div>{briefingSuggestion}</div>
                  </div>
                </CardBody>
              </Card>
            </div>

            <FormGroup>
              <div>
                <div style={{ marginTop: "20px" }}></div>
                <FormGroup>
                  <Label for="exampleText" className="text-white">
                    Mission Prompt
                  </Label>
                  <Input
                    id="exampleText"
                    placeholder="What would you like to know?"
                    name="text"
                    rows="5"
                    type="textarea"
                    value={briefing}
                    onChange={(e) => setBriefing(e.target.value)}
                  />
                  <div style={{ textAlign: "right", paddingTop: "8px" }}>
                    <Button
                      color="primary"
                      style={{ border: "1px solid green" }}
                      disabled={isSubmitting}
                    >
                      Create Draft
                    </Button>
                  </div>
                </FormGroup>
              </div>
            </FormGroup>
          </Form>
          <div style={{ marginTop: "50px" }} ref={draftRef}></div>
          {draft && (
            <Card>
              {/* <div className="text-white">Draft</div> */}
              <CardBody>
                <div
                  className="text-primary"
                  dangerouslySetInnerHTML={{ __html: draft }}
                />
              </CardBody>
            </Card>
          )}
          {draft && (
            <>
              <Form onSubmit={(e) => handleWriteDraftReport(e)}>
                <FormGroup>
                  <div style={{ marginTop: "40px" }}></div>
                  <Label for="exampleText" className="text-white">
                    Feedback
                  </Label>
                  <Input
                    id="exampleText"
                    placeholder="What do you think?"
                    name="text"
                    rows="5"
                    type="textarea"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                  />
                  <div style={{ textAlign: "left", paddingTop: "8px" }}>
                    <Button
                      color="primary"
                      style={{ border: "1px solid yellow" }}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                      Retry
                    </Button>
                  </div>
                </FormGroup>
              </Form>

              <Form>
                <div style={{ textAlign: "right" }}>
                  <Button
                    color="primary"
                    style={{ border: "3px solid green" }}
                    disabled={isSubmitting}
                    onClick={(e) => handleAcceptReport(e)}
                  >
                    <i className="bi bi-body-text"></i> Save Report
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CreateMission;
