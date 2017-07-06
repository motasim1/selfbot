const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");

bot.commands = new Discord.Collection()
bot.aliases = new Discord.Collection()

bot.on("ready", () => {
  fs.readdir("./commands", (err, files) => {
    if(err) console.error(err);
    console.log(`Loading a total of ${files.length} commands!`);
    files.forEach(filename => {
      let props = require(`./commands/${filename}`);
      bot.commands.set(props.help.name, props);
      props.config.aliases.forEach(alias => {
        bot.aliases.set(alias, props.help.name);
      });
    });
  });
  console.log("Online and ready!")
}); // Ready event: when the bot gets online.


bot.on("message", message => {
  if(message.author.id !== bot.user.id) return;
  if (!message.content.startsWith(config.prefix)) return;
  let command = message.content.toLowerCase().split(' ')[0].slice(config.prefix.length);
  let args = message.content.split(' ').slice(1);
  let cmd;
  let server;
  if(message.guild) {
    server = message.guild
  }
  let author = message.author
  if (bot.commands.has(command)) {
  cmd = bot.commands.get(command);
  } else if (bot.aliases.has(command)) {
  cmd = bot.commands.get(bot.aliases.get(command));
  }
  if(!cmd) return;
    if (cmd) {
        if(cmd.config.enabled === false) return message.channel.send("```Selfbot error: Command is disabled.```")
        if(cmd.config.guildOnly === true && !message.guild) return message.channel.send("```Selfbot error: Command is only available in a server.```")
        cmd.run(bot, message, args, server, author);
    }
}); // Command handler.

bot.login(config.token) // Logins to your bot account with the setted token in the config file.
