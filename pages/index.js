import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import HomeAnimations from "../src/js/main";
import Link from "next/link";
import Mlogo from "../components/Mlogo";
// // export const getServerSideProps = async () => {};
import {
  Canvas,
  useFrame,
  ThreeElements,
  useThree,
  useLoader,
} from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import React, { useRef, useState, useEffect, use } from "react";

const Model = () => {
  // Load the model from glTF 2.0 (.glb or .gltf) file in /public
  const gltf = useLoader(GLTFLoader, "/3d/m-tree-pink.gltf");
  const ref = useRef();

  // Set initial camera position
  useThree(({ camera }) => {
    camera.position.x = -20;
    camera.position.y = 20;
    camera.position.z = 30;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <primitive scale={0.2} ref={ref} object={gltf.scene} />
    </>
  );
};

export default function Home({ title, content }) {
  return (
    <div className="gradient-background text-white">
      <Head>
        <title>Marvin Intelligence</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600"
            rel="stylesheet"
          />
        </>
      </Head>
      <HomeAnimations />
      <div className="is-boxed has-animations">
        <div className="body-wrap gradient-background">
          <header className="site-header">
            <div className="container">
              <div className="site-header-inner">
                <div className="brand header-brand">
                  {/* <Mlogo /> */}
                  {/* <div
                    className="m-0"
                    style={{ width: "auto", height: "200px" }}
                  >
                    <Canvas>
                      <OrbitControls minDistance={1} maxDistance={2} />
                      <ambientLight intensity={2} />
                      <pointLight position={[-30, -30, -30]} intensity={0.5} />
                      <pointLight position={[20, 20, 20]} intensity={0.5} />
                      <pointLight position={[10, 10, 10]} intensity={2} />
                      <Model />
                    </Canvas>
                  </div> */}
                </div>
              </div>
            </div>
          </header>
          <main>
            <section className="hero">
              <div className="container">
                <div className="hero-inner">
                  <div className="hero-copy">
                    <h1 className="hero-title mt-0">
                      Unlock the Power of Automated Learning
                    </h1>
                    <p className="text-white hero-paragraph">
                      Empower your intellectual journey with your personal team
                      of AI researchers. Discover, Learn, and Master any subject
                      matter effortlessly.
                    </p>
                    <div className="hero-cta">
                      <Link
                        className="button button-primary"
                        href="/account/log-in"
                      >
                        Start your Free Trial
                      </Link>
                      <a className="button" href="#">
                        Meet your AI Team
                      </a>
                    </div>
                  </div>
                  <div className="hero-figure anime-element">
                    <svg
                      className="placeholder"
                      width={528}
                      height={396}
                      viewBox="0 0 528 396"
                    >
                      <rect
                        width={528}
                        height={396}
                        style={{ fill: "transparent" }}
                      />
                    </svg>
                    <div
                      className="hero-figure-box hero-figure-box-01"
                      data-rotation="45deg"
                    />
                    <div
                      className="hero-figure-box hero-figure-box-02"
                      data-rotation="-45deg"
                      style={{ borderRadius: "20px" }}
                    ></div>
                    <div
                      className="hero-figure-box hero-figure-box-03"
                      data-rotation="0deg"
                    />
                    <div
                      className="hero-figure-box hero-figure-box-04"
                      data-rotation="-135deg"
                    />
                    <div
                      style={{ borderRadius: "20px" }}
                      className="hero-figure-box hero-figure-box-05"
                    >
                      <img
                        style={{ borderRadius: "20px" }}
                        src="splash-boxes/6.png"
                      />
                    </div>
                    <div
                      style={{ borderRadius: "20px" }}
                      className="hero-figure-box hero-figure-box-06"
                    >
                      <img
                        style={{ borderRadius: "20px" }}
                        src="splash-boxes/4.png"
                      />
                    </div>
                    {/* <div
                      style={{ borderRadius: "20px" }}
                      className="hero-figure-box hero-figure-box-07"
                    >
                      <img
                        style={{ borderRadius: "20px" }}
                        src="splash-boxes/1.png"
                      />
                    </div> */}
                    <div
                      className="hero-figure-box hero-figure-box-08"
                      data-rotation="-22deg"
                      style={{ borderRadius: "20px" }}
                    >
                      <img
                        style={{ borderRadius: "20px" }}
                        src="splash-boxes/2.png"
                      />
                    </div>
                    <div
                      className="hero-figure-box hero-figure-box-09"
                      data-rotation="-52deg"
                    />
                    <div
                      className="hero-figure-box hero-figure-box-10"
                      data-rotation="-50deg"
                    />
                  </div>
                </div>
              </div>
            </section>
            <section className="features section">
              <div className="container">
                <div className="features-inner section-inner has-bottom-divider">
                  <div className="features-wrap">
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img
                            style={{
                              height: "380px",
                              objectFit: "cover",
                              borderRadius: "20px",
                            }}
                            className="cardShadow"
                            src="splash-steps/sign-up.png"
                            alt="Feature 01"
                          />
                        </div>
                        <h4 className="feature-title mt-24">
                          Step 1 - Sign Up
                        </h4>
                        <p className="text-md mb-0">
                          Sign up and name your Intelligence Agency
                        </p>
                      </div>
                    </div>
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img
                            style={{
                              height: "380px",
                              objectFit: "cover",
                              borderRadius: "20px",
                            }}
                            className="cardShadow"
                            src="splash-steps/hire-agent.png"
                            alt="Feature 02"
                          />
                        </div>
                        <h4 className="feature-title mt-24">
                          Step 2 - Hire Your Agents
                        </h4>
                        <p className="text-md mb-0">
                          Hire your first AI Agent and assign a domain of
                          expertise
                        </p>
                      </div>
                    </div>
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img
                            style={{
                              height: "380px",
                              objectFit: "cover",
                              borderRadius: "20px",
                            }}
                            src="splash-steps/assign-mission.png"
                            alt="Feature 03"
                            className="cardShadow"
                          />
                        </div>
                        <h4 className="feature-title mt-24">
                          Step 3 - Assign Missions
                        </h4>
                        <p className="text-md mb-0">
                          Assign your first mission. Let your agent explore the
                          depths of any topic
                        </p>
                      </div>
                    </div>
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img
                            src="splash-steps/review-reports.png"
                            alt="Feature 04"
                            style={{
                              height: "380px",
                              objectFit: "cover",
                              borderRadius: "20px",
                            }}
                            className="cardShadow"
                          />
                        </div>
                        <h4 className="feature-title mt-24">
                          Step 4 - Review Reports:{" "}
                        </h4>
                        <p className="text-md mb-0">
                          Receive comprehensive missions from your agents
                        </p>
                      </div>
                    </div>
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img
                            src="splash-steps/iterative.png"
                            alt="Feature 05"
                            style={{
                              height: "380px",
                              objectFit: "cover",
                              borderRadius: "20px",
                            }}
                            className="cardShadow"
                          />
                        </div>
                        <h4 className="feature-title mt-24">
                          Step 5 - Iterative Learning:
                        </h4>
                        <p className="text-md mb-0">
                          Continue the process. Iterate and learn from the
                          missions
                        </p>
                      </div>
                    </div>
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img
                            src="splash-steps/get-started.png"
                            alt="Feature 06"
                            style={{
                              height: "380px",
                              objectFit: "cover",
                              borderRadius: "20px",
                            }}
                            className="cardShadow"
                          />
                        </div>
                        <h4 className="feature-title mt-24">Get Started</h4>
                        <p className="text-md mb-0">
                          <Link
                            className="button"
                            style={
                              {
                                // textDecoration: "none",
                                // fontSize: "1.5em",
                              }
                            }
                            href="/account/log-in"
                          >
                            Start your Free Trial Now
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <section className="pricing section">
              <div className="container-sm">
                <div className="pricing-inner section-inner">
                  <div className="pricing-header text-center">
                    <h2 className="section-title mt-0">
                      Free Trial Offer - Explore the World of Knowledge with Us!
                    </h2>
                    <div className="section-paragraph mb-0 text-white">
                      <div>
                        <p>
                          At Intelligence.Marvin.Technology, we believe in the
                          transformative power of knowledge. "But don't just
                          take my word for it,"
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.readingrainbow.org/"
                          >
                            (LeVar Burton Reading Rainbow voice)
                          </a>
                          . We want you to experience it firsthand, which is why
                          we're offering you a risk-free trial of our service.
                        </p>
                        <p>
                          Our free trial gives you access to the full
                          Intelligence.Marvin.Technology experience, allowing
                          you to create your first 100 missions absolutely free
                          or for 14 days, whichever comes first.
                        </p>
                        <p>
                          During your trial period, you'll have the opportunity
                          to explore and utilize all our platform's
                          capabilities, from managing your own team of agents to
                          receiving comprehensive and curated missions. With our
                          intuitive dashboard and innovative autonomous
                          missions, you'll discover a new, engaging way to learn
                          and process information.
                        </p>
                        <p>
                          And the best part? No commitment. If you feel
                          Intelligence.Marvin.Technology isn't the right fit for
                          you, you can cancel anytime during the trial period at
                          no cost. So why wait? Begin your knowledge exploration
                          journey today!
                        </p>
                        <p>
                          *Please note: After the free trial, your plan will
                          automatically convert into a paid subscription unless
                          cancelled. Details of our subscription plans can be
                          found below.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-tables-wrap">
                    <h2>Basic Plan</h2>
                  </div>
                  <div className="pricing-tables-wrap">
                    <div className="pricing-table">
                      <div className="pricing-table-inner is-revealing">
                        <div className="pricing-table-main">
                          <div className="pricing-table-header pb-24">
                            <div className="pricing-table-price">
                              <span className="pricing-table-price-currency h2">
                                $
                              </span>
                              <span className="pricing-table-price-amount h1">
                                10
                              </span>
                              <span className="text-xs">/month</span>
                            </div>
                          </div>
                          <div className="pricing-table-features-title text-xs pt-24 pb-24">
                            What you will get
                          </div>
                          <ul className="pricing-table-features list-reset text-xs">
                            <li>
                              <span>500 Missions</span>
                            </li>
                            <li>
                              <span>Up to 5 Agents</span>
                            </li>
                            <li>
                              <span>Unlimited Report Storage</span>
                            </li>
                            <li>
                              <span>Personal Customer Service</span>
                            </li>
                          </ul>
                        </div>
                        <div className="pricing-table-cta mb-8">
                          <a
                            className="button button-primary button-shadow button-block"
                            href="#"
                          >
                            Pre order now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pricing-tables-wrap">
                    <h2>Pro Plan</h2>
                  </div>
                  <div className="pricing-tables-wrap">
                    <div className="pricing-table">
                      <div className="pricing-table-inner is-revealing">
                        <div className="pricing-table-main">
                          <div className="pricing-table-header pb-24">
                            <div className="pricing-table-price">
                              <span className="pricing-table-price-currency h2">
                                $
                              </span>
                              <span className="pricing-table-price-amount h1">
                                20
                              </span>
                              <span className="text-xs">/month</span>
                            </div>
                          </div>
                          <div className="pricing-table-features-title text-xs pt-24 pb-24">
                            What you will get
                          </div>
                          <ul className="pricing-table-features list-reset text-xs">
                            <li>
                              <span>2000 Missions</span>
                            </li>
                            <li>
                              <span>Unlimited Agents</span>
                            </li>
                            <li>
                              <span>Automated Missions</span>
                            </li>
                            <li>
                              <span>Personal Customer Service</span>
                            </li>
                          </ul>
                        </div>
                        <div className="pricing-table-cta mb-8">
                          <a
                            className="button button-primary button-shadow button-block"
                            href="#"
                          >
                            Pre order now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pricing-tables-wrap">
                    <h2>Enterprise</h2>
                  </div>
                  <div className="pricing-tables-wrap">
                    <div className="pricing-table">
                      <div className="pricing-table-inner is-revealing">
                        <div className="pricing-table-main">
                          <div className="pricing-table-header pb-24">
                            <div className="pricing-table-price">
                              Custom Pricing
                            </div>
                          </div>
                          <div className="pricing-table-features-title text-xs pt-24 pb-24">
                            What you will get
                          </div>
                          <ul className="pricing-table-features list-reset text-xs">
                            <li>
                              <span>More API calls</span>
                            </li>
                            <li>
                              <span>Automated Missions</span>
                            </li>
                            <li>
                              <span>Possible API integrations</span>
                            </li>
                            <li>
                              <span>Priority support</span>
                            </li>
                          </ul>
                        </div>
                        <div className="pricing-table-cta mb-8">
                          <a
                            className="button button-primary button-shadow button-block"
                            href="#"
                          >
                            Pre order now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
            <section className="cta section">
              <div className="container">
                <div
                  className="cta-inner section-inner"
                  style={{ borderRadius: "20px" }}
                >
                  <h3 className="section-title mt-0">
                    Talk to Marvin about it:
                  </h3>
                  <div className="cta-cta">
                    <a
                      className="button button-primary button-wide-mobile"
                      href="#"
                    >
                      Get in touch
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <div style={{ height: "60px" }}></div>
          <Mlogo></Mlogo>

          <footer className="site-footer">
            <div className="container">
              <div className="site-footer-inner">
                <div className="brand footer-brand">
                  <a href="#">
                    {/* <img
                      className="header-logo-image"
                      src="logo.png"
                      alt="Logo"
                      width={200}
                    /> */}
                  </a>
                </div>
                <ul className="footer-links list-reset">
                  <li>
                    <Link href="#" className="text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
          <div style={{ fontSize: "0.75em" }} className="footer-copyright">
            © 2023 Marvin.Technology
          </div>
        </div>
      </div>
    </div>
  );
}

// page 2 content:
