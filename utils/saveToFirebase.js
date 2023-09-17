import { db } from "./firebase"; // Adjust the path according to your project structure
import { ref, set } from "firebase/database";

async function saveToFirebase(table, dataToSave) {
  try {
    const tableRef = ref(db, table);
    await set(tableRef, dataToSave);
    // Data saved successfully
    console.log("Data saved successfully");
    return { success: true };
  } catch (error) {
    console.error("Error inserting data:", error.message);

    // Here you can handle different types of errors (e.g., network issues, validation errors) differently
    // if (error.code === 'some_specific_error_code') {
    //   // Handle specific error type
    // }

    // Additionally, you may want to log the error to an error tracking service
    return { success: false, error: error.message };
  }
}

export { saveToFirebase };
