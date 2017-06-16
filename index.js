const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.API_KEY, {
  polling: true
});

bot.onText(/(\/help|\/start)/, (msg, match) => {
  bot.sendMessage(msg.chat.id, "This bot is for getting random numbers. To do a coin toss, send a message containing \"coin\", to do a dice roll, send a message containing \"dice\", to get a random number, send the minimum number and the maximum number separated by a space. Works inline too.");
});

bot.onText(/.*/, (msg, match) => {
  bot.sendMessage(msg.chat.id, excute(match[0]));
});

bot.on("inline_query", msg => {
  bot.answerInlineQuery(msg.id, [{
    "id": msg.id,
    "type": "article",
    "title": preview(msg.query),
    "input_message_content": {
      "message_text": excute(msg.query)
    }
  }], {
    "cache_time": 1,
    "is_personal": true
  });
});

const excute = msg => {
  if (/coin/.test(msg)) return "Coin toss: " + (Math.floor(Math.random() * 2) == 0 ? "Heads" : "Tails");

  if (/dice/.test(msg)) return "Dice roll: " + Math.ceil(Math.random() * 6);

  const min = parseInt(msg.substr(0, msg.indexOf(" ")));
  const max = parseInt(msg.substr(msg.indexOf(" ")));
  return "" + ((Math.random() * (max - min)) + min);
}

const preview = msg => {
  if (/coin/.test(msg)) return "Coin toss";

  if (/dice/.test(msg)) return "Dice roll";

  return "Random Number (min max)"
}
