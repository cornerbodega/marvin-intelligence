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
// import IntelliFab from "../components/IntelliFab";
import IntelliFab from "../../../components/IntelliFab";
import { getSupabase } from "../../../utils/supabase";
import { useState } from "react";
import { set } from "lodash";

// import missingsBriefingHandler from "../api/missions/generate-briefing-suggestions-endpoint";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// todo: bring in original report's summary
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
    // const expertises = [agent.expertise1, agent.expertise2, agent.expertise3];
    // // const { req, res } = context;
    // // const data = handler(req, res);
    // let expertiseString = expertises[0];

    // if (expertises.length > 1) {
    //   expertiseString += " and " + expertises[1];
    // }
    // if (expertises.length > 2) {
    //   expertiseString += " and " + expertises[2];
    // }
    // console.log(expertiseString);
    // const chat_completion = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are an expert at generating an interesting research question for given areas of study. You always return exactly one answer in less than 300 characters.",
    //     },
    //     {
    //       role: "user",
    //       content: `Generate AI, Machine Learning, and Natural Language Processing. Return only the results in the following JSON format: {suggestion}`,
    //     },
    //     {
    //       role: "assistant",
    //       content: `{
    //               "suggestion": "I need a comprehensive report on the applications of Natural Language Processing in the modern digital landscape."
    //           }`,
    //     },
    //     {
    //       role: "user",
    //       content: `What is an interesting research question for ${expertiseString}?`,
    //     },
    //   ],
    // });
    // let briefingSuggestion = "";
    // const suggestionResponseContent =
    //   chat_completion.data.choices[0].message.content;
    // if (suggestionResponseContent) {
    //   console.log("suggestionResponseContent");
    //   console.log(suggestionResponseContent);
    //   console.log("typeof suggestionResponseContent");
    //   console.log(typeof suggestionResponseContent);
    //   if (typeof suggestionResponseContent === "object") {
    //     briefingSuggestion = suggestionResponseContent.suggestion;
    //   } else if (
    //     typeof suggestionResponseContent === "string" &&
    //     suggestionResponseContent.includes(`"suggestion":`)
    //   ) {
    //     const parsedSuggestionContent = JSON.parse(suggestionResponseContent);
    //     if (parsedSuggestionContent) {
    //       briefingSuggestion = parsedSuggestionContent.suggestion;
    //     }
    //   } else if (typeof suggestionResponseContent === "string") {
    //     briefingSuggestion = suggestionResponseContent;
    //   }

    //   // briefingSuggestion = suggestionResponseContent.split("suggestion:")[1];
    // } // Process a POST request
    // // const suggestionResponse = missingsBriefingHandler(req, res);
    // console.log("suggestionResponseContent");
    // console.log(suggestionResponseContent);

    // Get the briefing suggestion from GPT API (via next /api)
    // const briefingPlaceholder = fetch("POST", "/api/missions/briefing-suggestion/", expertises, missionHistory)
    // const suggestionResponse = await fetch(
    //   "/api/agents/create-agent-endpoint",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ expertises }),
    //   }
    // );

    // console.log("suggestionResponse");
    // console.log(suggestionResponse);
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
  const [briefing, setBriefing] = useState();
  const [showSuggestedBriefing, setShowSuggestedBriefing] = useState();
  const [draft, setDraft] = useState();
  const [feedbackInput, setFeedbackInput] = useState("");
  const router = useRouter();

  const draftRef = useRef();
  async function handleWriteDraftReport(e) {
    console.log("create mission handleSubmit");
    console.log("draft");
    console.log(draft);
    // console.log(handleSubmit);
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
    // console.log("21343254res");
    // console.log(res.json());
    const draftResponseContent = await res.json();
    console.log("draftResponseContent");
    console.log(draftResponseContent.data);
    // const processedContent = await remark()
    // .use(html)
    // .process(draftResponseContent.data);
    // const contentHtml = processedContent.toString();
    setDraft(draftResponseContent.data);
    // if (draftRef.current) {
    //   draftRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    // }
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
  //   const agentName = agent.agentName;
  // const { setSelectedAgentByName, selectedAgent } = useContext(IntelliContext);
  // let agent = selectedAgent;
  // console.log("agent");
  // console.log(agent);
  // if (Object.keys(agent).length === 0) {
  //   setSelectedAgentByName(agentName);
  //   console.log("GET AGENT DETAIL FROM DB!");
  // }
  // function handleFabClick(e) {
  //   router.push("/missions/create-mission");
  // }
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
      }),
    });
    // console.log("21343254res");
    // console.log(res.json());
    // const draftResponseContent = await res.json();
    setIsSubmitting(false);
    // console.log("draftResponseContent");
    // console.log(draftResponseContent);
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

      const getSuggestionParams = { expertiseString };
      if (router.query.parentReportId) {
        const parentReportId = router.query.parentReportId;
        getSuggestionParams.parentReportId = parentReportId;
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
        setBriefingSuggestion(data.briefingSuggestion);
        setParentReportSummary(data.parentReportSummary);
      } else {
        console.error("Failed to fetch briefing suggestion");
      }
      //  catch (error) {
      //   console.error("An error occurred:", expertiseString);
      // }
    }

    fetchBriefingSuggestion();
  }, [agent]);
  const currentQueryParams = router.query;
  return (
    <div>
      <Breadcrumb className="text-white">
        <BreadcrumbItem>
          <i className="bi  bi-body-text"></i>
          &nbsp;
          <Link className="text-white" href="/missions/view-missions">
            Missions
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          {/* `/missions/create-mission/agents/view-agents?parentReportId=${
        report.reportId
      }&highlight=${JSON.stringify(highlight)}` */}
          <i className="bi bi-body-text"></i>+ &nbsp;
          <Link
            className="text-white"
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
          <i className={`bi-file-earmark-person-fill`}></i> Agent{" "}
          {agent.agentName}
        </BreadcrumbItem>
        <BreadcrumbItem className="">Dispatch</BreadcrumbItem>
      </Breadcrumb>

      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <Form onSubmit={handleWriteDraftReport}>
            <div>
              <Card className="bg-black text-white">
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
                      style={{}}
                      // src={`/default-agents/${agentName}.png`}
                      src={`${agent.profilePicUrl}`}
                      alt="agent"
                    />
                  </div>
                  <CardTitle
                    style={{
                      display: "flex",
                      marginTop: "10px",
                      justifyContent: "center",
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
                      style={{ marginTop: "10px" }}
                      color="info"
                      className="ms-3"
                    >
                      {agent.expertise1}
                    </Badge>
                    <Badge
                      color="info"
                      style={{ marginTop: "10px" }}
                      className="ms-3"
                    >
                      {agent.expertise2}
                    </Badge>
                    <Badge
                      color="info"
                      className="ms-3"
                      style={{ marginTop: "10px" }}
                    >
                      {agent.expertise3}
                    </Badge>
                  </CardSubtitle>
                  <div className="text-white">
                    <div>
                      <h4 className="text-white">Bio</h4>
                    </div>
                    <div>{agent.bio}</div>
                    <div>
                      <h4 className="text-white">Mission History</h4>
                    </div>

                    {parentReportSummary && (
                      <div>
                        <h4 className="text-white">Linked Mission Context</h4>
                      </div>
                    )}
                    <div>{parentReportSummary}</div>
                    <div>
                      <h4 className="text-white">Briefing Suggestion</h4>
                    </div>
                    <div>{briefingSuggestion}</div>
                  </div>
                </CardBody>
              </Card>
            </div>
            {/* <div>
                <h3>Create Mission</h3>
              </div> */}
            <FormGroup>
              {/* <div style={{ marginBotton: "10px", textAlign: "left" }}>
                {!showSuggestedBriefing ? (
                  <a
                    onClick={(e) =>
                      setShowSuggestedBriefing(!showSuggestedBriefing)
                    }
                    style={{ textDecoration: "underline" }}
                  >
                    Suggested Briefing
                  </a>
                ) : (
                  <>
                    {" "}
                    <a
                      style={{
                        paddingBottom: "8px",
                        textDecoration: "underline",
                      }}
                      onClick={(e) =>
                        setShowSuggestedBriefing(!showSuggestedBriefing)
                      }
                    >
                      Hide Suggested Briefing
                    </a>
                    <div
                      style={{
                        marginBotton: "10px",
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                      className="text-white"
                    >
                      {briefingSuggestion}
                    </div>
                  </>
                )}
              </div> */}

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
