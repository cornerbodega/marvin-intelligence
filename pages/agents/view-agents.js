import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardGroup,
  Button,
  Row,
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Toast,
} from "reactstrap";
import useRouter from "next/router";
import { useEffect, useRef, useState, useContext } from "react";
import { debounce } from "lodash";
// other imports
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import IntelliCardGroup from "../../components/IntelliCardGroup";
import IntelliCardGroupRow from "../../components/IntelliCardGroupRow";
import { getSupabase } from "../../utils/supabase";
import RevealAnimations from "../../components/RevealAnimations";
import IntelliFab from "../../components/IntelliFab";
// rest of component
import IntelliProvider from "../../components/IntelliProvider/IntelliProvider";
import IntelliContext from "../../components/intelliContext/IntelliContext";
import { useUser } from "@auth0/nextjs-auth0/client";

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const supabase = getSupabase();
    const session = await getSession(context.req, context.res);
    const user = session?.user;
    console.log("session");
    console.log(session);

    let { data: agency, agencyError } = await supabase
      .from("users")
      .select("agencyName")
      .eq("userId", user.sub);
    if (agencyError) {
      console.log("agencyError");
    }
    console.log("agency");
    console.log(agency);
    if (!agency || agency.length === 0) {
      return {
        redirect: {
          permanent: false,
          destination: "/agency/create-agency",
        },
        props: {},
      };
    }

    let { data: agents, error } = await supabase
      .from("agents")
      .select(
        "agentId, expertise1, expertise2, expertise3, agentName, profilePicUrl, bio"
      )
      .eq("userId", user.sub);

    // other pages will redirect here if they're empty
    // If no agency, go to create agency page
    // If no agents, go to crete agent page
    // let agency;
    return {
      props: { agents },
    };
  },
});
const ViewAgents = ({ agents }) => {
  const { setSelectedAgent } = useContext(IntelliContext);
  const { user, error, isLoading } = useUser();
  console.log("ViewAgents user");
  console.log(user);
  console.log("Veiw Agents setSelectedAgent");
  console.log(setSelectedAgent);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);
  // const agentNames = agents.map((agent) => agent.agentName);
  useEffect(() => {
    const handleDebouncedScroll = debounce(() => handleScroll(), 200);
    window.addEventListener("scroll", handleDebouncedScroll);
    return () => {
      window.removeEventListener("scroll", handleDebouncedScroll);
    };
  }, []);
  useEffect(() => {
    if (!agents || agents.length === 0) {
      goToPage("create-agent");
    }
  });
  const handleScroll = (container) => {
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      setIsInView((prev) => bottom <= innerHeight);
    }
  };
  const handleFabClick = () => {
    console.log("ViewAgents HandleClick Clicked!");
    goToPage("create-agent");
  };
  const handleCardClick = (agent) => {
    // console.log("handleCardClick");
    // const agentName = event.target.dataset.datums.agentName;
    const agentName = agent.agentName;
    const agentId = agent.agentId;
    console.log("ViewAgents HandleCardClick Clicked!");
    // setSelectedAgent(agent);
    goToPage(`/agents/detail/${agentName}/${agentId}`);
  };
  const router = useRouter;
  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(name);
  }
  useEffect(() => {
    if (isInView) {
      console.log(`LOAD MORE AGENTS ${offset}`);
      // loadMoreUsers(offset);
    }
  }, [isInView]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem className="text-white" active>
          Agents
        </BreadcrumbItem>
      </Breadcrumb>
      <div ref={containerRef}>
        <Row className="text-primary">
          {/* <h5 className="mb-3 mt-3">Free Agents</h5>

          <IntelliCardGroupRow></IntelliCardGroupRow>
          <div
            style={{
              paddingRight: "16px",
              paddingTop: "16px",
              textAlign: "left",
            }}
          >
            <Button className="btn" color="primary">
              Regenerate
            </Button>
            &nbsp;
            <Button className="btn" color="primary">
              Create an Agent
            </Button>
          </div> */}

          {/* <h5 className="mb-3 mt-3">Roster</h5> */}
          {/* <IntelliCardGroupRow></IntelliCardGroupRow>
          <IntelliCardGroupRow></IntelliCardGroupRow> */}
          <IntelliCardGroup
            handleCardClick={handleCardClick}
            datums={agents}
            datumsType={"agents"}
          ></IntelliCardGroup>
          <IntelliFab onClick={handleFabClick} icon="+" />

          {/* </Col> */}
        </Row>
      </div>
    </>
  );
};

export default ViewAgents;
