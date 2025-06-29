import { Button, Row, Breadcrumb, BreadcrumbItem, Col } from "reactstrap";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import IntelliTextInput from "../../../components/IntelliTextInput/IntelliTextInput";
import { useUser } from "../../../context/UserContext";

import { supabase } from "../../../utils/supabase";

import { slugify } from "../../../utils/slugify";
import IntelliCardGroup from "../../../components/IntelliCardGroup";
import Link from "next/link";

import Head from "next/head";
import { saveToSupabase } from "../../../utils/saveToSupabase";
const PAGE_COUNT = 9;

const ViewReports = () => {
  const folders = [];

  const _agencyName = null;
  const _folderLikesByFolderId = {};
  const _reportCountsByFolderId = {};

  const [isLast, setIsLast] = useState(false);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(2);
  const [isInView, setIsInView] = useState(false);
  const [loadedReports, setLoadedReports] = useState(folders);
  const [briefingInput, setBriefingInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState();
  const [agencyName, setAgencyName] = useState(_agencyName);
  const [triedToLoadReports, setTriedToLoadReports] = useState(false);
  const [didClickQuickDraft, setDidClickQuickDraft] = useState(false);
  const [reportLength, setReportLength] = useState("short");
  const textareaRef = useRef(null);

  const userContext = useUser();
  const router = useRouter();

  const [folderLikesByFolderId, setFolderLikesByFolderId] = useState(
    _folderLikesByFolderId
  );
  const [reportCountsByFolderId, setReportCountsByFolderId] = useState(
    _reportCountsByFolderId
  );

  useEffect(() => {
    if (textareaRef.current) {
      const computedStyle = window.getComputedStyle(textareaRef.current);
      const textWidth = getTextWidth(briefingInput, computedStyle.fontSize);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const paddingRight = parseFloat(computedStyle.paddingRight);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const contentWidth =
        textareaRef.current.offsetWidth - paddingLeft - paddingRight;

      const lines = Math.ceil(textWidth / contentWidth);
      const lastLineWidth = textWidth % contentWidth || textWidth;

      const cursorLeft = lastLineWidth + paddingLeft;
      const cursorTop = (lines - 1) * lineHeight;

      const wrapper = textareaRef.current.parentElement;
      wrapper.style.setProperty("--cursor-pos-x", `${cursorLeft + 10}px`);
      wrapper.style.setProperty("--cursor-pos-y", `${cursorTop + 17}px`);

      if (briefingInput.length === 0) {
        wrapper.style.setProperty("--cursor-pos-x", `13px`);
        wrapper.style.setProperty("--cursor-pos-y", `20px`);
      }
    }
  }, [briefingInput]);

  function getTextWidth(text, fontSize) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = fontSize + " Arial";
    return ctx.measureText(text).width;
  }

  useEffect(() => {
    if (userContext?.id) {
      setUserId(userContext.id);
    }
  }, [userContext]);

  useEffect(() => {
    const initData = async () => {
      if (!userId || triedToLoadReports) return;

      setTriedToLoadReports(true);

      if (!agencyName) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("agencyName")
            .eq("userId", userId)
            .single();

          if (data?.agencyName) {
            setAgencyName(data.agencyName);
          } else {
            const res = await fetch("/api/agency/generate-guest-agency-name");
            const json = await res.json();
            setAgencyName(`Guest ${json.agencyName}`);
          }
        } catch (err) {
          console.error("Error fetching agency name:", err);
        }
      }

      const { data: folders, error } = await supabase
        .from("folders")
        .select("*")
        .eq("userId", userId)
        .filter("folderName", "neq", null)
        .filter("folderPicUrl", "neq", null)
        .or("availability.neq.DELETED,availability.is.null")
        .limit(PAGE_COUNT)
        .order("folderId", { ascending: false });

      if (error) {
        console.error("Error loading folders:", error);
        return;
      }

      setLoadedReports(folders || []);

      const folderIds = (folders || []).map((f) => f.folderId);
      if (folderIds.length === 0) return;

      const { data: folderLikes } = await supabase
        .from("folderLikes")
        .select()
        .in("folderId", folderIds);

      const likesMap = (folderLikes || []).reduce((acc, like) => {
        acc[like.folderId] = (acc[like.folderId] || 0) + like.likeValue;
        return acc;
      }, {});
      setFolderLikesByFolderId((prev) => ({ ...prev, ...likesMap }));

      const { data: reportCounts } = await supabase
        .from("folders")
        .select("folderId, reportFolders(count)")
        .in("folderId", folderIds);

      const countsMap = (reportCounts || []).reduce((acc, item) => {
        acc[item.folderId] = item.reportFolders?.[0]?.count || null;
        return acc;
      }, {});
      setReportCountsByFolderId((prev) => ({ ...prev, ...countsMap }));
    };

    initData();
  }, [userId]);

  async function loadPagedResults() {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("userId", userId)
      .filter("folderName", "neq", null)
      .filter("folderPicUrl", "neq", null)
      .limit(PAGE_COUNT)
      .order("folderId", { ascending: false });

    if (!error) setLoadedReports(data);
  }

  function goToPage(name) {
    router.push(name);
  }

  async function handleSearch(searchInput) {
    setSearchInput(searchInput);

    if (searchInput.trim() === "") {
      loadPagedResults();
      return;
    }

    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .ilike("folderName", `%${searchInput}%`)
      .eq("userId", userId);

    if (!error) setLoadedReports(data);
  }

  const handleScroll = () => {
    if (containerRef.current && typeof window !== "undefined") {
      const { bottom } = containerRef.current.getBoundingClientRect();
      const { innerHeight } = window;
      setIsInView((prev) => bottom <= innerHeight);
    }
  };

  useEffect(() => {
    const handleDebouncedScroll = debounce(() => {
      if (!isLast) handleScroll();
    }, 200);
    window.addEventListener("scroll", handleDebouncedScroll);
    return () => window.removeEventListener("scroll", handleDebouncedScroll);
  }, []);

  useEffect(() => {
    if (!isLast && !searchInput && userId && isInView) {
      const loadMoreReports = async () => {
        const from = offset * PAGE_COUNT;
        const to = from + PAGE_COUNT - 1;
        setOffset((prev) => prev + 1);

        const { data: moreFolders } = await supabase
          .from("folders")
          .select("*")
          .range(from, to)
          .or("availability.neq.DELETED,availability.is.null")
          .filter("folderName", "neq", null)
          .filter("folderPicUrl", "neq", null)
          .eq("userId", userId)
          .order("createdAt", { ascending: false });

        const folderIds = moreFolders.map((f) => f.folderId);

        const { data: likes } = await supabase
          .from("folderLikes")
          .select()
          .in("folderId", folderIds);

        const newLikes = (likes || []).reduce((acc, like) => {
          acc[like.folderId] = (acc[like.folderId] || 0) + like.likeValue;
          return acc;
        }, {});

        setFolderLikesByFolderId((prev) => ({ ...prev, ...newLikes }));

        const { data: counts } = await supabase
          .from("folders")
          .select("folderId, reportFolders(count)")
          .in("folderId", folderIds);

        const newCounts = (counts || []).reduce((acc, item) => {
          acc[item.folderId] = item.reportFolders?.[0]?.count || null;
          return acc;
        }, {});

        setReportCountsByFolderId((prev) => ({ ...prev, ...newCounts }));

        setLoadedReports((prev) => getUniqueFolders([...prev, ...moreFolders]));

        if ((moreFolders || []).length < PAGE_COUNT) setIsLast(true);
      };

      loadMoreReports();
    }
  }, [isInView, isLast]);

  function getUniqueFolders(folders) {
    const seenIds = new Set();
    return folders.filter((f) => {
      if (seenIds.has(f.folderId)) return false;
      seenIds.add(f.folderId);
      return true;
    });
  }

  const handleCardClick = (folder) => {
    const folderSlug = slugify(`${folder.folderId}-${folder.folderName}`);
    router.push(`/reports/folders/intel-report/${folderSlug}`);
  };

  async function handleQuickDraftClick() {
    if (didClickQuickDraft) return;

    setDidClickQuickDraft(true);

    const createUserModel = { userId, agencyName };
    await saveToSupabase("users", createUserModel).catch(console.log);

    const newTask = {
      type: "quickDraft",
      status: "queued",
      userId,
      context: {
        briefingInput,
        userId,
        reportLength,
      },
      createdAt: new Date().toISOString(),
    };

    const response = await fetch("/api/tasks/save-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      router.push({
        pathname: "/reports/create-report/quick-draft",
        query: { ...router.query, briefingInput },
      });
    } else {
      console.error("Failed to save the task");
    }
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
            href="/agency/create-agency"
            style={{ color: "white", textDecoration: "none" }}
          >
            {agencyName}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem className="text-white" active>
          Create Report
        </BreadcrumbItem>
      </Breadcrumb>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        Ask a question or enter information to create a folder and a report.
      </div>

      <div id="quickDraftBriefingInput">
        <div className="textareaWrapper">
          <IntelliTextInput
            value={briefingInput}
            onChange={setBriefingInput}
            placeholder="type or paste here."
          />
        </div>
        <Row>
          <Col>
            <Button
              onClick={handleQuickDraftClick}
              style={{
                borderColor: "#31A0D1",
                borderWidth: "4px",
                marginTop: "0px",
                marginBottom: "16px",
                marginRight: "8px",
              }}
              disabled={briefingInput.length === 0 || didClickQuickDraft}
              className="btn btn-primary"
            >
              <i className="bi bi-folder"></i> Create Report Folder
            </Button>
          </Col>
        </Row>
      </div>
      {loadedReports.length >= 0 && (
        <div style={{ marginBottom: "20px", width: "100%", display: "flex" }}>
          <input
            type="text"
            placeholder="⌕ Search my reports"
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              borderRadius: "8px",
              backgroundColor: "#000",
              color: "white",
              border: "1px solid grey",
              height: "2em",
              flexGrow: 1,
              textIndent: "10px",
            }}
          />
        </div>
      )}
      <div ref={containerRef}>
        <Row className="text-primary">
          <IntelliCardGroup
            offset={offset}
            handleCardClick={handleCardClick}
            datums={loadedReports}
            folderLikesByFolderId={folderLikesByFolderId}
            reportCountsByFolderId={reportCountsByFolderId}
            datumsType={"folders"}
          />
        </Row>
      </div>
    </>
  );
};

export default ViewReports;
