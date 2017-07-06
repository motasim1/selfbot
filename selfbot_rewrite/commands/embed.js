const embedcolors = require("../embedcolors.json");
const Discord = require("discord.js");
const config = require("../config.json");
const package = require("../package.json");
exports.run = (bot, message, args, author) => {
  let to_embed = args.slice(0).join(" ")
  if(!to_embed) return message.channel.send("```Selfbot error: You must provide text to put in an embed.```")
  const embed = new Discord.RichEmbed()
  if(!config.embedtitle) {
    embed.setTitle(message.author.username)
  } else {
    embed.setTitle(config.embedtitle)
  }
  embed.setThumbnail(message.author.avatarURL)
  .setColor(embedcolors.embed)
  .setDescription(to_embed)
  .setFooter("motasim#4036's selfbot V" + package.version)
  message.channel.send({embed: embed})
}

exports.help = {
  name: "embed",
  description: "Put your text in a nice embed.",
  usage: "embed [text to put]"
}

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: []
}
