import { Row, Breadcrumb, BreadcrumbItem, Button } from "reactstrap";
import useRouter from "next/router";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useUser } from "../../../context/UserContext";
import { supabase } from "../../../utils/supabase";
import { slugify } from "../../../utils/slugify";
import IntelliCardGroup from "../../../components/IntelliCardGroup";
const PAGE_COUNT = 9;

const ViewReports = () => {
  const containerRef = useRef(null);

  const [loadedReports, setLoadedReports] = useState([]);
  const [folderLikesByFolderId, setFolderLikesByFolderId] = useState({});
  const [reportCountsByFolderId, setReportCountsByFolderId] = useState({});
  const [offset, setOffset] = useState(1);
  const [isLast, setIsLast] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState();
  const { user, isLoading: isAuthLoading } = useUser();

  useEffect(() => {
    if (!isAuthLoading && user?.id) {
      setUserId(user.id);
    }
  }, [user, isAuthLoading]);
  useEffect(() => {
    async function fetchInitialData() {
      const { data: agency } = await supabase
        .from("users")
        .select("agencyName")
        .eq("userId", userId);

      if (!agency || agency.length === 0) {
        console.warn("No agency found; defaulting");
      }

      const { data: folders, error } = await supabase
        .from("folders")
        .select("*")
        .filter("folderName", "neq", null)
        .filter("folderPicUrl", "neq", null)
        .filter("availability", "eq", "GLOBAL")
        .limit(PAGE_COUNT)
        .order("folderId", { ascending: false });

      if (error) {
        console.error("Error loading folders", error);
        return;
      }

      setLoadedReports(folders);

      const folderIds = folders.map((f) => f.folderId);

      // Folder Likes
      const { data: likes } = await supabase
        .from("folderLikes")
        .select()
        .in("folderId", folderIds);

      const likesMap =
        likes?.reduce((acc, like) => {
          acc[like.folderId] = (acc[like.folderId] || 0) + like.likeValue;
          return acc;
        }, {}) || {};

      setFolderLikesByFolderId(likesMap);

      // Report Counts
      const { data: reportCountsData } = await supabase
        .from("folders")
        .select("folderId, reportFolders(count)")
        .in("folderId", folderIds);

      const countsMap =
        reportCountsData?.reduce((acc, item) => {
          acc[item.folderId] = item.reportFolders[0]?.count || 0;
          return acc;
        }, {}) || {};

      setReportCountsByFolderId(countsMap);
    }

    fetchInitialData();
  }, []);

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
        .filter("folderName", "neq", null)
        .filter("folderPicUrl", "neq", null)
        .filter("availability", "eq", "GLOBAL");

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

  const handleScroll = (container) => {
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      setIsInView((prev) => bottom <= innerHeight);
    }
  };

  async function handleFabClick() {
    console.log("ViewReports HandleClick Clicked!");
    goToPage("/reports/folders/view-folders");
  }
  const handleCardClick = (folder) => {
    const folderName = folder.folderName;
    const folderId = folder.folderId;
    const folderSlug = slugify(`${folderId}-${folderName}`);

    goToPage(`/intelnet/folders/intelnet-report/${folderSlug}`);
  };
  const router = useRouter;
  function goToPage(name) {
    router.push(name);
  }

  useEffect(() => {
    if (!isLast && !searchInput) {
      const loadMoreReports = async () => {
        const from = offset * PAGE_COUNT;
        const to = from + PAGE_COUNT - 1;
        setOffset((prev) => prev + 1);
        let { data: folders, error } = await supabase
          .from("folders")
          .select("*")
          // .eq("userId", userId)
          .filter("folderName", "neq", null)
          .filter("folderPicUrl", "neq", null)
          .filter("availability", "eq", "GLOBAL")
          .limit(PAGE_COUNT)
          .range(from, to)
          .order("folderId", { ascending: false });

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

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          color="primary"
          style={{
            border: "3px solid green",
            fontSize: "1em",
            marginBottom: "20px",
            // align to the right using flexbox
          }}
          onClick={(e) => goToPage("/reports/folders/view-folders")}
        >
          <i className="bi bi-folder"></i> Create Report Folder
        </Button>
      </div>
      <Breadcrumb style={{ fontFamily: "monospace" }}>
        <BreadcrumbItem className="text-white" active>
          <i className={`bi bi-globe`}></i>&nbsp;Intel-Net
        </BreadcrumbItem>
      </Breadcrumb>
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        Intel-Net contains the latest declassified intelligence reports from
        around the world.
      </div>

      <div style={{ marginBottom: "40px", width: "100%", display: "flex" }}>
        <input
          type="text"
          style={{
            borderRadius: "8px",
            borderWidth: "0px",
            backgroundColor: "#444",
            color: "white",
            height: "2em",
            flexGrow: 1, // Let it grow to take the available space
            textIndent: "10px",
          }}
          placeholder="⌕ Search Global Reports"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div ref={containerRef}>
        <Row className="text-primary">
          <IntelliCardGroup
            offset={offset}
            handleCardClick={handleCardClick}
            datums={loadedReports}
            folderLikesByFolderId={folderLikesByFolderId}
            reportCountsByFolderId={reportCountsByFolderId}
            datumsType={"intelnet"}
          ></IntelliCardGroup>
        </Row>
      </div>
    </>
  );
};

export default ViewReports;
