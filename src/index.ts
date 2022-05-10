import { config } from "dotenv";
import { Telegraf } from "telegraf";
import { getNearestFlight } from "./api/flight";
import countryEmoji from "./countries.json";
import airports from "./airports.json";

config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("Ищу близкий самолёт к вам. Отправь мне геопозицию, чтобы начать."));
bot.help((ctx) => ctx.reply("Ищу близкий самолёт к вам. Отправь мне геопозицию, чтобы начать."));
bot.on("text", (ctx) =>
  ctx.reply("Данный тип сообщения не подходит, отправьте **геопозицию**", {
    parse_mode: "Markdown",
  })
);

bot.on("location", async (ctx) => {
  const message = await ctx.reply('Подождите...')

  const location = ctx.message.location;
  const flight = await getNearestFlight(location.longitude, location.latitude);

  console.log(flight);
  console.log(location);

  const flag = flight.flag;
  const flag1 = countryEmoji[flag];
  const airport1 = airports[flight.dep_icao];
  const airport2 = airports[flight.arr_icao];
  const ourLng = location.longitude;
  const ourLat = location.latitude;
  const airLng = flight.lng;
  const airLat = flight.lat;
  const dist = flight.distance
  const speed = flight.speed;
  const flag2 = countryEmoji[flag];
  const model = `Модель: ${flag2}`;
  const plane = flight.reg_number;
  const link = "https://flightaware.com/live/flight/" + plane;
  ctx.reply(
      `**Самый близкий к вам самолет** \n\n` +
    `Рейс: ${flag1} ${airport1.city} -> ${airport2.city} \n` +
      `Расстояние: ${flight.distance.toFixed(0)} км \n` +
      `Скорость: ${speed} км/ч \n` +
      `\n` +
      `[Следить за самолетом](${link})`,
    { disable_web_page_preview: true, parse_mode: "Markdown" }
  );
  ctx.deleteMessage(message.message_id)
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
