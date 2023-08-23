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
} from "reactstrap";
import Blog from "../../src/components/dashboard/Blog";
import bg1 from "../../public/default-agents/Agent Otter.png";

import bg2 from "../../src/assets/images/bg/bg2.jpg";
import bg3 from "../../src/assets/images/bg/bg3.jpg";
import bg4 from "../../src/assets/images/bg/bg4.jpg";
import Image from "next/image";
import AgentsTable from "../../src/components/dashboard/AgentsTable";
const BlogData = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];

const ViewAgents = () => {
  return (
    <div>
      Missions
      {/* --------------------------------------------------------------------------------*/}
      {/* Card-Group*/}
      {/* --------------------------------------------------------------------------------*/}
      <Row className="text-primary">
        <h5 className="mb-3 mt-3">Free Agents</h5>
        <Col>
          <CardGroup>
            <Card>
              <img
                src="../default-agents/Agent Otter.png"
                style={{
                  height: "337px",
                  objectFit: "cover",
                }}
                alt="Card image cap"
              />
              <CardBody>
                <CardTitle tag="h5" className="text-primary">
                  Agent Otter
                </CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  Expertise: Problem-solving and Creativity
                </CardSubtitle>
                <CardText>
                  Problem-solving expert. Armed with an arsenal of creative
                  approaches and innovative ideas, Otter specializes in crafting
                  unique solutions to complex issues. This AI agent is
                  especially helpful for game developers, as Otter loves
                  dissecting intricate problems and turning them into simple and
                  enjoyable games.
                </CardText>
                <Button>Hire</Button>
              </CardBody>
            </Card>
            <Card>
              <img
                src="../default-agents/Agent Dolphin.png"
                style={{
                  height: "337px",
                  objectFit: "cover",
                }}
                alt="Card image cap"
              />{" "}
              <CardBody>
                <CardTitle tag="h5" className="text-primary">
                  Agent Dolphin
                </CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  Expertise: Music and Rhythm
                </CardSubtitle>
                <CardText>
                  Agent Dolphin is a maestro of musical rhythm and harmony. If
                  you're a budding musician, Dolphin can guide you through the
                  nuances of rhythm, melody, and harmony, and even help you
                  create your own compositions. Dolphin's expertise lies in
                  understanding and generating musical patterns, making it an
                  ideal partner for your musical journey.
                </CardText>
                <Button>Hire</Button>
              </CardBody>
            </Card>
            <Card>
              <img
                src="../default-agents/Agent Grizzly Bear.png"
                style={{
                  height: "337px",
                  objectFit: "cover",
                }}
                alt="Card image cap"
              />{" "}
              <CardBody>
                <CardTitle tag="h5" className="text-primary">
                  Agent Grizzly
                </CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  Expertise: Business Strategy and Market Analysis
                </CardSubtitle>
                <CardText>
                  Whether you're just starting out with your first business plan
                  or looking for insights to help pivot your established
                  business, Grizzly's got your back. His approach is much like
                  the Grizzly Bear he's named after – determined, intelligent,
                  and incredibly perceptive.
                </CardText>
                <Button>Hire</Button>
              </CardBody>
            </Card>
          </CardGroup>
          <div style={{ padding: "16px", textAlign: "right" }}>
            <Button className="btn" color="primary">
              Regenerate
            </Button>
            &nbsp;
            <Button className="btn" color="primary">
              Create an Agent
            </Button>
          </div>
          <div>
            {" "}
            <h5 className="mb-3 mt-3">Signed Agent Roster</h5>
          </div>
          {/* <AgentsTable></AgentsTable> */}
        </Col>
      </Row>
    </div>
  );
};

export default ViewAgents;
