const config = require("../config.json");
const fs = require("fs");
exports.run = (bot, message, args) => {
  let title = args.slice(0).join(' ');
  if(title.length < 1) return;
  config.embedtitle = title;
  fs.writeFile('../config.json', JSON.stringify(config), (err) => {if(err) console.error(err)});
}

exports.help = {
  name: "setetitle",
  description: "Set a custom embed title for the embed command.",
  usage: "setetitle [new title]"
}

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: []
}
