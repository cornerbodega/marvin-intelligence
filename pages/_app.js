import FullLayout from "../src/layouts/FullLayout";
import Head from "next/head";
import "../styles/style.scss";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import Script from "next/script";
import "../styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </UserProvider>
  );
}

function AppContent({ Component, pageProps }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", "G-ZVF1TH6JRS");
  }, []);
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-ZVF1TH6JRS"
        strategy="afterInteractive"
        onLoad={() => window.gtag && window.gtag("js", new Date())}
      />
      <Head>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FullLayout>
        <Component {...pageProps} />
      </FullLayout>
    </>
  );
}

export default MyApp;
