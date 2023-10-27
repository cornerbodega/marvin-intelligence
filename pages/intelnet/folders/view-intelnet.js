import { Button, Row, Breadcrumb, BreadcrumbItem } from "reactstrap";
import useRouter from "next/router";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
// other imports
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
// import IntelliCardGroup from "../../../components/IntelliCardGroup";
// import IntelliCardGroup from "../../../components/IntelliCardGroup";
import { getSupabase } from "../../../utils/supabase";

import IntelliFab from "../../../components/IntelliFab";
// rest of component
import { slugify } from "../../../utils/slugify";
import IntelliCardGroup from "../../../components/IntelliCardGroup";
const PAGE_COUNT = 6;
const supabase = getSupabase();
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const session = await getSession(context.req, context.res);
    // const user = ;
    const userId = session?.user.sub;
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
    let { data: folders, error } = await supabase
      .from("folders")
      .select("*")
      .eq("userId", userId)
      .filter("folderName", "neq", null)
      .filter("folderPicUrl", "neq", null)
      .filter("availability", "eq", "GLOBAL")
      .limit(PAGE_COUNT)
      .order("folderId", { ascending: false });

    console.log("folders");
    console.log(folders);

    // Extract folderIds from the obtained folders data
    const folderIds = folders.map((folder) => folder.folderId);

    let folderLikes = [];

    // Check if there are any folderIds to avoid unnecessary query
    if (folderIds.length > 0) {
      let { data, folderLikesError } = await supabase
        .from("folderLikes")
        .select()
        .in("folderId", folderIds); // Filter folderLikes by folderIds from the first query

      if (!folderLikesError) {
        folderLikes = data;
        // console.log("folderLikes");
        // console.log(folderLikes);
      } else {
        console.error("Error fetching folder likes:", folderLikesError);
      }
    } else {
      console.log("No folders found for the given criteria");
    }

    const folderLikesByFolderId = folderLikes.reduce((acc, folderLike) => {
      if (!acc[folderLike.folderId]) {
        acc[folderLike.folderId] = 0;
      }

      acc[folderLike.folderId] += folderLike.likeValue; // Updated to sum the likeValue
      return acc;
    }, {});

    console.log("folderLikesByFolderId");
    console.log(folderLikesByFolderId);

    return {
      props: { folders, userId, folderLikesByFolderId },
    };
  },
});
const ViewReports = ({ folders, userId, folderLikesByFolderId }) => {
  const [isLast, setIsLast] = useState(false);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(2);
  const [isInView, setIsInView] = useState(false);
  const [loadedReports, setLoadedReports] = useState(folders);
  const [briefingInput, setBriefingInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  console.log("loadedReports");
  console.log(loadedReports);
  async function loadPagedResults() {
    console.log("Loading paged results");

    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("userId", userId)
      .filter("folderName", "neq", null)
      .filter("folderPicUrl", "neq", null)
      .limit(PAGE_COUNT)
      .order("folderId", { ascending: false });

    if (error) {
      console.error("Error loading paged results:", error);
      return;
    }

    setLoadedReports(data);
  }

  async function handleSearch(searchInput) {
    setSearchInput(searchInput);
    console.log("handleSearch");
    console.log(searchInput);

    if (searchInput.trim() === "") {
      loadPagedResults();
      return;
    }

    try {
      let { data: filteredReports, error } = await supabase
        .from("folders")
        .select("*")
        .ilike("folderName", `%${searchInput}%`)
        .eq("userId", userId);

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      console.log("filteredReports");
      console.log(filteredReports);
      setLoadedReports(filteredReports);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  }

  // async function handleSearch(searchInput) {
  //   console.log("handleSearch");
  //   console.log(searchInput);
  //   setSearchInput(searchInput);
  //   if (searchInput.trim() === "") {
  //     // If the search input is empty, you might want to load the initial set of folders
  //     // Or handle it accordingly based on your application's needs
  //     console.log("Search input is empty");
  //     return;
  //   }

  //   try {
  //     let { data: filteredReports, error } = await supabase
  //       .from("folders")
  //       .select("*")
  //       .ilike("folderName", `%${searchInput}%`)
  //       .eq("userId", userId); // assuming userId is available in this scope

  //     if (error) {
  //       console.error("Error fetching data:", error);
  //       return;
  //     }

  //     console.log("filteredReports");
  //     console.log(filteredReports);
  //     setLoadedReports(filteredReports); // assuming setLoadedReports is available in this scope
  //   } catch (error) {
  //     console.error("An unexpected error occurred:", error);
  //   }
  // }

  // function handleSearch(searchInput) {
  //   console.log("handleSearch");
  //   console.log(searchInput);
  //   // const filteredReports = folders.filter((folder) =>
  //   //   folder.folderName.toLowerCase().includes(searchInput.toLowerCase())
  //   // );
  //   // console.log("filteredReports");
  //   // console.log(filteredReports);
  //   // setLoadedReports(filteredReports);
  // }
  async function handleQuickDraftClick() {
    // await queueQuickDraftTask();
    // async function queueQuickDraftTask() {
    const draftData = { briefingInput };
    const newTask = {
      type: "quickDraft",
      status: "queued",
      userId,
      context: {
        ...draftData,
        userId,
      },
      createdAt: new Date().toISOString(),
    };

    // const newTaskRef = await saveToFirebase(
    //   `/${process.env.NEXT_PUBLIC_env === "production" ? "asyncTasks" : "localAsyncTasks"}/${process.env.NEXT_PUBLIC_serverUid}/${user.sub}/writeDraftReport`,
    //   newTask
    // );
    try {
      const response = await fetch("/api/tasks/save-task", {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json", // Content type header to tell the server the nature of the request body
        },
        body: JSON.stringify(newTask), // Convert the JavaScript object to a JSON string
      });

      if (response.ok) {
        console.log("Task saved successfully");
        // Process the response if needed
        const data = await response.json();
        console.log(data);
        goToPage("/reports/create-report/quick-draft");
      } else {
        console.error("Failed to save the task");
      }
    } catch (error) {
      console.error("An error occurred while saving the task:", error);
    }
    // }
    // Go to quick draft page
    // immediately start writing the report
    // let the user provide feedback
    // let the user save the report
    // the user will go to the folder detail page
    // the report will be there
    // the agent, folder, reportFolder, and report will be saved to supabase with no art
    // the agent will be created
    // the images for the folder and report and agent will load dynamically
    // at the bottom of the report is a continuum button
  }
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
  //     goToPage("/reports/folders/view-folders");
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
    goToPage("/missions/create-mission/briefing");
  };
  const handleCardClick = (folder) => {
    console.log(folder);
    // console.log("handleCardClick");
    // const reportName = event.target.dataset.datums.reportName;
    const folderName = folder.folderName;
    const folderId = folder.folderId;

    console.log("ViewReports HandleCardClick Clicked!");
    // setSelectedReport(report);
    const folderSlug = slugify(`${folderId}-${folderName}`);

    goToPage(`/intelnet/folders/intelnet-report/${folderSlug}`);
  };
  const router = useRouter;
  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(name);
  }

  useEffect(() => {
    if (!isLast && !searchInput) {
      const loadMoreReports = async () => {
        const from = offset * PAGE_COUNT;
        const to = from + PAGE_COUNT - 1;
        setOffset((prev) => prev + 1);

        const { data } = await supabase
          .from("folders")
          .select("*")
          .range(from, to)
          .order("createdAt", { ascending: false })
          .eq("availability", "GLOBAL");
        console.log("load more missions data");

        console.log(data);
        return data;
      };

      if (isInView) {
        console.log(`LOAD MORE FOLDERS ${offset}`);
        loadMoreReports().then((moreReports) => {
          console.log("moreReports");
          console.log(moreReports);
          if (moreReports.length === 0) {
            setIsLast(true);
          } else {
            setLoadedReports([...loadedReports, ...moreReports]);
            if (moreReports.length < PAGE_COUNT) {
              setIsLast(true);
            }
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
          <i className={`bi bi-globe`}></i>
          &nbsp; Intel-Net
        </BreadcrumbItem>
      </Breadcrumb>

      <div style={{ marginBottom: "40px", width: "100%", display: "flex" }}>
        <input
          type="text"
          style={{
            borderRadius: "8px",
            borderWidth: "0px",
            backgroundColor: "#444",
            color: "white",
            // marginLeft: "12px",
            // width: "auto", // Make the width auto to fit the content
            // maxWidth: "100%", // Control the maximum width for larger screens
            height: "2em",
            flexGrow: 1, // Let it grow to take the available space
            textIndent: "10px",
          }}
          lines="1"
          placeholder="⌕ Search Intel-Net"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {/* <div>{JSON.stringify(loadedReports)}</div> */}
      <div ref={containerRef}>
        <Row className="text-primary">
          <IntelliCardGroup
            offset={offset}
            handleCardClick={handleCardClick}
            datums={loadedReports}
            folderLikesByFolderId={folderLikesByFolderId}
            datumsType={"folders"}
          ></IntelliCardGroup>
        </Row>
      </div>
    </>
  );
};

export default ViewReports;
