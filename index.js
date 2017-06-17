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
  const info = msg.substring(msg.indexOf(" ") + 1);
  if (/^coin/i.test(msg)) {
    return "Coin toss: " + (Math.floor(Math.random() * 2) == 0 ? "Heads" : "Tails");
  }

  if (/^dice/i.test(msg)) {
    return "Dice roll: " + excute("between 1 6 int");
  }

  if (/^between/i.test(msg)) {
    const min = parseInt(info.substr(0, info.indexOf(" ")));
    const max = parseInt(info.substr(info.indexOf(" ")));
    if (/int/i.test(msg)) return "" + Math.floor((Math.random() * (max + 1 - min)) + min);
    else return "" + ((Math.random() * (max - min)) + min);
  }

  if (/^choose/i.test(msg)) {
    var options = [];
    var word = "";
    for (var i = 0; i < info.length; i++) {
      word += info[i]; // Add next character
      if (info[i] === " ") {
        word = word.slice(0, -1); // Remove last space
        options.push(word);
        word = "";
      }
    }
    options.push(word); // Add the last option
    return options[parseInt(excute("between 0 " + options.length + " int"))];
  }
  return "hello";
}

const preview = msg => {
  if (/^coin/i.test(msg)) return "Coin toss";
  if (/^dice/i.test(msg)) return "Dice roll";
  if (/^between/i.test(msg)) return "Random Number (min max)";
  if (/^choose/i.test(msg)) return "Choose one option";
}
