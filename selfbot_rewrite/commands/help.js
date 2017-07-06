const config = require("../config.json");
const Discord = require("discord.js");
const embedcolors = require("../embedcolors.json");
exports.run = (bot, message, args) => {
    if (args.length < 1) {
      try {
        const commandArray = bot.commands.array();
        while (commandArray.length) {
          const embed = new Discord.RichEmbed();
          const commands = commandArray.splice(0, 25);
          embed.setColor('#00ffff')
          embed.setTitle('Commands')
          embed.setDescription(`All available commands. Use ${config.prefix}help <command> for a detailed help. Message will be deleted over 30 seconds.`)
          for (const command of commands) {
            embed.addField(`${command.help.name}`, `${command.help.description}`);
          }
          message.channel.send({
            embed: embed
          }).then(message => {
            message.delete(30000)
          }).catch(console.error)
        }
      } catch (e) {
        console.error(e.stack)
      }
    } else {
      let command = args.slice(0).join(" ")
      if (command.length < 1) return;
      if (bot.commands.has(command)) {
        command = bot.commands.get(command);
        const embed = new Discord.RichEmbed()
          .setTitle(`${command.help.name}`)
          .setDescription(`A detailed help for the command: **${command.help.name}**`)
          .setColor("#00ffff")
          .addField("Name:", command.help.name)
          .addField("Description:", command.help.description)
          .addField("Usage:", config.prefix + command.help.usage)
          .addField("Enabled:", command.config.enabled)
          .addField("Server only:", command.config.guildOnly)
        message.channel.send({
          embed: embed
        }).then(message => {
          message.delete(30000)
        })
      } else {
        const embed = new Discord.RichEmbed()
          .setTitle("Error")
          .setColor(embedcolors.red)
          .setDescription(`The command "${command}" does not exist.`)
        message.channel.send({
          embed: embed
        }).then(message => {
          message.delete(30000)
        })
      }
    }
}

exports.help = {
  name: "help",
  description: "Shows info for all the commands or just for one.",
  usage: "help [command]"
}

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: []
}
