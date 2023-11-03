import {
  Container,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Jumbotron,
  Card,
  CardBody,
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
          destination: "/reports/folders/view-folders",
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
      console.log("Agency created successfully!");
      router.push("/reports/folders/view-folders");
    } else {
      console.log(JSON.stringify(res));
      alert("An error occurred while creating the agency. Please try again.");
    }
  }
  const [agencyName, setAgencyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Jumbotron>
              <h1 className="display-4">Create Your Intelligence Agency</h1>
              <p className="lead">
                This is where you will name your Intelligence Agency. Choose a
                name that reflects the ethos and mission of your agency.
              </p>
            </Jumbotron>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="agencyName">Agency Name</Label>
                    <Input
                      autoFocus
                      type="text"
                      name="agencyName"
                      id="agencyName"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Enter Agency Name"
                    />
                  </FormGroup>
                  <Button color="primary" disabled={isSubmitting} block>
                    Create
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CreateAgency;
