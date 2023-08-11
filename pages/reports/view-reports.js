// View Reports Page
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
      Reports
      <Row>
        <Col>
          <p></p>Filters.<p></p>Card Grid Layout. Infinite scroll!
        </Col>
      </Row>
    </div>
  );
};

export default ViewAgents;
