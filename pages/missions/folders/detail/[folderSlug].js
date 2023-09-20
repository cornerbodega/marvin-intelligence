import { Button, Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import useRouter from "next/router";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
// other imports
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import IntelliCardGroup from "../../../../components/IntelliCardGroup";
import { getSupabase } from "../../../../utils/supabase";
import Link from "next/link";
import IntelliFab from "../../../../components/IntelliFab";
import getCloudinaryImageUrlForHeight from "../../../../utils/getCloudinaryImageUrlForHeight";
// rest of component
import { slugify } from "../../../../utils/slugify";
const PAGE_COUNT = 6;
const supabase = getSupabase();
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const folderId = context.params.folderSlug.split("-")[0];
    const session = await getSession(context.req, context.res);
    const user = session?.user;

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

    let { data: missionsResponse, error } = await supabase
      .from("reportFolders")
      .select(
        `
      folders (folderName, folderDescription, folderPicUrl),
      reports (reportTitle, reportPicUrl, reportId)
    `
      )
      .eq("folderId", folderId);
    // .limit(3);

    let { data: linksResponse, error: linksError } = await supabase
      .from("links")
      .select("parentReportId, childReportId");

    if (error || linksError) {
      // handle errors
      console.error(error);
      console.error(linksError);
      // return {
      //   notFound: true,
      // };
    }

    // function structureData(foldersResponse, linksResponse) {
    //   // Your logic here to structure the data hierarchically, for example:

    //   const reportMap = new Map();

    //   foldersResponse.forEach((folder) => {
    //     folder.reports.forEach((report) => {
    //       reportMap.set(report.reportId, {
    //         ...report,
    //         children: [],
    //       });
    //     });
    //   });

    //   linksResponse.forEach((link) => {
    //     const parentReport = reportMap.get(link.parentReportId);
    //     const childReport = reportMap.get(link.childReportId);

    //     if (parentReport && childReport) {
    //       parentReport.children.push(childReport);
    //     }
    //   });

    //   return foldersResponse;
    // }

    // // here you would structure the data into a hierarchical/nested format
    // const structuredData = structureData(foldersResponse, linksResponse);

    const missions = [];
    let folderName = "";
    let folderDescription = "";
    let folderPicUrl = "";
    missionsResponse.forEach((mission) => {
      missions.push(mission.reports);
      folderName = mission.folders.folderName;
      folderDescription = mission.folders.folderDescription;
      folderPicUrl = mission.folders.folderPicUrl;
    });
    console.log("missions");
    console.log(missions);

    return {
      props: {
        missions,
        folderName,
        folderId,
        folderDescription,
        folderPicUrl,
        // structuredData,
      },
    };
  },
});
const ViewReports = ({
  missions,
  folderName,
  folderId,
  folderDescription,
  folderPicUrl,
}) => {
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
  // useEffect(() => {
  //   if (!isLast) {
  //     const loadMoreReports = async () => {
  //       const from = offset * PAGE_COUNT;
  //       const to = from + PAGE_COUNT - 1;
  //       const { data } = await supabase
  //         .from("reportFolders")
  //         .select(
  //           `
  //         folders (folderName, folderDescription, folderPicUrl),
  //         reports (reportTitle, reportPicUrl, reportId)
  //         `
  //         )
  //         .eq("folderId", folderId)
  //         .range(from, to)
  //         .order("createdAt", { ascending: false });
  //       // .limit(3);
  //       setOffset((prev) => prev + 1);
  //       return data;
  //       // const { data } = await supabase
  //       //   // .from("reports")
  //       //   // .select("*")
  //       //   .from("reportFolders")
  //       //   .select("reports (reportTitle, reportPicUrl, reportId)")
  //       //   .eq("folderId", folderId)
  //       //   .range(from, to)
  //       //   .order("createdAt", { ascending: false });
  //       // console.log("load more missions data");

  //       // console.log(data);
  //     };

  //     if (isInView) {
  //       console.log(`LOAD MORE REPORTS ${offset}`);
  //       loadMoreReports().then((moreReports) => {
  //         console.log("moreReports");
  //         console.log(moreReports);
  //         if (!moreReports) {
  //           return setIsLast(true);
  //         }
  //         // setLoadedReports([...loadedReports, ...moreReports]);
  //         // if (moreReports.length < PAGE_COUNT) {
  //         //   setIsLast(true);
  //         // }
  //         // setLoadedReports((prev) => [...prev, ...moreReports]);
  //       });
  //     }
  //   }
  // }, [isInView, isLast]);

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
            href="/missions/folders/view-folders"
          >
            Reports
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
        <Row>
          <Col
            style={{
              maxWidth: "300px",
              marginBottom: "20px",
            }}
          >
            <div>
              <img
                style={{ borderRadius: "7px" }}
                src={`${getCloudinaryImageUrlForHeight(folderPicUrl, 300)}`}
              />
            </div>
          </Col>
          <Col>
            <div
              style={{
                fontSize: "0.75em",
                marginTop: "10px",
                marginBottom: "16px",
              }}
            >
              <div>{folderDescription}</div>
              <div>
                {/* <ul>
                  <li>1</li>
                  <li>
                    <ul>
                      <li>2</li>
                    </ul>
                  </li>
                </ul> */}
              </div>
            </div>
          </Col>
        </Row>

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
