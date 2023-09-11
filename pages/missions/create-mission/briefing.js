import { withPageAuthRequired } from "@auth0/nextjs-auth0";
// import toast, { Toaster } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";

// import { getSupabase } from "../../../utils/supabase";
import { getSupabase } from "../../../utils/supabase";
// import { getSupabase } from "../../utils/supabase";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
// rest of component
import { slugify } from "../../../utils/slugify";
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
import { getSession } from "@auth0/nextjs-auth0";
import { set } from "lodash";
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const supabase = getSupabase();
    const session = await getSession(context.req, context.res);
    const user = session?.user;

    let { data: agents, error } = await supabase
      .from("agents")
      .select("agentName")
      .eq("userId", user.sub);
    const existingAgentNames = agents.map((agent) => agent.agentName);
    console.log("existingAgentNames");
    console.log(existingAgentNames);
    // other pages will redirect here if they're empty
    // If no agency, go to create agency page
    // If no agents, go to crete agent page
    // let agency;
    return {
      props: { existingAgentNames },
    };
  },
});
export const CreateAgentForm = ({ existingAgentNames }) => {
  const router = useRouter();
  console.log("existingAgentNames");
  console.log(existingAgentNames);
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const randomAnimalNames = ["Tiger", "Elephant", "Hawk", "Frog"];
  // const randomAnimalName =
  //   randomAnimalNames[Math.floor(Math.random() * randomAnimalNames.length)];

  // const [animalName, setAnimalName] = useState(randomAnimalName);
  const [specializedTraining, setSpecializedTraining] = useState("");
  const [showSpecializedTrainingInput, setShowSpecializedTrainingInput] =
    useState(false);

  const specializedTrainingExample = `Got some specialized info or a list of unique details for your agent? Paste them here as a CSV or just jot them down one by one.`;
  const [expertiseInput, setExpertiseInput] = useState(
    "Help me design a marketing strategy to boost the online presence of a new organic skincare brand. Please include a competitive analysis and recommended social media platforms"
  );
  // const [expertise1, setExpertise1] = useState("");
  const [expertise2, setExpertise2] = useState("");
  const [expertise3, setExpertise3] = useState("");
  useEffect(() => {
    let index = 0; // Move index outside of the setInterval
    if (notificationMessages.length === 0) return;
    const intervalId = setInterval(() => {
      // Store the interval ID
      if (index < notificationMessages.length) {
        const notificationMessage = notificationMessages[index];
        toast.success(notificationMessage);
        const newNotificationMessages = [...notificationMessages];
        newNotificationMessages.splice(index, 1);
        setNotificationMessages(newNotificationMessages);
        index++;
      } else {
        clearInterval(intervalId); // Clear the interval properly
      }
    }, 2000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [notificationMessages]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!expertiseInput) {
      alert("At least one area of expertise must be provided.");
      return;
    }
    const agentData = {
      expertiseInput,
      userId: user.sub,
      existingAgentNames,
      specializedTraining,
    };
    // before actually creating the agent
    // ask the api for a list of comical, world-building updates
    //   that incorporate the animal and the briefing
    const notificationMessagesResponse = await fetch(
      "/api/agents/create-agent-notification-endpoint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      }
    );
    const notificationMessagesJson = await notificationMessagesResponse.json();
    setNotificationMessages(notificationMessagesJson);
    console.log("notificationMessages fetch");
    console.log(notificationMessages);
    // Send the data to your API endpoint

    const res = await fetch("/api/agents/create-agent-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agentData),
    }).catch((error) => {
      console.log("error creating agent");
      console.log(error);
    });
    const createdAgent = await res.json();
    console.log("createdAgent");
    console.log(createdAgent);
    const agentId = createdAgent.agentId;
    // router.push(`/missions/create-mission/agents/${agentId}`);
    router.push({
      pathname: "/missions/create-mission/dispatch",
      query: { ...router.query, agentId: agentId, briefing: expertiseInput },
    });
    setIsSubmitting(false);

    // if (res.status === 200) {
    //   // alert("Agent created successfully!");

    //   console.log("Agent created successfully!");
    // } else {
    //   alert("An error occurred while creating the agent. Please try again.");
    // }
  };
  const { user, error, isLoading } = useUser();

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
                <h3>Create a New Mission</h3>
              </div>
              <FormGroup>
                <Row>
                  <FormGroup>
                    <Label className="text-white">Briefing</Label>
                    <Label className="text-white">
                      What would you like to know? Briefly describe the research
                      task and any guidelines here. The clearer the mission, the
                      better the results.
                    </Label>
                    <div
                      onClick={(e) => {
                        setExpertiseInput("");
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
                      autoFocus
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      //   placeholder={`"`}
                      name="text"
                      rows="5"
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
                            Specialized Training (optional)
                          </Label>
                          <Label className="text-white">
                            Provide any additional information you'd like your
                            agent to possess. This section helps in fine-tuning
                            your agent's capabilities
                          </Label>
                          <Input
                            id="exampleText"
                            placeholder={specializedTrainingExample}
                            name="text"
                            rows="5"
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

              <div style={{ marginBottom: "40px" }}></div>
              <div style={{ textAlign: "right" }}>
                <Button
                  color="primary"
                  disabled={isSubmitting || !expertiseInput}
                >
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
const CreateAgent = ({ existingAgentNames }) => {
  const [parentReportTitle, setParentReportTitle] = useState("");
  const [parentReportId, setParentReportId] = useState("");
  const [parentReportSlug, setParentReportSlug] = useState("");
  const router = useRouter();

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
        <BreadcrumbItem className="text-white">
          <i className={`bi bi-body-text`}></i>
          &nbsp;
          <Link
            href="/missions/view-missions"
            style={{
              fontWeight: "200",
              textDecoration: "none",
              color: "white",
            }}
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
        <BreadcrumbItem className="text-white">
          {" "}
          <i className={`bi-body-text`}></i>
          <div style={{ fontWeight: "800" }}>+ Create Mission</div>
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateAgentForm existingAgentNames={existingAgentNames} />
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
