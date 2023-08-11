import { useRouter } from "next/router";
import Image from "next/image";
import {
  Badge,
  Card,
  CardGroup,
  CardBody,
  CardText,
  Button,
  CardTitle,
  CardSubtitle,
  Table,
} from "reactstrap";
import styles from "./IntelliCard.module.css";
const IntelliCard = ({ imageSize, datums, datumsType, handleCardClick }) => {
  // console.log("intelli card group row");
  // console.log("Intellicard handleCardClick");
  // console.log(handleCardClick);
  const imageStyle = {};
  if (imageSize === "small") {
    imageStyle.height = "337px";
    imageStyle.objectFit = "cover";
  }
  const displayDatums = {};
  if (datumsType === "agents") {
    displayDatums.title = `Agent ${datums.agentName}`;
  }
  function handleClick() {
    // console.log("Intellicard handleCardClick");
    // console.log(handleCardClick);
    handleCardClick(datums);
  }
  return (
    <>
      <Card onClick={handleClick}>
        <img
          src={datums.profilePicUrl} // insert image transformations based on imageSize here
          style={imageStyle}
          alt="Card image cap"
        />

        <CardBody>
          <CardTitle tag="h5" className="text-primary">
            {/* Agent {datums.agentName} */}
            {displayDatums.title}
          </CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            <Badge color="info" className="ms-3">
              {datums.expertise1}
            </Badge>
            <Badge color="info" className="ms-3">
              {datums.expertise2}
            </Badge>
            <Badge color="info" className="ms-3">
              {datums.expertise3}
            </Badge>
          </CardSubtitle>
          {/* <CardText>{datums.bio}</CardText> */}
          {/* <Button>Hire</Button> */}
        </CardBody>
      </Card>
    </>
  );
};

export default IntelliCard;
