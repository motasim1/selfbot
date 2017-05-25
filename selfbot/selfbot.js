/*
        ---------------------------------------------------------------------------
        |Disclaimer:                                                               |
        |This selfbot is created by motasim#4036 for Discord.                      |
        |Please do NOT change the code unless you know what you are doing.         |
        |If you fuck up the code, you will need to restore it back for yourself.   |
        |I am not responsible for anything you do that can bring you in trouble.   |
        |                                                                          |
        |                                                                          |
        |                 © 2017 | motasim#4036's selfbot.                         |
        ----------------------------------------------------------------------------

*/

const Discord = require('discord.js')
const bot = new Discord.Client()
const config = require('./config.json')
const fs = require('fs')

function clean(text) {
  if (typeof(text) === "string")
  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
  return text;
}

bot.on('ready', (ready) => {
  console.log('Self bot is online! Prefix: ' + config.prefix)
  console.log('Logged in as: ' + bot.user.username + '#' + bot.user.discriminator)
  console.log('Use: ' + config.prefix + 'help')
  console.log('---------------------------------------------------------------------')
})

var copyright = "Created by motasim#4036."

var embedtitle = []

bot.on('message', (message) => {
  var args = message.content.split(/[ ]+/);
  if(message.author.id !== bot.user.id) return;
  if(message.content === config.prefix + 'ping') {
  message.channel.send("Ping?").then(m => m.edit(`Pong! Took ${m.createdTimestamp - message.createdTimestamp}ms.`))
  } else {
    if(message.content.startsWith(config.prefix + 'embed')) {
      message.delete()
      let embedtext = args.slice(1).join(' ');
      if(embedtext.length <= 1) return;
      const embed = new Discord.RichEmbed()
      if(config.embedcolor === "random") {
        embed.setColor("RANDOM")
      } else {
      embed.setColor(config.embedcolor)
      }
      if(embedtitle.length < 1) {
        embed.setTitle(`${message.author.username}`)
      } else {
        embed.setTitle(embedtitle)
      }
      embed.setDescription(embedtext)
      .setThumbnail(message.author.avatarURL)
      .setFooter(copyright)
      message.channel.send({embed: embed})
    } else {
      if(message.content === config.prefix + 'serverinfo') {
        if(!message.guild) return;
        const embed = new Discord.RichEmbed()
        if(config.embedcolor === "random") {
          embed.setColor("RANDOM")
        } else {
        embed.setColor(config.embedcolor)
        }
        embed.addField('Server name:', `**${message.guild.name}**`)
        .setThumbnail(message.guild.iconURL)
        .addField('Default Channel:', `${message.guild.defaultChannel} (#${message.guild.defaultChannel.name})`)
        .addField('Members:', `**${message.guild.memberCount}**`)
        .addField('Owner:', `${message.guild.owner} (${message.guild.owner.user.username}#${message.guild.owner.user.discriminator})`)
        .addField('Server ID:', `${message.guild.id}`)
        .setFooter(copyright)
        message.channel.send({embed: embed})
    } else {
      if(message.content === config.prefix + 'servers') {
        message.delete()
        const embed = new Discord.RichEmbed()
        .setTitle('Servers')
        .setThumbnail(message.author.avatarURL)
        .setDescription(`I am now in ${bot.guilds.size} servers.`)
        if(config.embedcolor === "random") {
          embed.setColor("RANDOM")
        } else {
        embed.setColor(config.embedcolor)
        }
        embed.setFooter(copyright)
        message.channel.send({embed: embed})
    } else {
      if(message.content.startsWith(config.prefix + 'setprefix')) {
        let prefix = args.slice(1).join(' ');
        if(prefix.length < 1) return;
        if(prefix.length > 1) return;
        config.prefix = prefix[0];
        fs.writeFile('./config.json', JSON.stringify(config), (err) => {if(err) console.error(err)});
        console.log(`Changed prefix to: ${prefix}`)
        console.log('-----------------------------')
      } else {
        if(message.content.startsWith(config.prefix + 'prune')) {
          const amount = !!parseInt(message.content.split(" ")[1]) ? parseInt(message.content.split(" ")[1]) : parseInt(message.content.split(" ")[2])
          message.channel.fetchMessages({limit: 100})
          .then(messages => {
            let msg_array = messages.array();
            msg_array = msg_array.filter(m => m.author.id === bot.user.id);
            msg_array.length = amount + 1;
            msg_array.map(m => m.delete().catch(console.error));
          });
        } else {
          if(message.content.startsWith(config.prefix + 'setgame')) {
            let i = args.slice(1).join(" ")
            if(i === "null") return bot.user.setGame(null)
          bot.user.setGame(args.join(" ").substring(7));
        } else {
          if(message.content.startsWith(config.prefix + 'setnick')) {
            if(!message.guild) return;
            var mention = message.mentions.users.first()
            var nickname = args.slice(2).join(' ');
            if(message.mentions.users.size) {
              if(!message.member.hasPermission("MANAGE_NICKNAMES")) return console.log(`You can not change nicknames on the server ${message.guild.name} because you do not have the right perms.`)
              if(nickname.length < 1) return;
              if(nickname === 'null') return message.guild.member(mention).setNickname(null)
              message.guild.member(mention).setNickname(nickname)
            } else {
            if(!message.member.hasPermission("CHANGE_NICKNAME")) return console.log(`You can not change your nickname on the server ${message.guild.name} because you do not have the right perms.`)
            var nickname = args.slice(1).join(' ');
            if(nickname === 'null') {
              message.member.setNickname(null)
              console.log(`Setted your nickname on the server **${message.guild.name}** back to ${bot.user.username}`)
              const e = new Discord.RichEmbed()
              .setTitle("Nickname")
              .setThumbnail(message.author.avatarURL)
              if(config.embedcolor === "random") {
                e.setColor("RANDOM")
              } else {
              e.setColor(config.embedcolor)
              }
              embed.setDescription("Successfully changed your nickname to " + message.author.username)
              .setFooter(copyright)
              message.channel.send({embed: e})
            } else {
            message.member.setNickname(nickname)
              const e = new Discord.RichEmbed()
              .setTitle("Nickname")
              .setThumbnail(message.author.avatarURL)
              if(config.embedcolor === "random") {
                e.setColor("RANDOM")
              } else {
              e.setColor(config.embedcolor)
              }
              embed.setDescription("Successfully changed your nickname to " + nickname)
              .setFooter(copyright)
              message.channel.send({embed: e})
            console.log(`Changed nickname on the server **${message.guild.name}** to **${nickname}**`)
          }
            message.delete().catch(console.error);
          }
          } else {
            let ownerID = config.ownerID
            let mention = message.mentions.users.first()
            let reason = args.slice(2).join(' ');
              var memes = ['https://cdn.discordapp.com/attachments/282816188294365194/299963082015244289/images.png'] // Post your memes between the []. Example: ['https://meme.io']
              if(message.content === config.prefix + 'meme') {
                message.channel.send(memes[Math.floor(Math.random() * memes.length)])
          } else {
            if(message.content === config.prefix + 'help') {
              const embed = new Discord.RichEmbed()
              .setTitle('Selfbot Help')
              if(config.embedcolor === "random") {
                embed.setColor("RANDOM")
              } else {
              embed.setColor(config.embedcolor)
              }
              embed.addField(config.prefix + 'help', 'Shows this help message.')
              .addField(config.prefix + 'info', 'Shows the bot info.')
              .addField(config.prefix + 'insult', 'Insults the mentioned user.')
              .addField(config.prefix + 'ping', 'Returns "pong" with how long it took to respond')
              .addField(config.prefix + 'embed', 'Puts your text in an embed.')
              .addField(config.prefix + 'github', 'Shows the link for my github.')
              .addField(config.prefix + 'setgame', 'Sets your playing game.')
              .addField(config.prefix + 'chat', 'Use this when the chat is dead.')
              .addField(config.prefix + 'setprefix', 'Sets your new prefix.')
              .addField(config.prefix + 'setetitle', 'Sets the title for your embeds.')
              .addField(config.prefix + 'servers', 'Shows in how many servers you are in.')
              .addField(config.prefix + 'meme', 'Post a random meme.')
              .addField('Mod part', '--')
              .addField(config.prefix + 'setnick', 'Sets your new nickname for the server or for the mentioned user.')
              .addField(config.prefix + 'prune', 'Deletes message that were sent by you.')
              .addField(config.prefix + 'kick', "Kicks the mentioned user.")
              .addField(config.prefix + 'ban', "Bans the mentioned user.")
              .addField('Server commands:', '--')
              .addField(config.prefix + 'serverinfo', 'Shows the serverinfo.')
              .addField(config.prefix + 'leave', 'Leaves the server where the message was sent in.')
              .addField(config.prefix + 'perms', 'Shows the permissions for you in a server.')
              .setFooter(copyright)
              message.channel.send({embed: embed})
            } else {
              if(message.content.startsWith('What is my prefix?')) {
                message.reply(`Your prefix is: ${config.prefix}`)
              } else {
                if(message.content === config.prefix + 'chat') {
                  message.delete()
                  message.channel.send('Chat is dead\nWould you like to bring it alive?\n[Yes] [No]')
                } else {
                  if(message.content === config.prefix + 'leave') {
                    if(!message.guild) return;
                    message.delete()
                    if(message.author.id === message.guild.id) return;
                    message.guild.leave()
                  } else {
                      if(message.content.startsWith(config.prefix + 'insult')) {
                        if(!message.mentions.users.size) return;
                        message.delete()
                        let mention = message.mentions.users.first()
                        var insults = ['Is your ass jealous of the amount of shit that just came out of your mouth?', 'Two wrongs dont make a right, take your parents as an example.', 'Id like to see things from your point of view but I cant seem to get my head that far up my ass.', 'If I wanted to kill myself Id climb your ego and jump to your IQ.', 'Your family tree must be a cactus because everybody on it is a prick.', 'You are so ugly, when your mom dropped you off at school she got a fine for littering.', 'Your birth certificate is an apology letter from the condom factory.']
                        message.channel.send(mention + " " + insults[Math.floor(Math.random() * insults.length)])
                      } else {
                        if(message.content.startsWith(config.prefix + 'github')) {
                          if(message.mentions.users.size) {
                            const embed = new Discord.RichEmbed()
                            .setTitle('GitHub')
                            .setDescription('You can find my code on [my](https://www.github.com/motasim1/selfbot) github.')
                            if(config.embedcolor === "random") {
                              embed.setColor("RANDOM")
                            } else {
                            embed.setColor(config.embedcolor)
                            }
                            message.channel.send(`${mention}:`)
                            message.channel.send({embed: embed})
                          } else {
                            const embed = new Discord.RichEmbed()
                            .setTitle('GitHub')
                            .setDescription('You can find my code on [my](https://www.github.com/motasim1/selfbot) github.')
                            if(config.embedcolor === "random") {
                              embed.setColor("RANDOM")
                            } else {
                            embed.setColor(config.embedcolor)
                            }
                            message.channel.send({embed: embed})
                          }
                        } else {
                          if(message.content.startsWith(config.prefix + 'eval')) {
                            message.delete()
                              try {
                                let com = eval(message.content.split(" ").slice(1).join(" "));
                                var com2 = message.content.split(" ").slice(1).join(" ");
                                message.channel.send(":arrow_down:\n```md\n# INPUT\n" + com2 + "```")
                                  message.channel.send(":arrow_up:\n```md\n# OUTPUT\n" + com + "```")
                              } catch(e) {
                                message.channel.send(":arrow_down:\n```md\n# INPUT\n" + com2 + "```")
                                message.channel.send(":arrow_up:\n```md\n# OUTPUT\n" + e + "```")
                              }
                          } else {
                            if(message.content === config.prefix + 'perms') {
                              if(!message.guild) return;
                              var yes = ":white_check_mark:"
                              var no = ":x:"
                              if(message.author.id === message.guild.owner.id) return message.reply('You are the server owner so you have full perms!')
                              if(!message.member.hasPermission("EMBED_LINKS")) return message.reply("You can not post embeds in this channel/server. Please try again in an other channel or take contact with one of the Admins of the server.")
                              const embed = new Discord.RichEmbed()
                              if(config.embedcolor === "random") {
                                embed.setColor("RANDOM")
                              } else {
                              embed.setColor(config.embedcolor)
                              }
                              if(message.member.hasPermission("ADMINISTRATOR")) {
                                message.reply("You have full perms.")
                              } else {
                              if(message.member.hasPermission("CREATE_INSTANT_INVITE")) {
                                 embed.addField('Create instant invite:', yes)
                               } else {
                                 embed.addField("Create instant invite:", no)
                               }
                              if(message.member.hasPermission("KICK_MEMBERS")) {
                                embed.addField("Kick members:", yes)
                              } else {
                                embed.addField("Kick members:", no)
                              }
                              if(message.member.hasPermission("BAN_MEMBERS")) {
                                embed.addField("Ban members:", yes)
                              } else {
                                embed.addField("Ban members:", no)
                              }
                              if(message.member.hasPermission("MANAGE_CHANNELS")) {
                                embed.addField("Manage channels:", yes)
                              } else {
                                embed.addField("Manage channels:", no)
                              }
                              if(message.member.hasPermission("MANAGE_GUILD")) {
                                embed.addField("Manage server:", yes)
                              } else {
                                embed.addField("Manage server:", no)
                              }
                              if(message.member.hasPermission("MANAGE_MESSAGES")) {
                                embed.addField("Manage messages:", yes)
                              } else {
                                embed.addField("Manage messages:", no)
                              }
                              if(message.member.hasPermission("EMBED_LINKS")) {
                                embed.addField("Embeds:", yes)
                              } else {
                                embed.addField("Embeds:", no)
                              }
                              if(message.member.hasPermission("EXTERNAL_EMOJIS")) {
                                embed.addField("Use external emoji:", yes)
                              } else {
                                embed.addField("Use external emoji:", no)
                              }
                              if(message.member.hasPermission("CHANGE_NICKNAME")) {
                                embed.addField("Change nickname:", yes)
                              } else {
                                embed.addField("Change nickname:", no)
                              }
                              embed.setFooter(copyright)
                              message.channel.send({embed: embed})
                            }
                          } else {
                            if(message.content === config.prefix + 'info') {
                              const embed = new Discord.RichEmbed()
                              .setTitle("Selfbot Info")
                              if(config.embedcolor === "random") {
                                embed.setColor("RANDOM")
                              } else {
                              embed.setColor(config.embedcolor)
                              }
                              embed.setDescription("This is a selfbot which you can host for yourself.\nYou can get the code from my [github](https://github.com/motasim1/selfbot).\nI am coded in JS by motasim#4036.\nIf you have any questions and or suggestions for the bot, feel free to join the support server. (You can find the link on the first page of my GitHub project)")
                              message.channel.send({embed: embed})
                            } else {
                              if(message.content === config.prefix + 'version') {
                                message.reply("```The current version of the bot is 1.9 | Last update: Custom embed titles```")
                              } else {
                                if(message.content.startsWith(config.prefix + "setetitle")) {
                                  let title = args.slice(1).join(" ")
                                  if(title.length < 1) return embedtitle.shift()
                                  embedtitle.shift()
                                  embedtitle.push(title)
                                  message.reply("Ok. Your new embed title is `" + title + "`. Please note that you need to set this back after a re-boot.")
                                } else {
                                  if(message.content.startsWith(config.prefix + "kick")) {
                                    if(!message.guild) return;
                                    let mention = message.mentions.users.first()
                                    let reason = args.slice(2).join(" ")
                                    if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) return message.channel.send("```You do not have the Kick Members permission.```")
                                    if(!message.mentions.users.size) return message.channel.send("```Please mention someone to kick```")
                                    if(reason.length < 2) return message.channel.send("```Please provide a reason for this kick```")
                                    if(!message.guild.member(mention).kickable) return message.channel.send("```You can not kick a member who has a higher role than you or who has the same role as you.```")
                                    const embed = new Discord.RichEmbed()
                                    .setTitle("Kick")
                                    .setColor("#ff0000")
                                    .addField("User:", `${mention.username}#${mention.discriminator}`)
                                    .addField("Moderator:", message.author.tag)
                                    .addField("Reason:", reason)
                                    message.guild.defaultChannel.send({embed: embed})
                                    const embedd = new Discord.RichEmbed()
                                    .setTitle("Kick")
                                    .setDescription("You are kicked from the server **" + message.guild.name + "**")
                                    .setColor("#ff0000")
                                    .addField("Moderator:", message.author.tag)
                                    .addField("Reason:", reason)
                                    message.guild.member(mention).send({embed: embedd})
                                    bot.setTimeout(() => {
                                      message.guild.member(mention).kick(7)
                                      message.channel.send("Successfully kicked **" + mention.username + "#" + mention.discriminator + "**")
                                    }, 1000)
                                  } else {
                                    if(message.content.startsWith(config.prefix + "ban")) {
                                      if(!message.guild) return;
                                      let mention = message.mentions.users.first()
                                      let reason = args.slice(2).join(" ")
                                      if(!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) return message.channel.send("```You do not have the Kick Members permission.```")
                                      if(!message.mentions.users.size) return message.channel.send("```Please mention someone to ban```")
                                      if(reason.length < 2) return message.channel.send("```Please provide a reason for this ban```")
                                      if(!message.guild.member(mention).kickable) return message.channel.send("```You can not ban a member who has a higher role than you or who has the same role as you.```")
                                      const embed = new Discord.RichEmbed()
                                      .setTitle("Ban")
                                      .setColor("#ff0000")
                                      .addField("User:", `${mention.username}#${mention.discriminator}`)
                                      .addField("Moderator:", message.author.tag)
                                      .addField("Reason:", reason)
                                      message.guild.defaultChannel.send({embed: embed})
                                      const embedd = new Discord.RichEmbed()
                                      .setTitle("Ban")
                                      .setDescription("You are banned from the server **" + message.guild.name + "**")
                                      .setColor("#ff0000")
                                      .addField("Moderator:", message.author.tag)
                                      .addField("Reason:", reason)
                                      message.guild.member(mention).send({embed: embedd})
                                      bot.setTimeout(() => {
                                        message.guild.member(mention).ban(7)
                                        message.channel.send("Successfully banned **" + mention.username + "#" + mention.discriminator + "**")
                                      }, 1000)
                                    } else {
                                      if(message.content.startsWith(config.prefix + "afk")) {
                                        if(config.afk === "false") {
                                          config.afk = "true"
                                          message.reply("You are now AFK.")
                                          fs.writeFile('./config.json', JSON.stringify(config), (err) => {if(err) console.error(err)});
                                        } else {
                                        if(config.afk === "true") {
                                          config.afk = "false"
                                          message.reply("You are no longer AFK.")
                                          fs.writeFile('./config.json', JSON.stringify(config), (err) => {if(err) console.error(err)});
                                        }
                                      }
                                    }
                                    }
                                  }
                                }
                              }
                            }
                          }
                          }
                          }
                        }
                        }
                      }
                      }
                    }
                  }
                  }
                }
              }
            }
          }
        }
        }
      }
    })

    bot.on("message", message => {
      if(!message.guild) return;
      if(message.author.bot) return;
      if(message.mentions.users.has(bot.user.id)) {
        if(message.author.id === bot.user.id) return;
        if(config.afk === "false") return;
        if(config.afk === "true") {
          const embed = new Discord.RichEmbed()
          .setTitle("AFK")
          if(config.embedcolor === 'random') {
            embed.setColor("RANDOM")
          } else {
            embed.setColor(config.embedcolor)
          }
          embed.setDescription("I am AFK. Please DM me later because this mention gets muted due my selfbot.")
          message.channel.send({embed: embed})
        }
        const embed = new Discord.RichEmbed()
        .setTitle("Mention")
        if(config.embedcolor === 'random') {
          embed.setColor("RANDOM")
        } else {
          embed.setColor(config.embedcolor)
        }
        embed.setDescription("You were mentioned in a server.")
        .addField("User:", message.author.tag)
        .addField("Server:", message.guild.name)
        .addField("Channel:", message.channel)
        .addField("Content:", message.content)
        bot.channels.get(config.logchannel).send({embed: embed})
      }
    })

bot.login(config.token);
