// import toast, { Toaster } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../../utils/firebase";
// import { getSupabase } from "../../../utils/supabase";
// import { getSupabase } from "../../../utils/supabase";
import { getSupabase } from "../../utils/supabase";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
// rest of component
// import { setupFirebaseListener } from "../../utils/firebaseListener";
import { slugify } from "../../utils/slugify";
import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Row,
  Toast,
  ToastBody,
} from "reactstrap";

import Link from "next/link";

import { saveToFirebase } from "../../utils/saveToFirebase";
import Router from "next/router";
import saveTask from "../../utils/saveTask";
import { useFirebaseListener } from "../../utils/useFirebaseListener";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
export function goToAgentProfile({ agentId }) {
  console.log("goToAgentProfile");
  console.log(agentId);
  // const router = useRouter();
  Router.push({
    pathname: "/agents/detail/draft-report",
    query: { ...Router.query, agentId: agentId },
  });
}
const supabase = getSupabase();
export const CreateAgentForm = ({ userId }) => {
  const router = useRouter();
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [specializedTraining, setSpecializedTraining] = useState("");
  const [showSpecializedTrainingInput, setShowSpecializedTrainingInput] =
    useState(false);

  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);

  //
  useEffect(() => {
    if (taskId) {
      const taskRef = db.ref(
        `/${
          process.env.VERCEL_ENV === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${process.env.NEXT_PUBLIC_serverUid}/${userId}/taskType/${taskId}`
      );

      taskRef.on("value", (snapshot) => {
        const taskData = snapshot.val();
        setTaskStatus(taskData.status);
        console.log("client addAgent taskData");
        console.log(taskData);

        if (taskData.status === "complete") {
          console.log("client addAgent completed taskData.context");
          console.log(taskData.context);
          // Query Supabase to fetch the updated data when the task is completed
          console.log(taskData.context.folderId);
          // querySupabase();
        }
      });

      return () => taskRef.off(); // Cleanup the listener on component unmount
    }
  }, [taskId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const newTask = {
        type: "addAgent",
        taskId,
        status: "queued",
        userId: user.sub,
        context: {
          expertiseInput,
          userId: userId,
          // generation: 0,
          // totalGenerations: 1,
        },
        createdAt: new Date().toISOString(),
      };

      const newTaskRef = await saveTask(newTask);
      // const newTaskRef = await saveToFirebase(
      //   `/${process.env.VERCEL_ENV === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${userId}/addAgent`,
      //   newTask
      // );

      if (newTaskRef) {
        setTaskId(newTaskRef.key); // Store the task ID to set up the listener
      } else {
        console.error("Failed to queue the task.");
      }
    } catch (error) {
      console.error("Error queuing the task:", error.message);
    } finally {
      // setIsSubmitting(false);
    }
  };
  const querySupabase = async () => {
    try {
      const { data, error } = await supabaseClient.from("agents").select("*");
      // .eq("taskId", taskId);
      if (error) {
        throw error;
      }
      console.log("Data retrieved from Supabase:", data);
    } catch (error) {
      console.error("Error querying Supabase:", error.message);
    }
  };
  const specializedTrainingExample =
    "You love the McRib. You always mention the McRib in each of your replies, to a comical degree.";
  const [expertiseInput, setExpertiseInput] = useState("");

  // const oldHandleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   if (!expertiseInput) {
  //     alert("At least one area of expertise must be provided.");
  //     return;
  //   }
  //   const agentData = {
  //     expertiseInput,
  //     userId: user.sub,
  //     specializedTraining,
  //   };

  //   // Send the data to your API endpoint
  //   // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  //   // This needs to be the result of receiving the firebase go-ahead to query supabase
  //   // And then the result of the supabase query
  //   // const savedAddAgentAsyncTask = await fetch(
  //   //   "/api/agents/add-agent-endpoint",
  //   //   {
  //   //     method: "POST",
  //   //     headers: {
  //   //       "Content-Type": "application/json",
  //   //     },
  //   //     body: JSON.stringify(agentData),
  //   //   }
  //   // ).catch((error) => {
  //   //   console.log("error creating agent");
  //   //   console.log(error);
  //   // });
  //   // // const createdAgent = await res.json();
  //   // console.log("savedAddAgentAsyncTask add-agent");
  //   // console.log(savedAddAgentAsyncTask);

  //   // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  //   // const agentId = createdAgent.agentId;
  //   // router.push({
  //   //   pathname: "/missions/create-mission/dispatch",
  //   //   query: { ...router.query, agentId: agentId },
  //   // });
  //   setIsSubmitting(false);

  //   // if (res.status === 200) {
  //   //   // alert("Agent created successfully!");

  //   //   console.log("Agent created successfully!");
  //   // } else {
  //   //   alert("An error occurred while creating the agent. Please try again.");
  //   // }
  // };
  const { user, error, isLoading } = useUser();

  // useEffect(() => {
  //   if (user) {
  //     setupFirebaseListener(user);
  //   }
  // }, [user]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  function getRandomExpertise() {
    const expertises = getExpertiseExamples();
    return expertises[Math.floor(Math.random() * expertises.length)];
  }
  // return (

  // );
  return (
    <>
      {/* <Toast message="Agent Otter has been successfully created!" /> */}
      {/* {user && (
        <div>
          
          <h2>{JSON.stringify(user)}</h2>
          <p>{user.email}</p>
        </div>
      )} */}
      <div style={{ marginBottom: "40px" }}></div>
      {/* <Toast className="p-3 bg-primary my-2"> */}
      {/* <ToastBody>Agent creation in progress...</ToastBody> */}

      {/* <ToastBody style={{ textDecoration: "underline" }}>
          <Link href="#">View Agent Otter</Link>
        </ToastBody> */}
      {/* </Toast> */}
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <Form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "40px" }}>
                <h3>New Agent Creation</h3>
              </div>
              <FormGroup>
                <Row>
                  <FormGroup>
                    <Label className="text-white">Expertise</Label>
                    <Label className="text-white">
                      List or describe the areas where you'd like your agent to
                      excel. You can specify up to three areas of expertise. Our
                      AI will process your input to extract standardized areas
                      of expertise
                    </Label>
                    <Input
                      autoFocus
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      placeholder={`${getRandomExpertise()}, ${getRandomExpertise()}, ${getRandomExpertise()}`}
                      name="text"
                      rows="10"
                      type="textarea"
                    />
                  </FormGroup>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div style={{ marginBottom: "10px" }}>
                    {!showSpecializedTrainingInput ? (
                      <Label
                        className="text-white"
                        style={{ textDecoration: "underline" }}
                        onClick={() =>
                          setShowSpecializedTrainingInput(
                            !showSpecializedTrainingInput
                          )
                        }
                      >
                        Add Specialized Training
                      </Label>
                    ) : (
                      <div>
                        <FormGroup>
                          <Label className="text-white">
                            Specialized Training
                          </Label>
                          <Label className="text-white">
                            Provide additional information or specific skills
                            you'd like your agent to possess. This section helps
                            in fine-tuning your agent's capabilities
                          </Label>
                          <Input
                            id="exampleText"
                            placeholder={specializedTrainingExample}
                            name="text"
                            rows="10"
                            type="textarea"
                            value={specializedTraining}
                            onChange={(e) =>
                              setSpecializedTraining(e.target.value)
                            }
                          />
                        </FormGroup>
                      </div>
                    )}
                  </div>
                </Row>
              </FormGroup>

              {/* <FormGroup>
                <Row>
                  <Label className="text-white" for="expertise1" md={4}>
                    Expertise
                  </Label>
                  <Col md={8}>
                    <Input
                      autoFocus
                      type="text"
                      name="expertise1"
                      id="expertise1"
                      value={expertise1}
                      onChange={(e) => setExpertise1(e.target.value)}
                      placeholder={getRandomExpertise()}
                    />
                  </Col>
                </Row>
              </FormGroup>
              {expertise1 ? (
                <FormGroup>
                  <Row>
                    <Label className="text-white" for="expertise2" md={4}>
                      Expertise 2
                    </Label>
                    <Col md={8}>
                      <Input
                        type="text"
                        name="expertise2"
                        id="expertise2"
                        value={expertise2}
                        onChange={(e) => setExpertise2(e.target.value)}
                        placeholder="Optional"
                      />
                    </Col>
                  </Row>
                </FormGroup>
              ) : null}
              {expertise2 ? (
                <FormGroup>
                  <Row>
                    <Label className="text-white" for="expertise3" md={4}>
                      Expertise 3
                    </Label>
                    <Col md={8}>
                      <Input
                        value={expertise3}
                        onChange={(e) => setExpertise3(e.target.value)}
                        type="text"
                        name="expertise3"
                        id="expertise3"
                        placeholder="Optional"
                      />
                    </Col>
                  </Row>
                </FormGroup>
              ) : null}
              <div style={{ marginBottom: "10px" }}>
                {!showSpecializedTrainingInput ? (
                  <a
                    className="text-white"
                    style={{ textDecoration: "underline" }}
                    onClick={() =>
                      setShowSpecializedTrainingInput(
                        !showSpecializedTrainingInput
                      )
                    }
                  >
                    Add Specialized Training
                  </a>
                ) : (
                  <div>
                    <FormGroup>
                      <Label className="text-white">Specialized Training</Label>
                      <Input
                        id="exampleText"
                        placeholder={specializedTrainingExample}
                        name="text"
                        rows="10"
                        type="textarea"
                        value={specializedTraining}
                        onChange={(e) => setSpecializedTraining(e.target.value)}
                      />
                    </FormGroup>
                  </div>
                )}
              </div> */}

              <div style={{ marginBottom: "20px" }}></div>
              <div style={{ textAlign: "right" }}>
                <Button color="primary" disabled={isSubmitting}>
                  Create
                </Button>{" "}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const session = await getSession(context.req, context.res);
    // const user = ;
    const userId = session?.user.sub;
    let { data: agency, agencyError } = await supabase
      .from("users")
      .select("agencyName")
      .eq("userId", userId);
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
    return {
      props: { userId },
    };
  },
});
const CreateAgent = ({ userId }) => {
  const [parentReportTitle, setParentReportTitle] = useState("");
  const [parentReportId, setParentReportId] = useState("");
  const [parentReportSlug, setParentReportSlug] = useState("");
  const router = useRouter();
  // const user = useUser();
  const firebaseSaveData = useFirebaseListener(
    `/${
      process.env.VERCEL_ENV === "production" ? "asyncTasks" : "localAsyncTasks"
    }/${process.env.NEXT_PUBLIC_serverUid}/${userId}/addAgent/context/`
  );

  useEffect(() => {
    if (firebaseSaveData) {
      console.log("firebase save data");
      console.log(firebaseSaveData);
      if (firebaseSaveData.agentId) {
        clearPreviousAgent();
        const agentId = firebaseSaveData.agentId;
        async function clearPreviousAgent() {
          const clearWriteDraftReportTask = {
            type: "addAgent",
            status: "cleared",
            userId,
            context: {},
            createdAt: new Date().toISOString(),
          };
          try {
            await saveTask(clearWriteDraftReportTask);
          } catch (error) {
            console.log(error);
          }
        }
        goToAgentProfile({ agentId });
      }
    }
  }, [firebaseSaveData]); // Added folderId as a dependency

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

  function notify(message) {
    toast(message);
  }

  return (
    <>
      {" "}
      {/* <button onClick={notify}>Make me a toast</button> */}
      <Toaster position="bottom-center" />
      <Breadcrumb style={{ fontWeight: "200", fontFamily: "monospace" }}>
        {/* <BreadcrumbItem className="text-white">
          <i className={`bi bi-person-badge`}></i>
          &nbsp;
          <Link
            href="/agents/view-agents"
            style={{
              fontWeight: "200",
              textDecoration: "none",
              color: "white",
            }}
          >
            Agents
          </Link>
        </BreadcrumbItem> */}
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
        {/* <BreadcrumbItem style={{ fontWeight: "200" }} className="text-white">
          {" "}
          <i className={`bi-folder`}></i>+ Create Report
        </BreadcrumbItem> */}
        <BreadcrumbItem className="text-white" active>
          <Link
            href="/agents/view-agents"
            style={{
              fontWeight: "200",
              textDecoration: "none",
              color: "white",
            }}
          >
            <i className={`bi bi-person-badge`}></i>
            &nbsp;Select Agent
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem
          className="text-white"
          style={{ fontWeight: "800" }}
          active
        >
          <i className={`bi bi-person-badge`}></i>+ Add Agent
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateAgentForm userId={userId} />
    </>
  );
};

