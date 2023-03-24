import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import {
  generateResponse,
  generateImage,
  generateChatResponse,
} from "./utils/functions.js";
import { bot } from "./utils/bot.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).send("An error occurred, the server will be reset.");

  // Send an exit signal to the Node.js process
  process.exit(1);
});

app.post("/img", async (req, res) => {
  const prompt = req.body.prompt;
  const response = await generateImage(prompt);
  console.log(response);
  res.send(response).status(200);
});

app.post("/bot", async (req, res) => {
  const prompt = req.body.prompt;
  const response = await generateResponse(prompt);
  console.log(response);
  res.send(response).status(200);
});

app.post("/prompt", async (req, res) => {
  const prompt = req.body.prompt;
  const response = await generateChatResponse(prompt);
  console.log(response);
  res.send(response).status(200);
});

app.listen(process.env.PORT || 3002, () => {
  console.log("Server is running...");
});

bot.start((ctx) => {
  ctx.reply(
    "Welcome to the ChatGPT Bot! Send me a message, and I will generate a response using GPT-3."
  );
});
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.hears(["Hi", "hi", "hey"], (ctx) => ctx.reply("Hey there"));
bot.command("fact", (ctx) => ctx.reply("👍"));
bot.command("voice", async (ctx) => {
  ctx.replyWithVoice(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  );
});
bot.command("list", (ctx) =>
  ctx.telegram.getMyCommands().then((res) => console.log(res))
);

bot.on("message", async (ctx) => {
  if (ctx.message.text.split(" ")[0] === "/img") {
    const imgPrompt = ctx.message.text.split(" ").slice(1).join(" ");
    const imgResponse = await generateImage(imgPrompt);
    return ctx.replyWithPhoto(imgResponse);
  } else {
    console.log(ctx.message.text);
    const prompt = ctx.message.text;
    const response = await generateChatResponse(prompt);
    return ctx.reply(response);
  }
});

bot.entity("hello", (ctx) => ctx.reply("Hey there"));

bot.launch((ctx) => ctx.telegram.setCommands(["fact", "voice"]));

console.log("Telegram ChatGPT Bot is running...");
