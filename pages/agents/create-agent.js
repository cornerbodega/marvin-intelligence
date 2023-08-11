import { useEffect, useRef } from "react";
import { debounce } from "lodash";
// other imports
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import IntelliCardGroup from "../../components/IntelliCardGroup";
import IntelliCardGroupRow from "../../components/IntelliCardGroupRow";
import { getSupabase } from "../../utils/supabase";
import RevealAnimations from "../../components/RevealAnimations";
import IntelliFab from "../../components/IntelliFab";
import { useUser } from "@auth0/nextjs-auth0/client";
// rest of component
import React, { useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const randomAnimalNames = ["Tiger", "Elephant", "Hawk", "Frog"];
  // const randomAnimalName =
  //   randomAnimalNames[Math.floor(Math.random() * randomAnimalNames.length)];

  // const [animalName, setAnimalName] = useState(randomAnimalName);
  const [expertise1, setExpertise1] = useState("");
  const [expertise2, setExpertise2] = useState("");
  const [expertise3, setExpertise3] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!expertise1) {
      alert("At least one area of expertise must be provided.");
      return;
    }

    const agentData = {
      expertises: [expertise1, expertise2, expertise3],
      userId: user.sub,
      existingAgentNames,
    };

    // Send the data to your API endpoint
    const res = await fetch("/api/agents/create-agent-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agentData),
    });
    setIsSubmitting(false);

    if (res.status === 200) {
      // alert("Agent created successfully!");

      console.log("Agent created successfully!");
    } else {
      alert("An error occurred while creating the agent. Please try again.");
    }
  };
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

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
      <Toast className="p-3 bg-primary my-2">
        {/* <ToastBody>Agent creation in progress...</ToastBody> */}

        <ToastBody style={{ textDecoration: "underline" }}>
          <Link href="#">View Agent Otter</Link>
        </ToastBody>
      </Toast>
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <Form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "40px" }}>
                <h3>New Agent Registration</h3>
              </div>
              <FormGroup>
                <Row>
                  <Label for="expertise1" md={4}>
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
                      placeholder="Enter expertise"
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Label for="expertise2" md={4}>
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
              <FormGroup>
                <Row>
                  <Label for="expertise3" md={4}>
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

              <div style={{ marginBottom: "40px" }}></div>
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
const CreateAgent = () => {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/agents/view-agents">Agents</Link>
        </BreadcrumbItem>
        <BreadcrumbItem className="text-white" active>
          Add Agent
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateAgentForm />
    </>
  );
};

export default CreateAgent;
