import { current } from "@reduxjs/toolkit";
import { max } from "lodash";
import { saveToFirebase } from "../../../../utils/saveToFirebase";

export default async function handler(req, res) {
  console.log("START GENERATE CONTINUA TASKS ENDPOINT");
  //   const { childReportId, userId, generationsRemaining } = req.body;

  console.log(req.body);
  const { userId, currentGeneration, maxGenerations } = req.body;
  // "maxGenerations",
  // "currentGeneration",
  let newTaskContext = { ...req.body };
  newTaskContext.currentGeneration = newTaskContext.currentGeneration + 1;
  console.log("currentGeneration");
  console.log(currentGeneration);
  console.log("maxGenerations");
  console.log(maxGenerations);
  if (currentGeneration <= maxGenerations) {
    try {
      const newTask = {
        type: "doContinuum",
        status: "queued",
        userId,
        context: {
          ...newTaskContext,
          userId,
        },
        createdAt: new Date().toISOString(),
      };

      const newTaskRef = await saveToFirebase(
        `asyncTasks/${userId}/doContinuum`,
        newTask
      );
    } catch (error) {
      console.log(error);
    }
    // const nextGenerationTask = {
    //   ...taskData,
    //   context: {
    //     ...context,
    //     currentGeneration: context.currentGeneration++,
    //   },
    // };
    // await saveToFirebase(
    //   `asyncTasks/${context.userId}/generateContinuumTasks`,
    //   nextGenerationTask
    // );
  }
  return res.status(200).json({});
}
