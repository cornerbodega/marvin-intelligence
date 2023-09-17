const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export async function getFromOpenAi(messages) {
  const results = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    })
    .catch((error) => {
      console.log("error");
      console.log(error);
    });

  return results.data.choices[0].message.content;
}
