import {
  Button,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
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

// import { useUser } from "@auth0/nextjs-auth0/client";
// import { getSupabase } from "../../utils/supabase";
// import { useRouter } from "next/router";
// import { withPageAuthRequired } from "@auth0/nextjs-auth0";
// import { getSession } from "@auth0/nextjs-auth0";
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const supabase = getSupabase();
    const session = await getSession(context.req, context.res);
    const user = session?.user;

    let { data: agency, agencyError } = await supabase
      .from("users")
      .select("agencyName")
      .eq("userId", user.sub);
    if (agencyError) {
      console.log("agencyError");
    }
    console.log("agency");
    console.log(agency);
    if (!agency || agency.length === 0) {
      return {
        redirect: {
          permanent: false,
          destination: "/agency/create-agency",
        },
        props: {},
      };
    }
    const _agencyName = agency[0].agencyName;
    return { props: { user, _agencyName } };
  },
});

const ViewReports = ({ user, _agencyName }) => {
  const [agencyName, setAgencyName] = useState(_agencyName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleSubmit(e) {
    setIsSubmitting(true);
    const res = await fetch("/api/agency/update-agency-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agencyName, user }),
    });
    setIsSubmitting(false);

    if (res.status === 200) {
    } else {
      console.log(JSON.stringify(res));
      alert("An error occurred while creating the agency. Please try again.");
    }
  }
  return (
    <>
      <Row>
        <Col md={{ size: 8, offset: 1 }}>
          <Form onSubmit={handleSubmit}>
            <h3 className="mb-4">{agencyName}</h3>

            <FormGroup>
              <Input
                autoFocus
                type="text"
                name="expertise1"
                id="expertise1"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Enter Agency Name"
              />
            </FormGroup>

            <div className="text-right mt-4">
              <Button color="primary" disabled={isSubmitting}>
                Update
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

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
