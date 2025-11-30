export default async function handler(req, res) {
  console.log("NEXT api Save Task Request");
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

  console.log("req.body");
  console.log(req.body);
  console.log("serverUrl");
  console.log(serverUrl);

  try {
    const response = await fetch(`${serverUrl}/api/tasks/save-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("save task response", data);
    res.status(response.status).json(data);
  } catch (error) {
    console.log("task executor error");
    console.log(error);
    res.status(500).json({ error: "Failed to save task", message: error.message });
  }
}
