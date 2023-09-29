// import { forwardRequest } from "../../../../utils/forwardRequest";
import { forwardRequest } from "../../../utils/forwardRequest";
const serverUrl = "http://localhost:8080";
export default async function handler(req, res) {
  console.log("Intel Proxy Request");
  console.log(req.body);
  const targetUrl = decodeURIComponent(req.query.targetUrl);
  //   let request = { ...req, targetUrl: targetUrl };
  const response = await forwardRequest({
    req,
    targetUrl: `${serverUrl}${targetUrl}`,
    // "https://intelserver-l7cbnkbn2q-uc.a.run.app/api/agents/generate-agent-name"
  });

  console.log("Intel Proxy Response");
  console.log(response);
  res.status(response.status).json(response.data);
}
