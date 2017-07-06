exports.run = (bot, message) => {
  message.channel.send("Ping-Ponging...").then(m => m.edit(`Pong! Took ${m.createdTimestamp - message.createdTimestamp}ms.`))
}

exports.help = {
  name: "ping",
  description: "Ping/Pong command. Shows latency for the bot.",
  usage: "ping"
}

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: []
}
