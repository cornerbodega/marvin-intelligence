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
  const router = useRouter();
  const imageStyle = {};
  if (imageSize === "small") {
    imageStyle.height = "337px";
    imageStyle.objectFit = "cover";
  }
  const displayDatums = { ...datums };
  if (datumsType === "agents") {
    displayDatums.title = `Agent ${datums.agentName}`;
    displayDatums.picUrl = datums.profilePicUrl;
  }
  if (datumsType === "reports") {
    displayDatums.picUrl = datums.reportPicUrl;
    displayDatums.title = datums.reportTitle;
  }
  function handleClick() {
    // console.log("Intellicard handleCardClick");
    // console.log(handleCardClick);
    handleCardClick(datums);
  }
  function handleHire() {
    // console.log("Intellicard handleCardClick");
    // console.log(handleCardClick);
    // handleCardClick(datums);
    router.push(`/missions/create-mission/${datums.agentId}`);
  }

  return (
    <>
      <Card>
        <img
          onClick={handleClick}
          src={displayDatums.picUrl} // insert image transformations based on imageSize here
          style={imageStyle}
          alt="Card image cap"
        />

        <CardBody>
          <div onClick={handleClick}>
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
          </div>
          {/* <CardText>{datums.bio}</CardText> */}
          <Button
            style={{
              border: "1px solid white",
              position: "absolute",
              bottom: "4px",
              right: "4px",
            }}
            onClick={handleHire}
          >
            <i className="bi bi-body-text"></i>+
          </Button>
        </CardBody>
      </Card>
    </>
  );
};

export default IntelliCard;
