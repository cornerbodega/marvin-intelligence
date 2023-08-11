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
import { remark } from "remark";
import html from "remark-html";

import Link from "next/link";

import Image from "next/image";

import { useRouter } from "next/router";
import { useContext } from "react";
import { object } from "prop-types";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import IntelliFab from "../../../components/IntelliFab";
import { getSupabase } from "../../../utils/supabase";
import { useState } from "react";
import { set } from "lodash";
// import missingsBriefingHandler from "../../api/missions/generate-briefing-suggestions-endpoint";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const agentId = context.params.agentId;
    const supabase = getSupabase();
    console.log("agentId");
    console.log(agentId);
    let { data: agents, error } = await supabase
      .from("agents")
      .select(
        "agentId, expertise1, expertise2, expertise3, agentName, profilePicUrl, bio"
      )
      .eq("agentId", agentId);
    if (error) {
      console.log(error);
    }
    const agent = agents[0];
    const expertises = [agent.expertise1, agent.expertise2, agent.expertise3];
    // const { req, res } = context;
    // const data = handler(req, res);
    let expertiseString = expertises[0];

    if (expertises.length > 1) {
      expertiseString += " and " + expertises[1];
    }
    if (expertises.length > 2) {
      expertiseString += " and " + expertises[2];
    }
    console.log(expertiseString);
    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at generating an interesting research questions for given areas of study.",
        },
        {
          role: "user",
          content: `Generate AI, Machine Learning, and Natural Language Processing. Return only the results in the following JSON format: {suggestion}`,
        },
        {
          role: "assistant",
          content: `{
                "suggestion": "I need a comprehensive report on the applications of Natural Language Processing in the modern digital landscape."
            }`,
        },
        {
          role: "user",
          content: `What is an interesting research question for ${expertiseString}?`,
        },
      ],
    });
    let briefingSuggestion = "";
    const suggestionResponseContent =
      chat_completion.data.choices[0].message.content;
    if (suggestionResponseContent) {
      console.log("suggestionResponseContent");
      console.log(suggestionResponseContent);
      console.log("typeof suggestionResponseContent");
      console.log(typeof suggestionResponseContent);
      if (typeof suggestionResponseContent === "object") {
        briefingSuggestion = suggestionResponseContent.suggestion;
      } else if (
        typeof suggestionResponseContent === "string" &&
        suggestionResponseContent.includes(`"suggestion":`)
      ) {
        const parsedSuggestionContent = JSON.parse(suggestionResponseContent);
        if (parsedSuggestionContent) {
          briefingSuggestion = parsedSuggestionContent.suggestion;
        }
      } else if (typeof suggestionResponseContent === "string") {
        briefingSuggestion = suggestionResponseContent;
      }

      // briefingSuggestion = suggestionResponseContent.split("suggestion:")[1];
    } // Process a POST request
    // const suggestionResponse = missingsBriefingHandler(req, res);
    console.log("suggestionResponseContent");
    console.log(suggestionResponseContent);

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
      props: { agent: agent || {}, briefingSuggestion },
    };
  },
});

const CreateMission = ({ agent, briefingSuggestion }) => {
  // console.log("agent");
  // console.log(agent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [briefing, setBriefing] = useState();
  const [draft, setDraft] = useState();
  async function handleWriteDraftReport(e) {
    console.log("create mission handleSubmit");
    // console.log(handleSubmit);
    e.preventDefault();
    setIsSubmitting(true);
    const expertises = [agent.expertise1, agent.expertise2, agent.expertise3];

    const draftData = { briefing, expertises };
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
    setIsSubmitting(false);
    // write a report!
    // this will be a draft report
    // it will be saved in the database as the only draft for this mission, and will be overwritten each time the user saves a new draft
    // Once the user approves the mission, the draft will be saved as the final report
  }

  //   const agentName = agent.agentName;
  // const { setSelectedAgentByName, selectedAgent } = useContext(IntelliContext);
  // let agent = selectedAgent;
  // console.log("agent");
  // console.log(agent);
  // if (Object.keys(agent).length === 0) {
  //   setSelectedAgentByName(agentName);
  //   console.log("GET AGENT DETAIL FROM DB!");
  // }
  function handleFabClick(e) {
    router.push("/missions/create-mission");
  }
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/agents/view-agents">Missions</Link>
        </BreadcrumbItem>

        <BreadcrumbItem className="text-white" active>
          Create Mission
        </BreadcrumbItem>
      </Breadcrumb>

      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <Form onSubmit={handleWriteDraftReport}>
            <div style={{ marginBottom: "40px" }}>
              <Card>
                <CardTitle
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <h3 className="text-primary">Agent {agent.agentName}</h3>
                </CardTitle>
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

                  <CardSubtitle
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "20px",
                      justifyContent: "center",
                    }}
                    className="mb-2 text-muted"
                    tag="h6"
                  >
                    <Badge color="info" className="ms-3">
                      {agent.expertise1}
                    </Badge>
                    <Badge color="info" className="ms-3">
                      {agent.expertise2}
                    </Badge>
                    <Badge color="info" className="ms-3">
                      {agent.expertise3}
                    </Badge>
                  </CardSubtitle>
                </CardBody>
              </Card>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h3>Create Mission</h3>
            </div>
            <FormGroup>
              <Label for="exampleText" className="text-white">
                Briefing
              </Label>
              <Input
                id="exampleText"
                placeholder={briefingSuggestion}
                name="text"
                rows="10"
                type="textarea"
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
              />
            </FormGroup>
            {/* <FormGroup>
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
                    value={agent.expertise1}
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
                    value={agent.expertise2}
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
                    value={agent.expertise3}
                    onChange={(e) => setExpertise3(e.target.value)}
                    type="text"
                    name="expertise3"
                    id="expertise3"
                    placeholder="Optional"
                  />
                </Col>
              </Row>
            </FormGroup> */}

            <div style={{ marginBottom: "40px" }}></div>
            <div style={{ textAlign: "right" }}>
              <Button color="primary" disabled={isSubmitting}>
                Create Draft
              </Button>{" "}
            </div>
          </Form>
          <h3>Draft</h3>
          <div dangerouslySetInnerHTML={{ __html: draft }} />
          {/* {draft} */}
          {/* {JSON.stringify(draft)} */}
          {/* {draft && <h3 className="text-white">{draft}</h3>} */}
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <h3>Briefing</h3>
          <textarea />
          <h3>Draft Report</h3>
          <textarea />
          <h3>Feedback</h3>
          <textarea />
          <div>
            <button>Revise Draft</button>
          </div>
          <h3>Actions</h3>
          <div>
            <button>Approve</button>
          </div>
        </Col>
      </Row> */}
      {/* <IntelliFab onClick={handleFabClick} icon="+" /> */}
    </div>
  );
};

export default CreateMission;
