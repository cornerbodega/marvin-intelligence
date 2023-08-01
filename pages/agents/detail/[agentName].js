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
    query: { agentName },
  } = router;
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/agents/view-agents">Agents</Link>
        </BreadcrumbItem>

        <BreadcrumbItem active>{agentName}</BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Col>
          <div>
            <h1>{agentName}</h1>
          </div>
          <div>
            <img
              src={`/default-agents/${agentName}.png`}
              style={{
                //   width: "300px",
                height: "337px",
                objectFit: "cover",
                //   objectPosition: "-20% 0",
              }}
              alt="agent"
            />
          </div>
          <h3>Stats</h3>
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
                subtitle="Current Availability"
                earning="Available"
                icon="bi bi-bag"
              />
            </Col>
          </Row>
          <h3>Expertise</h3>
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
                  Home Automation
                </Badge>
                <Badge color="info" className="ms-3">
                  Elderly Care
                </Badge>
                <Badge color="info" className="ms-3">
                  Pet Care
                </Badge>
                <Badge color="info" className="ms-3">
                  Gardening
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
          <h3>Bio</h3>
          <Card className="text-primary">
            <CardBody>
              Meet Agent Pangolin, the master intelligence operative with
              remarkable skills in Home Automation, Elderly Care, and Gardening.
              Just like the adaptable and resourceful pangolin, this agent
              excels in optimizing and controlling environments with Home
              Automation. With a protective nature, Agent Pangolin ensures the
              well-being of the elderly with care and compassion. Like a
              gardener tending to a lush paradise, they cultivate harmonious
              gardens for a thriving world. Count on Agent Pangolin for
              efficient, nurturing, and eco-friendly solutions.
            </CardBody>
            {/* <div>
              <strong>Home Automation:</strong> Pangolins are known for their
              adaptability and efficiency in navigating their surroundings.
              Similarly, home automation involves optimizing and controlling
              various systems in a house, reflecting the pangolin's ability to
              manage its environment.
            </div>
            <div>
              <strong>Elderly Care:</strong> Like the pangolin's protective
              nature, elderly care involves providing support, care, and
              attention to the elderly, ensuring their well-being and safety.
            </div>
            <div>
              <strong>Gardening:</strong> Pangolins are often associated with
              nature due to their habitat and ecological significance. Gardening
              aligns with this spirit, as it involves nurturing and cultivating
              plants to create a harmonious and thriving environment.
            </div>
            <div>
              <strong>Environmental:</strong> As pangolins are vulnerable to
              environmental changes and habitat destruction, elements related to
              the environment such as Environmental Science or Conservation
              align with their spirit.
            </div>
            <div>
              <strong>Wildlife:</strong> Pangolins are fascinating creatures of
              the wild. Elements connected to Wildlife, such as Wildlife
              Conservation or Wildlife Biology, capture the essence of the
              pangolin's natural habitat and ecological significance.
            </div> */}
          </Card>
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
    </div>
  );
};

export default ViewAgents;
