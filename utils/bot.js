import dotenv from "dotenv";
import { Telegraf } from "telegraf";
dotenv.config();

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
