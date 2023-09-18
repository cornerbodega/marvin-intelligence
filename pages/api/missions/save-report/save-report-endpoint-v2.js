// @author Marvin-Rhone

import { current } from "@reduxjs/toolkit";

export default async function handler(req, res) {
  console.log("SAVE REPORT ENDPOINT V2");
  console.log(req.body);
  const currentContext = { ...req.body };

  if (currentContext.draft1) {
    currentContext.draft = currentContext.draft1;
  }

  if (currentContext.draft2) {
    currentContext.draft = currentContext.draft2;
  }
  if (currentContext.draft3) {
    currentContext.draft = currentContext.draft3;
  }
  if (currentContext.researchLink1) {
    currentContext.researchLink = currentContext.researchLink1;
  }
  return res.status(200).json(currentContext);
}
