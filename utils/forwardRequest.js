// utils/forwardRequest.js
import axios from "axios";

export async function forwardRequest({ req, targetUrl }) {
  try {
    const serverResponse = await axios({
      rejectUnauthorized: false,
      method: req.method,
      url: targetUrl,
      headers: req.headers,
      data: JSON.stringify(req.body),
      contentType: "application/json", // add contentType
    });

    return {
      status: serverResponse.status,
      data: serverResponse.data,
    };
  } catch (error) {
    console.log(error);
    if (error.response) {
      // The request was made and the server responded with a status code outside of the range of 2xx
      return {
        status: error.response.status,
        data: error.response.data,
      };
    } else {
      // Something happened in setting up the request or there was a network error
      return {
        status: 500,
        data: { error: "Internal Server Error" },
      };
    }
  }
}
