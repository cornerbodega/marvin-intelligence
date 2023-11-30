// @author Marvin-Rhone
// dispatch.js is the page where the user can create a mission for an
// agent to complete.
// import { saveToFirebase } from "../../utils/saveToFirebase";
// import { saveToFirebase } from "../../../utils/saveToFirebase";
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

import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
// import IntelliFab from "../components/IntelliFab";

// import { getSupabase } from "../../utils/supabase";
import { getSupabase } from "../../../utils/supabase";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { slugify } from "../../../utils/slugify";
// import { setupFirebaseListener } from "../../../utils/firebaseListener";
import saveTask from "../../../utils/saveTask";
// bring in original report's summary
// bring in agent's memory of previous reports
// bring in content of link from original report
import { useFirebaseListener } from "../../../utils/useFirebaseListener";
import LoadingDots from "../../../components/LoadingDots";
import IntelliReportLengthDropdown from "../../../components/IntelliReportLengthDropdown/IntelliReportLengthDropdown";
import Head from "next/head";
// import { is } from "@react-three/fiber/dist/declarations/src/core/utils";
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const supabase = getSupabase();
    // const agentId = context.params.agentId;
    const session = await getSession(context.req, context.res);
    const user = session?.user;
    const userId = user.sub;
    const { data: agency, agencyError } = await supabase
      .from("users")
      .select("agencyName")
      .eq("userId", user.sub);
    const agencyName = agency[0].agencyName;
    if (agencyError) {
      console.log("agencyError");
    }
    console.log("agency");
    console.log(agency);
    if (!agency || agency.length === 0) {
      return {
        redirect: {
          permanent: false,
          destination: "/agency/create-agency",
        },
        props: {},
      };
    }

    const { agentId, parentReportId, highlightStartIndex, highlightEndIndex } =
      context.query;
    console.log("parentReportId");
    console.log(parentReportId);

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
    const expertiseOutput = [
      agent.expertise1,
      agent.expertise2,
      agent.expertise3,
    ];
    // My Tokens
    let { data: tokensResponse, error: tokensError } = await supabase
      .from("tokens")
      .select("tokens")
      .eq("userId", userId);
    if (tokensError) {
      console.log("tokensError");
    }
    console.log("tokensResponse");
    console.log(tokensResponse);
    let _tokensRemaining = 0;
    if (tokensResponse) {
      if (tokensResponse[0]) {
        _tokensRemaining = tokensResponse[0].tokens;
      }
    }
    console.log("_tokensRemaining");
    console.log(_tokensRemaining);
    return {
      props: { userId, agent, expertiseOutput, agencyName, _tokensRemaining },
    };
  },
});

