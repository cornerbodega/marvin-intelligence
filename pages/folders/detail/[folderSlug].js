import { Button, Row, Breadcrumb, BreadcrumbItem } from "reactstrap";
import useRouter from "next/router";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
// other imports
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

import IntelliCardGroup from "../../../components/IntelliCardGroup";
import { getSupabase } from "../../../utils/supabase";
import Link from "next/link";
import IntelliFab from "../../../components/IntelliFab";
// rest of component
import { slugify } from "../../../utils/slugify";
const PAGE_COUNT = 6;
const supabase = getSupabase();
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const folderId = context.params.folderSlug.split("-")[0];
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
    //   let { data: missions, error } = await supabase
    //     .from("reportFolders")
    //     .select(
    //       `
    //   folderId,
    //   reports:*
    // `
    //     )
    //     .eq("folderId", folderId)
    //     .limit(PAGE_COUNT)
    //     .order("reportId", { ascending: false });

    //   if (error) {
    //     console.error(error);
    //   }
    // let { data: missions, error } = await supabase
    // .from('reportFolders')
    // .select('reports:*')
    // .eq('folderId', folderId);
    let { data: missionsResponse, error } = await supabase
      .from("reportFolders")
      .select(
        `
      folders (folderName),
      reports (reportTitle, reportPicUrl, reportId)
    `
      )
      .eq("folderId", folderId);

    if (error) {
      console.error(error);
    }

    const missions = [];
    let folderName = "";
    missionsResponse.forEach((mission) => {
      missions.push(mission.reports);
      folderName = mission.folders.folderName;
    });
    console.log("missions");
    console.log(missions);
    // let { data: missions, error } = await supabase
    //   .from("reports")
    //   .select("*")
    //   .eq("userId", user.sub)
    //   .eq("reportFolders.folderId", folderId)
    //   // .join("reportFolders", { foreignKey: "reportId" })
    //   .limit(PAGE_COUNT)
    //   .order("reportId", { ascending: false });
    // console.log("supabase.join");
    // console.log(supabase.join);
    // let { data: missions, error } = await supabase
    //   .from("reports")
    //   .select("*")
    //   .eq("userId", user.sub)
    //   .eq("reportFolders.folderId", folderId)
    //   .join("reportFolders", { foreignKey: "reportId" })
    //   .limit(PAGE_COUNT)
    //   .order("reportId", { ascending: false });
    // let { data: missions, error } = await supabase
    //   .from("reports")
    //   .select("*")
    //   .eq("userId", user.sub)
    //   .join("reportFolders", { foreignKey: "reportId" })
    //   // .eq("folderId", folderId)
    //   .limit(PAGE_COUNT)
    //   .order("reportId", { ascending: false });

    // let { data: missions, error } = await supabase
    //   .from("reports")
    //   .select("reports.*")
    //   .eq("reports.userId", user.sub)
    //   .eq("reportFolders.folderId", folderId)
    //   .join("reportFolders", "reportId", {
    //     foreignTable: "reports",
    //     foreignColumn: "reportId",
    //   })
    //   .limit(PAGE_COUNT)
    //   .order("reports.reportId", { ascending: false });

    // other pages will redirect here if they're empty
    // If no agency, go to create agency page
    // If no missions, go to crete report page
    // let agency;
    return {
      props: { missions, folderName, folderId },
    };
  },
});
const ViewReports = ({ missions, folderName, folderId }) => {
  const [isLast, setIsLast] = useState(false);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [loadedReports, setLoadedReports] = useState(missions);
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
    const reportTitle = report.reportTitle;
    const reportId = report.reportId;

    console.log("report");
    console.log(report);
    console.log("ViewReports HandleCardClick Clicked!");

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
          // .from("reports")
          // .select("*")
          .from("reportFolders")
          .select("reports (reportTitle, reportPicUrl, reportId)")
          .eq("folderId", folderId)
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
          if (!moreReports) {
            return setIsLast(true);
          }
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
          &nbsp;
          <Link
            style={{ textDecoration: "none", fontWeight: "300" }}
            className="text-white"
            href="/folders/view-folders"
          >
            {" "}
            Folders
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem
          className="text-white"
          style={{ fontWeight: "800" }}
          active
        >
          {folderName}
        </BreadcrumbItem>
      </Breadcrumb>

      {/* <div>{JSON.stringify(loadedReports)}</div> */}
      <div ref={containerRef}>
        <Row className="text-primary">
          <IntelliCardGroup
            offset={offset}
            handleCardClick={handleCardClick}
            datums={loadedReports}
            datumsType={"missions"}
          ></IntelliCardGroup>

          {/* <IntelliFab onClick={handleFabClick} icon="+" fabType="report" /> */}

          {/* </Col> */}
        </Row>
      </div>
    </>
  );
};

export default ViewReports;
