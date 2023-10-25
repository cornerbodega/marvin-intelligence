import {
  Button,
  Row,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
} from "reactstrap";
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

    // let { data: folders, error } = await supabase
    //   .from("folders")
    //   .select("*")
    //   .eq("userId", userId)
    //   .filter("folderName", "neq", null)
    //   .filter("folderPicUrl", "neq", null)
    //   .limit(PAGE_COUNT)
    //   .order("folderId", { ascending: false });
    // console.log("folders");
    // console.log(folders);

    // other pages will redirect here if they're empty
    // If no agency, go to create agency page
    // If no missions, go to crete report page
    // let agency;
    let { data: folders, error } = await supabase
      .from("folders")
      .select("*")
      .eq("userId", userId)
      .filter("folderName", "neq", null)
      .filter("folderPicUrl", "neq", null)
      // .filter("availability", "neq", "DELETED")
      .or(`availability.neq.DELETED,availability.is.null`)
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

    const _folderLikesByFolderId = folderLikes.reduce((acc, folderLike) => {
      if (!acc[folderLike.folderId]) {
        acc[folderLike.folderId] = 0;
      }

      acc[folderLike.folderId] += folderLike.likeValue; // Updated to sum the likeValue
      return acc;
    }, {});

    console.log("_folderLikesByFolderId");
    console.log(_folderLikesByFolderId);

    return {
      props: {
        folders,
        userId,
        agencyName: agency[0].agencyName,
        _folderLikesByFolderId,
      },
    };
  },
});
const ViewReports = ({
  folders,
  userId,
  agencyName,
  _folderLikesByFolderId,
}) => {
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
    goToPage(`/reports/folders/intel-report/${folderSlug}`);
  };
  const router = useRouter;
  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(name);
  }

  const [folderLikesByFolderId, setFolderLikesByFolderId] = useState(
    _folderLikesByFolderId
  ); // Step 1: New state variable

  useEffect(() => {
    if (!isLast && !searchInput) {
      const loadMoreReports = async () => {
        const from = offset * PAGE_COUNT;
        const to = from + PAGE_COUNT - 1;
        setOffset((prev) => prev + 1);

        let { data: folders } = await supabase
          .from("folders")
          .select("*")
          .range(from, to)
          .or(`availability.neq.DELETED,availability.is.null`)
          .eq("userId", userId)
          .order("createdAt", { ascending: false });

        // Extract folderIds from the obtained folders data
        const folderIds = folders.map((folder) => folder.folderId);

        let folderLikes = [];

        if (folderIds.length > 0) {
          let { data } = await supabase
            .from("folderLikes")
            .select()
            .in("folderId", folderIds);

          folderLikes = data;
        }

        const newLikesByFolderId = folderLikes.reduce((acc, folderLike) => {
          if (!acc[folderLike.folderId]) {
            acc[folderLike.folderId] = 0;
          }

          acc[folderLike.folderId] += folderLike.likeValue;
          return acc;
        }, {});

        // Update the folderLikesByFolderId state with the new data
        setFolderLikesByFolderId((prev) => ({
          ...prev,
          ...newLikesByFolderId,
        }));

        return folders;
      };

      if (isInView && !isLast && !searchInput) {
        loadMoreReports().then((moreReports) => {
          setLoadedReports((prev) =>
            getUniqueFolders([...prev, ...moreReports])
          );
          if (moreReports.length < PAGE_COUNT) {
            setIsLast(true);
          }
        });
      }
    }
  }, [isInView, isLast]);
  function getUniqueFolders(folders) {
    const seenIds = new Set();
    const uniqueFolders = [];

    for (const folder of folders) {
      if (!seenIds.has(folder.folderId)) {
        seenIds.add(folder.folderId);
        uniqueFolders.push(folder);
      }
    }

    return uniqueFolders;
  }
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1); // Default to 1 for "Short"

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const tokenToWords = 200;
  const tokenToCost = 0.38;
  const getOptionName = (tokenValue) => {
    switch (tokenValue) {
      case 1:
        return "Short (1 token)";
      case 2:
        return "Standard (2 tokens)";
      case 4:
        return "Super (4 tokens)";
      default:
        return "";
    }
  };
  // }
  return (
    <>
      <Breadcrumb style={{ fontFamily: "monospace" }}>
        <BreadcrumbItem className="text-white">
          <a style={{ color: "white" }} href="/account/tokens/get-tokens">
            {agencyName}
          </a>
        </BreadcrumbItem>
        <BreadcrumbItem className="text-white" active>
          <i className={`bi bi-folder`}></i>
          &nbsp;Reports
        </BreadcrumbItem>
      </Breadcrumb>
      <div id="quickDraftBriefingInput">
        <div>
          <textarea
            autoFocus
            value={briefingInput}
            onChange={(e) => setBriefingInput(e.target.value)}
            type="text"
            placeholder="What would you like to know?"
            lines="5"
            style={{
              padding: "12px 12px 13px 13px",
              borderWidth: "0px",
              width: "100%",
              height: "180px",
              color: "white",
              borderRadius: "8px",
              backgroundColor: "#444",
            }}
          />
        </div>
        <Row>
          <Col>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Button
                onClick={handleQuickDraftClick}
                style={{
                  textAlign: "left",
                  borderColor: "green",
                  borderWidth: "2px",
                  alignContent: "right",
                  marginBottom: "40px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                disabled={briefingInput.length === 0}
                className="btn btn-primary section-title"
              >
                {/* ↳ */}
                <i className="bi bi-folder"></i>+ Quick Draft
              </Button>
            </div>
          </Col>
          <Col>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                {/* Displaying the currently selected option in the DropdownToggle */}
                <DropdownToggle caret>
                  <i className="bi bi-coin"></i> {getOptionName(selectedOption)}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setSelectedOption(1)}>
                    <i className="bi bi-coin"></i> Short (1 token)
                  </DropdownItem>
                  <DropdownItem onClick={() => setSelectedOption(2)}>
                    <i className="bi bi-coin"></i> Standard (2 tokens)
                  </DropdownItem>
                  <DropdownItem onClick={() => setSelectedOption(4)}>
                    <i className="bi bi-coin"></i> Super (4 tokens)
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {/* <p>{selectedOption * tokenToWords} words</p>
            <p>${(selectedOption * tokenToCost).toFixed(2)}</p> */}
            </div>
          </Col>
        </Row>

        {/* <div>Super</div> */}
      </div>
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
          placeholder="🔎 Existing Reports"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {/* <div>{JSON.stringify(_folderLikesByFolderId)}</div> */}
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