const CreateMission = ({
  userId,
  agent,
  agencyName,
  _tokensRemaining,
  expertiseOutput,
}) => {
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
  const [isStreaming, setIsStreaming] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState("");
  const router = useRouter();
  const [tokensRemaining, setTokensRemaining] = useState(_tokensRemaining);
  const draftRef = useRef();
  const [parentReportTitle, setParentReportTitle] = useState("");
  const [parentReportId, setParentReportId] = useState("");
  const [parentReportSlug, setParentReportSlug] = useState("");

  const [notificationIntervalId, setNotificationIntervalId] = useState();
  const [notificationMessages, setNotificationMessages] = useState([]);

  const [writeDraftTaskId, setWriteDraftTaskId] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [draftResponseContent, setDraftResponseContent] = useState();

  const firebaseDraftData = useFirebaseListener(
    user
      ? `/${
          process.env.NEXT_PUBLIC_env === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/quickDraft/context`
      : null
  );
  const firebaseFolderIdData = useFirebaseListener(
    user
      ? `/${
          process.env.NEXT_PUBLIC_env === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${process.env.NEXT_PUBLIC_serverUid}/${
          user.sub
        }/saveLinkedReport/context/folderId`
      : null
  );
  const [hasQuickDrafted, setHasQuickDrafted] = useState(false);
  const [hasSavedReport, setHasSavedReport] = useState(false);
  // const firebaseDraftCompletedAt = useFirebaseListener(
  //   user ? `/${process.env.NEXT_PUBLIC_env === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/quickDraft/context/draft` : null
  // );
  // // const [draftResponseContent, setDraftResponseContent] = useState(null);

  useEffect(() => {
    if (firebaseFolderIdData && hasSavedReport) {
      console.log("firebaseFolderIdData");
      console.log(firebaseFolderIdData);

      // console.log("isStreaming");
      // console.log(isStreaming);

      goToPage(`/reports/folders/intel-report/${firebaseFolderIdData}`);
    }
  }, [firebaseFolderIdData]);
  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(name);
  }
  useEffect(() => {
    if (!firebaseDraftData) return;
    if (firebaseDraftData.draft) {
      console.log("firebaseDraftData");
      console.log(firebaseDraftData);
      function cleanIncompleteHTML(input) {
        // First, find the last complete tag.
        const lastOpenBracket = input.lastIndexOf("<");
        const lastCloseBracket = input.lastIndexOf(">");

        // If the last '<' appears after the last '>', then we have an incomplete tag.
        if (lastOpenBracket > lastCloseBracket) {
          // setIsStreaming(false);
          return input.substring(0, lastOpenBracket);
        } else {
          // setIsStreaming(true);
        }
      }
      // console.log("isStreaming");
      // console.log(isStreaming);
      console.log("firebaseDraftData.expertiseOutput");
      console.log(firebaseDraftData.expertiseOutput);
      if (firebaseDraftData.expertiseOutput) {
        if (
          JSON.stringify(firebaseDraftData.expertiseOutput) ===
          JSON.stringify(expertiseOutput)
        ) {
          setDraft(firebaseDraftData.draft);
        }
        // setExpertiseOutput(firebaseDraftData.expertiseOutput);
      }
      if (isSubmitting) {
        setIsSubmitting(false);
      }
    }
  }, [firebaseDraftData]);

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

  const [feedbacks, setFeedbacks] = useState([]);
  async function handleQuickDraft(e) {
    setTokensRemaining(tokensRemaining - 1);
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
    // setBriefing(`${briefing} ${feedbackInput}`);
    setFeedbackInput("");
    setHasQuickDrafted(true);

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

    console.log(" dispatch briefing");
    const draftData = {
      briefingInput,
      expertiseOutput,
      feedbacks,
      userId,
      reportLength,
    };
    if (feedbackInput) {
      // draftData.feedback = feedbackInput;
      // draftData.previousDraft = draft;
      let newFeedbacks = feedbacks;
      newFeedbacks.push({ feedback: feedbackInput, draft });
      console.log("newFeedbacks");
      console.log(newFeedbacks);
      setFeedbacks(newFeedbacks);
      draftData.feedbacks = newFeedbacks;
      // const newBriefingInput = `${briefingInput} ${draftData.feedback}`;

      // setBriefingInput(newBriefingInput);

      setFeedbackInput("");
    }
    // feedbacks",
    //     "userId",
    //     "previousDraft", // the previous draft to feebdack on
    //     "reportLength",

    // if (feedbackInput) {
    //   let feedback = [
    //     { role: "assistant", content: draft },
    //     {
    //       role: "user",
    //       content: `Please write the report again with the following feedback ${feedbackInput}.`,
    //     },
    //   ];
    //   draftData.feedback = feedback;
    // }
    // if (specializedTraining) {
    //   draftData.specializedTraining = specializedTraining;
    // }
    console.log("draftData");
    console.log(draftData);

    try {
      const clearQuickDraftTask = {
        type: "quickDraft",
        status: "cleared",
        userId: user.sub,
        context: {},
        createdAt: new Date().toISOString(),
      };
      await saveTask(clearQuickDraftTask);
      const clearSaveReportTask = {
        type: "saveReport",
        status: "cleared",
        userId: user.sub,
        context: {},
        createdAt: new Date().toISOString(),
      };
      await saveTask(clearSaveReportTask);
      // const clearOldDraftRef = await saveToFirebase(
      //   `/${process.env.NEXT_PUBLIC_env === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/quickDraft`,
      //   {}
      // );
      // const clearOldSaveRef = await saveToFirebase(
      //   `/${process.env.NEXT_PUBLIC_env === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/saveReport`,
      //   {}
      // );
      const newTask = {
        type: "quickDraft",
        status: "queued",
        userId: user.sub,
        context: {
          ...draftData,
          userId: user.sub,
          reportLength,
          existingExpertise: expertiseOutput,
        },
        createdAt: new Date().toISOString(),
      };
      const newTaskRef = await saveTask(newTask);
      // const newTaskRef = await saveToFirebase(
      //   `/${process.env.NEXT_PUBLIC_env === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/quickDraft`,
      //   newTask
      // );

      if (newTaskRef) {
        console.log("newTaskRef");
        console.log(newTaskRef);
        setWriteDraftTaskId(newTaskRef.key); // Store the task ID to set up the listener
        console.log("writeDraftTaskId");
        console.log(writeDraftTaskId);
      } else {
        console.error("Failed to queue the task.");
      }
    } catch (error) {
      console.error("Error queuing the task:", error.message);
    } finally {
      clearInterval(notificationIntervalId); // Clear the interval properly
      setNotificationMessages([]);
    }
  }

  // async function handleQuickDraft(e) {
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

  // useEffect(() => {
  //   if (
  //     !isSubmitting &&
  //     draft &&
  //     draftRef.current &&
  //     !isSaving &&
  //     !isStreaming
  //   ) {
  //     draftRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }
  // }, [isSubmitting, draft]);
  async function handleAcceptReport(e) {
    e.preventDefault();
    console.log("handleAcceptReport");
    setIsSaving(true);
    setHasSavedReport(true);
    setIsSubmitting(true);

    // setWriteDraftTaskId(crypto.randomUUID());

    try {
      const draftData = {
        briefingInput: router.query.briefingInput,
        existingAgentId: agent.agentId,
        draft,
      };
      if (router.query.parentReportId) {
        draftData.parentReportId = router.query.parentReportId;
      }
      if (router.query.highlightedText) {
        draftData.highlightedText = router.query.highlightedText;
      }
      if (router.query.elementId) {
        draftData.elementId = router.query.elementId;
      }
      // if (expertiseOutput) {
      //   draftData.expertiseOutput = expertiseOutput;
      //   // specializedTraining,
      // }

      // const newTask = {
      //   type: "finalizeAndVisualizeReport",
      //   status: "queued",
      //   userId,
      //   context: {
      //     ...draftData,
      //     userId,
      //   },
      //   createdAt: new Date().toISOString(),
      // };
      const saveReportTask = {
        type: "saveLinkedReport",
        status: "queued",
        userId: user.sub,
        context: {
          ...draftData,
          draft,
          agentId: agent.agentId,
          expertises: expertiseOutput,
          userId: user.sub,
        },
        createdAt: new Date().toISOString(),
      };

      const newTaskRef = await saveTask(saveReportTask);
      console.log("newTaskRef");
      console.log(newTaskRef);

      // const saveReportTaskRef = await saveTask(saveReportTask);
      // console.log("newTaskRef");
      // console.log(newTaskRef);

      // const saveReportTaskRef = await saveToFirebase(
      //   `/${process.env.NEXT_PUBLIC_env === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/saveReport`,
      //   saveReportTask
      // );

      if (newTaskRef) {
        // setWriteDraftTaskId(newTaskRef.key); // Store the task ID to set up the listener
        console.log("newTaskRef");
        console.log(newTaskRef);
      } else {
        console.error("Failed to queue the task.");
      }
    } catch (error) {
      console.error("Error queuing the task:", error.message);
    } finally {
      // setIsSubmitting(false);
      // clearInterval(notificationIntervalId); // Clear the interval properly
      // setNotificationMessages([]);
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
    //   router.push(`/reports/folders/detail/${folderId}`);
    // }

    // if this is a continuum, go to the folder

    // clear the notification
    // clearInterval(notificationIntervalId); // Clear the interval properly
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
  //     handleQuickDraft();
  //   }
  // }, [briefing]);

  // useEffect(() => {
  //   if (user) {
  //     setupFirebaseListener(user);
  //   }
  // }, [user]);
  const [reportLength, setReportLength] = useState("short");
  function handleSelectedLength(length) {
    console.log("handleselected length");
    console.log(length);
    setReportLength(length);
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
      const briefingResponse = await fetch("/api/reports/get-suggestion", {
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
          setBriefingInput(data.briefingSuggestion);
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
  const [generationsSliderValue, setGenerationsSliderValue] = useState(1);
  // const [createNewAgentsEnabled, setCreateNewAgentsEnabled] = useState(false);
  const textareaRef = useRef(null);
  const [briefingInput, setBriefingInput] = useState("");

  useEffect(() => {
    if (textareaRef.current) {
      // textareaRef.current.parentElement.style.setProperty(
      //   "--cursor-pos-x",
      //   "6px"
      // );
      const textWidth = getTextWidth(
        briefingInput,
        window.getComputedStyle(textareaRef.current).fontSize
      );
      const paddingLeft = parseFloat(
        window.getComputedStyle(textareaRef.current).paddingLeft
      );
      const paddingRight = parseFloat(
        window.getComputedStyle(textareaRef.current).paddingRight
      );

      const lineHeight = parseFloat(
        window.getComputedStyle(textareaRef.current).lineHeight
      );

      // Adjust for padding and ensure the cursor stays within bounds
      // const totalWidth = Math.min(
      //   textWidth + paddingLeft,
      //   textareaRef.current.offsetWidth - paddingRight - 1
      // );
      const textareaContentWidth =
        textareaRef.current.offsetWidth - paddingLeft - paddingRight;

      const lines = Math.ceil(textWidth / textareaContentWidth);
      const lastLineWidth = textWidth % textareaContentWidth || textWidth;

      const cursorLeft = lastLineWidth + paddingLeft;
      const cursorTop = (lines - 1) * lineHeight;

      textareaRef.current.parentElement.style.setProperty(
        "--cursor-pos-x",
        `${cursorLeft}px`
      );
      if (lines > 1) {
        textareaRef.current.parentElement.style.setProperty(
          "--cursor-pos-x",
          `${cursorLeft + lines * 5}px`
        );
      }

      if (briefingInput.length === 0) {
        console.log("briefingInput.length === 0");
        // textareaRef.current.parentElement.style.setProperty("top", "14px");
        textareaRef.current.parentElement.style.setProperty(
          "--cursor-pos-y",
          `${cursorTop + 45}px`
        );
        textareaRef.current.parentElement.style.setProperty(
          "caret-color",
          "transparent"
        );
        textareaRef.current.parentElement.classList.remove("no-background");
      } else {
        // textareaRef.current.parentElement.style.removeProperty("top");
        // console.log("lines");
        // console.log(lines);
        // textareaRef.current.parentElement.style.setProperty(
        //   "--cursor-pos-y",
        //   `${cursorTop + 15}px`
        // );
        // if (lines > 2) {
        //   textareaRef.current.parentElement.style.removeProperty(
        //     "--cursor-pos-y"
        //   );
        textareaRef.current.parentElement.style.setProperty(
          "caret-color",
          "limegreen"
        );
        textareaRef.current.parentElement.classList.add("no-background");
      }
      // } else {
      // textareaRef.current.parentElement.style.setProperty(
      //   "--cursor-pos-y",
      //   `${cursorTop + 42}px`
      // );
      // }
      // }
    }
  }, [briefingInput, textareaRef]);

  function getTextWidth(text, fontSize) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = fontSize + " Arial";
    return context.measureText(text).width;
  }

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>
          Agent {agent.agentName} | {agencyName}
        </title>
      </Head>
      <Toaster position="bottom-center" />

      <Breadcrumb
        style={{ fontWeight: "200", fontFamily: "monospace" }}
        className="text-white"
      >
        <BreadcrumbItem>
          <i className={`bi bi-person-badge`}></i>
          &nbsp;
          <Link
            style={{ fontWeight: "200", textDecoration: "none" }}
            className="text-white"
            href="/agents/view-agents"
          >
            Agents
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem style={{ fontWeight: "800" }} className="">
          Agent {agent.agentName}
        </BreadcrumbItem>
        {/* <BreadcrumbItem className="">
          <div style={{ fontWeight: "800" }}>Dispatch</div>
        </BreadcrumbItem> */}
      </Breadcrumb>

      <Row>
        <Col md={{ size: 7, offset: 2 }}>
          <Form onSubmit={handleQuickDraft}>
            <FormGroup>
              <div>
                <div style={{ marginTop: "20px" }}></div>

                <FormGroup>
                  <Row>
                    <Col className="col-8">
                      <Label htmlFor="exampleText" className="text-white">
                        What would you like to know?
                      </Label>
                    </Col>
                    <Col>
                      <div
                        onClick={(e) => {
                          setBriefingInput("");
                        }}
                        style={{
                          paddingTop: "4px",
                          fontSize: "0.75em",
                          display: "flex",
                          justifyContent: "flex-end",
                          cursor: "pointer",
                        }}
                      >
                        <i className="bi bi-x-circle"></i>
                      </div>
                    </Col>
                  </Row>
                  {/* <Input
                    id="exampleText"
                    placeholder="What would you like to know?"
                    name="text"
                    rows="5"
                    type="textarea"
                    value={briefing}
                    onChange={(e) => setBriefing(e.target.value)}
                  /> */}
                  <div className="textareaWrapper">
                    <textarea
                      ref={textareaRef}
                      autoFocus
                      value={briefingInput}
                      onChange={(e) => setBriefingInput(e.target.value)}
                      placeholder="What would you like to know?"
                      style={{
                        padding: "12px 12px 13px 13px",
                        borderWidth: "0px",
                        width: "100%",
                        height: "180px",
                        color: "white",
                        borderRadius: "8px",
                        border: "1px solid white",
                        backgroundColor: "#000",
                        "--cursor-pos": "0px", // Initial value
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "flex-start",
                      paddingTop: "8px",
                    }}
                  >
                    <Button
                      color="primary"
                      style={{ border: "1px solid green", marginRight: "16px" }}
                      disabled={isSubmitting || !briefingInput}
                    >
                      <i className="bi bi-folder"></i>+ Create Report
                    </Button>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <IntelliReportLengthDropdown
                      handleSelectedLength={handleSelectedLength}
                    />
                  </div>
                  <div
                    onClick={() => goToPage("/account/tokens/get-tokens")}
                    style={{
                      marginBottom: "32px",
                      marginTop: "22px",
                      fontSize: "0.75em",
                      color: "lightblue",
                      cursor: "pointer",
                      width: "148px",
                    }}
                  >
                    My Tokens: {tokensRemaining} <i className="bi bi-coin" />
                  </div>
                </FormGroup>
              </div>
            </FormGroup>
            <div>
              <Card
                style={{
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid white",
                  borderRadius: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "16px",
                    marginBottom: "16px",
                    marginTop: "0px",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      height: "337px",
                      width: "auto",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={`${agent.profilePicUrl}`}
                      fill={true}
                      style={{
                        // width: "100%",
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                        // borderRadiusTopLeft: "16px",
                        // borderRadiusTopRight: "16px",
                        // objectFit: "cover",
                        // objectPosition: "top",
                        // borderRadius: "20%",
                        // border: "12px solid green",
                      }}
                      alt="agent"
                    />
                  </div>
                </div>
                <CardBody>
                  <CardTitle
                    style={{
                      display: "flex",
                      marginTop: "16px",
                      // marginBottom: "16px",
                      justifyContent: "center",
                      fontWeight: 800,
                      color: "white",
                      fontSize: "1.2rem",
                    }}
                  >
                    Agent {agent.agentName}
                  </CardTitle>
                  <CardSubtitle
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "16px",
                      marginBottom: "16px",
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
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      {/* <i style={{ color: "grey" }} className="bi bi-trash" /> */}
                      {/* &nbsp; Delete? Yes / No */}
                    </div>
                    <div>
                      <h4>Bio</h4>
                    </div>
                    <div style={{ fontSize: "0.8em" }}>{agent.bio}</div>
                    {/* {JSON.stringify(agentMissionHistory)} */}
                    {/* {!agentMissionHistory && <LoadingDots></LoadingDots>} */}
                    {/* {!agentMissionHistory ||
                      (agentMissionHistory.length == 0 && <LoadingDots />)} */}
                    {agentMissionHistory && (
                      <>
                        <div>
                          <h4>Report History</h4>
                        </div>
                        <ul>
                          {agentMissionHistory.map((mission, index) => {
                            if (mission.reportFolders.length == 0) {
                              return <></>;
                            }
                            return (
                              <li key={index}>
                                {/* {JSON.stringify(mission)} */}
                                <Link
                                  className="reportFont"
                                  style={{
                                    textDecoration: "none",
                                    fontWeight: 300,
                                    color: "#E7007C",
                                    cursor: "pointer",
                                  }}
                                  href={`/reports/folders/intel-report/${mission.reportFolders[0].folderId}`}
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
                          <h4>Parent Report Context</h4>
                        </div>
                        <div>
                          <Link
                            className="reportFont"
                            style={{
                              textDecoration: "none",
                              fontWeight: 300,
                              color: "#E7007C",
                              cursor: "pointer",
                            }}
                            href={`/reports/folders/intel-report/${parentReportId}`}
                          >
                            {parentReportTitle}
                          </Link>
                        </div>
                        <div style={{ fontSize: "0.85em" }}>
                          {parentReportSummary}
                        </div>
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
          </Form>
          <div style={{ marginTop: "50px" }} ref={draftRef}></div>
          {draft && (
            <Card style={{ background: "black", color: "white" }}>
              {/* <div className="text-white">Draft</div> */}
              <CardBody className="report">
                <i className="bi bi-body-text"> New Draft </i>
                <div
                  // className="text-primary"
                  style={{ color: "white" }}
                  dangerouslySetInnerHTML={{ __html: draft }}
                />
              </CardBody>
            </Card>
          )}
          {draft && !draft.endsWith(" ".repeat(3)) && (
            <div className="scroll-downs">
              <div className="mousey">
                <div className="scroller"></div>
              </div>
            </div>
          )}
          {draft && !isSubmitting && draft.endsWith(" ".repeat(3)) && (
            <>
              <Form onSubmit={(e) => handleQuickDraft(e)}>
                <FormGroup>
                  <div style={{ marginTop: "40px" }}></div>
                  <Label htmlFor="exampleText" className="text-white">
                    Feedback
                  </Label>
                  <Input
                    style={{ backgroundColor: "#131313" }}
                    id="exampleText"
                    placeholder="What do you think?"
                    name="text"
                    rows="5"
                    type="textarea"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "flex-end",
                      paddingTop: "8px",
                    }}
                  >
                    <Button
                      color="primary"
                      style={{
                        border: "1px solid yellow",
                        marginRight: "16px",
                      }}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                      &nbsp;Refine
                    </Button>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <IntelliReportLengthDropdown
                      handleSelectedLength={handleSelectedLength}
                    />
                  </div>
                  <div>
                    <div
                      onClick={() => goToPage("/account/tokens/get-tokens")}
                      style={{
                        marginBottom: "32px",
                        marginTop: "22px",
                        fontSize: "0.75em",
                        color: "lightblue",
                        cursor: "pointer",
                        width: "148px",
                      }}
                    >
                      My Tokens: {tokensRemaining} <i className="bi bi-coin" />
                    </div>
                  </div>
                </FormGroup>
              </Form>
              <Button
                color="primary"
                style={{ border: "3px solid green", marginTop: "40px" }}
                disabled={isSubmitting || !draft.endsWith(" ".repeat(3))}
                onClick={(e) => handleAcceptReport(e)}
              >
                <i className="bi bi-floppy"></i> Save Report
              </Button>
              {isSaving && isSubmitting && "Savinng Report..."}
              {/* <h3>
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
              </FormGroup> */}
              {/* <div
                style={{
                  fontSize: "1em",
                  color: "#333",
                  cursor: "pointer",
                  lineHeight: "1.5",
                  marginBottom: "40px",
                  maxWidth: "600px",
                }}
              >
                <Label>
                  Elevate your mission with Continuum. Transform ideas into an
                  interconnected web of insights, dynamically expanded by AI.
                  Experience collaborative intelligence reimagined – dive from a
                  single thought into a vast knowledge tapestry. Try the future
                  of intelligent research now.
                </Label>
              </div>
              <div>
                <div></div>
              </div> */}
              {/* <Form>
                <div style={{ textAlign: "left" }}>
                  {!continuumEnabled && (
                    <Button
                      color="primary"
                      style={{ border: "3px solid green" }}
                      disabled={isSubmitting || !draft.endsWith(" ".repeat(3))}
                      onClick={(e) => handleAcceptReport(e)}
                    >
                      <i className="bi bi-folder"></i> Save Report
                    </Button>
                  )}
                  {continuumEnabled && (
                    <Button
                      color="primary"
                      style={{ border: "3px solid green" }}
                      disabled={isSubmitting || !draft.endsWith(" ".repeat(3))}
                      onClick={(e) => handleAcceptReport(e)}
                    >
                      <i className="bi bi-link"></i> Start Continuum
                    </Button>
                  )}
                </div>
              </Form> */}
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
{
  /* <FormGroup>
                    <span>
                      <Label
                        style={{ marginRight: "12px" }}
                        htmlFor="missionGenerations"
                      >
                        Continuum Generations:
                      </Label>
                      {generationsSliderValue}{" "}
                      <i className="bi bi-body-text"></i>
                    </span>
                    <Input
                      type="range"
                      name="missionGenerations"
                      id="missionGenerations"
                      min="1"
                      max="7"
                      defaultValue="1"
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
                          2 <i className="bi bi bi-body-text"></i>
                        </label>
                      </span>

                      <span>
                        <label htmlFor="missionGenerations">
                          3 <i className="bi bi-body-text"></i>
                        </label>
                      </span>
                    </div>
                  </FormGroup> */
}

{
  /* <FormGroup check>
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
                    </FormGroup> */
}
