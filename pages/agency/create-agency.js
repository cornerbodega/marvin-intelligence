import { useEffect, useState } from "react";
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
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";

function CreateAgency() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agencyName, setAgencyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    const res = await fetch("/api/agency/create-agency-endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agencyName, user }),
    });

    setIsSubmitting(false);
    console.log(`res.status ${res.status}`);

    if (res.status === 200) {
      console.log("Agency created successfully");

      const success = await router.push("/reports/folders/view-folders");
      console.log("Router push success?", success);
    } else {
      console.error("Failed to create agency", res);
      alert("An error occurred. Please try again.");
    }
  }

  if (loading) return <p>Loading user...</p>;

  return (
    <Container>
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "40px" }}>
              <h3>Name Intelligence Agency</h3>
              <p className="lead">
                This is where you will name your Intelligence Agency. Choose a
                name that reflects the ethos and mission of your agency.
              </p>
            </div>
            <FormGroup>
              <Row>
                <Label for="agencyName" md={4}>
                  Agency Name
                </Label>
                <Col md={8}>
                  <Input
                    autoFocus
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="Enter Agency Name"
                  />
                </Col>
              </Row>
            </FormGroup>
            <div style={{ textAlign: "left" }}>
              <Button color="primary" disabled={isSubmitting || !agencyName}>
                Create
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateAgency;
