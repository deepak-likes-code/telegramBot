import dotenv from "dotenv";
import express from "express";
import { Telegraf } from "telegraf";
import { Configuration, OpenAIApi } from "openai";
import bodyParser from "body-parser";
dotenv.config();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const app = express();
app.use(express.json());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateResponse(prompt) {
  console.log(`Prompt: ${prompt}`);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      // stop: ["\n"],
    });

    // const response = await post(openaiUrl, data, { headers: headers });
    console.log(response.data.choices[0].text);
    return response.data.choices[0].text;
  } catch (error) {
    console.error(`Error generating response: ${error}`);
    return "An error occurred while generating a response. Please try again.";
  }
}

app.post("/bot", async (req, res) => {
  const prompt = req.body.prompt;
  const response = await generateResponse(prompt);
  console.log(response);
  res.send(response).status(200);
  // res.status(200);
});

app.listen(process.env.PORT || 3002, () => {
  console.log("Server is running...");
});

bot.start((ctx) => {
  ctx.reply(
    "Welcome to the ChatGPT Bot! Send me a message, and I will generate a response using GPT-3."
  );
});

bot.on("message", async (ctx) => {
  console.log(ctx.message.text);
  const prompt = ctx.message.text;
  const response = await generateResponse(prompt);
  ctx.reply(response);
});

bot.launch();

console.log("Telegram ChatGPT Bot is running...");
