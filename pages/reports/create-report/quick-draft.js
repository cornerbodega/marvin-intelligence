// @author Marvin-Rhone
// quick-draft.js is the page where the user can create a mission for an
// agent to complete.
// import { saveToFirebase } from "../../../utils/saveToFirebase";
import saveTask from "../../../utils/saveTask";
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import toast, { Toaster } from "react-hot-toast";

import { useUser } from "@auth0/nextjs-auth0/client";

import Image from "next/image";
import { useRouter } from "next/router";

import { useState, useEffect, useContext } from "react";

import { useFirebaseListener } from "../../../utils/useFirebaseListener";

const CreateMission = ({}) => {
  const router = useRouter();

  const { user } = useUser();
  const [userId, setUserId] = useState(user?.sub);

  const [draft, setDraft] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  console.log("router.query.briefingInput");
  console.log(router.query.briefingInput);
  console.log("router.query");
  console.log(router.query);
  console.log("router.query.userId");
  console.log(router.query.userId);

  if (!router.query.briefingInput || router.query.briefingInput.length == 0) {
    console.log("no briefing input. ");
    console.log("router.query.briefingInput");
    console.log(router.query.briefingInput);
  }

  if (!router.query.userId || router.query.userId.length == 0) {
    console.log("no briefing userId query param.");
    console.log("router.query.userId");
    console.log(router.query.userId);
  }

  useEffect(() => {
    if (router.query.userId) {
      setUserId(router.query.userId);
    }
  }, [router.query.userId]);

  const [expertiseOutput, setExpertiseOutput] = useState("");

  const firebaseDraftData = useFirebaseListener(
    userId
      ? `/${
          process.env.NEXT_PUBLIC_env === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${process.env.NEXT_PUBLIC_serverUid}/${userId}/quickDraft/context/`
      : null
  );
  console.log("firebaseDraftData");
  console.log(firebaseDraftData);
  console.log("path");
  console.log(
    `/${
      process.env.NEXT_PUBLIC_env === "production"
        ? "asyncTasks"
        : "localAsyncTasks"
    }/${process.env.NEXT_PUBLIC_serverUid}/${userId}/quickDraft/context/`
  );
  const firebaseSaveData = useFirebaseListener(
    userId
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
      setDraft(firebaseDraftData.draft);
      setExpertiseOutput(firebaseDraftData.expertiseOutput);
    }
  }, [firebaseDraftData]);

  const [showLoadingImage, setShowLoadingImage] = useState(false);

  useEffect(() => {
    if (firebaseSaveData) {
      if (hasSubmitted) {
        if (firebaseSaveData.folderId) {
          router.push({
            pathname: `/reports/folders/intel-report/${firebaseSaveData.folderId}`,
            query: { userId },
          });
        } else {
          setShowLoadingImage(true);
        }
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

  const [feedbacks, setFeedbacks] = useState([]);
  async function handleQuickDraftClick() {
    console.log("handleQuickDraft userId");
    // return console.log(userId);

    const draftData = { briefingInput: router.query.briefingInput };
    console.log("feedbackInput");
    console.log(feedbackInput);

    if (feedbackInput) {
      draftData.feedback = feedbackInput;
      let newFeedbacks = [...feedbacks, { feedback: feedbackInput, draft }];
      console.log("newFeedbacks");
      console.log(newFeedbacks);
      setFeedbacks(newFeedbacks);
      draftData.feedbacks = newFeedbacks;

      setFeedbackInput("");
    }
    if (!userId) {
      return console.log("Error 45: no user id");
    }
    const newTask = {
      type: "quickDraft",
      status: "queued",
      userId,
      context: {
        ...draftData,
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
      {feedbacks &&
        feedbacks.map((feedback, i) => (
          <Card key={i} style={{ backgroundColor: "#131313", color: "white" }}>
            <CardBody style={{ backgroundColor: "#131313", color: "white" }}>
              <i className="bi bi-body-text"> Draft {i + 1} </i>
              <div
                className="text-white"
                dangerouslySetInnerHTML={{ __html: feedback.draft }}
              />
              <i className="bi bi-pencil"> Feedback </i>
              <div
                className="text-white"
                dangerouslySetInnerHTML={{
                  __html: feedback.feedback,
                }}
              />
            </CardBody>
          </Card>
        ))}

      {!showLoadingImage && (
        <div>
          {draft && (
            <Card style={{ backgroundColor: "#131313", color: "white" }}>
              <CardBody style={{ backgroundColor: "#131313", color: "white" }}>
                <i className="bi bi-body-text"> Current Draft </i>
                <div
                  className="text-white"
                  dangerouslySetInnerHTML={{ __html: draft }}
                />
              </CardBody>
            </Card>
          )}
          {/* {previousDrafts &&
            previousDrafts.map((previousDraft, i) => (
              <Card
                key={i}
                style={{ backgroundColor: "#131313", color: "white" }}
              >
                <CardBody
                  style={{ backgroundColor: "#131313", color: "white" }}
                >
                  <i className="bi bi-body-text"> Previous Draft </i>
                  <div
                    className="text-white"
                    dangerouslySetInnerHTML={{ __html: previousDraft }}
                  />
                </CardBody>
              </Card>
            ))} */}

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
                        // display: "flex",
                        // flexDirection: "flex-end",
                        textAlign: "right",
                        paddingTop: "8px",
                      }}
                    >
                      <Button
                        color="primary"
                        style={{
                          border: "1px solid yellow",
                          // marginRight: "16px",
                        }}
                        disabled={
                          !draft.endsWith(" ".repeat(3)) || !feedbackInput
                        }
                        onClick={(e) => handleQuickDraftClick(e)}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                        &nbsp;Send
                      </Button>
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
        <div style={{ textAlign: "center", width: "100%" }}>
          <img style={{ width: "100%", height: "auto" }} src="/library.png" />
        </div>
      )}
    </div>
  );
};

export default CreateMission;

// Dispatch Notifications
// Describe the 5 steps needed to create a research report draft on the following topic. The 5th step should be writing draft report. The first step should be analyzing research objective: How can deep learning techniques be used to enhance idea generation processes and optimize monetization strategies in computer science? Return your answer as a JSON array of strings. Do not explain your answer. Use present tense -ing language. Maximum 5 words per step.
// What are 5 humorous status updates for Agent Haida Gwaii Black Bear, an expert in Totem Poles, doing a mission with the following briefing: What are the effects of different blending and layering techniques with oil pastels on depth perception and emotional response in abstract artwork?
