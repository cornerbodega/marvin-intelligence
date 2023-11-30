// import LogoDark from "../../assets/images/logos/xtremelogo.svg";
import Image from "next/image";
import Link from "next/link";
import LogoDark from "../../../public/logo.png";

const Logo = () => {
  return (
    <Link href="/reports/folders/view-folders">
      {/* <a> */}
      {/* Marvin Intelligence Agency */}
      <Image height="200" width="200" src={LogoDark} alt="logo" />
      {/* </a> */}
    </Link>
  );
};

export default Logo;
