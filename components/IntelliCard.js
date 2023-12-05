import Image from "next/image";
import { Badge, Card, CardBody, CardSubtitle } from "reactstrap";
import getCloudinaryImageUrlForHeight from "../utils/getCloudinaryImageUrlForHeight";
const IntelliCard = ({
  imageSize,
  datums,
  datumsType,
  handleCardClick,
  index,
  folderLikesByFolderId,
  reportCountsByFolderId,
}) => {
  // console.log("intelli card group row");
  // console.log("Intellicard handleCardClick");
  // console.log(handleCardClick);
  // const router = useRouter();
  // console.log("key");
  // console.log(index);
  const imageStyle = {
    borderTop: "2px solid #31A0D1",
    borderLeft: "1px solid #31A0D1",
    borderRight: "1px solid #31A0D1",
  };
  // if (index === 0) {
  imageStyle.borderTopLeftRadius = "16px";
  // }
  // if (index === 2) {
  imageStyle.borderTopRightRadius = "16px";
  // }
  // const imageStyle = {
  //   borderTopLeftRadius: "7px",
  //   borderTopRightRadius: "7px",
  // };
  let titleClassName = "";
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
    // titleClassName = "reportFont";
    icon = "bi bi-body-text";
  }
  if (datumsType === "folders") {
    displayDatums.picUrl = datums.folderPicUrl;
    displayDatums.title = datums.folderName;
    // titleClassName = "reportFont";
    icon = "bi bi-folder";
    if (folderLikesByFolderId) {
      likes = folderLikesByFolderId[datums.folderId];
    }
    if (reportCountsByFolderId) {
      reportCount = reportCountsByFolderId[datums.folderId];
    }
  }
  if (imageSize === "small") {
    // imageStyle.width = "auto";
    imageStyle.objectFit = "cover";
    displayDatums.picUrl = displayDatums.picUrl;
  }

  // console.log("IntelliCard datums");
  // console.log(displayDatums);
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
      {/* {displayDatums.picUrl} */}
      <Card
        onClick={handleClick}
        style={{ background: "black", cursor: "pointer" }}
        className="cardShadow text-white"
      >
        <div style={{ position: "relative", width: "100%" }}>
          <img
            src={displayDatums.picUrl}
            style={{ maxWidth: "100%", height: "auto", ...imageStyle }}
            layout="responsive"
            // width={337} // You may need to provide a sensible default or calculate this based on the aspect ratio
            // height={337}
            // objectFit="contain"
            alt={displayDatums.title}
          />
        </div>
        {/* <div style={{ position: "relative", width: "100%", height: "337px" }}> */}
        {/* <Image
            // onClick={handleClick}

            src={displayDatums.picUrl} // insert image transformations based on imageSize here
            style={imageStyle}
            layout="fill"
            objectFit="contain"
            // fill={true}
            // sizes="100vw"
            // style={{ width: "100%", height: "auto" }}
            alt={displayDatums.title}
          /> */}
        {/* <div onClick={handleClick} className="
          "></div> */}
        {/* </div> */}
        <CardBody
          style={{
            display: "flex",
            backgroundColor: "black",
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
            flexDirection: "column",
            justifyContent: "space-between",
            marginBottom: "30px",
            // marginTop: "-60px",
            // padding: "20px",
            padding: "10px 20px 10px 20px",
            borderBottom: "2px solid #31A0D1",
            borderLeft: "1px solid #31A0D1",
            borderRight: "1px solid #31A0D1",
            // border: "2px 2px 0px 0px solid #BFBFBF",
            boxShadow: `
            0 8px 0 -2px black, 
            0 8px 0 0 ${reportCount > 1 ? "#31A0D1" : "black"},
            0 16px 0 -2px black, 
            0 16px 0 0 ${reportCount > 2 ? "#31A0D1" : "black"},
            0 24px 0 -2px black, 
            0 24px 0 0 ${reportCount > 3 ? "#31A0D1" : "black"}
        `,
          }}
        >
          {/* <div style={{ color: "white" }}>{displayDatums.title}</div> */}
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
                minHeight: "70px",
                // marginTop: "4px",
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
              {reportCount && (
                <span style={{ whiteSpace: "nowrap" }}>
                  [{reportCount} <i className="bi bi-body-text" />]
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
          {/* {reportCount} */}
          <div
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
                  color: "gold",
                }}
                // className="section-title"
              >
                {likes > 1 && <span>{likes}&nbsp;</span>}
                <i className="bi bi-star-fill" />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default IntelliCard;

{
  /* <CardBody
style={{
  display: "flex",
  background: "black",
  flexDirection: "column",
  justifyContent: "center",
  marginBottom: "12px",
  marginTop: "-6px",
}}
>
<div
  style={{
    fontWeight: "800",
    color: "white",
    marginBottom: "16px",
    fontSize: "1.3rem",
    height: "100px", // specify a fixed height
    // overflow: "hidden", // hide the overflow content
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2, // limit the content to 2 lines at most
  }}
  className={titleClassName}
>
  {icon && <i className={icon}></i>} {displayDatums.title}
</div>
<CardSubtitle tag="h6" className="mb-2 text-muted">
  <i className="bi bi-star-fill" /> 723
</CardSubtitle>
<CardSubtitle
  className="mb-2 text-muted"
  // style={{ marginTop: "-50px" }}
  tag="h6"
>
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

</CardBody> */
}
