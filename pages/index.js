// import Head from "next/head";

// import Mlogo from "../components/Mlogo";
// import { Button, Container, Row, Col } from "reactstrap";

import React from "react";
// import Logo from "../src/layouts/logo/Logo";

export async function getServerSideProps(context) {
  // redirect to login if no token
  return {
    redirect: {
      destination: "/intelnet/folders/view-intelnet",
      permanent: false,
    },
  };
}
export default function Home() {
  return <></>;
  // return (
  //   <div
  //     style={{ background: "black" }}
  //     className="gradient-background text-white"
  //   >
  //     <Head>
  //       {/* <title>Intelligence</title> */}
  //       <meta name="description" content="Generated by create next app" />
  //       <link rel="icon" href="/favicon.ico" />
  //       <>
  //         <meta charSet="utf-8" />
  //         <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  //         <meta name="viewport" content="width=device-width, initial-scale=1" />
  //         <link
  //           href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600"
  //           rel="stylesheet"
  //         />
  //       </>
  //     </Head>

  //     <div>
  //       <div className="">
  //         <header className="">
  //           <div className=""></div>
  //         </header>
  //         <Container>
  //           <Row>
  //             <Col md={{ size: 6, offset: 1 }}>
  //               <main>
  //                 <div className="">
  //                   <div className="">
  //                     <div
  //                       // className="hero-inner"
  //                       style={{
  //                         marginLeft: "auto",
  //                         marginRight: "auto",
  //                         display: "flex",
  //                         // alignItems: "center",
  //                         flexDirection: "column",
  //                         background: "black",
  //                         borderRadius: "20px",
  //                       }}
  //                     >
  //                       <div style={{ width: "600px", marginBottom: "20px" }}>
  //                         <img
  //                           style={{
  //                             borderRadius: "20px",
  //                             width: "600px",
  //                             height: "auto",
  //                           }}
  //                           src="library.png"
  //                         />
  //                       </div>
  //                       <div
  //                         style={{
  //                           minWidth: "300px",
  //                           marginBottom: "20px",
  //                           maxWidth: "500px",
  //                         }}
  //                       >
  //                         <h1 className="hero-title mt-0 text-white">
  //                           Unlock the Power of Automated Learning
  //                         </h1>
  //                       </div>

  //                       <div className="" style={{ marginTop: "20px" }}>
  //                         <Button
  //                           // className="button btn-primary text-white"
  //                           href="/account/log-in"
  //                           style={{
  //                             color: "white",
  //                             border: "3px solid green",
  //                           }}
  //                         >
  //                           Get 25 Free Tokens
  //                         </Button>

  //                         {/* <span className="text-white" style={{ margin: "10px" }}>
  //                       or
  //                     </span>
  //                     <Button
  //                       style={{ color: "white" }}
  //                       href="/agents/view-agents"
  //                     >
  //                       Meet your AI Team
  //                     </Button> */}
  //                         <div
  //                           style={{ marginTop: "20px", fontSize: "0.75em" }}
  //                         >
  //                           <i className="bi bi-coin" /> 1 Token = 100 words
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 {/* <section className="features section">
  //             <div className="container">
  //               <div className="features-inner section-inner has-bottom-divider">
  //                 <div className="features-wrap">
  //                   <div className="feature text-center is-revealing">
  //                     <div className="feature-inner">
  //                       <div className="feature-icon">
  //                         <img
  //                           style={{
  //                             height: "380px",
  //                             objectFit: "cover",
  //                             borderRadius: "20px",
  //                           }}
  //                           className="cardShadow"
  //                           src="splash-steps/sign-up.png"
  //                           alt="Feature 01"
  //                         />
  //                       </div>
  //                       <h4 className="feature-title mt-24 text-white">
  //                         Step 1 - Sign Up
  //                       </h4>
  //                       <p className="text-md mb-0">
  //                         Sign up and name your Intelligence Agency
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="feature text-center is-revealing">
  //                     <div className="feature-inner">
  //                       <div className="feature-icon">
  //                         <img
  //                           style={{
  //                             height: "380px",
  //                             objectFit: "cover",
  //                             borderRadius: "20px",
  //                           }}
  //                           className="cardShadow"
  //                           src="splash-steps/hire-agent.png"
  //                           alt="Feature 02"
  //                         />
  //                       </div>
  //                       <h4 className="feature-title mt-24 text-white">
  //                         Step 2 - Hire Your Agents
  //                       </h4>
  //                       <p className="text-md mb-0">
  //                         Hire your first AI Agent and assign a domain of
  //                         expertise
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="feature text-center is-revealing">
  //                     <div className="feature-inner">
  //                       <div className="feature-icon">
  //                         <img
  //                           style={{
  //                             height: "380px",
  //                             objectFit: "cover",
  //                             borderRadius: "20px",
  //                           }}
  //                           src="splash-steps/assign-mission.png"
  //                           alt="Feature 03"
  //                           className="cardShadow"
  //                         />
  //                       </div>
  //                       <h4 className="feature-title mt-24 text-white">
  //                         Step 3 - Assign Missions
  //                       </h4>
  //                       <p className="text-md mb-0">
  //                         Assign your first mission. Let your agent explore the
  //                         depths of any topic
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="feature text-center is-revealing">
  //                     <div className="feature-inner">
  //                       <div className="feature-icon">
  //                         <img
  //                           src="splash-steps/review-reports.png"
  //                           alt="Feature 04"
  //                           style={{
  //                             height: "380px",
  //                             objectFit: "cover",
  //                             borderRadius: "20px",
  //                           }}
  //                           className="cardShadow"
  //                         />
  //                       </div>
  //                       <h4 className="feature-title mt-24 text-white">
  //                         Step 4 - Review Reports:{" "}
  //                       </h4>
  //                       <p className="text-md mb-0">
  //                         Receive comprehensive missions from your agents
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="feature text-center is-revealing">
  //                     <div className="feature-inner">
  //                       <div className="feature-icon">
  //                         <img
  //                           src="splash-steps/iterative.png"
  //                           alt="Feature 05"
  //                           style={{
  //                             height: "380px",
  //                             objectFit: "cover",
  //                             borderRadius: "20px",
  //                           }}
  //                           className="cardShadow"
  //                         />
  //                       </div>
  //                       <h4 className="feature-title mt-24 text-white">
  //                         Step 5 - Iterative Learning:
  //                       </h4>
  //                       <p className="text-md mb-0">
  //                         Continue the process. Iterate and learn from the
  //                         missions
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="feature text-center is-revealing">
  //                     <div className="feature-inner">
  //                       <div className="feature-icon">
  //                         <img
  //                           src="splash-steps/get-started.png"
  //                           alt="Feature 06"
  //                           style={{
  //                             height: "380px",
  //                             objectFit: "cover",
  //                             borderRadius: "20px",
  //                           }}
  //                           className="cardShadow"
  //                         />
  //                       </div>
  //                       <h4 className="feature-title mt-24 text-white">
  //                         Get Started
  //                       </h4>
  //                       <p
  //                         className="text-md mb-0"
  //                         style={{ marginTop: "20px" }}
  //                       >
  //                         <Button
  //                           style={{
  //                             color: "white",
  //                             border: "3px solid green",
  //                           }}
  //                           href="/account/log-in"
  //                         >
  //                           25 Free Tokens
  //                         </Button>
  //                       </p>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </section> */}
  //               </main>

  //               <div style={{ height: "60px" }}></div>
  //               <div
  //                 style={{
  //                   width: "80%",
  //                   // marginRight: "auto",
  //                   // marginLeft: "auto",
  //                   // alignContent: "center",
  //                   // justifyContent: "center",
  //                   // alignItems: "center",
  //                   // position: "relative",
  //                   // background: "red",
  //                   // display: "flex",
  //                 }}
  //               >
  //                 {/* <Mlogo /> */}
  //                 <div>
  //                   <img
  //                     src="/brain.jpg"
  //                     style={{
  //                       maxHeight: "400px",
  //                       width: "auto",
  //                       borderRadius: "20%",
  //                       marginBottom: "20px",
  //                     }}
  //                   />
  //                 </div>
  //                 {/* <Logo /> */}
  //               </div>
  //               <div style={{ height: "60px" }}></div>
  //               <div
  //                 style={{
  //                   display: "flex",
  //                   flexDirection: "column",
  //                   justifyContent: "center",
  //                 }}
  //               >
  //                 {" "}
  //                 <div> © 2024 Marvin.Technology</div>
  //                 <div className="reportFont">
  //                   H-T-T-P-S colon slash slash Marvin dot Technology
  //                 </div>
  //               </div>
  //             </Col>
  //           </Row>
  //         </Container>

  //         {/* <div
  //           style={{
  //             fontSize: "0.75em",
  //             marginBottom: "20px",
  //             padding: "10px",
  //           }}
  //           className="footer-copyright text-white"
  //         >
  //           {" "}
  //           © 2023 Marvin.Technology
  //         </div> */}
  //       </div>
  //     </div>
  //     {/* <HomeAnimations /> */}
  //   </div>
  // );
}

// page 2 content:
