import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
// import LogoWhite from "../../assets/images/logos/xtremelogowhite.svg";
import LogoWhite from "../../../public/logo.png";

const Header = ({ showMobmenu }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  // const [dropdownOpen, setDropdownOpen] = React.useState(false);

  // const toggle = () => setDropdownOpen((prevState) => !prevState);
  // const Handletoggle = () => {
  //   setIsOpen(!isOpen);
  // };

  return (
    <Navbar color="black" dark expand="md">
      <div className="d-flex align-items-center">
        <Button color="primary" className="d-lg-none" onClick={showMobmenu}>
          <i className="bi bi-list"></i>
        </Button>
      </div>
      {/* 
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div> */}

      <Collapse navbar isOpen={isOpen}>
        <Nav
          className="container-fluid d-flex justify-content-between align-items-center"
          navbar
        >
          {/* <input
            type="text"
            style={{
              borderRadius: "8px",
              marginLeft: "12px",
              width: "auto", // Make the width auto to fit the content
              maxWidth: "300px", // Control the maximum width for larger screens
              height: "2em",
              flexGrow: 1, // Let it grow to take the available space
              textIndent: "10px",
            }}
            placeholder="🔎 Search Reports"
          /> */}
          {/* <div
            className="d-flex align-items-center ms-2"
            style={{
              padding: "8px",
            }}
          >
            <span
              style={{
                fontSize: "1.5em",
                color: "white",
              }}
            >
              ⚙️
            </span>
          </div> */}
        </Nav>
      </Collapse>
    </Navbar>

    // <Navbar color="black" dark expand="md">
    //   <div className="d-flex align-items-center">
    //     <Button color="primary" className="d-lg-none" onClick={showMobmenu}>
    //       <i className="bi bi-list"></i>
    //     </Button>
    //   </div>

    //   <div className="hstack gap-2">
    //     <Button
    //       color="primary"
    //       size="sm"
    //       className="d-sm-block d-md-none"
    //       onClick={Handletoggle}
    //     >
    //       {isOpen ? (
    //         <i className="bi bi-x"></i>
    //       ) : (
    //         <i className="bi bi-three-dots-vertical"></i>
    //       )}
    //     </Button>
    //   </div>
    //   <Collapse navbar isOpen={isOpen}>
    //     <Nav
    //       className="container-fluid d-flex justify-content-between align-items-center"
    //       navbar
    //     >
    //       <input
    //         type="text"
    //         className="me-2" // Adjusted class to control spacing
    //         style={{
    //           borderRadius: "8px",
    //           margin: "10px 0", // Adjusted margin
    //           width: "calc(100% - 70px)", // Adjusted width for better responsiveness
    //           height: "2em",
    //           textIndent: "10px",
    //         }}
    //         placeholder="Search"
    //       />
    //       <div
    //         className="d-flex align-items-center"
    //         style={{
    //           padding: "8px", // Adjusted padding
    //         }}
    //       >
    //         <span
    //           style={{
    //             fontSize: "1.5em", // Adjusted the font size
    //             color: "white",
    //           }}
    //         >
    //           ⚙️
    //         </span>
    //       </div>
    //     </Nav>
    //   </Collapse>

    //   {/* <Collapse navbar isOpen={isOpen}>
    //     <Nav className="container-fluid d-flex justify-content-between" navbar>
    //       <input
    //         type="text"
    //         className="me-auto" // Added class to push the input to the left
    //         style={{
    //           borderRadius: "8px",
    //           margin: "25px",
    //           maxWidth: "40%", // Adjusted the width
    //           height: "2em",
    //           textIndent: "10px",
    //           // maxWidth: "", // Adjusted the max width to fit better on smaller screens
    //           flexGrow: 1, // Added to make input flexible
    //         }}
    //         placeholder="Search"
    //       />
    //       <div
    //         className="d-flex align-items-center"
    //         style={{ fontSize: "2em" }}
    //       >
    //         ⚙️
    //       </div>
    //     </Nav>
    //   </Collapse> */}
    // </Navbar>
  );
};

export default Header;
