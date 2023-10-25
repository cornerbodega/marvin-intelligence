import { Button, Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import useRouter from "next/router";
import { useEffect, useRef, useState } from "react";

// import _, { debounce, get, has, set } from "lodash";
// other imports
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
// import IntelliCardGroup from "../../../components/IntelliCardGroup";
// import { getSupabase } from "../../../utils/supabase";

// import Link from "next/link";
import IntelliFab from "../../../components/IntelliFab";
// import getCloudinaryImageUrlForHeight from "../../../utils/getCloudinaryImageUrlForHeight";
// rest of component
// import { slugify } from "../../../utils/slugify";
// const PAGE_COUNT = 6;
const supabase = getSupabase();
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingDots from "../../../components/LoadingDots";
import { useFirebaseListener } from "../../../utils/useFirebaseListener";
import saveTask from "../../../utils/saveTask";
import Head from "next/head";
import Router from "next/router";
import _ from "lodash";
import IntelliPrint from "../../../components/IntelliPrint/IntelliPrint";
import IntelliCopyUrl from "../../../components/IntelliCopyUrl/IntelliCopyUrl";
import { getSupabase } from "../../../utils/supabase";

// import { child } from "@firebase/database";
// export const getServerSideProps = withPageAuthRequired({
// export const getServerSideProps = withPageAuthRequired({
export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

const ViewReports = ({}) => {
  return (
    <>
      <div className="token-description">
        <h2>Explore a World of Knowledge with Our AI-Generated Reports!</h2>
        <p>
          Each token you hold allows you to dive into in-depth insights crafted
          just for you. Here's how your tokens translate into reports:
        </p>
        <ul>
          <li>
            <strong>Short Report</strong> (200 words): 1 Token
          </li>
          <li>
            <strong>Standard Report</strong> (400 words): 2 Tokens
          </li>
          <li>
            <strong>Super Report</strong> (800 words): 4 Tokens
          </li>
        </ul>
        <p>
          <strong>Price per token:</strong> $0.38
        </p>
        <p className="special-offer">
          <strong>New Here?</strong> Enjoy our special offer! Every new user
          starts with 25 free tokens as a demo to experience the depth and
          breadth of our platform.
        </p>
        <div className="token-status">
          <p>
            <strong>Your current tokens:</strong> 25
          </p>
          <Button className="btn-primary" style={{ border: "3px solid green" }}>
            Buy More Tokens
          </Button>
        </div>
      </div>
    </>
  );
};

export default ViewReports;
