import Head from "next/head";
import { useState, useEffect } from "react";

const Section = ({ title, children }) => (
  <>
    <h2 style={{ marginTop: "40px" }}>{title}</h2>
    {children}
  </>
);

const Entry = ({ title, href, children }) => (
  <>
    <h3 style={{ marginTop: "20px" }}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      ) : (
        title
      )}
    </h3>
    <p>{children}</p>
  </>
);

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default function Journal() {
  const [maxWidth, setMaxWidth] = useState("none");

  useEffect(() => {
    const updateMaxWidth = () =>
      setMaxWidth(window.innerWidth <= 767 ? "100vw" : "33vw");
    updateMaxWidth();
    window.addEventListener("resize", updateMaxWidth);
    return () => window.removeEventListener("resize", updateMaxWidth);
  }, []);

  return (
    <>
      <Head>
        <title>Marvin's Career Journal</title>
      </Head>
      <h1 style={{ textAlign: "left", marginBottom: "30px" }}>
        My Career Journal
      </h1>
      <p style={{ marginBottom: "20px" }}>
        <a href="/my-computer/access-my-computer">← Back to My Computer</a>
      </p>
      <div style={{ lineHeight: "1.8", margin: "20px 0" }}>
        <p>
          <img
            src="/piers-marvin.jpg"
            alt="marvin at the pier"
            style={{ maxWidth, width: "100%", height: "auto" }}
          />
        </p>

        <Section title="Claude Code Tools">
          <Entry title="xquery: Natural Language Database Queries" href="https://github.com/cornerbodega/xquery">
            A Node.js API that lets Claude query PostgreSQL databases using natural language.
            Supports multiple databases, multi-statement queries, automatic backups before DELETEs,
            and comes with a CLI client. Built for AI-assisted data investigation workflows.
          </Entry>

          <Entry title="Reporter: LaTeX to PDF API" href="https://github.com/cornerbodega/reporter">
            A simple API that converts LaTeX documents to PDFs. Send LaTeX, get base64-encoded
            PDF back. Supports syntax highlighting, logo insertion, and auto-cleanup of temp files.
            Perfect for generating professional reports from Claude's analysis.
          </Entry>
        </Section>

        <Section title="Computer Activities">
          <Entry title="Motosai: Multiplayer Motorcycle MMO" href="https://motosai.com">
            A browser-based multiplayer motorcycle game built in 5 weeks with
            Three.js, Socket.io, and Google Cloud Run. Features realistic counter-steering
            physics, real-time WebSocket multiplayer at 60fps, dynamic traffic AI, and a
            comic book aesthetic. 20K+ lines of code.{" "}
            <ExternalLink href="https://motosai.com/devlog">Read the devlog</ExternalLink>.
          </Entry>

          <Entry title="Gunsmoke4: AI Video Generation Pipeline">
            Transforms courtroom transcripts into cinematic videos using AI. Uses SadTalker
            for lip-sync, Flux Pro/Midjourney for character portraits, and RunPod GPU for
            rendering. 94% cheaper than commercial video APIs ($18-29 vs $330-720 for a
            12-hour video). Currently processing the Scopes Monkey Trial (1925).
          </Entry>

          <Entry title="Gunsmoke3: 3D Courtroom Simulation" href="https://github.com/cornerbodega/Gunsmoke3">
            Real-time 3D courtroom scenes in the browser using React Three Fiber and WebGL.
            GPT-4 for transcript parsing, lip-sync via viseme + amplitude analysis. 129 commits
            over 3 months. The predecessor to Gunsmoke4 - proved the concept but hit browser
            rendering limitations that led to the pipeline approach.
          </Entry>

          <Entry title="Marvin Intelligence: AI-Driven Choose-Your-Own-Adventure Wikipedia">
            I created <ExternalLink href="https://intelligence.marvin.technology">Marvin Intelligence</ExternalLink>{" "}
            to save and organize ChatGPT outputs into shareable, interlinked reports.
            <br />
            It's like a choose-your-own-adventure Wikipedia experience. Users can
            save ChatGPT outputs, create links between reports, and share them
            with others. The system uses a custom algorithm to generate HTML
            reports, making it easy to navigate and explore different topics.
            <br />
            The system creates agents that learn over time. They can even estimate
            what you're interested in and write reports automatically, giving you
            an endless personalized learning experience with built-in structure
            and referenceability.
            <br />
            Each report generates an image and you can listen via text-to-speech.
            <br />
            I use it all the time for recipes. I can't stand recipe websites. Too
            many ads and life stories. I'm hungry and maybe even at the store. I
            just want to know what and how much. I digest.
          </Entry>

          <Entry title="Hedge Fund Hero: AI-Driven Stock Analysis & Gamification">
            I built an iPhone game to help discover new stocks. It uses
            Retrieval Augmented Generation to perform Fundamental Analysis for every
            stock in the S&P 500. Live data.{" "}
            <ExternalLink href="https://apps.apple.com/in/app/hedge-fund-hero/id6605920631">
              Check it out!
            </ExternalLink>
          </Entry>

          <Entry title="Senior Software Engineer, Cookies">
            I focused on optimizing operations and reducing costs by over $1M
            annually. By building a custom Node.js API with DatoCMS, I replaced
            costly systems like Salsify and Tray.io while improving workflows. A
            dynamic CMS-powered website I developed cut campaign launch times
            significantly. Alongside my technical contributions, I mentored
            colleagues, sharing knowledge to help build tools like a retail
            evaluation app, broadening the impact of our team's work.
          </Entry>

          <Entry title="Founder, ABC Traceability">
            Starting ABC Traceability was a pivotal moment in my career. I
            developed and sold a web app to meet evolving cannabis compliance
            requirements in Washington State. This journey required self-teaching
            full-stack development and advocating for open API policies at
            conferences like AgroHack in Puerto Rico. It was rewarding to see my
            work support businesses navigating new regulatory landscapes.
          </Entry>

          <Entry title="Associate, BlackRock">
            At BlackRock, I learned the power of leveraging data and technology at
            scale. Managing analytics for $14T+ in assets on the Aladdin platform
            was both a technical and collaborative challenge. I partnered with
            portfolio managers to automate key processes like performance
            attribution and compliance reporting, improving accuracy and
            efficiency in portfolio management.
          </Entry>

          <Entry title="Project Manager Intern, DPR Construction">
            During my internships, I contributed to large-scale projects like a
            $27M skyscraper and a $50M cancer research center. These experiences
            taught me the fundamentals of project management, from procurement
            tracking to analyzing multimillion-dollar subcontracts. I learned how
            to balance attention to detail with big-picture thinking to ensure
            projects stayed on track.
          </Entry>
        </Section>

        <Section title="Education">
          <Entry title="Brown University">
            I majored in Economics, with enriching experiences like working as a
            Teaching Assistant in Computer Science and Management. My
            entrepreneurial spirit flourished when I won the Brown
            Entrepreneurship Club Elevator Pitch competition. Studying abroad at
            the University of Otago in New Zealand broadened my perspective, and I
            cherished leading my intramural basketball team to four consecutive
            championships.
          </Entry>
        </Section>

        <Section title="Learning & Growth">
          <Entry title="Certifications">
            The Machine Learning Specialization from Stanford University and
            DeepLearning.AI deepened my understanding of AI, covering regression,
            advanced algorithms, and reinforcement learning. I am currently
            enrolled in the subsequent Deep Learning Specialization.
          </Entry>

          <Entry title="Recreation">
            isSnowy(myLocation) ? skiing() : basketball();
          </Entry>
        </Section>
      </div>
    </>
  );
}
