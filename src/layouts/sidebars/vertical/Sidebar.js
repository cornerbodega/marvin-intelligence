import { Button, Nav, NavItem } from "reactstrap";
import Logo from "../../logo/Logo";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  {
    title: "Agents",
    href: "/agents/view-agents",
    icon: "bi bi-people",
  },
  {
    title: "Missions",
    href: "/missions/view-missions",
    icon: "bi bi-patch-check",
  },
  {
    title: "Continua",
    href: "/ui/badges",
    icon: "bi bi-link",
  },
  {
    title: "Reports",
    href: "/reports/view-reports",
    icon: "bi bi-card-text",
  },
  // Make Insights part of Reports UI
  // {
  //   title: "Insights",
  //   href: "/ui/cards",
  //   icon: "bi bi-hdd-stack",
  // },
  {
    title: "IntelNet",
    href: "/ui/buttons",
    icon: "bi bi-columns",
  },
  {
    title: "Buttons",
    href: "/ui/buttons",
    icon: "bi bi-hdd-stack",
  },

  {
    title: "Table",
    href: "/ui/tables",
    icon: "bi bi-layout-split",
  },
  {
    title: "Grid",
    href: "/ui/grid",
    icon: "bi bi-patch-check",
  },
  {
    title: "Forms",
    href: "/ui/forms",
    icon: "bi bi-textarea-resize",
  },
  {
    title: "Breadcrumbs",
    href: "/ui/breadcrumbs",
    icon: "bi bi-hdd-stack",
  },
  {
    title: "Welcome",
    href: "/",
    icon: "bi bi-speedometer2",
  },
  {
    title: "About",
    href: "/about",
    icon: "bi bi-people",
  },
];

const Sidebar = ({ showMobilemenu }) => {
  let curl = useRouter();
  const location = curl.pathname;

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <Button
          close
          size="sm"
          className="ms-auto d-lg-none"
          onClick={showMobilemenu}
        ></Button>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav" style={{ zIndex: "100" }}>
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              {/* <Link > */}
              <a
                href={navi.href}
                className={
                  location === navi.href
                    ? "text-primary nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </a>
              {/* </Link> */}
            </NavItem>
          ))}
          {/* <Button
            color="secondary"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://www.wrappixel.com/templates/xtreme-next-js-free-admin-template/"
          >
            Download Free
          </Button>
          <Button
            color="danger"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://www.wrappixel.com/templates/xtreme-react-redux-admin/?ref=33"
          >
            Upgrade To Pro
          </Button> */}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