function getExpertiseExamples() {
  return [
    "Cooking",
    "Programming",
    "Scriptwriting",
    "Business Planning",
    "Research",
    "Education",
    "Health and Fitness",
    "Music",
    "Art",
    "Gaming",
    "Translation",
    "Mental Health",
    "Medicine",
    "Data Analysis",
    "Agriculture",
    "Manufacturing",
    "Marketing",
    "Sales",
    "Finance",
    "Human Resources",
    "Cybersecurity",
    "E-commerce",
    "Home Automation",
    "Elderly Care",
    "Environment",
    "Autonomous Vehicles",
    "Personal Assistants",
    "News and Publishing",
    "Weather Forecasting",
    "Robotics",
    "Legal",
    "Real Estate",
    "Travel",
    "Space Exploration",
    "Fashion",
    "Literature",
    "Comedy",
    "Sports",
    "Politics",
    "Urban Planning",
    "Event Planning",
    "Career Counseling",
    "Archaeology",
    "Linguistics",
    "Philosophy",
    "Cosmetology",
    "Genetics",
    "Photography",
    "Wildlife",
    "Construction",
    "Aviation",
    "Astrophysics",
    "Customer Service",
    "Journalism",
    "Ethical Decision Making",
    "Animation",
    "Shopping",
    "Podcasting",
    "Screenwriting",
    "Time Management",
    "Civil Engineering",
    "Film Editing",
    "Meteorology",
    "Graphic Design",
    "Content Moderation",
    "Handwriting Recognition",
    "Pet Care",
    "Social Media",
    "Landscape Design",
    "Architecture",
    "Brewing",
    "Gambling",
    "Acting",
    "Video Production",
    "Public Speaking",
    "Machine Learning",
    "Disaster Response",
    "Cardiology",
    "Astronomy",
    "Oceanography",
    "Fitness Training",
    "Neurology",
    "Homebrewing",
    "Quantum Computing",
    "Sculpture",
    "Video Games",
    "Fishing",
    "Sociology",
    "Psychology",
    "Transportation",
    "Gardening",
    "History",
    "Navigation",
    "Natural Language Processing",
    "Cryptography",
    "Nanotechnology",
    "Recycling",
    "Anthropology",
    "Botany",
    "Blockchain",
    "Geology",
    "Climatology",
    "Ceramics",
    "Carpentry",
    "Dentistry",
    "Pharmacy",
    "Neuroscience",
    "Culinary Arts",
    "Criminal Justice",
    "Forestry",
    "Geography",
    "Horticulture",
    "Immunology",
    "Law",
    "Meteorology",
    "Microbiology",
    "Mycology",
    "Nursing",
    "Optometry",
    "Paralegal",
    "Phlebotomy",
    "Physics",
    "Physiology",
    "Podiatry",
    "Political Science",
    "Psychiatry",
    "Radiology",
    "Robotics",
    "Sociology",
    "Statistics",
    "Zoology",
    "Veterinary",
    "Virology",
    "Volcanology",
    "Welding",
  ];
}
export default CreateAgent;

// what are 5 humorous steps searching for an animal that embodies the expertise of Soul Calibur 7, Combos, and Game Balance
