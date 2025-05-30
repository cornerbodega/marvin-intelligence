import FullLayout from "../layouts/FullLayout";
import Head from "next/head";
import "../styles/style.scss";

import { UserProvider } from "../context/UserContext";
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
      <script async src="https://js.stripe.com/v3/buy-button.js"></script>
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Main /> */}
      <FullLayout>
        <Component {...pageProps} />
      </FullLayout>
    </>
  );
}

export default MyApp;
