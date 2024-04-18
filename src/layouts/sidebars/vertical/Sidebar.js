import { Button, Nav, NavItem } from "reactstrap";
import Logo from "../../logo/Logo";

import { useRouter } from "next/router";

const navigation = [
  {
    title: "Intel-Net",
    href: "/intelnet/folders/view-intelnet",
    icon: "bi bi-globe2",
  },
  {
    title: "My Reports",
    href: "/reports/folders/view-folders",
    icon: "bi bi-body-text",
  },

  {
    title: "Agents",
    href: "/agents/view-agents",
    icon: "bi bi-person-badge",
  },
];

const Sidebar = ({ showMobilemenu }) => {
  let curl = useRouter();
  const location = curl.pathname;

  return (
    <div className="p-3">
      <div
        style={{
          textAlign: "right",
          marginBottom: "-10px",
        }}
      >
        <a
          close="true"
          size="sm"
          className="ms-auto d-lg-none"
          style={{
            zIndex: 9999,
            color: "white",
            textDecoration: "none",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation(); // Stop the click from reaching the canvas
            showMobilemenu();
          }}
        >
          ✖
        </a>
      </div>
      <div className="d-flex align-items-center">
        <div style={{ marginTop: "20px" }}>
          <Logo />
        </div>
      </div>

      <div className="pt-4 mt-2">
        <Nav
          vertical
          className="sidebarNav"
          style={{
            zIndex: "100",
            fontStyle: "italic",
            fontFamily: "monospace",
          }}
        >
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <a
                href={navi.href}
                className={
                  location.includes(navi.href.split("/")[1])
                    ? "sidebarSelected bg-text-underline nav-link py-3"
                    : "nav-link sidebarSelected  py-3"
                }
                style={
                  location.includes(navi.href.split("/")[1])
                    ? { textDecoration: "underline", color: "#00fff2" }
                    : { color: "white" }
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </a>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
