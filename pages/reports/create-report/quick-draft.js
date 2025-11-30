// @author Marvin-Rhone
// quick-draft.js is the page where the user can create a mission for an
// agent to complete.
import DOMPurify from "dompurify";

import Link from "next/link";
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

import { useRouter } from "next/router";
import { useUser } from "../../../context/UserContext";
import { useState, useEffect } from "react";

import { useFirebaseListener } from "../../../utils/useFirebaseListener";

// import IntelliLoadingBar from "../../../components/IntelliLoadingBar/IntelliLoadingBar";

const CreateMission = ({}) => {
  const router = useRouter();

  const [draft, setDraft] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [userId, setUserId] = useState();
  const { user, isLoading: isAuthLoading } = useUser();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push("/");
      } else if (user?.id) {
        setUserId(user.id);
      }
    }
  }, [user, isAuthLoading, router]);

  if (!router.query.briefingInput || router.query.briefingInput.length == 0) {
    console.log("no briefing input. ");
    console.log("router.query.briefingInput");
    console.log(router.query.briefingInput);
  }

  // if (!router.query.userId || router.query.userId.length == 0) {
  //   console.log("no briefing userId query param.");
  //   console.log("router.query.userId");
  //   console.log(router.query.userId);
  // }
  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(name);
  }

  const [expertiseOutput, setExpertiseOutput] = useState("");

  const firebaseDraftData = useFirebaseListener(
    userId
      ? `/${"asyncTasks"}/${
          process.env.NEXT_PUBLIC_SERVER_UID
        }/${userId}/quickDraft/context/`
      : null
  );

  console.log(
    `/${"asyncTasks"}/${
      process.env.NEXT_PUBLIC_SERVER_UID
    }/${userId}/quickDraft/context/`
  );
  const firebaseSaveData = useFirebaseListener(
    userId
      ? `/${"asyncTasks"}/${
          process.env.NEXT_PUBLIC_SERVER_UID
        }/${userId}/finalizeAndVisualizeReport/context/`
      : null
  );

  useEffect(() => {
    if (firebaseDraftData) {
      console.log("firebaseDraftData");
      console.log(firebaseDraftData);
      setDraft(firebaseDraftData.draft);
      setExpertiseOutput(firebaseDraftData.expertiseOutput);
    }
  }, [firebaseDraftData]);

  const [showLoadingImage, setShowLoadingImage] = useState(false);
  const [isWaitingForDraft, setIsWaitingForDraft] = useState(true);

  useEffect(() => {
    if (firebaseDraftData?.draft) {
      setIsWaitingForDraft(false);
    }
  }, [firebaseDraftData]);

  useEffect(() => {
    if (firebaseSaveData) {
      if (hasSubmitted) {
        if (firebaseSaveData.folderId) {
          router.push({
            pathname: `/reports/folders/intel-report/${firebaseSaveData.folderId}`,
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
    console.log(newTask);
  }

  const [feedbacks, setFeedbacks] = useState([]);
  async function handleQuickDraftClick() {
    console.log("handleQuickDraft userId");
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

  if (isAuthLoading || !user) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "40px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        style={{ fontWeight: "200", fontFamily: "monospace" }}
        className="text-white"
      >
        <BreadcrumbItem>
          <Link href="/reports/folders/view-folders">Reports</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Quick Draft</BreadcrumbItem>
      </Breadcrumb>
      {feedbacks &&
        feedbacks.map((feedback, i) => (
          <Card key={i} style={{ backgroundColor: "#131313", color: "white" }}>
            <CardBody style={{ backgroundColor: "#131313", color: "white" }}>
              <i className="bi bi-body-text"> Draft {i + 1} </i>
              <div
                style={{ marginTop: "20px" }}
                className="text-white"
                dangerouslySetInnerHTML={{ __html: feedback.draft }}
              />
              <div style={{ marginTop: "40px" }}>
                <i className="bi bi-pencil"> Feedback </i>
              </div>
              <div
                style={{ marginTop: "20px" }}
                className="text-white"
                dangerouslySetInnerHTML={{
                  __html: feedback.feedback,
                }}
              />
            </CardBody>
          </Card>
        ))}

      {isWaitingForDraft && !draft && (
        <Card style={{ backgroundColor: "#131313", color: "white", textAlign: "center", padding: "40px" }}>
          <CardBody>
            <div style={{ fontSize: "1.2em", marginBottom: "20px" }}>
              <i className="bi bi-hourglass-split" style={{ marginRight: "10px" }}></i>
              Generating your report...
            </div>
            <div style={{ color: "#888" }}>
              This may take a moment. Please wait.
            </div>
          </CardBody>
        </Card>
      )}

      {!showLoadingImage && (
        <div>
          {draft && (
            <Card style={{ backgroundColor: "black", color: "white" }}>
              <CardBody style={{ backgroundColor: "black", color: "white" }}>
                <i className="bi bi-body-text"> Current Draft </i>
                <div
                  style={{ marginTop: "20px" }}
                  className="text-white"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(draft),
                  }}
                />
              </CardBody>
            </Card>
          )}

          {draft && draft.endsWith(" ".repeat(3)) && (
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
                      textAlign: "left",
                      paddingTop: "8px",
                    }}
                  >
                    <Button
                      color="primary"
                      style={{
                        border: "1px solid yellow",
                      }}
                      disabled={
                        !draft.endsWith(" ".repeat(3)) || !feedbackInput
                      }
                      onClick={(e) => handleQuickDraftClick(e)}
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                      &nbsp;Retry
                    </Button>
                  </div>
                </FormGroup>
              </Form>
              <div style={{ textAlign: "center" }}>
                <Button
                  color="primary"
                  style={{ border: "3px solid green", fontSize: "2em" }}
                  disabled={
                    isSubmitting ||
                    hasSubmitted ||
                    !draft.endsWith(" ".repeat(3))
                  }
                  onClick={(e) => handleAcceptReport(e)}
                >
                  <i className="bi bi-floppy"></i> Save Folder
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      {/* {showLoadingImage && (
        <div style={{ textAlign: "center", width: "100%" }}>
          <img style={{ width: "100%", height: "auto" }} src="/library.png" />
        </div>
      )} */}
    </div>
  );
};

export default CreateMission;
