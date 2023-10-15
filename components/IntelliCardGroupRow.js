import { useRouter } from "next/router";
import Image from "next/image";
import {
  Card,
  CardGroup,
  CardBody,
  CardText,
  Button,
  CardTitle,
  CardSubtitle,
  Table,
} from "reactstrap";
import IntelliCard from "./IntelliCard";

const IntelliCardGroupRow = ({
  cols,
  handleCardClick,
  datumsType,
  folderLikesByFolderId,
}) => {
  //   const router = useRouter();
  //   console.log(router);
  //   function goToPage(name) {
  //     console.log("go to page");
  //     console.log(name);
  //     router.push(`/missions/create-mission/agents/detail/${name}`);
  //   }
  // export default function Home() {
  // console.log("intelli card group row");
  // console.log(cols);
  // style={{ padding: "10px" }}
  const colLenth = cols.length;
  return (
    <CardGroup
      className="intelliReveal"
      style={
        {
          // borderBottomLeftRadius: "25px",
          // borderBottomRightRadius: "25px",
          // borderRadius: "25px",
        }
      }
    >
      {Array.apply(null, { length: colLenth }).map((e, i) =>
        colLenth > 2 ? (
          <IntelliCard
            imageSize="small"
            handleCardClick={handleCardClick}
            datums={cols[i]}
            key={i}
            index={i}
            folderLikesByFolderId={folderLikesByFolderId}
            datumsType={datumsType}
          ></IntelliCard>
        ) : (
          <IntelliCard
            handleCardClick={handleCardClick}
            imageSize="big"
            folderLikesByFolderId={folderLikesByFolderId}
            datums={cols[i]}
            datumsType={datumsType}
            key={i}
            index={i}
          ></IntelliCard>
        )
      )}
    </CardGroup>
  );
};
export default IntelliCardGroupRow;
// {
/* <Card>
        <img
          src="../default-agents/Agent Dolphin.png"
          style={{
            //   width: "300px",
            height: "337px",
            objectFit: "cover",
            //   objectPosition: "-20% 0",
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
            Agent Dolphin is a maestro of musical rhythm and harmony. If you're
            a budding musician, Dolphin can guide you through the nuances of
            rhythm, melody, and harmony, and even help you create your own
            compositions. Dolphin's expertise lies in understanding and
            generating musical patterns, making it an ideal partner for your
            musical journey.
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
            Whether you're just starting out with your first business plan or
            looking for insights to help pivot your established business,
            Grizzly's got your back. His approach is much like the Grizzly Bear
            he's named after – determined, intelligent, and incredibly
            perceptive.
          </CardText>
          <Button>Hire</Button>
        </CardBody>
      </Card> */
// };
