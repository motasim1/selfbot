const Discord = require("discord.js");
const package = require("../package.json");
exports.run = (bot, message, args) => {
  message.delete()
  try {
    let com = eval(message.content.split(" ").slice(1).join(" "));
    var com2 = message.content.split(" ").slice(1).join(" ");
    const good_eval = new Discord.RichEmbed()
    .setTitle("Eval")
    .setThumbnail(message.author.avatarURL)
    .setColor("#2aff00")
    .addField("Input", com2)
    .addField("Output", com)
    .setFooter("motasim#4036's selfbot V" + package.version)
    message.channel.send({embed: good_eval})
  } catch(e) {
    const bad_eval = new Discord.RichEmbed()
    .setTitle("Eval")
    .setThumbnail(message.author.avatarURL)
    .setColor("#ffe100")
    .setDescription("**Uh oh**, something went wrong:")
    .addField("Input:", com2)
    .addField("Output:", e)
    .setFooter("motasim#4036's selfbot V" + package.version)
    message.channel.send({embed: bad_eval})
  }
}

exports.help = {
  name: "eval",
  description: "Evaluate JavaScript code.",
  usage: "eval [code to eval]"
}

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: []
}
