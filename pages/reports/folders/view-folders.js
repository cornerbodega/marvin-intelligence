import { Button, Row, Breadcrumb, BreadcrumbItem, Col } from "reactstrap";
import useRouter from "next/router";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
// other imports
import { getSession } from "@auth0/nextjs-auth0";
// import IntelliCardGroup from "../../../components/IntelliCardGroup";
// import IntelliCardGroup from "../../../components/IntelliCardGroup";
import { getSupabase } from "../../../utils/supabase";

// rest of component
import { slugify } from "../../../utils/slugify";
import IntelliCardGroup from "../../../components/IntelliCardGroup";
import Link from "next/link";

import Head from "next/head";
const PAGE_COUNT = 6;
const supabase = getSupabase();

export async function getServerSideProps(context) {
  const session = await getSession(context.req, context.res);
  // const user = ;
  const userId = session?.user.sub;
  if (userId) {
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

    // Query the reportFolders table to get the count of reports for each folderId
    let { data: reportCountsData, error: reportCountsError } = await supabase
      .from("folders")
      .select(`folderId, reportFolders(count)`)
      .in("folderId", folderIds);
    console.log("reportCountsData");
    console.log(reportCountsData);
    // console.log("reportCountsData[0].reportFolders[0]");
    // console.log(reportCountsData[0].reportFolders[0]);

    if (reportCountsError) {
      console.error("Error fetching report counts:", reportCountsError);
    }

    const _reportCountsByFolderId = reportCountsData.reduce((acc, item) => {
      acc[item.folderId] = item.reportFolders[0].count || null;
      return acc;
    }, {});

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
    let tokensRemaining = 0;
    if (tokensResponse) {
      if (tokensResponse[0]) {
        tokensRemaining = tokensResponse[0].tokens;
      }
    }
    console.log("tokensRemaining");
    console.log(tokensRemaining);

    return {
      props: {
        folders,
        userId,
        agencyName: agency[0].agencyName,
        _folderLikesByFolderId,
        _reportCountsByFolderId,
        tokensRemaining,
      },
    };
  } else {
    return {
      props: {
        folders: [],
        userId: null,
        agencyName: "Guest Agency",
        _folderLikesByFolderId: null,
        _reportCountsByFolderId: null,
        tokensRemaining: 25,
      },
    };
  }
}
const ViewReports = ({
  folders,
  userId,
  agencyName,
  _folderLikesByFolderId,
  _reportCountsByFolderId,
  tokensRemaining,
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
  function handleSelectedLength() {}
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
  const [didClickQuickDraft, setDidClickQuickDraft] = useState(false);
  async function handleQuickDraftClick() {
    if (didClickQuickDraft) {
      return;
    }
    setDidClickQuickDraft(true);
    if (!userId) {
      // go to create agency page
    }
    // check if the user has enough tokens
    // query supabase for the user's tokens
    // check the cost of the proposed report
    // if the user has enough tokens, proceed
    // if the user does not have enough tokens, prompt them to buy more tokens
    const { data: tokens, error } = await supabase
      .from("tokens")
      .select("tokens")
      .eq("userId", userId);
    if (error) {
      console.log("error");
      console.log(error);
    }
    console.log("tokens");
    console.log(tokens);
    let tokensRemaining = 0;
    if (tokens) {
      if (tokens[0]) {
        tokensRemaining = tokens[0].tokens;
      }
    }
    console.log("tokensRemaining");
    console.log(tokensRemaining);
    let cost = 0;
    if (reportLength === "short") {
      cost = 1;
    }
    if (reportLength === "standard") {
      cost = 2;
    }
    if (reportLength === "super") {
      cost = 4;
    }
    console.log("cost");
    console.log(cost);
    if (cost > tokensRemaining) {
      // prompt the user to buy more tokens
      console.log("prompt the user to buy more tokens");
      return goToPage("/account/tokens/get-tokens");
    }

    const draftData = { briefingInput };
    const newTask = {
      type: "quickDraft",
      status: "queued",
      userId,
      context: {
        ...draftData,
        userId,
        reportLength,
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
        // goToPage("/reports/create-report/quick-draft");
        router.push({
          pathname: "/reports/create-report/quick-draft",
          query: { ...router.query, briefingInput },
        });
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
  // const handleFabClick = () => {
  //   console.log("ViewReports HandleClick Clicked!");
  //   goToPage("/missions/create-mission/briefing");
  // };
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
  );
  const [reportCountsByFolderId, setReportCountsByFolderId] = useState(
    _reportCountsByFolderId
  );
  useEffect(() => {
    if (!isLast && !searchInput && userId) {
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

        // Fetch the report counts for the new folders
        let { data: reportCountsData } = await supabase
          .from("folders")
          .select(`folderId, reportFolders(count)`)
          .in("folderId", folderIds);

        const newReportCountsByFolderId = reportCountsData.reduce(
          (acc, item) => {
            acc[item.folderId] = item.reportFolders[0].count || null;
            return acc;
          },
          {}
        );

        // Update the reportCountsByFolderId state
        setReportCountsByFolderId((prev) => ({
          ...prev,
          ...newReportCountsByFolderId,
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
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // textareaRef.current.parentElement.style.setProperty(
      //   "--cursor-pos-x",
      //   "6px"
      // );
      const textWidth = getTextWidth(
        briefingInput,
        window.getComputedStyle(textareaRef.current).fontSize
      );
      const paddingLeft = parseFloat(
        window.getComputedStyle(textareaRef.current).paddingLeft
      );
      const paddingRight = parseFloat(
        window.getComputedStyle(textareaRef.current).paddingRight
      );

      const lineHeight = parseFloat(
        window.getComputedStyle(textareaRef.current).lineHeight
      );

      // Adjust for padding and ensure the cursor stays within bounds
      // const totalWidth = Math.min(
      //   textWidth + paddingLeft,
      //   textareaRef.current.offsetWidth - paddingRight - 1
      // );
      const textareaContentWidth =
        textareaRef.current.offsetWidth - paddingLeft - paddingRight;

      const lines = Math.ceil(textWidth / textareaContentWidth);
      const lastLineWidth = textWidth % textareaContentWidth || textWidth;

      const cursorLeft = lastLineWidth + paddingLeft;
      const cursorTop = (lines - 1) * lineHeight;

      textareaRef.current.parentElement.style.setProperty(
        "--cursor-pos-x",
        `${cursorLeft}px`
      );
      if (lines > 1) {
        textareaRef.current.parentElement.style.setProperty(
          "--cursor-pos-x",
          `${cursorLeft + lines * 5}px`
        );
      }

      if (briefingInput.length === 0) {
        console.log("briefingInput.length === 0");
        // textareaRef.current.parentElement.style.setProperty("top", "14px");
        textareaRef.current.parentElement.style.setProperty(
          "--cursor-pos-y",
          `${cursorTop + 45}px`
        );
        textareaRef.current.parentElement.style.setProperty(
          "caret-color",
          "transparent"
        );
        textareaRef.current.parentElement.classList.remove("no-background");
      } else {
        // textareaRef.current.parentElement.style.removeProperty("top");
        // console.log("lines");
        // console.log(lines);
        // textareaRef.current.parentElement.style.setProperty(
        //   "--cursor-pos-y",
        //   `${cursorTop + 15}px`
        // );
        // if (lines > 2) {
        //   textareaRef.current.parentElement.style.removeProperty(
        //     "--cursor-pos-y"
        //   );
        textareaRef.current.parentElement.style.setProperty(
          "caret-color",
          "limegreen"
        );
        textareaRef.current.parentElement.classList.add("no-background");
      }
      // } else {
      // textareaRef.current.parentElement.style.setProperty(
      //   "--cursor-pos-y",
      //   `${cursorTop + 42}px`
      // );
      // }
      // }
    }
  }, [briefingInput, textareaRef]);

  function getTextWidth(text, fontSize) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = fontSize + " Arial";
    return context.measureText(text).width;
  }

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const [reportLength, setReportLength] = useState("short");
  function handleSelectedLength(length) {
    console.log("handleselected length");
    console.log(length);
    setReportLength(length);
  }

  return (
    <>
      <Head>
        <title>Reports | {agencyName}</title>
      </Head>

      <Breadcrumb style={{ fontFamily: "monospace" }}>
        <BreadcrumbItem className="text-white">
          <i className="bi bi-briefcase" />
          &nbsp;
          <Link
            style={{ color: "white", textDecoration: "none" }}
            href="/account/tokens/get-tokens"
          >
            {agencyName}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem className="text-white" active>
          <i className={`bi bi-folder`}></i>
          &nbsp;Reports
        </BreadcrumbItem>
      </Breadcrumb>
      <div id="quickDraftBriefingInput">
        <div className="textareaWrapper">
          <textarea
            ref={textareaRef}
            autoFocus
            value={briefingInput}
            onChange={(e) => setBriefingInput(e.target.value)}
            placeholder="What would you like to know?"
            style={{
              padding: "12px 12px 13px 13px",
              borderWidth: "0px",
              width: "100%",
              height: "180px",
              color: "white",
              borderRadius: "8px",
              border: "1px solid white",
              backgroundColor: "#000",
              "--cursor-pos": "0px", // Initial value
            }}
          />
        </div>
        <Row>
          <Col>
            {/* <div style={{ display: "flex", justifyContent: "flex-start" }}> */}
            <div>
              <div style={{ marginBottom: "10px" }}>
                <Button
                  onClick={handleQuickDraftClick}
                  style={{
                    textAlign: "left",
                    borderColor: "#3fd000",
                    borderWidth: "2px",
                    alignContent: "right",
                    marginTop: "0px",
                    marginRight: "8px",
                    cursor: "pointer",
                    width: "108",
                  }}
                  disabled={
                    briefingInput.length === 0 ||
                    didClickQuickDraft ||
                    tokensRemaining < 1
                  }
                  className="btn btn-primary "
                >
                  <i className="bi bi-folder"></i>+ Quick Draft
                </Button>
              </div>
              <div style={{ marginBottom: "100px" }}>
                {/* <IntelliReportLengthDropdown
                  handleSelectedLength={handleSelectedLength}
                /> */}
              </div>
              {/* <div
                onClick={() => goToPage("/account/tokens/get-tokens")}
                style={{
                  marginBottom: "32px",
                  marginTop: "22px",
                  fontSize: "0.75em",
                  color: "lightblue",
                  cursor: "pointer",
                  width: "200px",
                }}
              >
                My Tokens: {tokensRemaining} <i className="bi bi-coin" />
              </div> */}
            </div>
            {/* <div style={{}}>
            
            </div> */}
          </Col>
        </Row>

        {/* <div>Super</div> */}
      </div>
      {loadedReports.length > 0 && (
        <>
          <div style={{ marginBottom: "20px", width: "100%", display: "flex" }}>
            <input
              type="text"
              style={{
                borderRadius: "8px",
                borderWidth: "0px",
                backgroundColor: "#000",
                color: "white",
                border: "1px solid grey",
                // marginLeft: "12px",
                // width: "auto", // Make the width auto to fit the content
                // maxWidth: "100%", // Control the maximum width for larger screens
                height: "2em",
                flexGrow: 1, // Let it grow to take the available space
                textIndent: "10px",
              }}
              lines="1"
              placeholder="⌕ Search existing reports"
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
                reportCountsByFolderId={reportCountsByFolderId}
                datumsType={"folders"}
              ></IntelliCardGroup>
            </Row>
          </div>
        </>
      )}
    </>
  );
};

export default ViewReports;
