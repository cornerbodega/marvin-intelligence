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
import getCloudinaryImageUrlForHeight from "../utils/getCloudinaryImageUrlForHeight";
import styles from "./IntelliCard.module.css";
import { log } from "../utils/log";
const IntelliCard = ({
  imageSize,
  datums,
  datumsType,
  handleCardClick,
  index,
}) => {
  // console.log("intelli card group row");
  // console.log("Intellicard handleCardClick");
  // console.log(handleCardClick);
  // const router = useRouter();
  console.log("key");
  console.log(index);
  const imageStyle = {};
  // if (index === 0) {
  imageStyle.borderTopLeftRadius = "25px";
  // }
  // if (index === 2) {
  imageStyle.borderTopRightRadius = "25px";
  // }
  // const imageStyle = {
  //   borderTopLeftRadius: "7px",
  //   borderTopRightRadius: "7px",
  // };
  let titleClassName = "";
  let icon;
  const displayDatums = { ...datums };
  if (datumsType === "agents") {
    displayDatums.title = `Agent ${datums.agentName}`;
    displayDatums.picUrl = datums.profilePicUrl;
    icon = "bi bi-person-badge";
  }
  if (datumsType === "missions") {
    displayDatums.picUrl = datums.reportPicUrl;
    displayDatums.title = datums.reportTitle;
    titleClassName = "reportFont";
    icon = "bi bi-body-text";
  }
  if (datumsType === "folders") {
    displayDatums.picUrl = datums.reportPicUrl;
    displayDatums.title = datums.reportTitle;
    titleClassName = "reportFont";
    icon = "bi bi-file-earmark-text";
  }
  if (imageSize === "small") {
    imageStyle.height = "337px";
    imageStyle.objectFit = "cover";
    displayDatums.picUrl = getCloudinaryImageUrlForHeight(
      displayDatums.picUrl,
      337
    );
  }

  log("IntelliCard datums");
  log(displayDatums.picUrl);
  function handleClick() {
    // console.log("Intellicard handleCardClick");
    // console.log(handleCardClick);
    handleCardClick(datums);
  }
  // function handleHire() {
  //   // console.log("Intellicard handleCardClick");
  //   // console.log(handleCardClick);
  //   // handleCardClick(datums);
  //   if (datumsType === "agents") {
  //     router.push(
  //       `/missions/create-mission/dispatch?agentId=${datums.agentId}`
  //     );
  //   }
  //   if (datumsType === "missions") {
  //     router.push(`/missions/create-mission/agents/view-agents`);
  //   }
  // }

  return (
    <>
      <Card style={{ borderRadius: "25px" }} className="cardShadow">
        <img
          onClick={handleClick}
          src={displayDatums.picUrl} // insert image transformations based on imageSize here
          style={imageStyle}
          alt="Card image cap"
        />

        <CardBody
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div onClick={handleClick}>
            {/* <CardTitle tag="h5" className="text-primary"> */}
            {/* Agent {datums.agentName} */}
            <div
              style={{
                // fontStyle: "italic",
                fontWeight: "800",
                color: "#0645ad",
                marginBottom: "16px",
                fontSize: "1.3rem",
              }}
              className={titleClassName}
            >
              {icon && <i className={icon}></i>} {displayDatums.title}
            </div>
            {/* </CardTitle> */}
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              <Badge color="info" className="ms-3 expertiseBadge">
                {datums.expertise1}
              </Badge>
              <Badge color="info" className="ms-3 expertiseBadge">
                {datums.expertise2}
              </Badge>
              <Badge color="info" className="ms-3 expertiseBadge">
                {datums.expertise3}
              </Badge>
            </CardSubtitle>
          </div>
          {/* <CardText>{datums.bio}</CardText> */}
          {/* {datumsType === "agents" && (
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
          )} */}
        </CardBody>
      </Card>
    </>
  );
};

export default IntelliCard;
