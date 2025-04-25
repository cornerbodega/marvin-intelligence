import Head from "next/head";
import { useState, useEffect } from "react";
export default function Journal() {
  const [maxWidth, setMaxWidth] = useState("none");

  useEffect(() => {
    const updateMaxWidth = () =>
      setMaxWidth(window.innerWidth <= 767 ? "100vw" : "33vw");
    updateMaxWidth(); // Set initial value
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
      <div style={{ lineHeight: "1.8", margin: "20px 0" }}>
        <p>
          <img
            src="/piers-marvin.jpg"
            alt="marvin at the pier"
            style={{
              maxWidth, // Controlled dynamically
              width: "100%",
              height: "auto",
            }}
          />
        </p>

        <h2 style={{ marginTop: "40px" }}>Computer Activities</h2>
        <h3 style={{ marginTop: "20px" }}>
          Gunsmoke3: AI-Focused Full-Stack Dev | GPT, Supabase, Three.js
        </h3>
        <p>
          I'm building a system where you upload a PDF and it generates a movie
          using Three.js. Input: PDF, Output: YouTube in one click.
        </p>
        <h3 style={{ marginTop: "20px" }}>
          Marvin Intelligence: AI-Driven Choose-Your-Own-Adventure Wikipedia
        </h3>
        <p>
          I created{" "}
          <a href="https://intelligence.marvin.technology">
            Marvin Intelligence
          </a>{" "}
          to save and organize ChatGPT outputs into shareable, interlinked
          reports.
          <br />
          It’s like a choose-your-own-adventure Wikipedia experience. Users can
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
          <br />
          <a
            target="_black"
            href="https://apps.apple.com/in/app/hedge-fund-hero/id6605920631"
          />
        </p>
        <h3 style={{ marginTop: "20px" }}>
          Hedge Fund Hero: AI-Driven Stock Analysis & Gamification
        </h3>
        <p>
          I built an iPhone game for to help discover new stocks. It uses
          Retrieval Augmented Delivery to perform Fundamental Analysis for every
          stock in the S&P 500. Live data.
          <br />
          <a
            target="_black"
            href="https://apps.apple.com/in/app/hedge-fund-hero/id6605920631"
          >
            Check it out!
          </a>
        </p>

        <h3 style={{ marginTop: "20px" }}>Senior Software Engineer, Cookies</h3>
        <p>
          I focused on optimizing operations and reducing costs by over $1M
          annually. By building a custom Node.js API with DatoCMS, I replaced
          costly systems like Salsify and Tray.io while improving workflows. A
          dynamic CMS-powered website I developed cut campaign launch times
          significantly. Alongside my technical contributions, I mentored
          colleagues, sharing knowledge to help build tools like a retail
          evaluation app, broadening the impact of our team’s work.
        </p>

        <h3 style={{ marginTop: "20px" }}>Founder, ABC Traceability</h3>
        <p>
          Starting ABC Traceability was a pivotal moment in my career. I
          developed and sold a web app to meet evolving cannabis compliance
          requirements in Washington State. This journey required self-teaching
          full-stack development and advocating for open API policies at
          conferences like AgroHack in Puerto Rico. It was rewarding to see my
          work support businesses navigating new regulatory landscapes.
        </p>

        <h3 style={{ marginTop: "20px" }}>Associate, BlackRock</h3>
        <p>
          At BlackRock, I learned the power of leveraging data and technology at
          scale. Managing analytics for $14T+ in assets on the Aladdin platform
          was both a technical and collaborative challenge. I partnered with
          portfolio managers to automate key processes like performance
          attribution and compliance reporting, improving accuracy and
          efficiency in portfolio management.
        </p>

        <h3 style={{ marginTop: "20px" }}>
          Project Manager Intern, DPR Construction
        </h3>
        <p>
          During my internships, I contributed to large-scale projects like a
          $27M skyscraper and a $50M cancer research center. These experiences
          taught me the fundamentals of project management, from procurement
          tracking to analyzing multimillion-dollar subcontracts. I learned how
          to balance attention to detail with big-picture thinking to ensure
          projects stayed on track.
        </p>

        <h2 style={{ marginTop: "40px" }}>Creative Technical Projects</h2>
        <h3 style={{ marginTop: "20px" }}>Hedge Fund Hero (2024 – Present)</h3>
        <p>
          I’m currently working on Hedge Fund Hero, a project to make investment
          data more accessible and engaging. It offers AI-driven stock analysis
          for every S&P 500 company, with features like financial term
          explanations and a gamified leaderboard. Developing this system with
          iOS, Swift, Supabase, and Node.js has been a rewarding challenge in
          combining AI and user-centric design.
        </p>

        <h3 style={{ marginTop: "20px" }}>
          Intelligence.Marvin.Technology (2023 – Present)
        </h3>
        <p>
          This project explores the intersection of AI and knowledge management.
          It allows users to save and organize ChatGPT outputs into shareable,
          interlinked reports, creating a choose-your-own-adventure-style
          Wikipedia experience. Building this system has deepened my
          understanding of how structured AI outputs can enhance learning and
          collaboration.
        </p>

        <h3 style={{ marginTop: "20px" }}>RhymeWith.Us (2022 – Present)</h3>
        <p>
          With RhymeWith.Us, I’ve combined my love for wordplay with technical
          creativity. It’s a multiplayer browser game where players compete to
          rhyme words before time runs out. I used Three.js for 3D graphics and
          built a local scoring system with a non-AI NLP algorithm. The project
          balances fun gameplay with solid engineering principles.
        </p>

        <h2 style={{ marginTop: "40px" }}>Education</h2>
        <h3 style={{ marginTop: "20px" }}>Brown University</h3>
        <p>
          I majored in Economics, with enriching experiences like working as a
          Teaching Assistant in Computer Science and Management. My
          entrepreneurial spirit flourished when I won the Brown
          Entrepreneurship Club Elevator Pitch competition. Studying abroad at
          the University of Otago in New Zealand broadened my perspective, and I
          cherished leading my intramural basketball team to four consecutive
          championships.
        </p>

        <h2 style={{ marginTop: "40px" }}>Learning & Growth</h2>
        <h3 style={{ marginTop: "20px" }}>Certifications</h3>
        <p>
          The Machine Learning Specialization from Stanford University and
          DeepLearning.AI deepened my understanding of AI, covering regression,
          advanced algorithms, and reinforcement learning. I am currently
          enrolled in the subsequent Deep Learning Specialization.
        </p>

        <h3 style={{ marginTop: "20px" }}>Recreation</h3>
        <p>isSnowy(myLocation) == true ? skiing(): basketball();</p>
      </div>
    </>
  );
}
