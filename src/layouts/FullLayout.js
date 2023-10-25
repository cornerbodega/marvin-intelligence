import React from "react";
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";

const FullLayout = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  return (
    <main>
      <div
        style={{
          backgroundColor: "black",
        }}
        className="pageWrapper d-md-block d-lg-flex text-white"
      >
        {/******** Sidebar **********/}
        <aside
          style={{ zIndex: "100" }}
          className={`sidebarArea shadow  bg-black ${
            !open ? "" : "showSidebar"
          }`}
        >
          <Sidebar showMobilemenu={() => showMobilemenu()} />
        </aside>
        {/********Content Area**********/}

        <div
          // className="contentArea gradient-background"
          className=""
          style={{
            width: "100%",
            overflowX: "hidden",
          }}
        >
          {/********header**********/}
          <Header showMobmenu={() => showMobilemenu()} />

          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <div>{children}</div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
