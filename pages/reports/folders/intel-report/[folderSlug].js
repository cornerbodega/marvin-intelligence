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

import Router from "next/router";
// import _ from "lodash";
import IntelliPrint from "../../../../components/IntelliPrint/IntelliPrint";
// import { current } from "@reduxjs/toolkit";
// import IntelliReportLengthDropdown from "../../../../components/IntelliReportLengthDropdown/IntelliReportLengthDropdown";
import Head from "next/head";
import Image from "next/image";
// import { child } from "@firebase/database";
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const folderId = context.params.folderSlug.split("-")[0];
    const session = await getSession(context.req, context.res);
    const user = session?.user;
    const userId = user.sub;
    if (!folderId) {
      console.log("Error! No folder Id");
      return {};
    }
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
    //   folderLikes:folderId (
    //     userId,
    //     folderId,
    // ),
    // const missionsResponse = "";
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
            folderPicUrl,
            availability
        ),
        reports:reports (
            availability,
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
    // let _folderPicUrls = "";

    let _availability = "";
    missionsResponse.forEach((mission) => {
      if (mission.reports.availability == "DELETED") {
        return;
      }
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

      _availability = mission.folders.availability;
    });

    // My Tokens
    let { data: tokensResponse, error: tokensError } = await supabase
      .from("tokens")
      .select("tokens")
      .eq("userId", userId);
    if (tokensError) {
      console.log("tokensError");
    }
    console.log("tokensResponse");
    console.log(tokensResponse);
    let _tokensRemaining = 0;
    if (tokensResponse) {
      if (tokensResponse[0]) {
        _tokensRemaining = tokensResponse[0].tokens;
      }
    }
    console.log("tokensRemaining");
    console.log(_tokensRemaining);
    // console.log("missions");
    // console.log(missions);
    // const _currentfolderPicUrlIndex = _folderPicUrls
    //   ? Math.floor(Math.random() * _folderPicUrls.length)
    //   : 0;
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
        // _currentfolderPicUrlIndex,
        _folderLikes,
        _availability,
        _tokensRemaining,
      },
    };
  },
});
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
  _currentfolderPicUrlIndex,
  _folderLikes,
  _availability,
  _tokensRemaining,
}) => {
  // console.log("useUser");
  // console.log(useUser);
  // parentReportId,
  // userId,
  // parentReportContent,
  // agentId,
  // expertises,
  // specializedTraining,

  const { user, error, isLoading } = useUser();
  const userId = user ? user.sub : null;
  const [isLast, setIsLast] = useState(false);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [loadedReports, setLoadedReports] = useState(_loadedReports);
  const [tokensRemaining, setTokensRemaining] = useState(_tokensRemaining);

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1); // Default to 1 for "Short"
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
  const [currentfolderPicUrlIndex, setCurrentfolderPicUrlIndex] = useState(
    _currentfolderPicUrlIndex
  );
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
  const firebaseDoContinuumData = useFirebaseListener(
    user
      ? `/${
          process.env.NEXT_PUBLIC_env === "production"
            ? "asyncTasks"
            : "localAsyncTasks"
        }/${process.env.NEXT_PUBLIC_serverUid}/${userId}/doContinuum/`
      : null
  );
  // const firebaseContinuumStatus = useFirebaseListener(
  //   user ? `/${process.env.NEXT_PUBLIC_env === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${userId}/contu/status` : null
  // );

  async function fetchUpdatedReports() {
    console.log("FETCH UPDATED REPORTS");
    // Fetch the updated data from the database using the folderId
    let { data: updatedMissionsResponse, error: updatedError } = await supabase
      .from("reportFolders")
      .select(
        `
              folders (folderName, folderDescription, folderPicUrl),
              reports (reportTitle, reportPicUrl, reportPicDescription, reportId, reportContent, availability)
          `
      )
      .eq("folderId", folderId);
    // .filter("reports.availability", "neq", "DELETED")
    // .or("reports.availability.is.null");
    console.log("updatedMissionsResponse");
    console.log(updatedMissionsResponse);
    if (updatedError) {
      console.error(updatedError);
      return;
    }

    const updatedMissions = [];
    updatedMissionsResponse.forEach((mission) => {
      if (mission.reports.availability == "DELETED") {
        return;
      }
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
  const [currentGeneration, setCurrentGeneration] = useState(0);
  useEffect(() => {
    if (firebaseDoContinuumData) {
      console.log("firebaseDoContinuumData");
      console.log(firebaseDoContinuumData);

      if (firebaseDoContinuumData.status == "complete" || "in-progress") {
        // if (hasStartedContinuum) {
        if (firebaseDoContinuumData.context) {
          if (
            firebaseDoContinuumData.context.currentGeneration !=
            currentGeneration
          ) {
            setCurrentGeneration(
              firebaseDoContinuumData.context.currentGeneration
            );
            setDraft(
              firebaseDoContinuumData.context[
                `draft${currentGeneration == 1 ? "" : currentGeneration - 1}`
              ]
            );
          }
          fetchUpdatedReports();
          if (firebaseDoContinuumData.status == "complete") {
            // setHasStartedContinuum(false);
            setIsStreaming(false);
            setContinuumCompleted(true);
          }
          // }
        }
      }
    }
  }, [firebaseDoContinuumData]);

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
        //   setFolderPicUrls(firebaseFolderData.folderPicUrls);
        //   setCurrentfolderPicUrlIndex(folderPicUrls.length - 1);
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
        // updateReports();
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
  const [reportLength, setReportLength] = useState("short");
  function handleSelectedLength(length) {
    console.log("handleselected length");
    console.log(length);
    setReportLength(length);
  }
  async function handleContinuumClick(parentReport) {
    if (tokensRemaining < 1) {
      goToPage("/account/tokens/buy-tokens");
    }
    setTokensRemaining(tokensRemaining - 1);
    // "parentReportId",
    // "userId",
    // "parentReportContent",
    // "agentId",
    // "expertises",
    // "specializedTraining",
    // console.log("parentReport");
    // console.log(parentReport.reportId);
    // console.log("reportLinksMap");
    // console.log(reportLinksMap);
    // console.log("reportLinksMap[parentReport.reportId]");
    // console.log(reportLinksMap[parentReport.reportId]);
    const existingHyperlinks = await getLinksForContinuum(
      parentReport.reportId
    );
    console.log("existingHyperlinks");
    console.log(existingHyperlinks);
    setHasStartedContinuum(true);
    setIsStreaming(true);
    const parentReportId = parentReport.reportId;
    const parentReportContent = parentReport.reportContent;
    await saveTask({
      type: "continuum",
      status: "queued",
      userId,
      context: {
        parentReportId,
        userId,
        parentReportContent,
        agentId,
        expertises,
        specializedTraining,
        existingHyperlinks,
        reportLength,
      },
      createdAt: new Date().toISOString(),
    });
    console.log("Handle Continuum Click");
  }

  useEffect(() => {
    console.log("Updated highlight.highlightedText", highlight);
  }, [highlight]);
  const handleTextHighlight = (event, report) => {
    console.log("handleTextHighlight");
    const selection = window.getSelection();

    if (selection.toString().trim().length === 0) {
      setHighlight({ text: "", range: null });
      return;
    }

    const range = selection.getRangeAt(0);
    const startIndex = range.startOffset;
    const endIndex = range.endOffset;

    if (range.startContainer.parentNode !== range.endContainer.parentNode) {
      selection.removeAllRanges();
      setHighlight({ text: "", startIndex, endIndex });
      return;
    }

    let parentNode = range.startContainer.parentNode;
    while (parentNode && !parentNode.id && parentNode !== document.body) {
      parentNode = parentNode.parentNode;
    }

    const elementId = parentNode ? parentNode.id : null;
    console.log("selection");
    console.log("selection.toString()", selection.toString());
    setHighlight({
      highlightedText: selection.toString(),
      // startIndex,
      // endIndex,
      elementId,
      parentReportId: report.reportId,
      parentReportTitle: report.reportTitle,
    });
  };

  const handleFabClick = () => {
    console.log("handleFabClick");
    const highlightedText = highlight.highlightedText;
    const elementId = highlight.elementId;
    const parentReportId = highlight.parentReportId;
    const parentReportTitle = JSON.stringify(highlight.parentReportTitle);
    console.log("ViewReports HandleClick Clicked!");
    Router.push({
      pathname: "/agents/detail/draft-report",
      query: {
        ...Router.query,
        agentId: loadedAgentId,
        parentReportId,
        parentReportTitle,
        highlightedText,
        elementId,
      },
    });
  };

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
          console.log("updatedHTML");
          console.log(updatedHTML);
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
        if (!childReports) {
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
        {/* {JSON.stringify(loadedReports)} */}
        {children &&
          children.map((item) => (
            <li key={item.id}>
              {!item.id && "loading..."}
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
                    ?.reportTitle || `Generating Report Artwork`}
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
  const [likes, setLikes] = useState(
    _folderLikes.map((like) => like.likeValue).reduce((a, b) => a + b, 0)
  );
  async function handleLike() {
    // console.log("handleLike");
    // console.log("_folderLikes");
    // console.log(_folderLikes);
    // console.log("likes");
    // console.log(likes);
    let _likes = likes;
    let likeValue = 0;
    if (likes === 0) {
      likeValue = 1;
    } else {
      likeValue = -1;
    }
    _likes += likeValue;
    if (likes < 0) {
      _likes = 0;
    }
    setLikes(_likes);
    // update supabase likes table

    const { error } = await supabase
      .from("folderLikes")
      .insert({ folderId, userId, likeValue });
    if (error) {
      console.error("Error updating likes", error);
      return;
    }
  }
  const [availability, setAvailability] = useState(_availability);
  async function handleGlobeClick() {
    console.log("handleGlobeClick");
    let _availability = availability;
    if (availability === "") {
      // setAvailability("GLOBAL");
      _availability = "GLOBAL";
    } else {
      // setAvailability("");
      _availability = "";
    }
    setAvailability(_availability);
    console.log("availability");
    console.log(_availability);
    // update supabase likes table
    const { error } = await supabase
      .from("folders")
      .update({ availability: _availability })
      .eq("folderId", folderId);
    if (error) {
      console.error("Error updating availability", error);
      return;
    }
  }

  const [showFolderDeleteQuestion, setShowFolderDeleteQuestion] =
    useState(false);

  const [showReportDeleteQuestion, setShowReportDeleteQuestion] =
    useState(false);
  function handleFolderDeleteClick() {
    console.log("handleFolderDeleteClick");
    setShowFolderDeleteQuestion(!showFolderDeleteQuestion);
  }
  async function handleFolderDeleteYes() {
    console.log("handleFolderDeleteYes");
    console.log("folderId");
    console.log(folderId);
    // update supbase availability column in the folders table to "DELETED"
    const { error } = await supabase
      .from("folders")
      .update({ availability: "DELETED" })
      .eq("folderId", folderId);
    if (error) {
      console.error("Error updating availability", error);
      return;
    } else {
      console.log("DELTEED");
      goToPage("/reports/folders/view-folders");
    }
  }
  function handleFolderDeleteNo() {
    console.log("handleFolderDeleteNo");
    setShowFolderDeleteQuestion(false);
  }
  function handleReportDeleteClick() {
    console.log("handleReportDeleteClick");
    setShowReportDeleteQuestion(!showReportDeleteQuestion);
  }
  async function handleReportDeleteYes(reportId) {
    console.log("handleFolderDeleteYes");
    console.log("reportId");
    console.log(reportId);
    // update supbase availability column in the folders table to "DELETED"
    const { error } = await supabase
      .from("reports")
      .update({ availability: "DELETED" })
      .eq("reportId", reportId);
    if (error) {
      console.error("Error updating availability", error);
      return;
    } else {
      console.log("DELTEED reportId");
      // router.replace(router.asPath);

      setShowReportDeleteQuestion(false);
      fetchUpdatedReports();
      // goToPage("/reports/folders/view-folders");
    }
  }
  function handleReportDeleteNo() {
    console.log("handleFolderDeleteNo");
    setShowReportDeleteQuestion(false);
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
        {folderPicUrl && (
          <div
            style={{
              height: "700px",
              width: "auto",
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
              <Image
                // className="report-image"
                src={`${getCloudinaryImageUrlForHeight(folderPicUrl, 700)}`}
                fill={true}
                style={{
                  // objectFit: "contain",
                  // width: "auto",
                  objectPosition: "top",
                }}
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
        {/* {JSON.stringify(folderPicUrls)} */}
      </div>
      {folderPicUrl && (
        <div style={{ marginTop: "-10px", marginBottom: "20px" }}>
          <Row>
            <Col style={{ whiteSpace: "nowrap" }}>
              <span
                style={{
                  whiteSpace: "nowrap",
                  marginRight: "20px",
                  color: "gold",
                }}
              >
                <i
                  style={{
                    color: `${likes > 0 ? "gold" : "white"}`,
                  }}
                  onClick={handleLike}
                  className={`bi bi-star${
                    likes === 0 ? "bi bi-star" : "bi bi-star-fill"
                  }`}
                />
                {likes < 2 ? "" : likes}
              </span>
              <span style={{ marginRight: "20px" }}>
                <i
                  onClick={handleGlobeClick}
                  className="bi bi-globe"
                  style={{
                    color: `${availability === "GLOBAL" ? "gold" : "white"}`,
                  }}
                />
                {/* {availability} */}
              </span>
              <span>
                <IntelliPrint loadedReports={loadedReports} />
              </span>
            </Col>

            <Col></Col>
          </Row>
        </div>
      )}
      <div> {folderDescription}</div>
      <div
        className="reportTitle reportFont section-title"
        style={{ marginTop: "30px" }}
      >
        <Row>
          <Col>
            Table of Contents
            <span style={{ whiteSpace: "nowrap" }}>
              &nbsp;[{loadedReports.length} <i className="bi bi-body-text"></i>]
            </span>
          </Col>
        </Row>
      </div>
      {/* {JSON.stringify(parentChildIdMap)} */}
      {!parentChildIdMap.id && <LoadingDots style={{ marginTop: "30px" }} />}
      {parentChildIdMap.id && (
        <ul>
          <li key={parentChildIdMap.id}>
            <a
              style={{
                color: "#E7007C",
                textDecoration: "none",
                cursor: "pointer",
                // fontWeight: 400,
                fontSize: "0.85em",
              }}
              href={`#${parentChildIdMap.id}`}
              onClick={() => console.log("Navigating to parent report")}
            >
              {loadedReports.find(
                (report) => report.reportId === parentChildIdMap.id
              )?.reportTitle ||
                `Generating Images for Report ID: ${parentChildIdMap.id}`}
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
      <div style={{ marginLeft: "auto", textAlign: "right" }}>
        <i
          style={{
            color: `${showFolderDeleteQuestion ? "white" : "grey"}`,
            cursor: "pointer",
          }}
          className="bi bi-trash"
          onClick={handleFolderDeleteClick}
        />
        &nbsp;
        {showFolderDeleteQuestion && (
          <>
            Delete Folder?{" "}
            <span
              style={{ color: "white", cursor: "pointer" }}
              onClick={handleFolderDeleteYes}
            >
              Yes
            </span>{" "}
            /{" "}
            <span
              style={{ color: "white", cursor: "pointer" }}
              onClick={handleFolderDeleteNo}
            >
              No
            </span>
          </>
        )}
      </div>
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
                {!report.reportPicUrl && <LoadingDots />}
                {report.reportPicUrl && (
                  <a
                    href={report.reportPicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    alt={report.reportPicDescription}
                    title={report.reportPicDescription}
                  >
                    <img
                      src={getCloudinaryImageUrlForHeight(
                        report.reportPicUrl,
                        700
                      )}
                      alt="Report Image"
                      className="report-image"
                      style={{ borderRadius: "10px" }}
                    />
                    {/* <div className="overlay"></div> */}
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
                onMouseUp={(e) => handleTextHighlight(e, report)}
                className="report text-primary reportFont"
                dangerouslySetInnerHTML={{ __html }}
              />
              <div style={{ display: "flex", flexDirection: "flex-start" }}>
                <Button
                  className="btn btn-primary"
                  style={{ marginRight: "16px", textAlign: "left" }}
                  onClick={() => {
                    handleContinuumClick(report);
                  }}
                  disabled={isStreaming}
                >
                  <i className="bi bi-link"></i> Continuum
                </Button>

                {/* Report Delete Button */}
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <Button disabled={isStreaming}>
                    <i
                      style={{
                        color: `${showReportDeleteQuestion ? "white" : "grey"}`,
                        cursor: "pointer",
                      }}
                      className="bi bi-trash"
                      disabled={isStreaming}
                      onClick={handleReportDeleteClick}
                    />
                  </Button>
                  &nbsp;
                  {showReportDeleteQuestion}
                  {showReportDeleteQuestion && (
                    <>
                      Delete Report?{" "}
                      <span
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() => {
                          handleReportDeleteYes(reportId);
                        }}
                      >
                        Yes
                      </span>{" "}
                      /{" "}
                      <span
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={handleReportDeleteNo}
                      >
                        No
                      </span>
                    </>
                  )}
                </div>
                {/* <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <i style={{ color: "grey" }} className="bi bi-trash" />
        
        
                </div> */}
              </div>
            </div>
          );
        })}
      {/* <IntelliReportLengthDropdown
        handleSelectedLength={handleSelectedLength}
      /> */}
      <div
        onClick={() => goToPage("/account/tokens/get-tokens")}
        style={{
          marginBottom: "32px",
          marginTop: "22px",
          fontSize: "0.75em",
          color: "lightblue",
          cursor: "pointer",
          width: "148px",
        }}
      >
        My Tokens: {tokensRemaining} <i className="bi bi-coin" />
      </div>
      {/* Draft */}
      {/* Is streaming{JSON.stringify(isStreaming)} */}
      {/* {JSON.stringify(loadedReports)} */}
      {isStreaming && (
        <div id="draft">
          <div className="reportTitle reportFont section-title">Draft</div>
          <div
            className="report text-primary reportFont"
            dangerouslySetInnerHTML={{ __html: draft }}
          ></div>
          {draft && !draft.endsWith(" ".repeat(3)) && (
            <div className="scroll-downs">
              <div className="mousey">
                <div className="scroller"></div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* {JSON.stringify(agent)} */}
      {agent.profilePicUrl && !isStreaming && (
        <div
          style={{ textAlign: "center", marginTop: "116px" }}
          onClick={() => goToAgentProfile({ agentId: agent.agentId })}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "237px",
              objectFit: "cover",
              marginBottom: "16px",

              textAlign: "center",
            }}
          >
            <img
              src={`${getCloudinaryImageUrlForHeight(
                agent.profilePicUrl,
                237
              )}`}
              style={{ borderRadius: "20%", cursor: "pointer" }}
              alt="agent"
            />
          </div>

          <a
            style={{
              fontWeight: 800,
              color: "#E7007C",
              fontWeight: "200",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Agent {agent.agentName}
          </a>
        </div>
      )}
      {highlight.highlightedText && loadedAgentId != 0 && (
        <IntelliFab onClick={handleFabClick} icon="+" fabType="report" />
      )}
    </div>
  );
};

export default ViewReports;
