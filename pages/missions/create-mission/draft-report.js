// @author Marvin-Rhone
// dispatch.js is the page where the user can create a mission for an
// agent to complete.
import { saveToFirebase } from "../../../utils/saveToFirebase";
// import { log } from "../../../utils/log";
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
import toast, { Toaster } from "react-hot-toast";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

import { useRouter } from "next/router";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
// import IntelliFab from "../components/IntelliFab";

import { getSupabase } from "../../../utils/supabase";
import { useState, useRef, useEffect } from "react";

import { slugify } from "../../../utils/slugify";
import { setupFirebaseListener } from "../../../utils/firebaseListener";

// bring in original report's summary
// bring in agent's memory of previous reports
// bring in content of link from original report
import { useFirebaseListener } from "../../../utils/useFirebaseListener";
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

  const [notificationIntervalId, setNotificationIntervalId] = useState();
  const [notificationMessages, setNotificationMessages] = useState([]);

  const [writeDraftTaskId, setWriteDraftTaskId] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [draftResponseContent, setDraftResponseContent] = useState();

  const firebaseData = useFirebaseListener(
    user ? `/asyncTasks/${user.sub}/writeDraftReport/context/data` : null
  );

  // // const [draftResponseContent, setDraftResponseContent] = useState(null);

  useEffect(() => {
    if (firebaseData) {
      console.log("firebaseData");
      console.log(firebaseData);
      setDraft(firebaseData);
    }
  }, [firebaseData]);

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
    console.log("router.query.briefing");
    console.log(router.query.briefing);
    console.log("briefing");
    console.log(briefing);
    if (e) {
      e.preventDefault();
    }
    setIsSubmitting(true);
    setFeedbackInput("");

    // const notificationMessagesResponse = await fetch(
    //   "/api/missions/write-draft-notification-endpoint",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ briefing, agentName: agent.agentName }),
    //   }
    // );
    // console.log("await notificationMessagesResponse.json()");
    // const notificationJson = await notificationMessagesResponse.json();

    // setNotificationMessages(notificationJson);
    const expertises = [agent.expertise1, agent.expertise2, agent.expertise3];
    console.log(" dispatch briefing");
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
    console.log("draftData");
    console.log(draftData);

    try {
      const newTask = {
        type: "writeDraftReport",
        status: "queued",
        userId: user.sub,
        context: {
          ...draftData,
          userId: user.sub,
          generation: 0,
          totalGenerations: 1,
        },
        createdAt: new Date().toISOString(),
      };

      const newTaskRef = await saveToFirebase(
        `asyncTasks/${user.sub}/writeDraftReport`,
        newTask
      );

      if (newTaskRef) {
        setWriteDraftTaskId(newTaskRef.key); // Store the task ID to set up the listener
        console.log("writeDraftTaskId");
        console.log(writeDraftTaskId);
      } else {
        console.error("Failed to queue the task.");
      }
    } catch (error) {
      console.error("Error queuing the task:", error.message);
    } finally {
      setIsSubmitting(false);
      clearInterval(notificationIntervalId); // Clear the interval properly
      setNotificationMessages([]);
    }
  }

  // async function handleWriteDraftReport(e) {
  //   console.log("create mission handleSubmit");
  //   console.log("draft");
  //   console.log(draft);
  //   console.log("router.query.briefing");
  //   console.log(router.query.briefing);
  //   console.log("briefing");
  //   console.log(briefing);
  //   if (e) {
  //     e.preventDefault();
  //   }
  //   setIsSubmitting(true);
  //   setFeedbackInput("");

  //   // setNotificationMessages(notificationJson);
  //   const expertises = [agent.expertise1, agent.expertise2, agent.expertise3];
  //   console.log(" dispatch briefing");
  //   const draftData = { briefing, expertises };
  //   const specializedTraining = agent.specializedTraining;
  //   if (feedbackInput) {
  //     let feedback = [
  //       { role: "assistant", content: draft },
  //       {
  //         role: "user",
  //         content: `Please write the report again with the following feedback ${feedbackInput}.`,
  //       },
  //     ];
  //     draftData.feedback = feedback;
  //   }
  //   if (specializedTraining) {
  //     draftData.specializedTraining = specializedTraining;
  //   }
  //   console.log("draftData");
  //   console.log(draftData);
  //   // call firebase here, not the endpoint

  //   const res = await fetch("/api/missions/draft-report-endpoint", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(draftData),
  //   });

  //   const draftResponseContent = await res.json();
  //   console.log("draftResponseContent");
  //   console.log(draftResponseContent.data);

  //   setDraft(draftResponseContent.data);

  //   setIsSubmitting(false);
  //   clearInterval(notificationIntervalId); // Clear the interval properly
  //   setNotificationMessages([]);
  //   // write a report!
  //   // this will be a draft report
  //   // it will be saved in the database as the only draft for this mission, and will be overwritten each time the user saves a new draft
  //   // Once the user approves the mission, the draft will be saved as the final report
  // }
  useEffect(() => {
    if (!isSubmitting && draft && draftRef.current && !isSaving) {
      draftRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isSubmitting, draft]);
  async function handleAcceptReport(e) {
    e.preventDefault();
    console.log("handleAcceptReport");
    setIsSaving(true);
    setIsSubmitting(true);
    // fetch("/api/missions/save-report-notification-endpoint", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ briefing, agentName: agent.agentName }),
    // }).then(async (notificationMessagesResponse) => {
    //   // console.log(notificationMessagesResponse.js);

    //   const notificationJson = await notificationMessagesResponse.json();
    //   console.log("notificationJson");
    //   console.log(notificationJson);
    //   setNotificationMessages(notificationJson);
    //   console.log("notificationMessages");
    //   console.log(notificationMessages);
    // });
    let reportData = {};
    if (router.query.parentReportId) {
      reportData.parentReportId = router.query.parentReportId;
    }
    if (router.query.highlightedText) {
      reportData.highlightedText = router.query.highlightedText;
    }
    if (router.query.elementId) {
      reportData.elementId = router.query.elementId;
    }
    setWriteDraftTaskId(crypto.randomUUID());
    const specializedTraining = agent.specializedTraining;
    if (specializedTraining) {
      reportData.specializedTraining = specializedTraining;
    }
    try {
      const newTask = {
        // taskId: writeDraftTaskId,
        type: "saveReport",
        status: "queued",
        userId: user.sub,
        context: {
          ...reportData,
          draft,
          agentId: agent.agentId,
          expertises: [agent.expertise1, agent.expertise2, agent.expertise3],
          userId: user.sub,
          currentGeneration: 1,
          maxGenerations: 3,
        },
        createdAt: new Date().toISOString(),
      };

      const newTaskRef = await saveToFirebase(
        `asyncTasks/${user.sub}/saveReport`,
        newTask
      );

      if (newTaskRef) {
        // setWriteDraftTaskId(newTaskRef.key); // Store the task ID to set up the listener
        console.log("writeDraftTaskId");
        console.log(writeDraftTaskId);
      } else {
        console.error("Failed to queue the task.");
      }
    } catch (error) {
      console.error("Error queuing the task:", error.message);
    } finally {
      setIsSubmitting(false);
      clearInterval(notificationIntervalId); // Clear the interval properly
      setNotificationMessages([]);
    }
    // v1
    // const reportResponse = await fetch("/api/missions/save-report-endpoint", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     draft,
    //     briefing,
    //     userId: user.sub,
    //     agentId: agent.agentId,
    //     parentReportId: router.query.parentReportId,
    //     highlightedText: router.query.highlightedText,
    //     startIndex: router.query.startIndex,
    //     endIndex: router.query.endIndex,
    //     elementId: router.query.elementId,
    //     continuumEnabled,
    //     numberGenerations: generationsSliderValue,
    //   }),
    // });

    // setIsSubmitting(false);
    // const reportJson = await reportResponse.json();
    // console.log("reportJson");
    // console.log(reportJson);
    // const reportId = reportJson.reportId;
    // const folderId = reportJson.folderId;
    // // setIsSubmitting(false);

    // // if this is not a continuum, go to the report
    // if (!continuumEnabled) {
    //   router.push(`/missions/report/${reportId}`);
    // }
    // if (continuumEnabled) {
    //   router.push(`/folders/detail/${folderId}`);
    // }

    // if this is a continuum, go to the folder

    // clear the notification
    clearInterval(notificationIntervalId); // Clear the interval properly
    // setNotificationMessages([]);
  }
  // async function handleAcceptReport(e) {
  //   e.preventDefault();
  //   console.log("handleAcceptReport");
  //   setIsSubmitting(true);
  //   setIsSaving(true);
  //   const notificationMessagesResponse = await fetch(
  //     "/api/missions/save-report-notification-endpoint",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ briefing, agentName: agent.agentName }),
  //     }
  //   );
  //   // console.log(notificationMessagesResponse.js);
  //   const notificationJson = await notificationMessagesResponse.json();
  //   console.log("notificationJson");
  //   console.log(notificationJson);
  //   setNotificationMessages(notificationJson);
  //   console.log("notificationMessages");
  //   console.log(notificationMessages);

  //   const reportResponse = await fetch("/api/missions/save-report-endpoint", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       briefing,
  //       draft,
  //       agentName: agent.agentName,
  //       agentId: agent.agentId,
  //       userId: user.sub,
  //     }),
  //   });
  //   const reportJson = await reportResponse.json();
  //   console.log("reportJson");
  //   console.log(reportJson);
  //   const reportId = reportJson.data[0].reportId;
  //   // setIsSubmitting(false);
  //   router.push(`/missions/report/${reportId}`);
  //   // clearInterval(notificationIntervalId); // Clear the interval properly
  //   // setNotificationMessages([]);
  // }

  // useEffect(() => {
  //   if (briefing) {
  //     handleWriteDraftReport();
  //   }
  // }, [briefing]);

  useEffect(() => {
    if (user) {
      setupFirebaseListener(user);
    }
  }, [user]);
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
          // setBriefingSuggestion(data.briefingSuggestion);
          setBriefing(data.briefingSuggestion);
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
    if (!router.query.briefing) {
      fetchBriefingSuggestion();
    } else {
      setBriefing(router.query.briefing);
      console.log("router.query.briefing");
      console.log(router.query.briefing);
      // handle
    }
  }, [agent]);

  useEffect(() => {
    let index = 0; // Move index outside of the setInterval
    if (notificationMessages.length === 0) return;
    console.log("notificationMessages");
    console.log(notificationMessages);
    const intervalId = setInterval(() => {
      // Store the interval ID
      if (index < notificationMessages.length && isSubmitting) {
        const notificationMessage = notificationMessages[index];
        toast.success(notificationMessage);
        const newNotificationMessages = [...notificationMessages];
        newNotificationMessages.splice(index, 1);
        setNotificationMessages(newNotificationMessages);
        index++;
      } else {
        setNotificationMessages([]);
        clearInterval(intervalId); // Clear the interval properly
      }
    }, 2000);
    setNotificationIntervalId(intervalId);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [notificationMessages]);
  const currentQueryParams = router.query;

  // Continuum
  const [continuumEnabled, setContinuumEnabled] = useState(false);
  const [generationsSliderValue, setGenerationsSliderValue] = useState(2);
  // const [createNewAgentsEnabled, setCreateNewAgentsEnabled] = useState(false);

  return (
    <div>
      <Toaster position="bottom-center" />

      <Breadcrumb
        style={{ fontWeight: "200", fontFamily: "monospace" }}
        className="text-white"
      >
        <BreadcrumbItem>
          <i className="bi  bi-body-text"></i>
          &nbsp;&nbsp;
          <Link
            style={{ fontWeight: "200", textDecoration: "none" }}
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
              style={{ fontWeight: "200", textDecoration: "none" }}
              href={`/missions/report/${parentReportId}-${parentReportSlug}`}
            >
              {parentReportTitle}
            </Link>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem>
          <i className="bi bi-body-text"></i>+&nbsp;
          <Link
            className="text-white"
            style={{ fontWeight: "200", textDecoration: "none" }}
            href={{
              pathname: "/missions/create-mission/briefing",
              query: currentQueryParams,
            }}
          >
            Create Mission
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem style={{ fontWeight: "800" }} className="">
          <i className={`bi bi-person-badge`}></i>&nbsp;Dispatch Agent{" "}
          {agent.agentName}
        </BreadcrumbItem>
        {/* <BreadcrumbItem className="">
          <div style={{ fontWeight: "800" }}>Dispatch</div>
        </BreadcrumbItem> */}
      </Breadcrumb>

      <Row>
        <Col md={{ size: 7, offset: 2 }}>
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
                      style={{ marginBottom: "5px" }}
                      color="info"
                      className="ms-3 expertiseBadge"
                    >
                      {agent.expertise1}
                    </Badge>
                    <Badge
                      color="info"
                      style={{ marginBottom: "5px" }}
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
                      <>
                        <div>
                          <h4>Linked Mission Context</h4>
                        </div>

                        <div>{parentReportSummary}</div>
                      </>
                    )}
                    {/* {briefingSuggestion && (
                      <>
                        <div>
                          <h4>Briefing Suggestion</h4>
                        </div>
                        <div>{briefingSuggestion}</div>
                      </>
                    )} */}
                  </div>
                </CardBody>
              </Card>
            </div>

            <FormGroup>
              <div>
                <div style={{ marginTop: "20px" }}></div>
                <FormGroup>
                  <Label htmlFor="exampleText" className="text-white">
                    Mission Prompt
                  </Label>
                  <div
                    onClick={(e) => {
                      setBriefing("");
                    }}
                    style={{
                      paddingTop: "4px",
                      fontSize: "0.75em",
                      display: "flex",
                      justifyContent: "flex-end",
                      cursor: "pointer",
                    }}
                  >
                    🚫
                  </div>
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
                      disabled={isSubmitting || !briefing}
                    >
                      <i className="bi bi-body-text"></i> Create Draft
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
                <i className="bi bi-body-text"> Draft </i>
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
                  <Label htmlFor="exampleText" className="text-white">
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
                      &nbsp;Retry
                    </Button>
                  </div>
                </FormGroup>
              </Form>
              <h3>
                <i className="bi bi-link"></i> Continuum
              </h3>

              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="missionContinuum"
                    onChange={() => setContinuumEnabled(!continuumEnabled)}
                  />
                  Enable Continuum
                </Label>
              </FormGroup>
              <div
                style={{
                  // fontFamily: "Arial, sans-serif",
                  fontSize: "1em",
                  color: "#333",
                  lineHeight: "1.5",
                  marginBottom: "40px",
                  maxWidth: "600px",
                }}
              >
                <Label>
                  Transform your mission into a living, evolving narrative with
                  Continuum. Spawn a vibrant web of interconnected insights,
                  autonomously explored and expanded by AI agents. It's
                  collaborative intelligence, reimagined – a seamless journey
                  from a singular idea to a rich tapestry of knowledge. Try it
                  now and experience the future of intelligent research.
                </Label>
              </div>
              <div>
                {continuumEnabled && (
                  <div>
                    <FormGroup>
                      <span>
                        <Label
                          style={{ marginRight: "12px" }}
                          htmlFor="missionGenerations"
                        >
                          <i className="bi bi-link"></i> Generations:
                        </Label>
                        {generationsSliderValue}
                      </span>
                      <Input
                        // style={{ width: "50%" }}
                        type="range"
                        name="missionGenerations"
                        id="missionGenerations"
                        min="2"
                        max="10"
                        defaultValue="2"
                        step="1"
                        onChange={(e) =>
                          setGenerationsSliderValue(e.target.value)
                        }
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          <label htmlFor="missionGenerations">
                            2 <i className="bi bi-body-text"></i>
                          </label>
                        </span>

                        <span>
                          <label htmlFor="missionGenerations">
                            10 <i className="bi bi-body-text"></i>
                          </label>
                        </span>
                      </div>
                    </FormGroup>

                    {/* <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          onChange={() =>
                            setCreateNewAgentsEnabled(!createNewAgentsEnabled)
                          }
                          name="enableAgentCreation"
                        />
                        Create New Agents
                      </Label>
                    </FormGroup> */}
                  </div>
                )}
              </div>
              <Form>
                <div style={{ textAlign: "right" }}>
                  <Button
                    color="primary"
                    style={{ border: "3px solid green" }}
                    // disabled={isSubmitting}
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

// Dispatch Notifications
// Describe the 5 steps needed to create a research report draft on the following topic. The 5th step should be writing draft report. The first step should be analyzing research objective: How can deep learning techniques be used to enhance idea generation processes and optimize monetization strategies in computer science? Return your answer as a JSON array of strings. Do not explain your answer. Use present tense -ing language. Maximum 5 words per step.
// What are 5 humorous status updates for Agent Haida Gwaii Black Bear, an expert in Totem Poles, doing a mission with the following briefing: What are the effects of different blending and layering techniques with oil pastels on depth perception and emotional response in abstract artwork?
