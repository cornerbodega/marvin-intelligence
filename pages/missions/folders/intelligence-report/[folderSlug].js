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
      reports (reportTitle, reportPicUrl, reportId, reportContent)
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
    }

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
  // useEffect(() => {
  //   const handleDebouncedScroll = debounce(
  //     () => !isLast && handleScroll(),
  //     200
  //   );
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
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
    async function getLinks(report) {
      let { data: links, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("parentReportId", report.reportId);

      if (linksError) {
        console.log("linksError", linksError);
        return;
      }

      if (links && links.length > 0) {
        const container = document.createElement("div");
        container.innerHTML = report.reportContent;

        links.forEach((link) => {
          const element = container.querySelector(`[id="${link.elementId}"]`);
          let highlightedText = (() => {
            try {
              return JSON.parse(link.highlightedText);
            } catch {
              return link.highlightedText;
            }
          })();

          if (element) {
            // const newLink = `<a href="/missions/report/${link.childReportId}">${highlightedText}</a>`;

            const newLink = `<a href="#${link.childReportId}">${highlightedText}</a>`;

            const updatedHTML = element.innerHTML.replace(
              highlightedText,
              newLink
            );
            element.innerHTML = updatedHTML;
          }
        });

        report.reportContent = container.innerHTML; // Update the reportContent directly
      }
    }
    async function updateReports() {
      const updatedReports = await Promise.all(
        loadedReports.map(async (report) => {
          const clonedReport = { ...report }; // Create a shallow copy
          await getLinks(clonedReport); // Update the cloned report's content
          return clonedReport; // Return the updated report
        })
      );

      // Compare if there’s a change in the reports, then only update the state
      const isChanged = updatedReports.some(
        (report, index) =>
          report.reportContent !== loadedReports[index].reportContent
      );

      if (isChanged) {
        setLoadedReports((prevReports) => {
          return updatedReports.map((report, index) => {
            return report.reportContent !== prevReports[index].reportContent
              ? report
              : prevReports[index]; // Avoid updating the item if there's no change
          });
        });
      }
    }

    updateReports();
  }, [supabase]);

  // useEffect(() => {
  //   async function getLinks(report) {
  //     let { data: links, error: linksError } = await supabase
  //       .from("links")
  //       .select("*")
  //       .eq("parentReportId", report.reportId);

  //     if (linksError) {
  //       console.log("linksError", linksError);
  //       return;
  //     }
  //     console.log("reportSlug link");
  //     console.log(links);
  //     if (links && links.length > 0) {
  //       const container = document.createElement("div");
  //       container.innerHTML = report.reportContent;
  //       // console.log("report.reportContent");
  //       // console.log(report.reportContent);

  //       links.forEach((link) => {
  //         const element = container.querySelector(`[id="${link.elementId}"]`);
  //         // let highlightedText = JSON.parse(link.highlightedText);
  //         let highlightedText = (() => {
  //           try {
  //             return JSON.parse(link.highlightedText);
  //           } catch {
  //             return link.highlightedText;
  //           }
  //         })();
  //         // if (typeof link.highlightedText !== "string") {
  //         // highlightedText = JSON.parse(link.highlightedText);
  //         // } else {
  //         // highlightedText =
  //         // }
  //         console.log("reportSlug element");
  //         console.log(element);
  //         console.log("reportSlug highlightedText");
  //         console.log(highlightedText);
  //         if (element) {
  //           const newLink = `<a href="/missions/report/${link.childReportId}">${highlightedText}</a>`;
  //           const updatedHTML = element.innerHTML.replace(
  //             highlightedText,
  //             newLink
  //           );
  //           console.log("updatedHTML");
  //           console.log(updatedHTML);
  //           element.innerHTML = updatedHTML;
  //         }
  //       });

  //       setLoadedReports(loadedReports.replace(report, container.innerHTML));
  //     }
  //   }

  //   // getLinks(report);
  //   loadedReports.forEach((report) => {
  //     getLinks(report);
  //   });
  // }, [loadedReports]);
  useEffect(() => {
    if (!isLast) {
      const loadMoreReports = async () => {
        const from = offset * PAGE_COUNT;
        const to = from + PAGE_COUNT - 1;
        const { data } = await supabase
          .from("reportFolders")
          .select(
            `
            folders (folderName, folderDescription, folderPicUrl),
            reports (reportTitle, reportPicUrl, reportId, reportContent)
          `
          )
          .eq("folderId", folderId)
          .range(from, to)
          .order("createdAt", { ascending: false });
        // .limit(3);
        setOffset((prev) => prev + 1);
        return data;
      };

      if (isInView) {
        console.log(`LOAD MORE REPORTS ${offset}`);
        loadMoreReports().then((moreReports) => {
          console.log("moreReports");
          console.log(moreReports);
          if (!moreReports) {
            return setIsLast(true);
          }
        });
      }
    }
  }, [isInView, isLast]);

  // }
  return (
    <div style={{ maxWidth: "90%" }}>
      <Breadcrumb style={{ marginTop: "65px" }}>
        {/* <BreadcrumbItem className="text-white" active>
          <i className={`bi bi-folder`}></i>
          &nbsp;
          <Link
            style={{ textDecoration: "none", fontWeight: "300" }}
            className="text-white"
            href="/missions/folders/view-folders"
          >
            Reports
          </Link>
        </BreadcrumbItem> */}

        <BreadcrumbItem
          className="text-white reportFont"
          style={{ fontWeight: "800", fontSize: "2em" }}
          active
        >
          {folderName}
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="folder-section report-section">
        {/* <div className="title-container">
        </div> */}
        <div className="content-container">
          <a href={folderPicUrl} target="_blank" rel="noopener noreferrer">
            <div className="image-container">
              <img src={folderPicUrl} className="middle-image " alt="Folder" />
            </div>
          </a>

          <div
            className="report text-primary reportFont folder-description"
            dangerouslySetInnerHTML={{ __html: folderDescription }}
          />
        </div>

        {/* <div className="content-container">
          <a href={folderPicUrl} target="_blank" rel="noopener noreferrer">
            <div className="image-container">
              <img
                src={folderPicUrl}
                // className="folder-image report-image"
                className="middle-image"
                alt="Folder"
              />
            </div>
          </a>

          <div
            className="report text-primary reportFont folder-description"
            dangerouslySetInnerHTML={{ __html: folderDescription }}
          />
        </div> */}
      </div>
      <div className="reportFont section-title" style={{ marginTop: "30px" }}>
        Table of Contents
      </div>

      {/* <div>
        <img src={folderPicUrl} className="folder-image" alt="Folder" />
        <div className="reportFont">{folderDescription}</div>
      </div> */}
      {/* <div className="reportFont" style={{ marginTop: "30px" }}>
        Table of Contents
      </div> */}
      {/* {<div>{JSON.stringify(loadedReports)}</div>} */}
      {loadedReports.map((cols, index) => {
        const report = loadedReports[index];
        const reportId = loadedReports[index].reportId;
        const reportTitle = loadedReports[index].reportContent
          .split(`<h2 id="reportTitle">`)[1]
          .split(`</h2>`)[0];
        const __html = `<div className="report">${
          loadedReports[index].reportContent
            .split(`<h2 id="reportTitle">`)[1]
            .split(`</h2>`)[1]
        }`;

        console.log("reportTitle");
        console.log(reportTitle);
        console.log("__html");
        console.log(__html);
        return (
          <div key={index} id={reportId} className="report-section">
            <div className="title-container">
              <div className="reportTitle reportFont section-title">
                {reportTitle}
              </div>

              {index !== 0 && (
                <a href="#top" className="top-button text-white">
                  🔝
                </a>
              )}
            </div>

            {report.reportPicUrl && (
              <a
                href={report.reportPicUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={report.reportPicUrl}
                  alt="Report Image"
                  className="report-image"
                />
              </a>
            )}

            <div
              id="reportRoot"
              className="report text-primary reportFont"
              dangerouslySetInnerHTML={{ __html }}
            />
          </div>

          // <div key={index} id={reportId} className="report-section">
          //   <div className="title-container">
          //     <div className="reportTitle reportFont section-title">
          //       {reportTitle}
          //     </div>

          //     {index !== 0 && (
          //       <a href="#top" className="top-button text-white">
          //         🔝
          //       </a>
          //     )}
          //   </div>

          //   <div
          //     className={`content-container ${
          //       index % 2 === 0 ? "left" : "right"
          //     }`}
          //   >
          //     {report.reportPicUrl && (
          //       <img
          //         src={report.reportPicUrl}
          //         alt="Report Image"
          //         className="report-image"
          //       />
          //     )}

          //     <div
          //       id="reportRoot"
          //       className="report text-primary reportFont"
          //       dangerouslySetInnerHTML={{ __html }}
          //     />
          //   </div>
          // </div>

          // <div key={index} id={reportId} className="report-section">
          //   <div className="title-container">
          //     <div className="reportTitle reportFont section-title">
          //       {reportTitle}
          //     </div>

          //     {index !== 0 && (
          //       <a href="#top" className="top-button text-white">
          //         🔝
          //       </a>
          //     )}
          //   </div>

          //   <div
          //     className={`content-container ${
          //       index % 2 === 0 ? "left" : "right"
          //     }`}
          //   >
          //     {report.reportPicUrl && (
          //       <img
          //         src={report.reportPicUrl}
          //         alt="Report Image"
          //         className="report-image"
          //       />
          //     )}

          //     <div
          //       id="reportRoot"
          //       className="report text-primary reportFont"
          //       dangerouslySetInnerHTML={{ __html }}
          //     />
          //   </div>
          // </div>

          // works
          // <div key={index} id={reportId} style={{ position: "relative" }}>
          //   {index % 2 === 0 && (
          //     <img
          //       src={report.reportPicUrl}
          //       alt="Report Image"
          //       className="report-image left"
          //     />
          //   )}
          //   <div className="title-container">
          //     <div className="reportTitle reportFont section-title">
          //       {reportTitle}
          //     </div>

          //     {/* Conditionally render the top button if it's not the first div */}
          //     {index == loadedReports.length - 1 && (
          //       <a href="#top" className="top-button text-white">
          //         🔝
          //       </a>
          //     )}
          //   </div>
          //   <div
          //     id="reportRoot"
          //     style={{ marginRight: "36px" }}
          //     // onMouseUp={handleTextHighlight}
          //     className="report text-primary reportFont"
          //     dangerouslySetInnerHTML={{
          //       __html,
          //       // const draftTitle = draft;
          //     }}
          //   />
          // </div>
        );
      })}

      {/* <div>{JSON.stringify(loadedReports)}</div> */}
      {/* <div ref={containerRef}>
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
              <div></div>
            </div>
          </Col>
        </Row>
        {JSON.stringify(loadedReports)}
       
      </div> */}
      {/* <Row className="text-primary">
          <IntelliCardGroup
            offset={offset}
            handleCardClick={handleCardClick}
            datums={loadedReports}
            datumsType={"missions"}
          ></IntelliCardGroup>
        </Row> */}
    </div>
  );
};

export default ViewReports;
