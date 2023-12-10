import React from "react";
import { Container, Row, Col } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";
import IntelliNotificationsArea from "../../components/IntelliNotificationsArea/IntelliNotificationsArea";
import { useUser } from "@auth0/nextjs-auth0/client";

const FullLayout = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };
  const { user, error, isLoading } = useUser();
  const userId = user?.sub;
  return (
    <main>
      <Row
        noGutters
        className="pageWrapper text-white"
        style={{ backgroundColor: "black", marginLeft: "10px" }}
      >
        {/* Sidebar */}
        <Col
          md="auto"
          className={`sidebarArea shadow bg-black ${
            !open ? "" : "showSidebar"
          }`}
          style={{ zIndex: 100 }}
        >
          <Sidebar showMobilemenu={showMobilemenu} />
        </Col>

        {/* Main Content Area */}
        <Col onClick={(open && showMobilemenu) || (() => {})}>
          {/* Notifications Area */}

          {/* Header */}
          <Header showMobmenu={showMobilemenu} />

          {/* Middle Content */}
          <Container fluid className="p-4 wrapper">
            {children}
          </Container>
        </Col>
      </Row>
    </main>
  );
};

export default FullLayout;
