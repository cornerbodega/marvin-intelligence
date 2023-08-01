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
import AgentDetailMissionsTable from "../../../src/components/dashboard/AgentDetailMissionsTable";
// import TopCards from "../src/components/dashboard/TopCards";
import TopCards from "../../../src/components/dashboard/TopCards";
import Link from "next/link";
import AgentsTable from "../../../src/components/dashboard/AgentsTable";
// import Blog from "../../../src/components/dashboard/Blog";
// import bg1 from "../../src/assets/images/bg/bg1.jpg";
// import bg1 from "../../../public/default-agents/otter.png";
// import bg2 from "../../../src/assets/images/bg/bg2.jpg";
// import bg3 from "../../../src/assets/images/bg/bg3.jpg";
// import bg4 from "../../../src/assets/images/bg/bg4.jpg";
import Image from "next/image";
// import user1 from "../../../public/default-agents/pangolin.png";
// import user2 from "../../../public/default-agents/quokka.png";
// import user3 from "../../../public/default-agents/axolotl.png";
// import user4 from "../../../public/default-agents/red panda.png";
// import user5 from "../../../public/default-agents/pika.png";

// import AgentsTable from "../../../src/components/dashboard/AgentsTable";
import { useRouter } from "next/router";

const ViewAgents = () => {
  const router = useRouter();
  const {
    query: { missionName },
  } = router;
  const reportName = `"Smart Haven Unleashed: The Transformational Journey" [7 📝]`;

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/mission/view-missions">Missions</Link>
        </BreadcrumbItem>

        <BreadcrumbItem active>{missionName}</BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Col>
          <div>
            <h1>{missionName}</h1>
          </div>
          <h3>Mission Overview</h3>
          <Card className="text-primary">
            <CardText>
              <CardBody>
                Operation Smart Haven aims to transform the client's residence
                into a cutting-edge, secure, and efficient smart home. Agent
                Pangolin, with expertise in Home Automation, Elderly Care, and
                Gardening, will design and implement a seamless ecosystem of
                interconnected devices. The mission involves selecting the best
                home automation systems, integrating smart devices for improved
                convenience, ensuring utmost security measures, and crafting a
                nurturing environment for the elderly. Through careful planning
                and execution, the mission strives to create an optimized and
                harmonious living space for the client's comfort and peace of
                mind.
              </CardBody>
            </CardText>
          </Card>
          <h3>Mission Brief</h3>
          <Card className="text-primary">
            <CardText>
              <CardBody>
                <i>
                  "Agent Pangolin, I'm planning to set up a smart home with
                  automation features, but I'm overwhelmed by all the options.
                  Can you recommend the best home automation systems and devices
                  to ensure efficiency and security?"
                </i>
                <p></p> Agent Pangolin has been assigned to conduct Operation
                Smart Haven, a mission aimed at transforming the client's home
                into an efficient and secure smart living space. The objective
                is to implement cutting-edge Home Automation systems, enhance
                Elderly Care features, and create a thriving garden environment.
                The agent will carefully select and integrate smart devices,
                ensuring seamless connectivity and user-friendliness. Security
                measures will be prioritized to protect the client's privacy and
                property. By combining expertise in Home Automation, Elderly
                Care, and Gardening, Agent Pangolin aims to craft a personalized
                and nurturing haven for the client's ultimate comfort and
                well-being.
              </CardBody>
            </CardText>
          </Card>
          <h3>Report</h3>
          <Card className="text-primary">
            <CardText>
              <CardBody>
                Agent Pangolin successfully executed Operation Smart Haven, a
                mission focused on transforming the client's home into a smart
                and secure living space. The agent utilized expertise in Home
                Automation, Elderly Care, and Gardening to select and integrate
                cutting-edge smart devices, optimizing the client's living
                experience. Emphasis was placed on ensuring seamless
                connectivity, user-friendliness, and enhanced security. The
                mission also involved creating a nurturing garden environment
                for the client's enjoyment. With careful planning and execution,
                Agent Pangolin delivered a personalized and efficient haven,
                providing the client with utmost comfort and peace of mind.
                <p></p>
                <CardBody className="">
                  <div className="button-group">
                    <Link href={`/reports/detail/${reportName}`}>
                      <Button className="btn" color="primary" size="lg">
                        {reportName}
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </CardBody>
            </CardText>
          </Card>

          {/*           
          <h3>Missions</h3>
          <AgentDetailMissionsTable />
          <h3>Insights</h3>
          <Row>
            <h5 className="mb-3 mt-3">Colored Card</h5>
            <Col md="6" lg="3">
              <Card body color="primary" inverse>
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="info" inverse>
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
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
                  With supporting text below as a natural lead-in to additional
                  content.
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
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="light-warning">
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="light-info">
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="light-success">
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="light-danger">
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
          </Row> */}
          <h3>Actions</h3>
          <Card>
            {/* <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              Block Buttons
            </CardTitle> */}
            <CardBody className="">
              <div className="button-group">
                <Button className="btn" color="primary" size="lg" block>
                  Mission Replay
                </Button>
                {/* <Button className="btn" color="primary" size="lg" block>
                  Rate 
                </Button>
                <Button className="btn" color="primary" size="lg" block>
                  Decomission Agent
                </Button>
                <Button className="btn" color="primary" size="lg" block>
                  Compile Detailed Report{" "}
                </Button> */}
                {/* <Button
                  className="btn"
                  color="secondary"
                  size="lg"
                  block
                ></Button> */}
              </div>
            </CardBody>
          </Card>
          <h3>Related Missions</h3>
          <Row>
            <Col md="6" lg="3">
              <Card body color="primary" inverse>
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="info" inverse>
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
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
                  With supporting text below as a natural lead-in to additional
                  content.
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
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="light-warning">
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="light-info">
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="light-success">
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
            <Col md="6" lg="3">
              <Card body color="light-danger">
                <CardTitle tag="h5">Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <div>
                  <Button>Button</Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ViewAgents;
