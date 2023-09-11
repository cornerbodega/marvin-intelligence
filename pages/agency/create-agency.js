import {
  Container,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useEffect, useState } from "react";
// This is where an agency is founded and named.
// There will be another page for editing the agency.
// This page is important because
//      It will be the page users are routed to who aren't in an agency,
//     ... Which will be all new users!
// Creating an Agency will also create a user record, if it doesn't exist.
// This also reduces friction for the IntelliNet feature.
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSupabase } from "../../utils/supabase";
import { useRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getSession } from "@auth0/nextjs-auth0";
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
    if (agency && agency.length > 0) {
      return {
        redirect: {
          permanent: false,
          destination: "/missions/create-mission/agents/view-agents",
        },
        props: {},
      };
    }
    return { props: { user } };
  },
});
function CreateAgency() {
  const supabase = getSupabase();
  const router = useRouter();

  const { user, error, isLoading } = useUser();
  // useEffect(() => {
  //   if (user) {
  //     const subscription = supabase
  //       .from(`users:userId=eq.${user.sub}`)
  //       .on("INSERT", (payload) => {
  //         console.log("New matching userId added:", payload.new);
  //         // Handle the new userId data as required
  //       })
  //       .subscribe();

  //     // Cleanup the subscription on component unmount
  //     return () => supabase.removeSubscription(subscription);
  //   }
  // }, []);
  // HANDLE USER TABLE HERE AS WELL
  async function handleSubmit(e) {
    setIsSubmitting(true);
    const res = await fetch("/api/agency/create-agency-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agencyName, user }),
    });
    setIsSubmitting(false);

    if (res.status === 200) {
      // alert("Agent created successfully!");
      router.push("/missions/create-mission/agents/view-agents");
      console.log("Agent created successfully!");
    } else {
      console.log(JSON.stringify(res));
      alert("An error occurred while creating the agency. Please try again.");
    }
  }
  const [agencyName, setAgencyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <>
      {" "}
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <Form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "40px" }}>
                {/* <Link href="#"> */}
                <h3>Create Intelligence Agency</h3>
                {/* </Link> */}
              </div>
              <FormGroup>
                <Row>
                  <Label for="expertise1" md={4}>
                    Agency Name
                  </Label>
                  <Col md={8}>
                    <Input
                      autoFocus
                      type="text"
                      name="expertise1"
                      id="expertise1"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Enter Agency Name"
                    />
                  </Col>
                </Row>
              </FormGroup>

              <div style={{ marginBottom: "40px" }}></div>
              <div style={{ textAlign: "right" }}>
                <Button color="primary" disabled={isSubmitting}>
                  Create
                </Button>{" "}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CreateAgency;
