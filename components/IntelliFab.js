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

const IntelliFab = ({ onClick, icon }) => {
  return (
    <button className={styles.fab} onClick={onClick}>
      {icon}
    </button>
  );
};
export default IntelliFab;
