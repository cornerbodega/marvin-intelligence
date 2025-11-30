import { Row, Breadcrumb, BreadcrumbItem } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useUser } from "../../context/UserContext";
import IntelliCardGroup from "../../components/IntelliCardGroup";
import { supabase } from "../../utils/supabase";
import { slugify } from "../../utils/slugify";
import Head from "next/head";

const PAGE_COUNT = 9;

const ViewAgents = () => {
  const [isLast, setIsLast] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [loadedAgents, setLoadedAgents] = useState([]);
  const [agencyName, setAgencyName] = useState("");

  const [parentReportTitle, setParentReportTitle] = useState("");
  const [parentReportId, setParentReportId] = useState("");
  const [parentReportSlug, setParentReportSlug] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const containerRef = useRef(null);
  const router = useRouter();
  const [userId, setUserId] = useState();
  const { user, isLoading: isAuthLoading } = useUser();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push("/");
      } else if (user?.id) {
        setUserId(user.id);
      }
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    const initialize = async () => {
      if (!userId) {
        return;
      }

      const { data: agency, error: agencyError } = await supabase
        .from("users")
        .select("agencyName")
        .eq("userId", userId);

      if (agencyError || !agency || agency.length === 0) {
        router.push("/agency/create-agency");
        return;
      }

      setAgencyName(agency[0].agencyName);

      const { data: agents, error: agentError } = await supabase
        .from("agents")
        .select(
          "agentId, expertise1, expertise2, expertise3, agentName, profilePicUrl, bio"
        )
        .eq("userId", userId)
        .limit(PAGE_COUNT)
        .order("agentId", { ascending: false });

      if (agentError || !agents || agents.length === 0) {
        router.push("/agents/create-agent");
        return;
      }

      setLoadedAgents(agents);
    };

    initialize();
  }, [userId]);

  useEffect(() => {
    if (router.query.parentReportTitle) {
      setParentReportTitle(JSON.parse(router.query.parentReportTitle));
      setParentReportSlug(slugify(router.query.parentReportTitle));
    }
    if (router.query.parentReportId) {
      setParentReportId(router.query.parentReportId);
    }
  }, [router.query]);

  useEffect(() => {
    const handleDebouncedScroll = debounce(() => {
      if (!isLast) handleScroll();
    }, 200);

    window.addEventListener("scroll", handleDebouncedScroll);
    return () => window.removeEventListener("scroll", handleDebouncedScroll);
  }, [isLast]);

  const handleScroll = () => {
    if (containerRef.current && typeof window !== "undefined") {
      const { bottom } = containerRef.current.getBoundingClientRect();
      setIsInView(bottom <= window.innerHeight);
    }
  };

  const loadPagedResults = async () => {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("userId", userId)
      .filter("agentName", "neq", null)
      .filter("profilePicUrl", "neq", null)
      .limit(PAGE_COUNT)
      .order("agentId", { ascending: false });

    if (!error) setLoadedAgents(data);
  };

  const handleSearch = async (searchInput) => {
    setSearchInput(searchInput);

    if (searchInput.trim() === "") {
      loadPagedResults();
      return;
    }

    const { data: filteredAgents, error } = await supabase
      .from("agents")
      .select("*")
      .ilike("bio", `%${searchInput}%`)
      .eq("userId", userId);

    if (!error) setLoadedAgents(filteredAgents);
  };

  const handleCardClick = (agent) => {
    router.push({
      pathname: "/agents/detail/draft-report",
      query: { ...router.query, agentId: agent.agentId },
    });
  };

  useEffect(() => {
    if (!isLast && isInView) {
      const loadMoreAgents = async () => {
        const from = offset * PAGE_COUNT;
        const to = from + PAGE_COUNT - 1;
        setOffset((prev) => prev + 1);

        const { data } = await supabase
          .from("agents")
          .select("*")
          .range(from, to)
          .order("createdAt", { ascending: false });

        if (data && data.length > 0) {
          setLoadedAgents((prev) => [...prev, ...data]);
          if (data.length < PAGE_COUNT) setIsLast(true);
        } else {
          setIsLast(true);
        }
      };

      loadMoreAgents();
    }
  }, [isInView]);

  if (isAuthLoading || !user) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "40px" }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Agents | {agencyName}</title>
      </Head>
      <Breadcrumb style={{ fontWeight: "200", fontFamily: "monospace" }}>
        <BreadcrumbItem className="text-white">
          <i className="bi bi-briefcase" />
          &nbsp;
          <Link
            href="/reports/folders/view-folders"
            style={{ color: "white", textDecoration: "none" }}
          >
            {agencyName}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem className="text-white">
          <i className="bi bi-person-badge" />
          &nbsp; <span style={{ color: "white" }}>Agents</span>
        </BreadcrumbItem>
        {parentReportTitle && (
          <BreadcrumbItem className="text-white">
            <Link
              href={`/missions/report/${parentReportId}-${parentReportSlug}`}
              style={{ color: "white", textDecoration: "none" }}
            >
              {parentReportTitle}
            </Link>
          </BreadcrumbItem>
        )}
      </Breadcrumb>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        Agents write reports. They have different expertise and skills, and
        remember their past missions.
      </div>

      <div style={{ marginBottom: 40, width: "100%", display: "flex" }}>
        <input
          type="text"
          placeholder="⌕ Search Agents"
          style={{
            borderRadius: "8px",
            borderWidth: "0px",
            backgroundColor: "#444",
            color: "white",
            height: "2em",
            flexGrow: 1,
            textIndent: "10px",
          }}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div ref={containerRef}>
        <Row className="text-primary">
          <IntelliCardGroup
            offset={offset}
            handleCardClick={handleCardClick}
            datums={loadedAgents}
            datumsType="agents"
          />
        </Row>
      </div>
    </>
  );
};

export default ViewAgents;
