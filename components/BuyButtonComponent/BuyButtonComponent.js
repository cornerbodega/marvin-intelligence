import * as React from "react";
import { useEffect } from "react";

function BuyButtonComponent() {
  // Paste the stripe-buy-button snippet in your React component

  return (
    <div>
      <stripe-pricing-table
        pricing-table-id="prctbl_1Qlm91Ee4jhfkFkI4nfQnPu3"
        publishable-key="pk_live_pkFsgwfKA40Y5u6mMwT63Z00"
      ></stripe-pricing-table>
    </div>
  );
}

export default BuyButtonComponent;
