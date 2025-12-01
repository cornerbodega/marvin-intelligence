import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";

import DraggableWindow from "../../components/EagleProgramManager/DraggableWindow.js";
import EagleOptixFolder from "../../components/EagleProgramManager/EagleOptixFolder.js";
import ProgramIcon from "../../components/EagleProgramManager/ProgramIcon.js";
import Head from "next/head";
const backgroundCanvasStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 1,
  backgroundImage: "url('/eaglebg.jpg')",
};

const programManagerContentStyle = {
  display: "flex",
  flexDirection: "column",
};

const icons = [
  {
    name: "Eagle Optix",
    image: "/eaglehead.jpg",
  },
];

export default function EagleCommandProgramManager() {
  const [isAboutMarvinOpen, setAboutMarvinOpen] = useState(false);
  const [isResearchToolsOpen, setResearchToolsOpen] = useState(false);
  const [isProgramManagerOpen, setProgramManagerOpen] = useState(true);
  const [isGamesOpen, setGamesOpen] = useState(false);
  const [isJournalOpen, setJournalOpen] = useState(false);
  const [isClaudeToolsOpen, setClaudeToolsOpen] = useState(false);

  function handleProgramManagerClose() {
    setProgramManagerOpen(false);
    console.log(`Program Manager closed`);
  }
  function handleAboutMarvinClosed() {
    setAboutMarvinOpen(false);
  }
  function handleResearchToolsClosed() {
    setResearchToolsOpen(false);
  }
  function handleGamesClosed() {
    setGamesOpen(false);
  }
  function handleJournalClosed() {
    setJournalOpen(false);
  }
  function handleClaudeToolsClosed() {
    setClaudeToolsOpen(false);
  }

  const handleProgramManagerIconClick = () => {
    console.log(`Program Manager icon clicked`);
    setProgramManagerOpen(true);
  };
  const handleAboutMarvinClick = () => {
    setAboutMarvinOpen(true);
  };
  const handleResearchToolsClick = () => {
    setResearchToolsOpen(true);
  };
  const handleGamesClick = () => {
    setGamesOpen(true);
  };
  const handleJournalClick = () => {
    setJournalOpen(true);
  };
  const handleClaudeToolsClick = () => {
    setClaudeToolsOpen(true);
  };
  const programManagerFolders = [
    {
      name: "About Me",
      description: "Resume & Career Journal",
      path: "/eagle-optix",
      image: "/eaglehead.jpg",
      onDoubleClick: handleAboutMarvinClick,
    },
    {
      name: "Claude Tools",
      description: "Open Source Dev Tools",
      path: "/eagle-optix",
      image: "/llm-tools-logo.png",
      onDoubleClick: handleClaudeToolsClick,
    },
    {
      name: "Research Tools",
      description: "AI-Powered Wiki",
      path: "/eagle-optix",
      image: "/sheet.jpg",
      onDoubleClick: handleResearchToolsClick,
    },
    {
      name: "Games",
      description: "Browser & Mobile Games",
      path: "/eagle-optix",
      image: "/nest.jpg",
      onDoubleClick: handleGamesClick,
    },
  ];

  const aboutMarvinFolders = [
    {
      name: "Career Journal",
      description: "Work history & projects",
      path: "/about/journal",
      image: "/talon.jpg",
    },
    {
      name: "Resume",
      description: "Google Doc",
      path: "https://docs.google.com/document/d/12ZRriMe62DBUce_ic5A4NkvMULugcnvUBtFpTsQJZdY/edit?tab=t.0",
      image: "/insight.jpg",
    },
  ];
  const researchToolsFolders = [
    {
      name: "Marvinfo",
      description: "AI-powered research wiki",
      path: "/about/why-what-how",
      image: "/feather.jpg",
    },
  ];
  const gamesFolders = [
    {
      name: "Hedge Fund Hero",
      description: "iOS stock analysis game",
      path: "https://apps.apple.com/us/app/hedge-fund-hero/id6605920631?ct=Tap33743197",
      image: "/HFH_Logo.png",
    },
    {
      name: "Rhyme With Us",
      description: "Multiplayer rhyming game",
      path: "https://rhymewith.us",
      image: "/rhyme-with-us.jpg",
    },
    {
      name: "Motosai",
      description: "Multiplayer motorcycle MMO",
      path: "https://motosai.com",
      image: "/motosai-logo.png",
    },
  ];
  const claudeToolsFolders = [
    {
      name: "xquery",
      description: "Natural language DB queries",
      path: "https://github.com/cornerbodega/xquery",
      image: "/xquery-logo.png",
    },
    {
      name: "Reporter",
      description: "LaTeX to PDF API",
      path: "https://github.com/cornerbodega/reporter",
      image: "/reporter-logo.png",
    },
  ];
  // {
  //   name: "Visionary Sheet Complete",
  //   path: "/visionary-sheet-completion",
  //   image: "/sheet.jpg",
  // },
  // {
  //   name: "Insights Navigator",
  //   // path: "/insights-navigator",
  //   image: "/insight.jpg",
  // },
  // {
  //   name: "Talon Error Snatcher",
  //   // path: "/talon-error-snatcher",
  //   image: "/talon.jpg",
  // },
  // {
  //   name: "Fuzzy Feather Matcher",
  //   path: "/feather-fuzzy-matcher",
  //   image: "/feather.jpg",
  // },
  // {
  //   name: "Nest Data Orchestrator",
  //   // path: "/nest-data-orchestrator",
  //   image: "/nest.jpg",
  // },

  return (
    <div>
      <Canvas style={backgroundCanvasStyle}>
        {/* <ambientLight /> */}
        {/* <pointLight position={[10, 10, 10]} /> */}
      </Canvas>
      <Head>
        <title>Marvin's Computer </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {isProgramManagerOpen && (
        <DraggableWindow
          title="Program Manager"
          defaultPosition={[50, 50]}
          defaultSize={[450, 520]}
          initialHeight={520} // Initial height for Program Manager window
          onClose={handleProgramManagerClose}
          zIndex={10} // Higher z-index for the window
        >
          <div style={programManagerContentStyle}>
            <EagleOptixFolder
              icons={programManagerFolders}
              windowId="programManager"
              initialHeight={480} // Initial height for folder contents
            />
          </div>
        </DraggableWindow>
      )}

      {isAboutMarvinOpen && (
        <DraggableWindow
          title="About Marvin"
          defaultPosition={[200, 200]}
          defaultSize={[400, 400]}
          initialHeight={400} // Initial height for Eagle Optix window
          onClose={handleAboutMarvinClosed}
          zIndex={10} // Higher z-index for the window
        >
          <EagleOptixFolder
            icons={aboutMarvinFolders}
            windowId="aboutMarvin"
            initialHeight={350}
          />
        </DraggableWindow>
      )}
      {isResearchToolsOpen && (
        <DraggableWindow
          title="Research Tools"
          defaultPosition={[200, 200]}
          defaultSize={[400, 400]}
          initialHeight={400} // Initial height for Eagle Optix window
          onClose={handleResearchToolsClosed}
          zIndex={10} // Higher z-index for the window
        >
          <EagleOptixFolder
            icons={researchToolsFolders}
            windowId="researchTools"
            initialHeight={350}
          />
        </DraggableWindow>
      )}
      {isGamesOpen && (
        <DraggableWindow
          title="Games"
          defaultPosition={[200, 200]}
          defaultSize={[400, 400]}
          initialHeight={400} // Initial height for Eagle Optix window
          onClose={handleGamesClosed}
          zIndex={10} // Higher z-index for the window
        >
          <EagleOptixFolder
            icons={gamesFolders}
            windowId="researchTools"
            initialHeight={350}
          />
        </DraggableWindow>
      )}
      {isClaudeToolsOpen && (
        <DraggableWindow
          title="Claude Tools"
          defaultPosition={[250, 150]}
          defaultSize={[400, 400]}
          initialHeight={400}
          onClose={handleClaudeToolsClosed}
          zIndex={10}
        >
          <EagleOptixFolder
            icons={claudeToolsFolders}
            windowId="claudeTools"
            initialHeight={350}
          />
        </DraggableWindow>
      )}
      {isJournalOpen && (
        <DraggableWindow
          title="Journal"
          defaultPosition={[200, 200]}
          defaultSize={[400, 400]}
          initialHeight={400} // Initial height for Eagle Optix window
          onClose={handleGamesClosed}
          zIndex={10} // Higher z-index for the window
        >
          test
          {/* <EagleOptixFolder
            icons={gamesFolders}
            windowId="researchTools"
            initialHeight={350}
          /> */}
        </DraggableWindow>
      )}
      <ProgramIcon
        icon={{
          name: "Program Manager",
          path: "true",
          image: "/programmanager.jpg",
        }}
        position={[20, 20]}
        onClick={handleProgramManagerIconClick}
        style={{ zIndex: 1 }} // Lower z-index for the icon
      />
    </div>
  );
}
