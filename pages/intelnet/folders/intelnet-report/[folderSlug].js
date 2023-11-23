import { Button, Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import useRouter from "next/router";
import { useEffect, useRef, useState } from "react";

// import _, { debounce, get, has, set } from "lodash";
// other imports
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
// import IntelliCardGroup from "../../../../components/IntelliCardGroup";
import { getSupabase } from "../../../../utils/supabase";
// import Link from "next/link";
import IntelliFab from "../../../../components/IntelliFab";
import getCloudinaryImageUrlForHeight from "../../../../utils/getCloudinaryImageUrlForHeight";
// rest of component
// import { slugify } from "../../../../utils/slugify";
// const PAGE_COUNT = 6;
const supabase = getSupabase();
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingDots from "../../../../components/LoadingDots";
import { useFirebaseListener } from "../../../../utils/useFirebaseListener";
import saveTask from "../../../../utils/saveTask";
import Head from "next/head";
import Router from "next/router";
import _ from "lodash";
import IntelliPrint from "../../../../components/IntelliPrint/IntelliPrint";
import IntelliCopyUrl from "../../../../components/IntelliCopyUrl/IntelliCopyUrl";

// import { child } from "@firebase/database";
// export const getServerSideProps = withPageAuthRequired({
// export const getServerSideProps = withPageAuthRequired({
export async function getServerSideProps(context) {
  console.log("context.params.folderSlug");
  console.log(context.params.folderSlug);
  console.log(context.params);
  const folderId = context.params.folderSlug.split("-")[0];
  if (!folderId) {
    console.log("Error! No folder Id");
    return {};
  }
  // const session = await getSession(context.req, context.res);
  // const user = session?.user;

  // let { data: agency, agencyError } = await supabase
  //   .from("users")
  //   .select("agencyName")
  //   .eq("userId", user.sub);
  // if (agencyError) {
  //   console.log("agencyError");
  // }
  // console.log("agency");
  // console.log(agency);
  // if (!agency || agency.length === 0) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/agency/create-agency",
  //     },
  //     props: {},
  //   };
  // }
  let { data: missionsResponse, error } = await supabase
    .from("reportFolders")
    .select(
      `
        reportId,
        folderId,
        folders:folders (
            folderName,
            folderDescription,
            folderPicDescription,
            folderPicUrl
        ),
        reports:reports (
            reportTitle,
            reportPicUrl,
            reportPicDescription,
            reportId,
            reportContent,
            agentId,
            agent:agentId (
                agentId,
                agentName,
                expertise1,
                expertise2,
                expertise3,
                specializedTraining

            )
        )
    `
    )
    .eq("folderId", folderId);
  // .limit(3);  // You can uncomment this and adjust as needed

  // Get the list fo users who have liked this folder
  // Get the list fo users who have liked this folder
  let { data: _folderLikes, folderLikesError } = await supabase
    .from("folderLikes")
    .select()
    .eq("folderId", folderId);

  if (!_folderLikes) {
    _folderLikes = [];
  }
  if (folderLikesError) {
    console.error("folderLikesError");
    console.error(folderLikesError);
  }
  // Log the results and errors for debugging
  console.log("missionsResponse");
  console.log(missionsResponse);
  console.log("folderId");
  console.log(folderId);
  console.error(error);

  // let { data: missionsResponse, error } = await supabase
  //   .from("reportFolders")
  //   .select(
  //     `
  //   folders (folderName, folderDescription, folderPicUrl),
  //   reports (reportTitle, reportPicUrl, reportId, reportContent, agentId)
  //   ))
  // `
  //   )
  //   .eq("folderId", folderId);
  // // .limit(3);
  console.log("missionsResponse");
  console.log(missionsResponse);
  if (!missionsResponse || missionsResponse.length === 0) {
    return console.log("No missions found");
  }
  let expertises = [];
  let agentId = 0;
  let specializedTraining = "";
  if (missionsResponse[0].reports.agent) {
    agentId = missionsResponse[0].reports.agent.agentId;

    if (missionsResponse[0].reports.agent.expertise1) {
      expertises.push(missionsResponse[0].reports.agent.expertise1);
    }
    if (missionsResponse[0].reports.agent.expertise2) {
      expertises.push(missionsResponse[0].reports.agent.expertise2);
    }
    if (missionsResponse[0].reports.agent.expertise3) {
      expertises.push(missionsResponse[0].reports.agent.expertise3);
    }

    if (missionsResponse[0].reports.agent.specializedTraining) {
      specializedTraining =
        missionsResponse[0].reports.agent.specializedTraining;
    }
  }
  let { data: linksResponse, error: linksError } = await supabase
    .from("links")
    .select("parentReportId, childReportId");

  if (error || linksError) {
    // handle errors
    console.error(error);
    console.error(linksError);
  }

  const _loadedReports = [];
  let _folderName = "";
  let _folderDescription = "";
  let _folderPicDescription = "";
  let _folderPicUrl = "";
  let _folderPicUrls = "";

  missionsResponse.forEach((mission) => {
    _loadedReports.push(mission.reports);
    // console.log("mission.folders");
    // console.log(mission.folders);
    _folderName = mission.folders.folderName;
    _folderDescription = mission.folders.folderDescription;
    _folderPicDescription = mission.folders.folderPicDescription;
    _folderPicUrl = mission.folders.folderPicUrl;
    // _folderPicUrls = mission.folders.folderPicUrls;
    // if (_folderPicUrls) {
    //   _folderPicUrls = JSON.parse(_folderPicUrls);
    // }
    // if (_folderPicUrls) {
    //   _folderPicUrls = JSON.parse(_folderPicUrls);
    // }
  });
  // console.log("missions");
  // console.log(missions);

  return {
    props: {
      _loadedReports,
      _folderName,
      folderId,
      _folderDescription,
      _folderPicDescription,
      _folderPicUrl,
      // _folderPicUrls,
      agentId,
      expertises,
      specializedTraining,
      _folderLikes,
      // structuredData,
    },
  };
}

const ViewReports = ({
  _loadedReports,
  _folderName,
  folderId,
  _folderDescription,
  _folderPicDescription,
  _folderPicUrl,
  // _folderPicUrls,
  agentId,
  expertises,
  specializedTraining,
  _folderLikes,
}) => {
  // console.log("useUser");
  // console.log(useUser);
  // parentReportId,
  // userId,
  // parentReportContent,
  // agentId,
  // expertises,
  // specializedTraining,

  const { user, error } = useUser();
  const userId = user ? user.sub : null;
  const [isLast, setIsLast] = useState(false);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [loadedReports, setLoadedReports] = useState(_loadedReports);
  // const [tableOfContents, setTableOfContents] = useState([]);
  const [highlight, setHighlight] = useState({
    text: "",
    startIndex: undefined,
    endIndex: undefined,
  });
  const [isStreaming, setIsStreaming] = useState(false);
  // let folderName = "";
  const [folderName, setFolderName] = useState(_folderName);
  const [folderDescription, setFolderDescription] =
    useState(_folderDescription);
  const [folderPicDescription, setFolderPicDescription] = useState(
    _folderPicDescription
  );
  const [folderPicUrl, setFolderPicUrl] = useState(_folderPicUrl);
  const [reportLinksMap, setReportLinksMap] = useState({});
  const [reportPicUrl, setReportPicUrl] = useState("");
  const [continuumCompleted, setContinuumCompleted] = useState(false);
  const [draft, setDraft] = useState("");
  const [hasStartedContinuum, setHasStartedContinuum] = useState(false);
  const [loadedAgentId, setLoadedAgentId] = useState(agentId);
  const firebaseSaveData = useFirebaseListener(
    user
      ? `/${
          process.env.NEXT_PUBLIC_env === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${
          process.env.NEXT_PUBLIC_serverUid
        }/${userId}/finalizeAndVisualizeReport/context/`
      : null
  );
  // const [folderPicUrls, setFolderPicUrls] = useState(_folderPicUrls);
  const [agent, setAgent] = useState({});
  // const folderPicUrls = [
  //   "http://res.cloudinary.com/dcf11wsow/image/upload/v1696728907/ft5rhqfvmq8mh4dszaut.png",
  //   "http://res.cloudinary.com/dcf11wsow/image/upload/v1696729485/tyohgp0u2yhppkudbs0k.png",
  //   "http://res.cloudinary.com/dcf11wsow/image/upload/v1696729819/xxqdjwhogtlhhyzhxrdf.png",
  //   "http://res.cloudinary.com/dcf11wsow/image/upload/v1696731503/n3pif850qts0vhaflssc.png",
  // ];
  // const [currentfolderPicUrlIndex, setCurrentfolderPicUrlIndex] = useState(
  //   folderPicUrls ? Math.floor(Math.random() * folderPicUrls.length) : 0
  // );
  const firebaseFolderData = useFirebaseListener(
    user
      ? `/${
          process.env.NEXT_PUBLIC_env === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${
          process.env.NEXT_PUBLIC_serverUid
        }/${userId}/regenerateFolder/context`
      : null
  );
  const firebaseDraftData = useFirebaseListener(
    user
      ? `/${
          process.env.NEXT_PUBLIC_env === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${process.env.NEXT_PUBLIC_serverUid}/${userId}/continuum/`
      : null
  );
  // const firebaseContinuumStatus = useFirebaseListener(
  //   user ? `/${process.env.NEXT_PUBLIC_env === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${userId}/contu/status` : null
  // );
  const [likes, setLikes] = useState(
    _folderLikes.map((like) => like.likeValue).reduce((a, b) => a + b, 0)
  ); // const [hasLiked, setHasLiked] = useState(likes === 0 ? false : true);
  // console.log("_folderLikes");
  // console.log(_folderLikes);
  // console.log("likes");
  // console.log(likes);
  async function fetchUpdatedReports() {
    console.log("FETCH UPDATED REPORTS");
    // Fetch the updated data from the database using the folderId
    let { data: updatedMissionsResponse, error: updatedError } = await supabase
      .from("reportFolders")
      .select(
        `
              folders (folderName, folderDescription, folderPicUrl),
              reports (reportTitle, reportPicUrl, reportPicDescription, reportId, reportContent, reportPicDescription)
          `
      )
      .eq("folderId", folderId);
    console.log("updatedMissionsResponse");
    console.log(updatedMissionsResponse);
    if (updatedError) {
      console.error(updatedError);
      return;
    }

    const updatedMissions = [];
    updatedMissionsResponse.forEach((mission) => {
      updatedMissions.push({ ...mission.reports });
      // console.log("mission.folders");
      // console.log(mission.folders);
      // setFolderName(mission.folders.folderName);
      // setFolderDescription(mission.folders.folderDescription);
      // console.log("mission.folders.folderDescription");
      // console.log(mission.folders.folderDescription);
      // setFolderPicUrl(mission.folders.folderPicUrl);
    });

    console.log("SET LOADED REPORTS");
    console.log(updatedMissions);
    // Update the state with the newly fetched data
    setLoadedReports(updatedMissions);
    updateReports(updatedMissions); // this one sets links on initial load
  }
  function goToAgentProfile({ agentId }) {
    // console.log("goToAgentProfile");
    // console.log(agentId);

    Router.push({
      pathname: "/agents/detail/draft-report",
      query: { ...Router.query, agentId: agentId },
    });
  }
  useEffect(() => {
    if (firebaseDraftData) {
      // console.log("firebaseDraftData");
      // console.log(firebaseDraftData);
      if (firebaseDraftData.context) {
        setDraft(firebaseDraftData.context.draft);
      }
      if (firebaseDraftData.status == "complete") {
        if (hasStartedContinuum) {
          fetchUpdatedReports();
          setHasStartedContinuum(false);
          setIsStreaming(false);
          // updateReports();
          setContinuumCompleted(true);
        }
      }
    }
  }, [firebaseDraftData]);

  useEffect(() => {
    if (firebaseFolderData) {
      console.log("firebaseFolderData save data");
      console.log(firebaseFolderData);

      if (
        firebaseFolderData.folderId &&
        firebaseFolderData.folderId == folderId &&
        firebaseFolderData.folderPicUrl
      ) {
        console.log("FOUND PHOTO FOR FOLDER");
        // fetchUpdatedReports();
        setFolderName(firebaseFolderData.folderName);
        setFolderDescription(firebaseFolderData.folderDescription);
        setFolderPicUrl(firebaseFolderData.folderPicUrl);
        // if (firebaseFolderData.folderPicUrls) {
        // setFolderPicUrls(firebaseFolderData.folderPicUrls);
        // setCurrentfolderPicUrlIndex(folderPicUrls.length - 1);
        // }
      }
    }
  }, [firebaseFolderData, folderId]); // Added folderId as a dependency

  useEffect(() => {
    if (firebaseSaveData) {
      console.log("firebase save data");

      if (
        firebaseSaveData.folderId &&
        firebaseSaveData.folderId == folderId &&
        firebaseSaveData.reportPicUrl
      ) {
        fetchUpdatedReports();
        updateReports();
      }
      if (firebaseSaveData.agentId && !agentId) {
        setLoadedAgentId(firebaseSaveData.agentId);
      }
    }
  }, [firebaseSaveData, folderId]); // Added folderId as a dependency

  useEffect(() => {
    // get agent from supabase by agentId
    // set agent name
    updateAgent(loadedAgentId);
  }, [loadedAgentId]);
  async function updateAgent(loadedAgentId) {
    let { data: agents, error: agentsError } = await supabase
      .from("agents")
      .select("*")
      .eq("agentId", loadedAgentId);

    if (agentsError) {
      console.log("agentError", agentError);
      return;
    }
    console.log("agent");
    console.log(agents);
    if (agents && agents.length > 0) {
      setAgent(agents[0]);
    }
  }

  // useEffect(() => {
  //   if (firebaseSaveData) {
  //     console.log("firebase save data");
  //     console.log(firebaseSaveData);
  //     console.log(folderId);
  //     if (firebaseSaveData.folderId) {
  //       if (firebaseSaveData.folderId == folderId) {
  //         if (firebaseSaveData.reportPicUrl) {
  //           console.log("FOUND IMAGE!!");
  //           setReportPicUrl(firebaseSaveData.reportPicUrl);
  //           // updateReports();
  //         }
  //       }
  //     }
  //   }
  // }, [firebaseSaveData]);

  useEffect(() => {
    console.log("Updated highlight.text", highlight);
  }, [highlight]);

  const router = useRouter;
  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(name);
  }

  useEffect(() => {
    // This conditional check ensures that updateReports is only called
    // when all necessary conditions are met
    // if (supabase && isStreaming && continuumCompleted) {
    console.log("Continuum Completed. Calling updateReports");
    updateReports(); // this one makes links happen for existing reports
    // }
  }, [supabase, isStreaming, continuumCompleted]); // The dependencies are narrowed down

  async function updateReports(newestReports) {
    console.log("UPDATE REPORTS");
    if (!loadedReports) return;
    let reports = newestReports;
    if (!reports) reports = loadedReports;
    const updatedReports = await Promise.all(
      reports.map(async (report) => {
        const clonedReport = { ...report };
        await getLinks(clonedReport);
        return clonedReport;
      })
    );

    // This checks if any report content has changed
    // const isChanged = updatedReports.some(
    //   (report, index) =>
    //     report.reportContent !== loadedReports[index].reportContent
    // );

    // if (isChanged) {
    console.log("Setting Loaded Reports");
    setLoadedReports(updatedReports); // Simply setting the whole updatedReports array
    // }
  }
  // useEffect(() => {
  //   updateReports();
  // }, [supabase, isStreaming, continuumCompleted]);
  // async function updateReports() {
  //   console.log("UPDATE REPORTS");
  //   if (!loadedReports) return;
  //   const updatedReports = await Promise.all(
  //     loadedReports.map(async (report) => {
  //       const clonedReport = { ...report }; // Create a shallow copy
  //       await getLinks(clonedReport); // Update the cloned report's content
  //       return clonedReport; // Return the updated report
  //     })
  //   );

  //   // Compare if there’s a change in the reports, then only update the state
  //   const isChanged = updatedReports.some(
  //     (report, index) =>
  //       report.reportContent !== loadedReports[index].reportContent
  //   );

  //   if (isChanged) {
  //     console.log("Setting Loaded Reports");
  //     setLoadedReports((prevReports) => {
  //       return updatedReports.map((report, index) => {
  //         return report.reportContent !== prevReports[index].reportContent
  //           ? report
  //           : prevReports[index]; // Avoid updating the item if there's no change
  //       });
  //     });
  //   }
  //   // setIsStreaming(false);
  // }
  async function getLinksForContinuum(reportId) {
    console.log("getLinksForContinuum");
    let { data: links, error: linksError } = await supabase
      .from("links")
      .select("*")
      .eq("parentReportId", reportId);

    if (linksError) {
      console.log("linksError", linksError);
      return;
    }

    // if (links && links.length > 0) {
    //   links.forEach((link) => {
    //     let highlightedText = (() => {
    //       try {
    //         return JSON.parse(link.highlightedText);
    //       } catch {
    //         return link.highlightedText;
    //       }
    //     })();
    //   });
    // }
    console.log("links");
    console.log(links);
    return links;
  }
  async function getLinks(report) {
    let { data: links, error: linksError } = await supabase
      .from("links")
      .select("*")
      .eq("parentReportId", report.reportId);

    if (linksError) {
      console.log("linksError", linksError);
      return;
    }
    console.log("links");
    console.log(links);
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
      console.log(report.reportContent);
    }
  }

  const [parentChildIdMap, setParentChildIdMap] = useState({});

  useEffect(() => {
    async function fetchChildReports(parentReportId) {
      try {
        const response = await fetch("/api/reports/get-children-of-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ parentReportId }),
        });

        if (!response.ok) {
          console.error("Error fetching child reports");
          return [];
        }

        const { childReports } = await response.json();
        // console.log("childReports");
        // console.log(childReports);
        return childReports;
      } catch (error) {
        console.error("Error:", error);
        return [];
      }
    }

    async function getParentChildIdMap() {
      const seenReportIds = [];
      let parentChildIdMap = {};
      let resultParentChildMap = {};
      for (const loadedReport of loadedReports) {
        const reportChildren = await fetchChildReports(loadedReport.reportId);
        parentChildIdMap[loadedReport.reportId] = reportChildren;
      }
      const parentReportIds = Object.keys(parentChildIdMap).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      );

      for (const parentReportId of parentReportIds) {
        console.log("parentReportId");
        const childReports = parentChildIdMap[parentReportId];
        console.log(parentReportId);
        // if (!childReports) continue;
        if (!seenReportIds.includes(parentReportId)) {
          seenReportIds.push(parentReportId);
          if (!resultParentChildMap[parentReportId]) {
            resultParentChildMap[parentReportId] = [];
          }
          childReports.forEach((childReport) => {
            console.log("childReport");
            console.log(childReport);
            if (!seenReportIds.includes(childReport.childReportId)) {
              resultParentChildMap[parentReportId].push(
                childReport.childReportId
              );
            }
            seenReportIds.push(childReport.childReportId);
          });
        }
      }
      // {"1300":[{"childReportId":1301}],"1301":[{"childReportId":1302}],"1302":[{"childReportId":1303}],"1303":[{"childReportId":1304}],"1304":[]}

      // Finding the minimum key to set it as a rootKey

      // const data = {
      //   1197: [1198, 1199, 1200],
      //   1198: [1201, 1203],
      //   1199: [1202],
      //   1200: [1286],
      //   1201: [1204],
      //   1202: [],
      //   1203: [],
      //   1204: [],
      //   1286: [],
      // };

      function buildTree(data) {
        const recurse = (key) => {
          console.log("Processing key:", key);

          const childrenData = data[key];
          if (!childrenData) {
            console.error("Key not found in data:", key);
            return { id: null, children: null };
          }

          const children = childrenData.map((childData) => {
            const childKey = childData.childReportId;
            console.log("Child key:", childKey);
            return recurse(String(childKey));
          });

          return {
            id: Number(key),
            children: children.length > 0 ? children : null,
          };
        };

        const rootKey = String(Math.min(...Object.keys(data).map(Number)));
        console.log("Root key:", rootKey);
        return recurse(rootKey);
      }

      const tree = buildTree(parentChildIdMap);
      parentChildIdMap = tree;
      return parentChildIdMap;
    }

    getParentChildIdMap().then((map) => {
      setParentChildIdMap(map);
    });
  }, [loadedReports, isStreaming, hasStartedContinuum]);
  const NestedList = ({ children, loadedReports }) => {
    return (
      <ul>
        {children &&
          children.map((item) => (
            <li key={item.id}>
              {!item.id && <LoadingDots style={{ marginTop: "20px" }} />}
              {item.id && (
                <a
                  style={{
                    fontWeight: 800,
                    color: "#E7007C",
                    fontWeight: "200",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  href={`#${item.id}`}
                  onClick={() => console.log(`Navigating to report ${item.id}`)}
                >
                  {loadedReports.find((report) => report.reportId === item.id)
                    ?.reportTitle || `Loading Report ID: ${item.id}`}
                </a>
              )}
              {item.children && (
                <NestedList
                  // children={item.children}
                  loadedReports={loadedReports}
                >
                  {item.children}
                </NestedList>
              )}
            </li>
          ))}
      </ul>
    );
  };

  // const NestedList = ({ children }) => {
  //   // console.log("children");
  //   // console.log(children);
  //   return (
  //     <ul>
  //       {children &&
  //         children.map((item) => (
  //           <li key={item.id}>
  //             Report ID: {item.id}
  //             {item.children && <NestedList children={item.children} />}
  //           </li>
  //         ))}
  //     </ul>
  //   );
  // };

  //   return (
  //     <li key={report.id}>
  //       <a
  //         href={`#${report.id}`}
  //         className="no-underline"
  //         style={{ fontWeight: "200", textDecoration: "none" }}
  //       >
  //         {report.title}
  //       </a>
  //       {report.children && report.children.length > 0 && (
  //         <ol>{report.children.map((child) => renderNestedReports(child))}</ol>
  //       )}
  //     </li>
  //   );
  // };

  // useEffect(() => {
  //   async function fetchChildReports(parentReportId) {
  //     try {
  //       const response = await fetch("/api/reports/get-child-reports", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ parentReportId }),
  //       });

  //       if (response.ok) {
  //         const { children } = await response.json();
  //         return children;
  //       }

  //       console.error("Error fetching child reports");
  //       return [];
  //     } catch (error) {
  //       console.error("Error:", error);
  //       return [];
  //     }
  //   }

  //   async function buildTableOfContents() {
  //     const reportWithChildren = await Promise.all(
  //       loadedReports.map(async (report) => {
  //         const children = await fetchChildReports(report.reportId);
  //         return {
  //           ...report,
  //           children: children.map((child) => ({ ...child, children: [] })), // Add a children property to each child report
  //         };
  //       })
  //     );

  //     setTableOfContents(reportWithChildren);
  //   }

  //   buildTableOfContents();
  // }, [loadedReports]);
  // const renderNestedReports = (report) => {
  //   if (!report.title) return null; // Prevent rendering if there is no title

  //   return (
  //     <li key={report.id}>
  //       <a
  //         href={`#${report.id}`}
  //         className="no-underline"
  //         style={{ fontWeight: "200", textDecoration: "none" }}
  //       >
  //         {report.title}
  //       </a>
  //       {report.children && report.children.length > 0 ? (
  //         <ol>{report.children.map((child) => renderNestedReports(child))}</ol>
  //       ) : null}
  //     </li>
  //   );
  // };
  // console.log("process.env.NEXT_PUBLIC_serverUid");
  // console.log(process.env.NEXT_PUBLIC_serverUid);
  // const [likes, setLikes] = useState(0); // initial likes state, assuming it starts from 0
  const [hasLiked, setHasLiked] = useState(false);
  async function handleLike() {
    // Query the folderLikes table to check if the user has already liked or disliked the folder
    const { data: existingLikes, error: likesError } = await supabase
      .from("folderLikes")
      .select("likeValue")
      .eq("folderId", folderId)
      .eq("userId", userId);

    if (likesError) {
      console.error("Error checking existing likes", likesError);
      return; // Exit early if there is an error fetching the likes
    }

    // Calculate the current balance of likes and dislikes for this user and folder
    const likeBalance = existingLikes.reduce(
      (total, record) => total + record.likeValue,
      0
    );
    console.log("likeBalance");
    console.log(likeBalance);
    // Determine the likeValue based on the like balance
    const likeValue = likeBalance >= 0 ? -1 : 1;

    // Prepare the record for the database operation
    const likeRecord = { folderId, userId, likeValue };

    // Insert a new like or dislike record
    const { data, error } = await supabase
      .from("folderLikes")
      .insert([likeRecord]);

    if (error) {
      console.error("Error updating likes", error);
    } else {
      // Update the local state to reflect the new like or dislike
      setLikes((prevLikes) => prevLikes + likeValue);
      // If the balance was zero, the user has now liked/disliked for the first time
      if (likeBalance === 0) {
        setHasLiked(likeValue === 1);
      } else {
        // If the balance was not zero, we simply invert the current hasLiked state
        setHasLiked((prevHasLiked) => !prevHasLiked);
      }
    }
  }

  // Speech
  // Use state to track whether audio is playing
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false); // New state for loading

  // Use ref to persist the audio object without re-rendering the component
  const audioRef = useRef(null);
  const handleReadReportClick = async (index) => {
    // If audio is currently playing, pause it
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // If audio is already loaded and is paused, resume playing
      if (audioRef.current && isLoadingAudio === false) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        // Start loading new audio
        setIsLoadingAudio(true);

        // Fetch the new text to read
        const textToRead = document.getElementById(
          `reportRoot${index}`
        ).textContent;

        try {
          const response = await fetch("/api/reports/speech/speak", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: textToRead }),
          });

          if (response.ok) {
            const audioBlob = await response.blob();
            // If there was a previous audio object, revoke the old object URL
            if (audioRef.current) {
              URL.revokeObjectURL(audioRef.current.src);
            }
            // Assign the new audio blob to the audioRef
            audioRef.current = new Audio(URL.createObjectURL(audioBlob));
            audioRef.current.play();
            setIsPlaying(true);
            audioRef.current.onended = () => {
              setIsPlaying(false);
            };
          } else {
            throw new Error("Network response was not ok.");
          }
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
        }
        setIsLoadingAudio(false);
      }
    }
  };

  return (
    <>
      {folderPicUrl && (
        <Head>
          <title>{folderName}</title>

          {/* General tags */}
          <meta name="title" content={folderName} />
          <meta name="description" content={folderDescription} />
          <meta name="image" content={folderPicUrl} />

          {/* Open Graph tags */}
          <meta property="og:title" content={folderName} />
          <meta property="og:description" content={folderDescription} />
          <meta property="og:image" content={folderPicUrl} />
          <meta property="og:url" content={folderPicUrl} />

          {/* Twitter Card tags */}
          <meta name="twitter:title" content={folderName} />
          <meta name="twitter:description" content={folderDescription} />
          <meta name="twitter:image" content={folderPicUrl} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
      )}
      <div style={{ maxWidth: "90%" }}>
        <Breadcrumb>
          <BreadcrumbItem
            className="text-white reportFont"
            style={{ fontWeight: "800", fontSize: "2em" }}
            active
          >
            {folderName}
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="folder-section report-section">
          {/* {folderPicUrl} */}
          {/* ["http://res.cloudinary.com/dcf11wsow/image/upload/v1696728907/ft5rhqfvmq8mh4dszaut.png","http://res.cloudinary.com/dcf11wsow/image/upload/v1696729485/tyohgp0u2yhppkudbs0k.png","http://res.cloudinary.com/dcf11wsow/image/upload/v1696729819/xxqdjwhogtlhhyzhxrdf.png","http://res.cloudinary.com/dcf11wsow/image/upload/v1696731503/n3pif850qts0vhaflssc.png"] */}
          {/* {folderPicUrls} */}

          {folderPicUrl && (
            <div
              style={{
                height: "700px",
                position: "relative",
              }}
              className="image-container"
            >
              <a
                href={folderPicUrl}
                target="_blank"
                rel="noopener noreferrer"
                alt={folderPicDescription}
                title={folderPicDescription}
              >
                <img
                  // className="report-image"
                  src={`${getCloudinaryImageUrlForHeight(folderPicUrl, 700)}`}
                  style={
                    {
                      // objectFit: "contain",
                      // width: "auto",
                      // objectPosition: "top",
                    }
                  }
                />
              </a>
              {/* <div className="overlay"></div> */}
            </div>
            // <div>
            //   <div
            //     style={{
            //       height: "500px",
            //     }}
            //   >
            //     <img src={`${folderPicUrl}`} />
            //     {!folderPicUrl && (
            //       <LoadingDots style={{ position: "absolute", top: "125px" }} />
            //     )}
            //   </div>
            // </div>
          )}
          {/* works */}
          {/* {folderPicUrls && (
          <div>
            <div
              style={{
                height: "500px",
              }}
            >
              <img src={`${folderPicUrl}`} />
              {!folderPicUrl && (
                <LoadingDots style={{ position: "absolute", top: "125px" }} />
              )}
            </div>
          </div>
        )} */}
          {/* {JSON.stringify(folderPicUrls)} */}
          {/* {!folderPicUrls && (
            <div
              style={{
                height: "700px",
              }}
            >
              {!folderPicUrl && (
                <LoadingDots style={{ position: "absolute", top: "125px" }} />
              )}
              {folderPicUrl && (
                <div className="content-container">
                  <a
                    href={folderPicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="image-container">
                      <img
                        src={folderPicUrl}
                        className="middle-image "
                        alt="Folder"
                      />
                    </div>
                  </a>
                </div>
              )}
            </div>
          )} */}
        </div>
        {/* <div style={{ fontSize: "0.5em" }}>{folderPicDescription}</div> */}
        <div style={{ marginTop: "-10px", marginBottom: "20px" }}>
          <Row>
            <Col style={{ whiteSpace: "nowrap" }}>
              <span
                style={{
                  marginRight: "20px",
                  color: "gold",
                }}
              >
                <i
                  onClick={handleLike}
                  style={{
                    color: `${likes > 0 ? "gold" : "white"}`,
                    cursor: "pointer",
                  }}
                  className={`bi bi-star${
                    likes === 0 ? "bi bi-star" : "bi bi-star-fill"
                  }`}
                />
                {likes == 0 ? "" : ` ${likes}`}
              </span>
              <span style={{ marginRight: "20px" }}>
                <IntelliPrint loadedReports={loadedReports} />
              </span>
              <span>
                {/* <i className="bi bi-send" /> */}
                <IntelliCopyUrl />
              </span>
            </Col>
            {/* <Col> */}
            {/* </Col> */}
          </Row>
        </div>
        <div> {folderDescription}</div>
        <div
          className="reportTitle reportFont section-title"
          style={{ marginTop: "30px" }}
        >
          <Row>
            <Col>
              Table of Contents
              <span style={{ whiteSpace: "nowrap" }}>
                &nbsp;[{loadedReports.length}{" "}
                <i className="bi bi-body-text"></i>]
              </span>
            </Col>
          </Row>
        </div>
        {/* {JSON.stringify(parentChildIdMap)} */}
        {!parentChildIdMap.id && <LoadingDots style={{ marginTop: "30px" }} />}
        {parentChildIdMap.id && (
          <ul style={{ fontSize: "0.85em" }}>
            <li key={parentChildIdMap.id}>
              <a
                style={{
                  color: "#E7007C",
                  textDecoration: "none",
                  cursor: "pointer",
                  // fontWeight: 400,
                }}
                href={`#${parentChildIdMap.id}`}
                onClick={() => console.log("Navigating to parent report")}
              >
                {loadedReports.find(
                  (report) => report.reportId === parentChildIdMap.id
                )?.reportTitle || `Report ID: ${parentChildIdMap.id}`}
              </a>
              <NestedList
                // children={parentChildIdMap.children}
                loadedReports={loadedReports}
              >
                {parentChildIdMap.children}
              </NestedList>
            </li>
          </ul>
        )}
        {/* <ul>
        <li key={parentChildIdMap.id}>
          {parentChildIdMap.id}
          <NestedList children={parentChildIdMap.children} />
        </li>
      </ul> */}
        {/* {Object.keys(parentChildIdMap)} */}
        {loadedReports &&
          loadedReports.map((cols, index) => {
            const report = loadedReports[index];
            const reportId = loadedReports[index].reportId;
            if (
              !loadedReports[index].reportContent.includes(
                `<h2 id="reportTitle">`
              )
            ) {
              return;
            }
            const reportTitle = loadedReports[index].reportContent
              .split(`<h2 id="reportTitle">`)[1]
              .split(`</h2>`)[0];
            const __html = `<div className="report">${
              loadedReports[index].reportContent
                .split(`<h2 id="reportTitle">`)[1]
                .split(`</h2>`)[1]
            }`;

            // console.log("reportTitle");
            // console.log(reportTitle);
            // console.log("__html");
            // console.log(__html);
            return (
              <div key={index} id={reportId} className="report-section">
                <div className="title-container">
                  <div className="reportTitle reportFont section-title">
                    {reportTitle}
                  </div>
                  {index !== 0 && (
                    <a href="#top" className="top-button text-white">
                      {/* 🔝 */}⇧
                    </a>
                  )}
                </div>
                <div style={{ height: "700px" }} className="image-container">
                  {/* {report.reportPicDescription} */}
                  {!report.reportPicUrl && <LoadingDots />}
                  {report.reportPicUrl && (
                    <a
                      href={report.reportPicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={getCloudinaryImageUrlForHeight(
                          report.reportPicUrl,
                          700
                        )}
                        alt={report.reportPicDescription}
                        title={report.reportPicDescription}
                        className="report-image"
                        style={{ borderRadius: "10px" }}
                      />
                      {/* <div className="overlay" /> */}
                    </a>
                  )}
                </div>
                {/* Speech */}
                <div>
                  <div
                    onClick={() => handleReadReportClick(index)}
                    disabled={isLoadingAudio}
                    style={{
                      fontSize: "1.25em",

                      marginTop: "10px",
                    }}
                  >
                    {isLoadingAudio ? (
                      <i className="bi bi-hourglass-split" />
                    ) : isPlaying ? (
                      <i className="bi bi-pause-btn" />
                    ) : (
                      <i
                        style={{ cursor: "pointer" }}
                        className="bi bi-speaker"
                      />
                    )}
                  </div>
                </div>
                <div
                  id={`reportRoot${index}`}
                  // onMouseUp={(e) => handleTextHighlight(e, report)}
                  className="report text-primary reportFont"
                  dangerouslySetInnerHTML={{ __html }}
                />
                {/* <div style={{ display: "flex" }}>
                <div
                  className="btn btn-primary"
                  style={{ marginLeft: "auto", textAlign: "right" }}
                  onClick={() => {
                    handleContinuumClick(report);
                  }}
                >
                  <i className="bi bi-link"></i> Continuum
                </div>
              </div> */}
              </div>
            );
          })}
        {/* Draft */}
        {/* Is streaming{JSON.stringify(isStreaming)} */}
        {/* {JSON.stringify(loadedReports)} */}
        {/* {isStreaming && (
        <div id="draft">
          <div className="reportTitle reportFont section-title">Draft</div>
          <div
            className="report text-primary reportFont"
            dangerouslySetInnerHTML={{ __html: draft }}
          ></div>
        </div>
      )} */}
        {/* {JSON.stringify(agent)} */}
        {agent && !isStreaming && (
          <div
            style={{ textAlign: "center" }}
            // onClick={() => goToAgentProfile({ agentId: agent.agentId })}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "237px",
                objectFit: "cover",
                textAlign: "center",
              }}
            >
              <img
                src={`${agent.profilePicUrl}`}
                style={{ borderRadius: "50%" }} //cursor: "pointer"
                alt="agent"
              />
            </div>
            <div
              style={{
                marginTop: "16px",
                // fontWeight: 800,
                // color: "#E7007C",
                // fontWeight: "200",
                // textDecoration: "none",
                // cursor: "pointer",
              }}
            >
              Agent {agent.agentName}
            </div>
          </div>
        )}
        {/* {highlight.text && loadedAgentId != 0 && (
        <IntelliFab onClick={handleFabClick} icon="+" fabType="report" />
      )} */}
      </div>
    </>
  );
};

export default ViewReports;
