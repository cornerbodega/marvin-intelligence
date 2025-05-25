import Link from "next/link";
import { useState, useEffect } from "react";

export default function WhyWhatHow() {
  const [maxWidth, setMaxWidth] = useState("none");

  useEffect(() => {
    const updateMaxWidth = () =>
      setMaxWidth(window.innerWidth <= 767 ? "100vw" : "33vw");
    updateMaxWidth(); // Set initial value
    window.addEventListener("resize", updateMaxWidth);
    return () => window.removeEventListener("resize", updateMaxWidth);
  }, []);
  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>
        About Intelligence.Marvin.Technology
      </h1>
      {/* <img
        src="/Kata.jpg"
        alt="Sunrise at Kata Beach, Phuket, Thailand, where I discovered ChatGPT"
        style={{
          maxWidth, // Controlled dynamically
          width: "100%",
          height: "auto",
        }}
      /> */}
      {/* <div style={{ padding: 10 }}></div> */}
      {/* Sunrise at Kata Beach, Phuket, Thailand, where I discovered ChatGPT */}
      {/*     // router.push("/my-computer/access-my-computer");
       */}
      {/* <div style={{ padding: 20 }}></div> */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          I wanted to save the good stuff
        </h2>

        <p style={{ marginBottom: "20px" }}>
          When I first used ChatGPT, I thought it was great. Too great to waste.
          I wanted an easy way to save and organize what I was reading.
        </p>
        <p>
          I had been working on creating a business plan and it kept forgetting
          the name over time. I started saving the ChatGPT output in Google
          Sheets and had the idea to make links between reports. Rather than
          that, why not just make a website?
        </p>
        <p>
          I wonder if it can return HTML. It can! So I saved the output as html
          and added links myself. Of course, this was caveman cumbersome. If I
          could automate this process in a web app, then I could have a
          dynamically-genrated choose-your-own-adventure wiki page.
        </p>
        <ul>
          <li>
            What if every time a report is written, it's assocaited with a
            particular agent with a particular memory and specialization and
            perspective?
          </li>
          <li>
            What if the whole thing was automated? What if I could have the
            agents decide what to research and write next, recursively?
          </li>
          <li>
            Wouldn't that give me the ability to start and read a blog about
            anything I want, instanteneously, and completely customized to my
            interest?
          </li>
        </ul>
        <p>
          What if there were pictures and it read to me? That would be awesome.
        </p>
      </section>
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          Intelligence.Marvin.Technology is a recursive research at cataloging
          platform
        </h2>
        <p style={{ marginBottom: "20px" }}>
          This project was created with three primary goals in mind:
        </p>
        <ol style={{ marginBottom: "20px" }}>
          <li style={{ marginBottom: "10px" }}>
            Enable the creation of wiki-style pages directly from ChatGPT
            content.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Gain hands-on experience with state-of-the-art software development
            using AI.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Explore real-world economic opportunities made possible by recent
            advancements in AI technology.
          </li>
        </ol>
      </section>
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          Recruit GPT Agents to write reports
        </h2>

        <h3 style={{ marginBottom: "15px" }}>Reports</h3>
        <p style={{ marginBottom: "20px" }}>
          Start by pasting content from ChatGPT or other sources. An AI agent
          will analyze the content and generate a report. You can review and
          provide feedback on the report. Once you approve it, the agent will
          create a wiki-style page for you. This page is fully editable and
          shareable.
        </p>

        <h3 style={{ marginBottom: "15px" }}>Continuum & Deep Linking</h3>
        <p style={{ marginBottom: "20px" }}>
          Highlight any text in a report and click the <strong>+</strong>{" "}
          floating action button. This opens a prompt where the agent will guess
          what kind of linked report you need. You can edit or replace the
          prompt. The agent will generate a new report based on the prompt,
          factoring in the highlighted text, the linked report, and the agent’s
          previous reports. The new report will automatically link back to the
          original via a hyperlink on the highlighted text.
        </p>
        <p style={{ marginBottom: "20px" }}>
          The Continuum button simplifies this process by recursively generating
          deeply linked reports with shared context.
        </p>
      </section>
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          Built with flexible and scalable technologies
        </h2>
        <ul style={{ marginBottom: "20px" }}>
          <li style={{ marginBottom: "10px" }}>
            <strong>Frontend:</strong> Next.js (Hosted on Vercel)
          </li>
          <li style={{ marginBottom: "10px" }}>
            <strong>Backend:</strong> Node.js (Express on Cloud Run)
          </li>
          <li style={{ marginBottom: "10px" }}>
            <strong>Databases:</strong> Supabase (PostgreSQL) and Firebase
            (real-time)
          </li>
          <li style={{ marginBottom: "10px" }}>
            <strong>LLM:</strong> ChatGPT API (experimenting with different
            hosted and local models)
          </li>
        </ul>
      </section>
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Getting Started</h2>
        <ul>
          <li style={{ marginBottom: "10px" }}>
            Go to{" "}
            <Link
              style={{ color: "lightblue" }}
              href="/reports/folders/view-folders"
            >
              My Reports{" "}
            </Link>
            to create a report and view your previous ones. (Requires free
            account & login)
          </li>
          <li style={{ marginBottom: "10px" }}>
            Visit your previous{" "}
            <Link style={{ color: "lightblue" }} href="/agents/view-agents">
              Agents
            </Link>{" "}
            and write more reports using their memories & context.
          </li>
        </ul>
      </section>
      <Link
        style={{ color: "lightblue" }}
        href="/my-computer/access-my-computer"
      >
        About Marvin: Access my Computer
      </Link>
    </div>
  );
}
