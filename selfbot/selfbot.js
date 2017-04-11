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
  console.log('Self bot is online! Prefix:' + config.prefix)
  console.log('Logged in as:' + bot.user.username + '#' + bot.user.discriminator)
  console.log('Use:' + config.prefix + 'help')
  console.log('---------------------------------------------------------------------')
})

bot.on('message', (message) => {
  var args = message.content.split(/[ ]+/);
  if(message.author.id !== config.ownerID) return;
  if(message.content === config.prefix + 'ping') {
    message.edit('Pong!')
  } else {
    if(message.content.startsWith(config.prefix + 'embed')) {
      message.delete()
      let embed = args.slice(1).join(' ');
      if(embed.length <= 1) return;
      const embedd = new Discord.RichEmbed()
      .setTitle(`${message.author.username}`)
      .setColor(config.embedcolor)
      .setDescription(embed)
      .addField('---------------------------------------------------------------', "Made possible by Motasim's [selfbot](https://github.com/motasim1/selfbot)")
      message.channel.sendEmbed(embedd)
    } else {
      if(message.content === config.prefix + 'serverinfo') {
        if(!message.guild) return;
        let n = message.guild.channels.map(r => r.name)
        const embed = new Discord.RichEmbed()
        .setColor(config.embedcolor)
        .addField('Server name:', `**${message.guild.name}**`)
        .addField('Default Channel:', `${message.guild.defaultChannel} (#${message.guild.defaultChannel.name})`)
        .addField('Members:', `**${message.guild.memberCount}**`)
        .addField('Owner:', `${message.guild.owner} (${message.guild.owner.user.username}#${message.guild.owner.user.discriminator})`)
        .addField('Server ID:', `${message.guild.id}`)
        .addField('Channels:', `${n}`)
        .addField('---------------------------------------------------------------', "Made possible by Motasim's [selfbot](https://github.com/motasim1/selfbot)")
        message.channel.sendEmbed(embed)
    } else {
      if(message.content === config.prefix + 'servers') {
        message.delete()
        const embed = new Discord.RichEmbed()
        .setTitle('Servers')
        .setDescription(`I am now in ${bot.guilds.size} servers.`)
        .setColor(config.embedcolor)
        .addField('---------------------------------------------------------------', "Made possible by Motasim's [selfbot](https://github.com/motasim1/selfbot)")
        message.channel.sendEmbed(embed)
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
          var game = args.join(" ");
          bot.user.setGame(game);
        } else {
          if(message.content.startsWith(config.prefix + 'setnick')) {
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
            if(nickname === 'null') return message.member.setNickname(null).then(console.log(`Setted your nickname on the server **${message.guild.name}** back to ${bot.user.username}`))
            message.member.setNickname(nickname);
            console.log(`Changed nickname on the server **${message.guild.name}** to **${nickname}**`)
            message.delete().catch(console.error);
          }
          } else {
            let ownerID = config.ownerID
            // Moderation part. Works only with role perms
            let mention = message.mentions.users.first()
            let reason = args.slice(2).join(' ');
            if(message.content.startsWith(config.prefix + 'kick')) {
              if(!message.member.hasPermission("KICK_MEMBERS")) return;
              if(!message.mentions.users.size) return;
              if(reason.length < 1) return message.reply('You need to set a reason for this kick. Usage: ' + config.prefix + '`kick @user <reason>`')
              if (!message.guild.member(mention).kickable) return message.reply('I can not kick that member');
              if(mention.id === ownerID) return;
              message.reply(`I have kicked ${mention} successfully and I have deleted his/her messages in the last 7 days.`)
              const d = new Discord.RichEmbed()
              .setTitle('Kick')
              .setColor('#ff0000')
              .setDescription('You are kicked from the server ' + `**${message.guild.name}**`)
              .addField('Modrator:', `${message.author.username}#${message.author.discriminator}`)
              .addField('Reason:', reason)
              message.guild.member(mention).sendEmbed(d)
              message.guild.member(mention).kick(7)
            } else {
              if(message.content.startsWith(config.prefix + 'ban')) {
                if(!message.member.hasPermission("BAN_MEMBERS")) return;
                if(!message.mentions.users.size) return;
                if(reason.length < 1) return message.reply('You need to set a reason for this ban. Usage: ' + config.prefix + '`ban @user <reason>`')
                if (!message.guild.member(mention).bannable) return message.reply('I can not ban that member');
                if(mention.id === ownerID) return;
                message.reply(`I have banned ${mention} successfully and I have deleted his/her messages in the last 7 days.`)
                const d = new Discord.RichEmbed()
                .setTitle('Ban')
                .setColor('#ff0000')
                .setDescription('You are banned from the server ' + `**${message.guild.name}**`)
                .addField('Modrator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Reason:', reason)
                message.guild.member(mention).sendEmbed(d)
                message.guild.member(mention).ban(7)
            } else {
              var memes = ['https://cdn.discordapp.com/attachments/282816188294365194/299963082015244289/images.png'] // Post your memes between the []. Example: ['https://meme.io']
              if(message.content === config.prefix + 'meme') {
                message.channel.sendMessage(memes[Math.floor(Math.random() * memes.length)])
          } else {
            if(message.content === config.prefix + 'help') {
              const embed = new Discord.RichEmbed()
              .setTitle('Selfbot Help')
              .setColor(config.embedcolor)
              .addField(config.prefix + 'help', 'Shows this help message.')
              .addField(config.prefix + 'ping', 'Returns "pong".')
              .addField(config.prefix + 'embed', 'Puts your text in an embed.')
              .addField(config.prefix + 'setgame', 'Sets your playing game.')
              .addField(config.prefix + 'chat', 'Use this when the chat is dead.')
              .addField(config.prefix + 'setprefix', 'Sets your new prefix.')
              .addField(config.prefix + 'servers', 'Shows in how many servers you are in.')
              .addField(config.prefix + 'meme', 'Post a random meme.')
              .addField('Mod part', '--')
              .addField(config.prefix + 'setnick', 'Sets your new nickname for the server or for the mentioned user.')
              .addField(config.prefix + 'prune', 'Deletes message that were sent by you.')
              .addField(config.prefix + 'kick', 'Kicks the mentioned user.')
              .addField(config.prefix + 'ban', 'Bans the mentioned user.')
              .addField('Server commands:', '--')
              .addField(config.prefix + 'serverinfo', 'Shows the serverinfo.')
              .addField(config.prefix + 'leave', 'Leaves the server where the message was sent in.')
              .addField('---------------------------------------------------------------', "Made possible by Motasim's [selfbot](https://github.com/motasim1/selfbot)")
              message.channel.sendEmbed(embed)
            } else {
              if(message.content.startsWith('What is my prefix?')) {
                message.reply(`Your prefix is: ${config.prefix}`)
              } else {
                if(message.content === config.prefix + 'chat') {
                  message.delete()
                  message.channel.sendMessage('Chat is dead\nWould you like to bring it alive?\n[Yes] [No]')
                } else {
                  if(message.content === config.prefix + 'leave') {
                    if(!message.guild) return;
                    if(message.author.id === message.guild.id) return;
                    message.guild.leave()
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

bot.login(config.token);
