import FullLayout from "../src/layouts/FullLayout";
import Head from "next/head";
import "../styles/style.scss";
import "../styles/layout/_header.scss";
import "../styles/landing/scss/style.scss";
// import "../styles/fab/fab.css";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
// import IntelliProvider from "../components/IntelliProvider/IntelliProvider";
import "../styles/globals.css";
import { useEffect } from "react";
// import IntelliContext from "../components/intelliContext/IntelliContext";
// IntelliProvider;
// import { startHeartbeat, stopHeartbeat } from "../utils/heartbeat";
// import setupFirebaseListener from "../utils/firebase";
import { startActiveTab, stopActiveTab, isActiveTab } from "../utils/activeTab";
// import setupFirebaseListener from "../utils/firebaseListener";
// import { startActiveTab, stopActiveTab } from "../utils/activeTab";
// import { useEffect } from "react";
// import { UserProvider, useUser } from "path-to-your-user-hooks";
// import { startActiveTab, stopActiveTab, isActiveTab } from "./activeTab";
// import { setupFirebaseListener } from "./path-to-your-firebaseListener";
// import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </UserProvider>
  );
}

function AppContent({ Component, pageProps }) {
  const { user, error, isLoading } = useUser();
  // const [hasSetActiveTab, setHasSetActiveTab] = useState(false);
  useEffect(() => {
    window.tabId = window.tabId || Date.now().toString();
    startActiveTab();

    function handleVisibilityChange() {
      if (document.hidden) {
        stopActiveTab();
      } else {
        startActiveTab();
        console.log("1233t4y5turjy");
        // if (user && isActiveTab()) {
        //   setupFirebaseListener(user);
        // }
      }
    }

    // if (user) {
    //   setupFirebaseListener(user);
    // }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopActiveTab();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  return (
    <>
      <Head>
        <title>Intelligence</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FullLayout>
        <Component {...pageProps} />
      </FullLayout>
    </>
  );
}
// function MyApp({ Component, pageProps }) {
//   return (
//     <UserProvider>
//       <AppContent Component={Component} pageProps={pageProps} />
//     </UserProvider>
//   );
// }

// function AppContent({ Component, pageProps }) {
//   const { user, error, isLoading } = useUser();

//   useEffect(() => {
//     window.tabId = Date.now().toString();

//     if (user) {
//       setupFirebaseListener(user);
//     }

//     function handleVisibilityChange() {
//       if (document.hidden) {
//         startActiveTab();
//       } else {
//         stopActiveTab();
//       }
//     }

//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, [user]);

//   return (
//     <>
//       <Head>
//         <title>Intelligence</title>
//         <meta name="description" content="Generated by create next app" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <FullLayout>
//         <Component {...pageProps} />
//       </FullLayout>
//     </>
//   );
// }

// function MyApp({ Component, pageProps }) {
//   const { user, error, isLoading } = useUser();
//   useEffect(() => {
//     window.tabId = Date.now().toString();

//     if (user) {
//       setupFirebaseListener(user);
//     }

//     function handleVisibilityChange() {
//       if (document.hidden) {
//         stopHeartbeat();
//       } else {
//         startHeartbeat();
//       }
//     }

//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, [user]);
//   // useEffect(() => {
//   //   window.tabId = Date.now().toString();

//   //   if (user) {
//   //     setupFirebaseListener(user);
//   //   }

//   //   function handleVisibilityChange() {
//   //     if (document.hidden) {
//   //       stopHeartbeat();
//   //     } else {
//   //       startHeartbeat();
//   //     }
//   //   }

//   //   document.addEventListener("visibilitychange", handleVisibilityChange);

//   //   return () => {
//   //     document.removeEventListener("visibilitychange", handleVisibilityChange);
//   //   };
//   // }, [user]);

//   return (
//     <>
//       <Head>
//         <title>Intelligence</title>
//         <meta name="description" content="Generated by create next app" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <FullLayout>
//         {/* <IntelliProvider> */}
//         <UserProvider>
//           <Component {...pageProps} />
//         </UserProvider>
//         {/* </IntelliProvider> */}
//       </FullLayout>
//     </>
//   );
// }

export default MyApp;
