// @author Marvin-Rhone
// quick-draft.js is the page where the user can create a mission for an
// agent to complete.
// import { saveToFirebase } from "../../../utils/saveToFirebase";
import saveTask from "../../../utils/saveTask";
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
import Image from "next/image";
import { useRouter } from "next/router";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { getSupabase } from "../../../utils/supabase";
import { useState, useRef, useEffect } from "react";

import { slugify } from "../../../utils/slugify";
// import { setupFirebaseListener } from "../../../utils/firebaseListener";

// bring in original report's summary
// bring in agent's memory of previous reports
// bring in content of link from original report
import { useFirebaseListener } from "../../../utils/useFirebaseListener";
import IntelliReportLengthDropdown from "../../../components/IntelliReportLengthDropdown/IntelliReportLengthDropdown";

const CreateMission = ({}) => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  const userId = user ? user.sub : null;
  const [draft, setDraft] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  // const [briefingInput, setBriefingInput] = useState(
  //   router.query.briefingInput
  // );

  console.log("router.query.briefingInput");
  console.log(router.query.briefingInput);
  if (!router.query.briefingInput || router.query.briefingInput.length == 0) {
    console.log(
      "no briefing input. going back to /reports/folders/view-folders"
    );
    console.log("router.query.briefingInput");
    console.log(router.query.briefingInput);
    // goToPage("/reports/folders/view-folders");
  }
  const [expertiseOutput, setExpertiseOutput] = useState("");
  // const [folderId, setFolderId] = useState("");

  const firebaseDraftData = useFirebaseListener(
    user
      ? `/${
          process.env.NEXT_PUBLIC_env === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${process.env.NEXT_PUBLIC_serverUid}/${userId}/quickDraft/context/`
      : null
  );
  const firebaseSaveData = useFirebaseListener(
    user
      ? `/${
          process.env.NEXT_PUBLIC_env === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${
          process.env.NEXT_PUBLIC_serverUid
        }/${userId}/finalizeAndVisualizeReport/context/`
      : null
  );
  useEffect(() => {
    if (firebaseDraftData) {
      //   console.log("firebaseDraftData");
      //   console.log(firebaseDraftData);
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
      // if (briefingInput.length != 0) {
      //   setBriefingInput(firebaseDraftData.briefingInput);
      // }
      setDraft(firebaseDraftData.draft);
      setExpertiseOutput(firebaseDraftData.expertiseOutput);
      // setSpecializedTraining(firebaseDraftData.);
      //   if (isSubmitting) {
      //     setIsSubmitting(false);
      //   }
    }
  }, [firebaseDraftData]);

  const [showLoadingImage, setShowLoadingImage] = useState(false);
  useEffect(() => {
    if (firebaseSaveData) {
      if (hasSubmitted) {
        if (firebaseSaveData.folderId) {
          // if (folderId) {
          goToPage(
            `/reports/folders/intel-report/${firebaseSaveData.folderId}`
          );
          //   }
          //   setFolderId(firebaseDraftData.folderId);
        } else {
          setShowLoadingImage(true);
        }
        // setFolderId(firebaseDraftData.folderId);
      }
    }
  }, [firebaseSaveData]);
  async function handleAcceptReport() {
    setHasSubmitted(true);
    const draftData = {
      briefingInput: router.query.briefingInput,
      draft,
    };
    if (expertiseOutput) {
      draftData.expertiseOutput = expertiseOutput;
      // specializedTraining,
    }
    const newTask = {
      type: "finalizeAndVisualizeReport",
      status: "queued",
      userId,
      context: {
        ...draftData,
        userId,
      },
      createdAt: new Date().toISOString(),
    };
    const newTaskRef = await saveTask(newTask);
    console.log("newTaskRef");
    console.log(newTaskRef);
  }
  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(name);
  }
  const [reportLength, setReportLength] = useState("short");
  function handleSelectedLength(length) {
    console.log("handleselected length");
    console.log(length);
    setReportLength(length);
  }
  const [feedbacks, setFeedbacks] = useState([]);
  async function handleQuickDraftClick() {
    const draftData = { briefingInput: router.query.briefingInput };
    console.log("feedbackInput");
    console.log(feedbackInput);
    if (feedbackInput) {
      draftData.feedback = feedbackInput;
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

    const newTask = {
      type: "quickDraft",
      status: "queued",
      userId,
      context: {
        ...draftData,
        reportLength,
        userId,
      },
      createdAt: new Date().toISOString(),
    };
    await saveTask(newTask);
  }
  return (
    <div>
      <Toaster position="bottom-center" />
      <Breadcrumb
        style={{ fontWeight: "200", fontFamily: "monospace" }}
        className="text-white"
      >
        <BreadcrumbItem>Reports</BreadcrumbItem>
        <BreadcrumbItem>Quick Draft</BreadcrumbItem>
      </Breadcrumb>
      {!showLoadingImage && (
        <div>
          {draft && (
            <Card style={{ backgroundColor: "#131313", color: "white" }}>
              {/* <div className="text-white">Draft</div> */}
              <CardBody style={{ backgroundColor: "#131313", color: "white" }}>
                <i className="bi bi-body-text"> New Draft </i>
                <div
                  className="text-white"
                  dangerouslySetInnerHTML={{ __html: draft }}
                />
              </CardBody>
            </Card>
          )}
          {(draft && isSubmitting) ||
            hasSubmitted ||
            (draft && draft.endsWith(" ".repeat(3)) && (
              <>
                <Form onSubmit={(e) => handleQuickDraftClick(e)}>
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
                      style={{ backgroundColor: "#131313", color: "white" }}
                      autoFocus
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "flex-start",
                        paddingTop: "8px",
                      }}
                    >
                      <Button
                        color="primary"
                        style={{
                          border: "1px solid yellow",
                          marginRight: "16px",
                        }}
                        disabled={
                          !draft.endsWith(" ".repeat(3)) || !feedbackInput
                        }
                        onClick={(e) => handleQuickDraftClick(e)}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                        &nbsp;Refine
                      </Button>
                      {/* <IntelliReportLengthDropdown
                        handleSelectedLength={handleSelectedLength}
                      /> */}
                    </div>
                  </FormGroup>
                </Form>
                <div style={{ textAlign: "center" }}>
                  <Button
                    color="primary"
                    style={{ border: "3px solid green" }}
                    disabled={
                      isSubmitting ||
                      hasSubmitted ||
                      !draft.endsWith(" ".repeat(3))
                    }
                    onClick={(e) => handleAcceptReport(e)}
                  >
                    <i className="bi bi-floppy"></i> Save & Visualize
                  </Button>
                </div>
              </>
            ))}
        </div>
      )}
      {showLoadingImage && (
        <div style={{ textAlign: "center" }}>
          <Image
            src="/library.png"
            style={{ width: "500px", height: "500px" }}
          />
        </div>
      )}
    </div>
  );
};

export default CreateMission;

// Dispatch Notifications
// Describe the 5 steps needed to create a research report draft on the following topic. The 5th step should be writing draft report. The first step should be analyzing research objective: How can deep learning techniques be used to enhance idea generation processes and optimize monetization strategies in computer science? Return your answer as a JSON array of strings. Do not explain your answer. Use present tense -ing language. Maximum 5 words per step.
// What are 5 humorous status updates for Agent Haida Gwaii Black Bear, an expert in Totem Poles, doing a mission with the following briefing: What are the effects of different blending and layering techniques with oil pastels on depth perception and emotional response in abstract artwork?
