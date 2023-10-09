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
      .limit(PAGE_COUNT)
      .order("folderId", { ascending: false });
    console.log("folders");
    console.log(folders);
    // other pages will redirect here if they're empty
    // If no agency, go to create agency page
    // If no missions, go to crete report page
    // let agency;
    return {
      props: { folders, userId },
    };
  },
});
const ViewReports = ({ folders, userId }) => {
  const [isLast, setIsLast] = useState(false);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(2);
  const [isInView, setIsInView] = useState(false);
  const [loadedReports, setLoadedReports] = useState(folders);
  const [briefingInput, setBriefingInput] = useState("");
  console.log("loadedReports");
  console.log(loadedReports);

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
    //   `asyncTasks/${user.sub}/writeDraftReport`,
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

  useEffect(() => {
    if (!isLast) {
      const loadMoreReports = async () => {
        const from = offset * PAGE_COUNT;
        const to = from + PAGE_COUNT - 1;
        setOffset((prev) => prev + 1);

        const { data } = await supabase
          .from("folders")
          .select("*")
          .range(from, to)
          .order("createdAt", { ascending: false });
        console.log("load more missions data");

        console.log(data);
        return data;
      };

      if (isInView) {
        console.log(`LOAD MORE FOLDERS ${offset}`);
        loadMoreReports().then((moreReports) => {
          console.log("moreReports");
          console.log(moreReports);
          setLoadedReports([...loadedReports, ...moreReports]);
          if (moreReports.length < PAGE_COUNT) {
            setIsLast(true);
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
          <i className={`bi bi-folder`}></i>
          &nbsp; Reports
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
            lines="3"
            style={{
              padding: "12px 12px 13px 13px",
              width: "100%",
              borderRadius: "5px",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={handleQuickDraftClick}
            style={{
              textAlign: "right",
              alignContent: "right",
              marginBottom: "40px",
              marginRight: "10px",
              cursor: "pointer",
            }}
            className="btn btn-primary"
          >
            {/* ↳ */}
            Quick Draft
          </div>
        </div>
      </div>
      {/* <div>{JSON.stringify(loadedReports)}</div> */}
      <div ref={containerRef}>
        <Row className="text-primary">
          <IntelliCardGroup
            offset={offset}
            handleCardClick={handleCardClick}
            datums={loadedReports}
            datumsType={"folders"}
          ></IntelliCardGroup>
        </Row>
      </div>
    </>
  );
};

export default ViewReports;
