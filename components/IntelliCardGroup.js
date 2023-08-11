import { useRouter } from "next/router";
import Image from "next/image";
import {
  CardGroup,
  // Card,
  // CardGroup,
  // CardBody,
  // CardText,
  // Button,
  // CardTitle,
  // CardSubtitle,
  // Table,
  Col,
  Row,
} from "reactstrap";
import { useState } from "react";
import IntelliCardGroupRow from "./IntelliCardGroupRow";
import IntelliCard from "./IntelliCard";
const IntelliCardGroup = ({ datums, handleCardClick, datumsType }) => {
  //   const router = useRouter();
  //   console.log(router);
  //   function goToPage(name) {
  //     console.log("go to page");
  //     console.log(name);
  //     router.push(`/agents/detail/${name}`);
  //   }
  // export default function Home() {
  const [cardsModel, setCardsModel] = useState(datums);
  // const [cardsModel, setCardsModel] = useState([
  //   { title: "title1" },
  //   { title: "title2" },
  //   { title: "title3" },
  //   { title: "title4" },
  //   { title: "title3" },
  //   { title: "title4" },
  //   { title: "title4" },
  //   // { title: "title4" },
  // ]);

  // cols is a 3-element-long selection of cardsModel
  // let cols = [];
  // const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  console.log("cardsModel");
  console.log(cardsModel);
  const rowsInThrees = cardsModel
    ? cardsModel.reduce((acc, item, index) => {
        if (index % 3 === 0) {
          acc.push([]);
        }
        acc[Math.floor(index / 3)].push(item);
        return acc;
      }, [])
    : [];
  // console.log("rowsInThrees");
  // console.log(rowsInThrees);
  // console.log("intelli card group");
  console.log("Intellicard handleCardClick");
  console.log(handleCardClick);
  return (
    <>
      {rowsInThrees.map((cols, index) => {
        return (
          <div key={index} style={{ marginBottom: "16px" }}>
            <IntelliCardGroupRow
              handleCardClick={handleCardClick}
              cols={cols}
              datumsType={datumsType}
            />
          </div>
        );
      })}
    </>
  );
};

export default IntelliCardGroup;
