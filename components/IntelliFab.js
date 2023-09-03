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
// import IntelliCard from "./IntelliCard";
import styles from "./IntelliFab.module.css";
import { useState } from "react";

const IntelliFab = ({ onClick, icon, fabType }) => {
  const [logo, setLogo] = useState("");
  console.log("fabType");
  console.log(fabType);
  if (logo == "") {
    if (fabType === "report") {
      console.log("logo");
      console.log(logo);
      setLogo(`bi bi-body-text`);
    }
    if (fabType === "agent") {
      setLogo(`bi bi-person-badge`);
    }
  }

  return (
    <button className={styles.fab} onClick={onClick}>
      {logo && <i className={logo}></i>} {icon}
      {/* {logo} {icon} */}
    </button>
  );
};
export default IntelliFab;
