import { Button, Row, Breadcrumb, BreadcrumbItem } from "reactstrap";
import useRouter from "next/router";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
// other imports
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import IntelliCardGroup from "../../components/IntelliCardGroup";

import { getSupabase } from "../../utils/supabase";

import IntelliFab from "../../components/IntelliFab";
// rest of component
import { slugify } from "../../utils/slugify";
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

    let { data: folders, error } = await supabase
      .from("folders")
      .select("*")
      .eq("userId", user.sub)
      .filter("folderName", "neq", null)
      .filter("folderPicUrl", "neq", null)
      .limit(PAGE_COUNT)
      .order("folderId", { ascending: false });
    console.log("folders");
    console.log(folders);
    // other pages will redirect here if they're empty
    // If no agency, go to create agency page
    // If no missions, go to crete report page
    // let agency;
    return {
      props: { folders },
    };
  },
});
const ViewReports = ({ folders }) => {
  const [isLast, setIsLast] = useState(false);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [loadedReports, setLoadedReports] = useState(folders);
  console.log("loadedReports");
  console.log(loadedReports);
  // const reportNames = missions.map((report) => report.reportName);
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
  // useEffect(() => {
  //   if (!missions || missions.length === 0) {
  //     goToPage("/missions/view-missions");
  //   }
  // });

  const handleScroll = (container) => {
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      setIsInView((prev) => bottom <= innerHeight);
    }
  };
  const handleFabClick = () => {
    console.log("ViewReports HandleClick Clicked!");
    goToPage("/missions/create-mission/agents/view-agents");
  };
  const handleCardClick = (report) => {
    // console.log("handleCardClick");
    // const reportName = event.target.dataset.datums.reportName;
    const reportTitle = report.reportTitle;
    const reportId = report.reportId;

    console.log("ViewReports HandleCardClick Clicked!");
    // setSelectedReport(report);
    const reportSlug = slugify(`${reportId}-${reportTitle}`);
    goToPage(`/missions/report/${reportSlug}`);
  };
  const router = useRouter;
  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(name);
  }
  useEffect(() => {
    if (!isLast) {
      const loadMoreReports = async () => {
        const from = offset * PAGE_COUNT;
        const to = from + PAGE_COUNT - 1;
        setOffset((prev) => prev + 1);

        const { data } = await supabase
          .from("folders")
          .select("*")
          .range(from, to)
          .order("createdAt", { ascending: false });
        console.log("load more missions data");

        console.log(data);
        return data;
      };

      if (isInView) {
        console.log(`LOAD MORE AGENTS ${offset}`);
        loadMoreReports().then((moreReports) => {
          console.log("moreReports");
          console.log(moreReports);
          setLoadedReports([...loadedReports, ...moreReports]);
          if (moreReports.length < PAGE_COUNT) {
            setIsLast(true);
          }
          // setLoadedReports((prev) => [...prev, ...moreReports]);
        });
      }
    }
  }, [isInView, isLast]);

  // }
  return (
    <>
      <Breadcrumb style={{ fontFamily: "monospace" }}>
        <BreadcrumbItem className="text-white" active>
          <i className={`bi bi-folder`}></i>
          &nbsp; Folders
        </BreadcrumbItem>
      </Breadcrumb>

      {/* <div>{JSON.stringify(loadedReports)}</div> */}
      <div ref={containerRef}>
        <Row className="text-primary">
          <IntelliCardGroup
            offset={offset}
            handleCardClick={handleCardClick}
            datums={loadedReports}
            datumsType={"folders"}
          ></IntelliCardGroup>
          {/* <IntelliFab onClick={handleFabClick} icon="+" fabType="folders" /> */}

          {/* </Col> */}
        </Row>
      </div>
    </>
  );
};

export default ViewReports;
