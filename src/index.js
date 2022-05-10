require('dotenv').config()
const {Telegraf} = require('telegraf')
const flights = require('../flights.json')
const airports = require('../airports.json')
const fleets = require('../fleets.json')
const countryEmoji = require('../countries.json')
const {getNearestFlight} = require("./api/flight");

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Ищу близкий самолёт к вам. Отправь мне геопозицию, чтобы начать.'))
bot.help((ctx) => ctx.reply('Ищу близкий самолёт к вам. Отправь мне геопозицию, чтобы начать.'))
bot.on('text', ctx => ctx.reply('Данный тип сообщения не подходит, отправьте **геопозицию**', {parse_mode: "markdown"} ))
bot.on('location', async (ctx) => {

    const location = ctx.message.location
    const flight = await getNearestFlight(location.longitude, location.latitude)


    console.log(flight)
    console.log(location)


    const flag = flight.flag
    const flag1 = countryEmoji[flag]
    const airport1 = flight.dep_iata
    const airport2 = flight.arr_icao
    const ourLng = location.longitude
    const ourLat = location.latitude
    const airLng = flight.lng
    const airLat = flight.lat
    const dist = Math.sqrt((ourLng - airLng) ^ 2 + (ourLat - airLat) ^ 2) * 111.3
    const speed = flight.speed
    const flag2 = ''
    const model = `Модель: ${flag2}`
    const plane = flight.reg_number
    const link = 'https://flightaware.com/live/flight/' + plane
    ctx.reply(
        `Рейс: ${flag1} ${airport1} -> ${airport2} \n` +
        `Расстояние: ${dist} км \n` +
        `Скорость: ${speed} км/ч \n` +
        `\n`+
        `[Следить за самолетом](${link})`,
        {disable_web_page_preview: true, parse_mode: "markdown"}
    )

})

bot.launch()


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
