import Image from "next/image";
import { Badge, Card, CardBody, CardSubtitle } from "reactstrap";
const IntelliCard = ({
  imageSize,
  datums,
  datumsType,
  handleCardClick,
  index,
  folderLikesByFolderId,
  reportCountsByFolderId,
}) => {
  const reportsColor = "#31A0D1";
  const intelnetColor = "#3FFF8D";
  let borderBottomColor = reportsColor;
  const imageStyle = {
    borderTop: `2px solid ${reportsColor}`,
    borderLeft: `2px solid ${reportsColor}`,
    borderRight: `2px solid ${reportsColor}`,
  };
  const cardBottomBorder = {
    borderBottom: `2px solid ${reportsColor}`,
    borderLeft: `2px solid ${reportsColor}`,
    borderRight: `2px solid ${reportsColor}`,
  };
  // if (index === 0) {
  imageStyle.borderTopLeftRadius = "16px";
  // }
  // if (index === 2) {
  imageStyle.borderTopRightRadius = "16px";

  let icon;
  let likes;
  let reportCount;
  const displayDatums = { ...datums };
  if (datumsType === "agents") {
    displayDatums.title = `Agent ${datums.agentName}`;
    displayDatums.picUrl = datums.profilePicUrl;
    icon = "bi bi-person-badge";
  }
  if (datumsType === "missions") {
    displayDatums.picUrl = datums.reportPicUrl;
    displayDatums.title = datums.reportTitle;
    icon = "bi bi-body-text";
  }
  if (datumsType === "folders" || datumsType === "intelnet") {
    displayDatums.picUrl = datums.folderPicUrl;
    displayDatums.title = datums.folderName;
    icon = "bi bi-folder";
    if (datumsType === "intelnet") {
      imageStyle.borderTop = `2px solid ${intelnetColor}`;
      imageStyle.borderLeft = `2px solid ${intelnetColor}`;
      imageStyle.borderRight = `2px solid ${intelnetColor}`;
      cardBottomBorder.borderBottom = `2px solid ${intelnetColor}`;
      cardBottomBorder.borderLeft = `2px solid ${intelnetColor}`;
      cardBottomBorder.borderRight = `2px solid ${intelnetColor}`;
      borderBottomColor = intelnetColor;
      // borderLeft: `2px solid ${reportsColor}`,
      // borderRight: `2px solid ${reportsColor}`,
    }
    // if (folderLikesByFolderId) {
    //   likes = folderLikesByFolderId[datums.folderId];
    // }
    if (reportCountsByFolderId) {
      reportCount = reportCountsByFolderId[datums.folderId];
    }
  }
  if (imageSize === "small") {
    imageStyle.objectFit = "cover";
    displayDatums.picUrl = displayDatums.picUrl;
  }

  function handleClick() {
    handleCardClick(datums);
  }

  return (
    <>
      <Card
        onClick={handleClick}
        style={{ background: "black", cursor: "pointer" }}
        className="cardShadow text-white"
      >
        <div style={{ position: "relative", width: "100%" }}>
          {displayDatums.picUrl && (
            <img
              src={
                imageSize === "small"
                  ? displayDatums.picUrl.replace("medium", "small")
                  : displayDatums.picUrl
              }
              style={{ width: "100%", height: "auto", ...imageStyle }}
              layout="responsive"
              alt={displayDatums.title}
            />
          )}
        </div>

        <CardBody
          style={{
            display: "flex",
            backgroundColor: "black",
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
            flexDirection: "column",
            justifyContent: "space-between",
            marginBottom: "30px",
            padding: "10px 20px 10px 20px",
            ...cardBottomBorder,
            boxShadow: `
            0 8px 0 -2px black, 
            0 8px 0 0 ${reportCount > 1 ? borderBottomColor : "black"},
            0 16px 0 -2px black, 
            0 16px 0 0 ${reportCount > 2 ? borderBottomColor : "black"},
            0 24px 0 -2px black, 
            0 24px 0 0 ${reportCount > 3 ? borderBottomColor : "black"}
        `,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start", // Align items to the top
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                fontWeight: "800",
                color: "white",
                fontSize: "1em",
                maxHeight: "80px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",

                textOverflow: "ellipsis",
                whiteSpace: "normal",
              }}
              className="reportFont"
            >
              {icon && <i className={icon}></i>} {displayDatums.title}{" "}
              {reportCount > 1 && (
                <span
                  style={{
                    fontWeight: "200px",
                    fontSize: "0.75em",
                    textAlign: "right",
                    color: "#00fff2",
                    whiteSpace: "nowrap",
                  }}
                >
                  <i className="bi bi-link" />
                  <span>{reportCount}</span>
                </span>
              )}
            </div>
          </div>
          {datums["expertise1"] && (
            <CardSubtitle
              style={{ marginTop: "8px" }}
              className="mb-2 text-muted"
              tag="h6"
            >
              {["expertise1", "expertise2", "expertise3"].map(
                (expertise, i) => (
                  <Badge key={i} className="expertiseBadge">
                    {datums[expertise]}
                  </Badge>
                )
              )}
            </CardSubtitle>
          )}
          {/* <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              fontSize: "1rem",
            }}
          >
            {likes > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  color: "#A32C5D",
                }}
                // className="section-title"
              >
                {likes > 1 && <span>{likes}&nbsp;</span>}
                <i className="bi bi-star-fill" />
              </div>
            )}
          </div> */}
        </CardBody>
      </Card>
    </>
  );
};

export default IntelliCard;
