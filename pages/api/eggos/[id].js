export default async function handler(req, res) {
  console.log("eggos?!");
  if (req.method === "GET") {
    return res.send({ data: "Eggos!" });
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    res.send(response);
    // Process a POST request
  } else {
    return res.sendStatus(500);
    // Handle any other HTTP method
  }
}
