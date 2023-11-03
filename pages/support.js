import React from "react";
import { Button } from "reactstrap";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h2>Need Support?</h2>
      <p>
        Please add your issue to the <code>#support</code> channel in our
        Discord server.
      </p>
      <Link href="https://discord.gg/RwKkeZzq" passHref>
        <Button color="primary" target="_blank">
          Go to Discord
        </Button>
      </Link>
    </div>
  );
}
