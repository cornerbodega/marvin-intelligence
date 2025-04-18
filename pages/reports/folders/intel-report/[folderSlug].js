import { Button, Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import getEnv from "../../../../utils/getEnv";
import { getSession } from "@auth0/nextjs-auth0";

import { getSupabase } from "../../../../utils/supabase";

import IntelliFab from "../../../../components/IntelliFab";

const supabase = getSupabase();
import { useUser } from "@auth0/nextjs-auth0/client";
import LibraryImage from "../../../../components/LibraryImage";
import { useFirebaseListener } from "../../../../utils/useFirebaseListener";
import saveTask from "../../../../utils/saveTask";

import Router from "next/router";

import IntelliPrint from "../../../../components/IntelliPrint/IntelliPrint";

import Head from "next/head";

import IntelliNotificationsArea from "../../../../components/IntelliNotificationsArea/IntelliNotificationsArea";
import IntelliEditor from "../../../../components/IntelliEditor";

export async function getServerSideProps(context) {
  const folderId = context.params.folderSlug.split("-")[0];
  const session = await getSession(context.req, context.res);
  const user = session?.user;
  let userId = user?.sub;
  // const query = context.query;

  // const userIdFromRouter = query.userId;
  // if (!userId && userIdFromRouter) {
  //   userId = userIdFromRouter;
  // }

  if (!folderId) {
    console.log("Error! No folder Id");
    return {};
  }
  let { data: agency, agencyError } = await supabase
    .from("users")
    .select("agencyName")
    .eq("userId", userId);
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
            createdAt,
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
  }

  let { data: linksResponse, error: linksError } = await supabase
    .from("links")
    .select("parentReportId, childReportId");

  if (error || linksError) {
    console.log("intel-report error");
    console.error(error);
    console.error(linksError);
  }

  const _loadedReports = [];
  let _folderName = "";
  let _folderDescription = "";
  let _folderPicDescription = "";
  let _folderPicUrl = "";

  let _availability = "";
  missionsResponse.forEach((mission) => {
    if (mission.reports.availability == "DELETED") {
      return;
    }
    _loadedReports.push(mission.reports);

    _folderName = mission.folders.folderName;
    _folderDescription = mission.folders.folderDescription;
    _folderPicDescription = mission.folders.folderPicDescription;
    _folderPicUrl = mission.folders.folderPicUrl;

    _availability = mission.folders.availability;
  });

  // Sort Initial Loaded Reports by cretedAt
  _loadedReports.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA - dateB; // sort by date ascending
  });

  return {
    props: {
      _loadedReports,
      _folderName,
      folderId,
      _folderDescription,
      _folderPicDescription,
      _folderPicUrl,
      agentId,
      expertises,
      specializedTraining,
      _folderLikes,
      _availability,
      userId,
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
  agentId,
  expertises,
  specializedTraining,
  _folderLikes,
  _availability,
  userId,
}) => {
  const { user } = useUser();
  const router = useRouter();

  const [loadedReports, setLoadedReports] = useState(_loadedReports);

  const [highlight, setHighlight] = useState({
    text: "",
    startIndex: undefined,
    endIndex: undefined,
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [folderName, setFolderName] = useState(_folderName);
  const [folderDescription, setFolderDescription] =
    useState(_folderDescription);
  const [folderPicDescription, setFolderPicDescription] = useState(
    _folderPicDescription
  );
  const [folderPicUrl, setFolderPicUrl] = useState(_folderPicUrl || "");
  const [continuumCompleted, setContinuumCompleted] = useState(false);
  const [hasStartedContinuum, setHasStartedContinuum] = useState(false);
  const [editorReportId, setEditorReportId] = useState(null);
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");

  function handleContentChange(newContent) {
    setEditorContent(newContent);
  }

  const [loadedAgentId, setLoadedAgentId] = useState(agentId);
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [editorReportId]);

  const firebaseContinuumStatus = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_SERVER_UID}/${
      userId || "default"
    }/continuum/status`
  );
  const firebaseVisualizeAndSaveStatus = useFirebaseListener(
    `/${getEnv()}/${process.env.NEXT_PUBLIC_SERVER_UID}/${
      userId || "default"
    }/finalizeAndVisualizeReport/status`
  );

  useEffect(() => {
    console.log("firebaseVisualizeAndSaveStatus");
    console.log(firebaseVisualizeAndSaveStatus);
    if (
      userId &&
      (firebaseVisualizeAndSaveStatus === "complete" ||
        firebaseContinuumStatus === "complete")
    ) {
      console.log("Continuum Completed. Calling updateReports");
      fetchUpdatedReports(); // this one makes links happen for existing reports
    }
  }, [userId, firebaseVisualizeAndSaveStatus, firebaseContinuumStatus]);

  const firebaseSaveData = useFirebaseListener(
    user
      ? `/${"asyncTasks"}/${
          process.env.NEXT_PUBLIC_SERVER_UID
        }/${userId}/finalizeAndVisualizeReport/context/`
      : null
  );

  const [agent, setAgent] = useState({});
  const folderPath = `/${"asyncTasks"}/${
    process.env.NEXT_PUBLIC_SERVER_UID
  }/${userId}/regenerateFolder/context/`;

  const firebaseFolderData = useFirebaseListener(user ? folderPath : null);

  const firebaseDraftData = useFirebaseListener(
    user
      ? `/${"asyncTasks"}/${
          process.env.NEXT_PUBLIC_SERVER_UID
        }/${userId}/continuum/`
      : null
  );

  async function fetchUpdatedReports() {
    console.log("FETCH UPDATED REPORTS");

    let { data: updatedMissionsResponse, error: updatedError } = await supabase
      .from("reportFolders")
      .select(
        `
          folders (folderName, folderDescription, folderPicUrl),
          reports (reportTitle, reportPicUrl, reportPicDescription, reportId, reportContent, availability, createdAt, agentId)
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
      if (mission.reports.availability == "DELETED") {
        return;
      }
      updatedMissions.push({ ...mission.reports });
    });
    // Sort Updated Reports by cretedAt
    updatedMissions.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      // Compare the two dates
      if (dateA < dateB) {
        return -1; // return a negative value if dateA is earlier than dateB
      }
      if (dateA > dateB) {
        return 1; // return a positive value if dateA is later than dateB
      }
      return 0; // return 0 if dates are equal
    });
    console.log("SET LOADED REPORTS");
    console.log(updatedMissions);
    // Update the state with the newly fetched data
    setLoadedReports(updatedMissions);
    updateReports(updatedMissions); // this one sets links on initial load
  }

  function goToAgentProfile({ agentId }) {
    Router.push({
      pathname: "/agents/detail/draft-report",
      query: { ...Router.query, agentId: agentId },
    });
  }

  useEffect(() => {
    fetchUpdatedReports();
  }, []);

  useEffect(() => {
    if (firebaseDraftData) {
      if (firebaseDraftData.status == "complete") {
        fetchUpdatedReports();
        setHasStartedContinuum(false);
        setIsStreaming(false);
        setContinuumCompleted(true);
      }
    }
  }, [firebaseDraftData]);

  useEffect(() => {
    if (firebaseFolderData) {
      console.log("firebaseFolderData save data");
      console.log(firebaseFolderData);

      if (
        firebaseFolderData.folderId &&
        firebaseFolderData.folderPicUrl &&
        firebaseFolderData.folderId == folderId
      ) {
        console.log("FOUND PHOTO FOR FOLDER");
        setFolderName(firebaseFolderData.folderName);
        setFolderDescription(firebaseFolderData.folderDescription);
        setFolderPicUrl(firebaseFolderData.folderPicUrl);
      }
    }
  }, [firebaseFolderData, folderId]); // Added folderId as a dependency

  useEffect(() => {
    console.log("2firebaseSaveData");
    console.log(firebaseSaveData);
    if (firebaseSaveData) {
      console.log("firebase save data");

      if (
        firebaseSaveData.folderId &&
        firebaseSaveData.folderId == folderId &&
        firebaseSaveData.reportPicUrl
      ) {
        fetchUpdatedReports();
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

  const [reportLength, setReportLength] = useState("short");
  function handleSelectedLength(length) {
    console.log("handleselected length");
    console.log(length);
    setReportLength(length);
  }
  async function handleContinuumClick(parentReport) {
    console.log(`handleContinuumClick`);

    const existingHyperlinks = await getLinksForContinuum(
      parentReport.reportId
    );
    console.log("existingHyperlinks");
    console.log(existingHyperlinks);
    setHasStartedContinuum(true);
    setIsStreaming(true);
    const parentReportId = parentReport.reportId;
    const parentReportContent = parentReport.reportContent;
    const briefingInput = parentReport.reportTitle;
    await saveTask({
      type: "continuum",
      status: "queued",
      userId,
      context: {
        briefingInput,
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
    console.log(
      `save task ${JSON.stringify({
        type: "continuum",
        status: "queued",
        userId,
        context: {
          briefingInput,
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
      })}`
    );
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
      elementId,
      parentReportId: report.reportId,
      parentReportTitle: report.reportTitle,
    });
  };

  const imageStyle = {
    borderTop: "2px solid #31A0D1",
    borderLeft: "2px solid #31A0D1",
    borderRight: "2px solid #31A0D1",
  };

  imageStyle.borderTopLeftRadius = "16px";
  imageStyle.borderTopRightRadius = "16px";

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

  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(name);
  }

  useEffect(() => {
    // This conditional check ensures that updateReports is only called
    // when all necessary conditions are met
    if (supabase && isStreaming && continuumCompleted) {
      console.log("Continuum Completed. Calling updateReports");
      updateReports(); // this one makes links happen for existing reports
    }
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

    console.log("Setting Loaded Reports");
    setLoadedReports(updatedReports); // Simply setting the whole updatedReports array
    // update folder
  }
  async function getLinksForContinuum(reportId) {
    console.log("getLinksForContinuum");
    let { data: links, error: linksError } = await supabase
      .from("links")
      .select("*, reports:parentReportId(availability)")
      .eq("childReportId", reportId)
      .not("reports.availability", "eq", "DELETED");

    if (linksError) {
      console.log("linksError", linksError);
      return;
    }

    console.log("links");
    console.log(links);
    return links;
  }
  async function getLinks(report) {
    let { data: links, error: linksError } = await supabase
      .from("links")
      .select("*, reports:parentReportId(availability)")
      .eq("parentReportId", report.reportId)
      .not("reports.availability", "eq", "DELETED");

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
          const newLink = `<a href="#${link.childReportId}">${highlightedText}</a>`;

          // Try replacing normalized version inside the actual DOM
          const originalText = element.textContent;
          const normalizedText = originalText.replace(/\s+/g, " ").trim();
          const normalizedHighlight = highlightedText
            .replace(/\s+/g, " ")
            .trim();

          console.log("originalText:", originalText);
          console.log("normalizedText:", normalizedText);
          console.log("normalizedHighlight:", normalizedHighlight);

          if (normalizedText.includes(normalizedHighlight)) {
            // Build a regex to allow for whitespace between words
            const escaped = highlightedText
              .trim()
              .replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") // escape special chars
              .replace(/\s+/g, "\\s+"); // match any whitespace

            const regex = new RegExp(escaped);
            element.innerHTML = element.innerHTML.replace(regex, newLink);
          } else {
            console.warn("Could not match normalized highlight in text");
          }
        } else {
          console.log(`Element with id ${link.elementId} not found`);
        }
      });

      report.reportContent = container.innerHTML;
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
        const childReports = parentChildIdMap[parentReportId];
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
          // console.log("Processing key:", key);

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
        // console.log("Root key:", rootKey);
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
  const NestedList = ({ children, loadedReports, level = 0 }) => {
    // Function to calculate font weight based on level
    const calculateFontWeight = (level) => {
      // Example: Starting with 600 for level 0 and decrease by 100 for each level
      return Math.max(500, 600 - level * 100);
    };

    return (
      <ol>
        {children &&
          children.map((item) => (
            <li
              style={{
                marginBottom: "8px",
                marginTop: "8px",
              }}
              key={item.id}
            >
              {!item.id && "loading..."}
              {item.id && (
                <a
                  style={{
                    fontSize: "1rem",
                    color: "#00fff2",
                    fontWeight: calculateFontWeight(level),
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
                  loadedReports={loadedReports}
                  level={level + 1} // Increment level for nested lists
                >
                  {item.children}
                </NestedList>
              )}
            </li>
          ))}
      </ol>
    );
  };
  const [likes, setLikes] = useState(
    _folderLikes.map((like) => like.likeValue).reduce((a, b) => a + b, 0)
  );
  async function handleLike() {
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
    if (availability !== "GLOBAL") {
      _availability = "GLOBAL";
      setAvailability("GLOBAL");
    } else {
      setAvailability("");
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
  function handleEditReportClick(reportId) {
    console.log(`Editing report ${reportId}`);
    setEditorReportId(reportId);
    if (editorReportId === reportId) {
      setEditorReportId(null);
    }
  }

  async function handleEditReportSaveClick(
    reportId,
    newContent,
    reportContent
  ) {
    console.log("Preparing to save report:", reportId, newContent); // This will show you what's being passed
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports/edit-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId, newContent, reportContent }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        // close the editor
        setEditorReportId(null);
        setIsSubmitting(false);
        // reload reports
        fetchUpdatedReports();
        // Log the success message
        // alert("Report saved successfully!");
      } else {
        console.log(`Failed to save report ${reportId}. response:`, response);
        console.error("Failed to save the report");
        alert("Error 542: error saving report.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      alert("Error 543: error processing your request to save report.");
    }
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
      setShowReportDeleteQuestion(false);
      fetchUpdatedReports();
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

  async function handleRefreshFolderImageClick() {
    if (regenImageDisabled) {
      return;
    }
    const newTask = {
      type: "regenerateFolder",
      status: "queued",
      userId,
      context: {
        folderId,
        userId,
      },
      createdAt: new Date().toISOString(),
    };
    const newTaskRef = await saveTask(newTask);
    // disable the button and show a message
    setRegenImageDisabled(true);
  }
  async function handleRefreshReportImageClick(index) {
    if (regenImageDisabled) {
      return;
    }
    setRegenImageDisabled(true);
    const childReportId = loadedReports[index].reportId;
    const draft = loadedReports[index].reportContent;
    const newTask = {
      type: "regenerateReportImage",
      status: "queued",
      userId,
      context: {
        childReportId,
        userId,
        draft,
      },
      createdAt: new Date().toISOString(),
    };
    const newTaskRef = await saveTask(newTask);
  }
  const [regenImageDisabled, setRegenImageDisabled] = useState(false);
  return (
    <>
      {/* Notifications Area */}
      <IntelliNotificationsArea />
      <div style={{ maxWidth: "90%" }}>
        {folderPicUrl.length > 0 && (
          <>
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
              <div
                style={{
                  width: "auto",
                  position: "relative",
                }}
                className="image-container"
              >
                {/* <a
                  href={folderPicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  alt={folderPicDescription}
                  title={folderPicDescription}
                > */}
                <img
                  style={{
                    borderTopRightRadius: "20px",
                    borderTopLeftRadius: "20px",
                  }}
                  alt={folderPicDescription}
                  title={folderPicDescription}
                  className="report-image"
                  src={`${folderPicUrl}`}
                />
                {/* </a> */}
              </div>
            </div>

            <div style={{ marginTop: "-10px", marginBottom: "20px" }}>
              <Row>
                <Col style={{ whiteSpace: "nowrap" }}>
                  {/* <span
                    style={{
                      whiteSpace: "nowrap",
                      marginRight: "20px",
                      color: `${likes > 0 ? "gold" : "white"}`,
                    }}
                  >
                    Like &nbsp;
                    <i
                      style={{}}
                      onClick={handleLike}
                      className={`bi bi-star${
                        likes === 0 ? "bi bi-star" : "bi bi-star-fill"
                      }`}
                    />
                    {likes < 2 ? "" : likes}
                  </span> */}
                  <span
                    style={{
                      marginRight: "20px",
                      fontFamily: "monospace",
                      color: `${
                        availability === "GLOBAL" ? "#3FFF8D" : "white"
                      }`,
                      cursor: "pointer",
                    }}
                  >
                    <i
                      onClick={handleGlobeClick}
                      className="bi bi-globe"
                      style={{}}
                    />
                  </span>
                  <span style={{ fontFamily: "monospace" }}>
                    <IntelliPrint loadedReports={loadedReports} />
                  </span>
                </Col>

                <Col
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginRight: "20px",
                  }}
                >
                  <span
                    style={{
                      color: regenImageDisabled ? "grey" : "white",
                      cursor: regenImageDisabled ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap",
                      fontFamily: "monospace",
                    }}
                    onClick={() => handleRefreshFolderImageClick()}
                  >
                    Regen Image &nbsp;
                    <i className="bi bi-arrow-clockwise" />
                  </span>
                </Col>
              </Row>
            </div>

            <div> {folderDescription}</div>
            <div
              className="reportTitle reportFont section-title"
              style={{ marginTop: "30px", fontSize: "1em" }}
            >
              <Row>
                <Col>Table of Contents</Col>
              </Row>
            </div>
            {!parentChildIdMap.id && (
              <LibraryImage style={{ marginTop: "30px" }} />
            )}
            {parentChildIdMap.id && (
              <ul className="linkFont">
                <li key={parentChildIdMap.id}>
                  <a
                    style={{
                      color: "#00fff2",
                      textDecoration: "none",
                      cursor: "pointer",
                      fontSize: "1.2em",
                    }}
                    href={`#${parentChildIdMap.id}`}
                    onClick={() => console.log("Navigating to parent report")}
                  >
                    {loadedReports.find(
                      (report) => report.reportId === parentChildIdMap.id
                    )?.reportTitle || ``}
                  </a>
                  <NestedList loadedReports={loadedReports}>
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
          </>
        )}
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

            return (
              <div key={index} id={reportId} className="report-section">
                {report.reportPicUrl && (
                  <>
                    <div className="title-container">
                      <div className="reportTitle reportFont section-title">
                        {reportTitle}
                      </div>

                      {index !== 0 && (
                        <a href="#top" className="top-button text-white">
                          ⇧
                        </a>
                      )}
                    </div>
                    <div className="image-container">
                      {!report.reportPicUrl && <LibraryImage />}
                      {report.reportPicUrl && (
                        <img
                          src={report.reportPicUrl}
                          alt={report.reportPicDescription}
                          className="report-image"
                        />
                      )}
                    </div>
                    {/* Speech */}
                    <Row>
                      <Col>
                        <div
                          disabled={isLoadingAudio}
                          style={{
                            fontSize: "1.20em",
                            fontWeight: "200",
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          {isLoadingAudio ? (
                            <i className="bi bi-hourglass-split" />
                          ) : isPlaying ? (
                            <i
                              style={{ cursor: "pointer" }}
                              className="bi bi-pause-btn"
                              onClick={() => handleReadReportClick(index)}
                            />
                          ) : (
                            <div
                              style={{
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                fontFamily: "monospace",
                              }}
                              onClick={() => handleReadReportClick(index)}
                            >
                              Play <i className="bi bi-speaker" />
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col
                        style={{
                          width: "100%",
                          // background: "red",
                          textAlign: "right",
                          marginRight: "20px",
                          marginTop: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            color: "white",
                            whiteSpace: "nowrap",
                            fontFamily: "monospace",
                          }}
                          onClick={() =>
                            handleEditReportClick(
                              reportId,
                              report.reportContent
                            )
                          }
                        >
                          Edit Report &nbsp;
                          <i className="bi bi-pencil" />
                        </span>
                      </Col>
                      <Col
                        style={{
                          width: "100%",
                          // background: "red",
                          textAlign: "right",
                          marginRight: "20px",
                          marginTop: "10px",
                          cursor: regenImageDisabled
                            ? "not-allowed"
                            : "pointer",
                          color: regenImageDisabled ? "grey" : "white",

                          fontFamily: "monospace",
                        }}
                      >
                        <span
                          onClick={() => handleRefreshReportImageClick(index)}
                        >
                          Regen Image &nbsp;
                          <i className="bi bi-arrow-clockwise" />
                        </span>
                      </Col>
                    </Row>
                  </>
                )}
                {/* Begin Editor */}
                {/* Editor Report Id
                {editorReportId}
                Report Id
                {reportId} */}
                <>
                  {report.reportId == editorReportId && (
                    <div ref={editorRef} style={{ marginBottom: "30px" }}>
                      <IntelliEditor
                        reportContent={report.reportContent}
                        index={index}
                        onContentChange={handleContentChange}
                      />
                      <Button
                        color="primary"
                        style={{
                          border: "3px solid green",
                          marginTop: "40px",
                        }}
                        disabled={isSubmitting}
                        onClick={(e) =>
                          handleEditReportSaveClick(
                            report.reportId,
                            editorContent,
                            report.reportContent
                          )
                        }
                      >
                        <i className="bi bi-floppy"></i> Save Report
                      </Button>
                    </div>
                  )}
                </>
                {/* End Editor */}
                {/* Begin Report */}
                {reportId != editorReportId && (
                  <>
                    <div
                      id={`reportRoot${index}`}
                      onMouseUp={(e) => handleTextHighlight(e, report)}
                      onTouchEnd={(e) => handleTextHighlight(e, report)}
                      className="report reportFont"
                      dangerouslySetInnerHTML={{ __html }}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <Button
                        className="btn btn-primary"
                        style={{ marginRight: "16px" }}
                        onClick={() => {
                          handleContinuumClick(report);
                        }}
                        disabled={isStreaming}
                      >
                        <i className="bi bi-link"></i> Continuum
                      </Button>
                      {isStreaming && "Continuum in Progress"}
                      <div style={{ marginLeft: "auto", textAlign: "right" }}>
                        <Button disabled={isStreaming}>
                          <i
                            style={{
                              color: `${
                                showReportDeleteQuestion ? "white" : "grey"
                              }`,
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
                    </div>
                  </>
                )}
              </div>
            );
          })}

        {agent.profilePicUrl && !isStreaming && (
          <div
            style={{ textAlign: "center", marginTop: "116px" }}
            onClick={() => goToAgentProfile({ agentId: agent.agentId })}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",

                width: "auto",
                objectFit: "cover",
                marginBottom: "16px",

                textAlign: "center",
              }}
            >
              <img
                src={agent.profilePicUrl}
                alt={agent.agentName}
                style={{
                  borderRadius: "20%",
                  cursor: "pointer",
                  width: "300px",
                  height: "auto",
                }}
              />
            </div>

            <a
              style={{
                fontWeight: 800,
                color: "#00fff2",
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
          <IntelliFab onClick={handleFabClick} icon="" fabType="report" />
        )}
      </div>
    </>
  );
};

export default ViewReports;
