import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardGroup,
  Button,
  Row,
  Col,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import AgentDetailMissionsTable from "../../../../src/components/dashboard/AgentDetailMissionsTable";
import TopCards from "../../../../src/components/dashboard/TopCards";
import Link from "next/link";
// import AgentsTable from "../../../../src/components/dashboard/AgentsTable";

import Image from "next/image";

import { useRouter } from "next/router";
import IntelliContext from "../../../../components/intelliContext/IntelliContext";
import { useContext } from "react";
import { object } from "prop-types";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getSupabase } from "../../../../utils/supabase";
import IntelliFab from "../../../../components/IntelliFab";
import IntelliCardGroupRow from "../../../../components/IntelliCardGroupRow";

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const agentId = context.params.agentId;
    const supabase = getSupabase();
    console.log("agentId");
    console.log(agentId);
    // MOVE THIS TO Context Provider
    let { data: agent, error } = await supabase
      .from("agents")
      .select(
        "agentId, expertise1, expertise2, expertise3, agentName, profilePicUrl, bio, specializedTraining"
      )
      .eq("agentId", agentId);
    if (error) {
      console.log(error);
    }

    return {
      props: { agent: agent[0] || {} },
    };
  },
});

const AgentDetail = ({ agent }) => {
  console.log("agent");
  console.log(agent);
  const router = useRouter();
  const {
    query: { agentName },
  } = router;
  // const agent = {};
  // const { setSelectedAgentByName, selectedAgent } = useContext(IntelliContext);
  // let agent = selectedAgent;
  // console.log("agent");
  // console.log(agent);
  // if (Object.keys(agent).length === 0) {
  //   setSelectedAgentByName(agentName);
  //   console.log("GET AGENT DETAIL FROM DB!");
  // }
  function handleFabClick(e) {
    router.push(`/missions/create-mission/${agent.agentId}`);
  }
  return (
    <div>
      <Card style={{ backgroundColor: "black" }}>
        <CardBody>
          <Breadcrumb>
            <BreadcrumbItem>
              <i className={`bi bi-file-earmark-person-fill`}></i>
              &nbsp;
              <Link href="/agents/view-agents">Agents</Link>
            </BreadcrumbItem>
            <BreadcrumbItem className="text-white" active>
              Agent {agentName}
            </BreadcrumbItem>
          </Breadcrumb>
          <Row>
            <Col>
              <div>{/* <h1>Agent {agentName}</h1> */}</div>

              <div>
                <img
                  // src={`/default-agents/${agentName}.png`}
                  src={`${agent.profilePicUrl}`}
                  style={{
                    // width: "40%",
                    height: "337px",
                    objectFit: "cover",
                    objectPosition: "-80% 1",
                  }}
                  alt="agent"
                />
              </div>
              <div style={{ marginTop: "8px" }}>
                <Button
                  style={{ border: "1px solid white" }}
                  onClick={handleFabClick}
                >
                  <i className="bi bi-body-text"></i>+ Create Mission
                </Button>
              </div>
              <h3 className="text-white">Bio</h3>
              <Card className="text-primary">
                <CardBody>{agent.bio}</CardBody>
              </Card>

              <h3 className="text-white">Expertise</h3>
              <Card>
                {/* <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              Badges with Contextual variations
            </CardTitle> */}
                <CardBody className="">
                  <div>
                    {/* <Badge color="primary">Primary</Badge>
                <Badge color="secondary" className="ms-3">
                  Secondary
                </Badge>
                <Badge color="success" className="ms-3">
                  Success
                </Badge>
                <Badge color="danger" className="ms-3">
                  Danger
                </Badge>
                <Badge color="warning" className="ms-3">
                  Warning
                </Badge> */}
                    <Badge color="info" className="ms-3">
                      {agent.expertise1}
                    </Badge>
                    <Badge color="info" className="ms-3">
                      {agent.expertise2}
                    </Badge>
                    <Badge color="info" className="ms-3">
                      {agent.expertise3}
                    </Badge>

                    {/* <Badge color="light" className="ms-3">
                  Light
                </Badge>
                <Badge color="dark" className="ms-3">
                  Dark
                </Badge> */}
                  </div>
                </CardBody>
              </Card>
              {agent.specializedTraining && (
                <>
                  <h3 className="text-white">Specialized Training</h3>
                  <Card>
                    <CardBody className="text-primary">
                      {agent.specializedTraining}
                    </CardBody>
                  </Card>
                </>
              )}
              <h3 className="text-white">Stats</h3>
              <Row>
                <Col sm="6" lg="3">
                  <TopCards
                    bg="bg-light-success text-success"
                    title="Profit"
                    subtitle="Missions Completed"
                    earning="21"
                    icon="bi bi-wallet"
                  />
                </Col>
                <Col sm="6" lg="3">
                  <TopCards
                    bg="bg-light-danger text-danger"
                    title="Insights Generated"
                    subtitle="Insights Generated"
                    earning="1"
                    icon="bi bi-coin"
                  />
                </Col>
                {/* <Col sm="6" lg="3">
              <TopCards
                bg="bg-light-warning text-warning"
                title="New Project"
                subtitle="Yearly Project"
                earning="456"
                icon="bi bi-basket3"
              />
            </Col> */}
                <Col sm="6" lg="3">
                  <TopCards
                    bg="bg-light-info text-into"
                    title="Status"
                    subtitle="IntelNet Followers"
                    earning="14"
                    icon="bi bi-bag"
                  />
                </Col>
              </Row>

              <h3 className="text-white">Missions</h3>
              {/* <IntelliCardGroupRow /> */}
              {/* <AgentDetailMissionsTable /> */}
              <h3 className="text-white">Insights</h3>
              <Row>
                <h5 className="mb-3 mt-3">Colored Card</h5>
                <Col md="6" lg="3">
                  <Card body color="primary" inverse>
                    <CardTitle tag="h5">Special Title Treatment</CardTitle>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
                    <div>
                      <Button style={{ border: "1px solid white" }}>
                        Button
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col md="6" lg="3">
                  <Card body color="info" inverse>
                    <CardTitle tag="h5">Special Title Treatment</CardTitle>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
                    <div>
                      <Button>Button</Button>
                    </div>
                  </Card>
                </Col>
                <Col md="6" lg="3">
                  <Card body color="success" inverse>
                    <CardTitle tag="h5">Special Title Treatment</CardTitle>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
                    <div>
                      <Button>Button</Button>
                    </div>
                  </Card>
                </Col>
                <Col md="6" lg="3">
                  <Card body color="danger" inverse>
                    <CardTitle tag="h5">Special Title Treatment</CardTitle>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
                    <div>
                      <Button>Button</Button>
                    </div>
                  </Card>
                </Col>
              </Row>
              <h3>Actions</h3>
              <Card>
                {/* <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              Block Buttons
            </CardTitle> */}
                <CardBody className="">
                  <div className="button-group">
                    <Button className="btn" color="primary" size="lg" block>
                      Dispatch On Mission
                    </Button>
                    <Button className="btn" color="primary" size="lg" block>
                      Adjust Training
                    </Button>
                    <Button className="btn" color="primary" size="lg" block>
                      Decomission Agent
                    </Button>
                    <Button className="btn" color="primary" size="lg" block>
                      Compile Detailed Report
                    </Button>
                    {/* <Button
                  className="btn"
                  color="secondary"
                  size="lg"
                  block
                ></Button> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <IntelliFab onClick={handleFabClick} icon="+" />
        </CardBody>
      </Card>
    </div>
  );
};

export default AgentDetail;
