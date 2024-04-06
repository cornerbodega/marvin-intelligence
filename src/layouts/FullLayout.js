import React from "react";
import { Container, Row, Col } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";
import { useRouter } from "next/router"; // Import useRouter

const FullLayout = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter(); // Use useRouter to get the current path
  const isRootPath = router.pathname === "/"; // Check if it's the root path

  const showMobilemenu = () => {
    if (!isRootPath) {
      setOpen(!open);
    }
  };

  return (
    <main>
      <Row
        noGutters
        className={`pageWrapper text-white ${isRootPath ? "fullScreen" : ""}`}
        style={{
          backgroundColor: "black",
          marginLeft: isRootPath ? "0px" : "10px",
        }}
      >
        {/* Conditionally render Sidebar if not on root path */}
        {!isRootPath && (
          <Col
            md="auto"
            className={`sidebarArea shadow bg-black ${
              !open ? "" : "showSidebar"
            }`}
            style={{ zIndex: 100 }}
          >
            <Sidebar showMobilemenu={showMobilemenu} />
          </Col>
        )}

        {/* Main Content Area */}
        <Col onClick={(open && showMobilemenu) || (() => {})}>
          {/* Header - conditionally render if not on root path */}
          {!isRootPath && <Header showMobmenu={showMobilemenu} />}

          {/* Middle Content */}
          <Container
            fluid
            className={`p-4 wrapper ${isRootPath ? "fullScreen" : ""}`}
          >
            {children}
          </Container>
        </Col>
      </Row>
    </main>
  );
};

export default FullLayout;
