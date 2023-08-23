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
const PAGE_COUNT = 6;
const supabase = getSupabase();
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
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
      .eq("userId", user.sub)
      .limit(PAGE_COUNT)
      .order("agentId", { ascending: false });

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
  const [isLast, setIsLast] = useState(false);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [loadedAgents, setLoadedAgents] = useState(agents);
  // const agentNames = agents.map((agent) => agent.agentName);
  useEffect(() => {
    const handleDebouncedScroll = debounce(
      () => !isLast && handleScroll(),
      200
    );
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
    if (!isLast) {
      const loadMoreAgents = async () => {
        const from = offset * PAGE_COUNT;
        const to = from + PAGE_COUNT - 1;
        setOffset((prev) => prev + 1);

        const { data } = await supabase
          .from("agents")
          .select("*")
          .range(from, to)
          .order("createdAt", { ascending: false });
        console.log("load more agents data");

        console.log(data);
        return data;
      };

      if (isInView) {
        console.log(`LOAD MORE AGENTS ${offset}`);
        loadMoreAgents().then((moreAgents) => {
          console.log("moreAgents");
          console.log(moreAgents);
          setLoadedAgents([...loadedAgents, ...moreAgents]);
          if (moreAgents.length < PAGE_COUNT) {
            setIsLast(true);
          }
          // setLoadedAgents((prev) => [...prev, ...moreAgents]);
        });
      }
    }
  }, [isInView, isLast]);

  // }
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem className="text-white" active>
          <i className={`bi bi-file-earmark-person-fill`}></i>
          &nbsp; Agents
        </BreadcrumbItem>
      </Breadcrumb>
      <div style={{ marginBottom: "8px", textAlign: "right" }}>
        <Button style={{ border: "1px solid white" }} onClick={handleFabClick}>
          <i className="bi bi-file-earmark-person-fill"></i>+ Create Agent
        </Button>
      </div>
      {/* <div>{JSON.stringify(loadedAgents)}</div> */}
      <div ref={containerRef}>
        <Row className="text-primary">
          <IntelliCardGroup
            handleCardClick={handleCardClick}
            datums={loadedAgents}
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
