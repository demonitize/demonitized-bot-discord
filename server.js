/**
 * Rate Limit continually reached
 * IDK why the fuck this is happening, but whatever the cause, it's annoying as it resets the bot token.
 * 
 * Find issue and fix
 * -DMTZ
 */

// process.exit(0);
const {
  Client,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver
} = require(`discord.js`);
const commandsJSON = require("./commands.json");
const {
  VoiceConnectionStatus,
  AudioPlayerStatus,
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  adapterCreator
} = require("@discordjs/voice");
require('dotenv').config();

const ytdl = require(`ytdl-core`);
const ytsr = require(`ytsr`);

const request = require("request");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  waitGuildTimeout: 30_000
});

var modTemplate = {
  username: null,
  message: null
};

const packageJson = require("./package.json");
const {
  readdirSync
} = require("fs");
const {
  sep
} = require("path");
const {
  warning,
  success,
  error
} = import("log-symbols");
const config = require("./config");
const configuration = require(`./config.json`);
const wait = require("util").promisify(setTimeout);
const YouTubePlayer = require("./exports/youtube");
const { ReturnDocument } = require("mongodb");
var rueGuild;
var resource;
let connection;
var videoDuration = {
  min: 0,
  sec: 0
};

// Requring the packages and modules required
// All the methods used here are destructing.

// we require the config file

// Creating a instance of Client.

// Attaching Config to bot so it can be accessed anywhere.
client.config = config;

// Creating command and aliases collection.
["commands", "aliases"].forEach(x => (client[x] = new Collection()));

// A function to load all the commands.
const load = (dir = "./commands/") => {
  readdirSync(dir).forEach(dirs => {
    // we read the commands directory for sub folders and filter the files with name with extension .js
    const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files =>
      files.endsWith(".js")
    );

    // we use for loop in order to get all the commands in sub directory
    for (const file of commands) {
      // We make a pull to that file so we can add it the bot.commands collection
      const pull = require(`${dir}/${dirs}/${file}`);
      // we check here if the command name or command category is a string or not or check if they exist
      if (
        pull.help &&
        typeof pull.help.name === "string" &&
        typeof pull.help.category === "string"
      ) {
        if (client.commands.get(pull.help.name))
          return console.warn(
            `${warning} Two or more commands have the same name ${pull.help.name}.`
          );
        // we add the the comamnd to the collection, Map.prototype.set() for more info
        client.commands.set(pull.help.name, pull);
        // we log if the command was loaded.
        console.log(`${success} Loaded command ${pull.help.name}.`);
      } else {
        // we check if the command is loaded else throw a error saying there was command it didn't load
        console.log(
          `${error} Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`
        );
        // we use continue to load other commands or else it will stop here
        continue;
      }
      // we check if the command has aliases, is so we add it to the collection
      if (pull.help.aliases && typeof pull.help.aliases === "object") {
        pull.help.aliases.forEach(alias => {
          // we check if there is a conflict with any other aliases which have same name
          if (client.aliases.get(alias))
            return console.warn(
              `${warning} Two commands or more commands have the same aliases ${alias}`
            );
          client.aliases.set(alias, pull.help.name);
        });
      }
    }
  });
};

// we call the function to all the commands.
load();

/**
 * Ready event
 * @description Event is triggred when bot enters ready state.
 */
client.on(`debug`, x => console.log(x));
client.on(`warn`, x => console.log(x));
client.on(`error`, x => console.log(x));
// client.on(`guildMemberAdd`, onGuildJoin);
// client.on("messageReactionAdd", reactionRolesHandler);
client.on("ready", () => {
  console.log("I am online");
  console.log(`Logged in as ${client.user.tag} at ${new Date()}`);
  console.log(
    `Currently serving ${client.guilds.cache.size} guilds, with a total of ${client.channels.cache.size
    } channels, with ${client.guilds.cache.reduce(
      (a, g) => a + g.memberCount,
      0
    )} total users.`
  );
  rueGuild = client.guilds.cache.get(`00000000000000`);
  var date = new Date();
  var embed = new MessageEmbed()
    .setColor(0x0b01105)
    .setTitle("BOT STARTUP")
    .setDescription(`The bot has started with the following stats`)
    .addField("GUILDS", `${client.guilds.cache.size}`, true)
    .addField("CHANNELS", `${client.channels.cache.size}`, true)
    .addField(
      "MEMBERS",
      `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`,
      true
    )
    .addField("VERSION", `${packageJson.version}`, true)
    .setTimestamp(date);

  const responses = [
    `Version ${packageJson.version}`,
    `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} epic people`,
    /* ^^ Only use this one if the bot's status is NOT streaming, otherwise the formatting looks really weird ^^ */
    `${client.guilds.cache.size} servers`,
    `You like jazz?`,
    `I don't have bugs, I have Features`,
    `Every month is Pride Month | LGBTQIA+ Rights`,
    // `TEST MODE ACTIVE`
  ];
  var number = 0;

  function randomizer() {
    if (number == responses.length - 1) {
      number = -1;
    }
    number++;
    let GameActivity = responses[number];
    client.user.setActivity(GameActivity, {
      type: "WATCHING",
      url: "https://twitch.tv/r00tkitt"
    });
    client.user.setStatus("online");
  }

  setInterval(randomizer, 10000);
  // let options = {
  //   method: "POST",
  //   url: "https://discordbotlist.com/api/v1/bots/551194918853410817/stats",
  //   headers: {
  //     "cache-control": "no-cache",
  //     "content-type": "application/x-www-form-urlencoded",
  //     authorization: process.env.UPDATE_TOKEN
  //   },
  //   form: {
  //     guilds: client.guilds.cache.size,
  //     users: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
  //   }
  // };

  // request(options, function (error, response, body) {
  //   if (error) console.warn(new Error(error));
  //   // console.log(response);
  //   console.log(body);
  // });

    let fetchCmdOpts = {
      method: "GET",
      url: "https://discord.com/api/applications/551194918853410817/commands",
      headers: {
        authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    };
    request(fetchCmdOpts, function (error, response, body) {
      if (error) console.warn(new Error(error));
      // console.log(response);
      console.log(body);
    });
  // changePerms();

  
});

function automodTemplate(int, msgCnt) {
  let embedOut = new MessageEmbed()
    .setTitle(`AutoMod`)
    .setDescription(`Your message has been deleted from **${int.guild.name}** for the following reasons:`)
    .addField(`Reason`, "`Message matched Regex`")
    .addField(`Message Content`, `\`${msgCnt}\``)
    .addField(`Offending Phrase`, `\`\``)
    .setTimestamp(new Date())
    .setColor("#34e1eb")
    .setFooter(
      `If you wish to dispute this infraction, please contact an Admin`
    );
  return embedOut;
}

function loggingTemplate(int, logType, reason, user, infractionAuthor) {
  let embedOut = new MessageEmbed()
    .setTitle(`Moderation Logs`)
    .addField(`Log Type`, `\`${logType}\``)
    .addField(`Reason`, `\`${reason}\``)
    .addField(`User`, `\`${user}\``)
    .addField(`Moderator Involved`, `\`${infractionAuthor}\``)
    .setTimestamp(new Date())
    .setColor("#34e1eb");
  return embedOut;
}

function timeoutTemplate(user, ofdMsg, author, int) {
  let embedOut = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`Timeout`)
    .setAuthor(author.username, author.avatarURL())
    .setDescription(
      `You have been sent to Time Out in **${int.guild.name}**. Details are listed below`
    )
    .addFields({
      name: "Duration",
      value: `One Minute`
    }, {
      name: "Moderator Involved",
      value: `\`${author.username}\``
    })
    .setTimestamp(new Date())
    .setFooter(
      `If you wish to appeal this infraction, please message a Sever Administrator.`
    );

  return embedOut;
}

function warnTemplate(user, ofdMsg, author, int) {
  let embedOut = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`Warning`)
    .setAuthor(author.username, author.avatarURL())
    .setDescription(
      `You have been warned in **${int.guild.name}**. Details are listed below`
    )
    .addFields({
      name: "Offending Message",
      value: `\`${ofdMsg}\``
    }, {
      name: "Moderator Involved",
      value: `\`${author.username}\``
    })
    .setTimestamp(new Date())
    .setFooter(
      `If you wish to appeal this warning, please message a Sever Administrator.`
    );

  return embedOut;
}

function lockdownTemplate(int) {
  let embedOut = new MessageEmbed()
    .setTitle("Server Lockdown")
    .setDescription("The server is now locked down. This could be for many reasons such as a hate raid, or for spam.")
    .setTimestamp(new Date())
    .setColor("#a61e14")
    .setFooter("Please contact an admin or a mod if you have any questions");
  return embedOut;
}

function lockdownRlsTemplate(int) {
  let embedOut = new MessageEmbed()
    .setTitle("Server Lockdown Released")
    .setDescription("The server is now unlocked. Thank you for your patience!")
    .setTimestamp(new Date())
    .setColor("#179e08")
    .setFooter("Remember to read the rules");
  return embedOut;
}

function streamStart(msg) {
  let embedOut = new MessageEmbed()
  .setTitle("Starting Playback")
  .setDescription("Attempting to start live playback of NGEN Radio")
  .setAuthor({name:"NGEN Radio", iconURL:"https://cdn.glitch.global/2403c079-213b-4b06-ba42-6bd03960be4b/ngen.png"})
  .setColor("RANDOM")
  .setTimestamp(new Date())
  .setFooter(`Requested by ${msg.member.user.tag}`);
  return embedOut;
}

function onGuildJoin(member) {
  if (member.user.bot) return;
  if (member.guild.id == `00000000000000`) {
    client.guilds.cache
      .get(`00000000000000`)
      .channels.fetch(`00000000000000`)
      .then(chnl => {
        let actionrow = new MessageActionRow().addComponents(
          new MessageButton()
          .setCustomId("ban_usr")
          .setLabel("Ban User")
          .setStyle(`DANGER`)
        );
        let embed = new MessageEmbed()
          .setColor(0xfa6800)
          .setTitle(`Member Join`)
          .setDescription(`${member} joined the server.`)
          .setThumbnail(member.displayAvatarURL({
            dynamic: true
          }))
          .setTimestamp(new Date());
        chnl.send({
          embeds: [embed],
          components: [actionrow]
        });
      });
  }
}

function changePerms() {
  client.application.commands.create({
    name: 'volume',
    description: "Controls the volume of the music player.",
    options: [{
      "name": "newvol",
      "description": "The new volume level.",
      "required": true,
      "type": "NUMBER",
      "minValue": 0.1,
      "maxValue": 2.0
    }]
  });

  client.application.commands.create({
    name: "lockdown",
    description: "Locks down the entire server.",
    type: "CHAT_INPUT",
    options: [{
      type: "BOOLEAN",
      name: "mode",
      description: "true=lock false=unlock",
      required: true
    }],
    defaultPermission: false
   }, "888257605548535828")
  client.application.commands.set([commandsJSON.commands[0],commandsJSON.commands[1]]); /* Register slash commands */

  // client.application.commands.create({
  //   name: "cp",
  //   description: "Brings Up Moderator Control Panel",
  //   type: "MESSAGE",
  //   options
  //     permissions: [

  //     ],
  //   });
  //   console.log(data.id);
  // });
  // client.application.commands.create({
  //   defaultPermission: false,
  //   name: 'addrule',
  //   description: 'Adds a rule to the Rules channel',
  //   options: [{
  //       "name": "rule_chnl",
  //       "description": "The channel to send the rules embed to",
  //       "required": true,
  //       "type": "CHANNEL",
  //       "channelTypes": ["GUILD_TEXT"]
  //     },
  //     {
  //       "name": "rule_title",
  //       "description": "The **bold** text at the start of the rule",
  //       "type": "STRING",
  //       "required": true
  //     },
  //     {
  //       "name": "rule_desc",
  //       "description": "The more in depth explaination of the rule",
  //       "type": "STRING",
  //       "required": true
  //     }
  //   ]
  // }, "863849951469633546");
  // client.application.commands.permissions.set({
  //   "command": "910701676799877140",
  //   "guild": "618236743560462356",
  //   "permissions": [{
  //     "id": "414602371621060629",
  //     "permission": true,
  //     "type": "USER"
  //   }]
  // });
}

client.on(`messageCreate`, msg => {
  if (msg.author.bot) return;
  // if (msg.content == "??fuckyamessage") {
  //   msg.channel.bulkDelete(1000, )
  // }
  if (msg.guildId == "00000000000000") {
    let demonRegex = new RegExp("demon|demonitized", "i");
    if (demonRegex.test(msg.content)) {
      msg.reply("What the fork do you want?");
    }
  }
  // if (config.filterBypass.includes(msg.author.id)) return;
  switch (msg.guildId) {
    default:
      return;
      break;
    case "00000000000000":
      if (new RegExp(config.deadnames, "i").test(msg.content) || new RegExp(config.regex, "i").test(msg.content)) {
        msg.delete();
        try {
          msg.author.send({
            embeds: [automodTemplate(msg, msg.content)]
          });
        } catch (err) {
          console.warn(err);
        };
        console.log(`${msg.author.tag} can be MODERATED: ${msg.member.moderatable}, MANAGED: ${msg.member.manageable}`);
        if (msg.member.manageable) {
          msg.member.timeout(5000, `Using a blacklisted term`);
        }
        break;
      }
    case "00000000000000":
      if (new RegExp(config.deadnames, "i").test(msg.content) || new RegExp(config.regex, "i").test(msg.content) || new RegExp(config.regexTop, "i").test(msg.content)) {
        if (config.filterBypass.includes(msg.author.id)) {
          console.warn(`${msg.author.tag} bypasses the filter due to being on the override list.`)
          return;
        }
        if (msg.member.permissions.has("MANAGE_MESSAGES")) {
          msg.author.send(`Hey ${msg.author}! Just so you know you typed a blocked term in ${msg.guild.name}, however as you have moderator permissions you bypass the filter.`).catch(function(err) {
            console.warn(err);
          })
          return;
        }
        msg.delete();
        try {
          msg.author.send({
            embeds: [automodTemplate(msg, msg.content)]
          });
        } catch (err) {
          console.warn(err);
        };
        console.log(`${msg.author.tag} can be MODERATED: ${msg.member.moderatable}, MANAGED: ${msg.member.manageable}`);
        if (msg.member.manageable) {
          msg.member.timeout(5000, `Using a blacklisted term`);
        }
        client.guilds.fetch("00000000000000").then(srv => {
          srv.channels.fetch("00000000000000").then(chnl => {
            chnl.send({
              embeds: [loggingTemplate(msg, "AutoMod", "Message Matched Filter", msg.author.tag, client.user.tag)]
            });
          })
        })
      }
      break;
    case "00000000000000":
      if (new RegExp(config.deadnames, "i").test(msg.content) || new RegExp(config.regex, "i").test(msg.content)) {
        msg.delete();
        try {
          msg.author.send({
            embeds: [automodTemplate(msg, msg.content)]
          });
        } catch (err) {
          console.warn(err);
        };
        console.log(`${msg.author.tag} can be MODERATED: ${msg.member.moderatable}, MANAGED: ${msg.member.manageable}`);
        if (msg.member.manageable) {
          msg.member.timeout(5000, `Using a blacklisted term`);
        }
        client.guilds.fetch("00000000000000").then(srv => {
          srv.channels.fetch("00000000000000").then(chnl => {
            chnl.send({
              embeds: [loggingTemplate(msg, "AutoMod", "Message Matched Filter", msg.author.tag, client.user.tag)]
            });
          })
        })
      }
      break;
    case "00000000000000":
      if (new RegExp(config.regexChloe, "i").test(msg.content)) {
        msg.delete();
        try {
          msg.author.send({
            embeds: [automodTemplate(msg, msg.content)]
          });
        } catch (err) {
          console.warn(err);
        };
        console.log(`${msg.author.tag} can be MODERATED: ${msg.member.moderatable}, MANAGED: ${msg.member.manageable}`);
        if (msg.member.manageable) {
          msg.member.timeout(5000, `Using a blacklisted term`);
        }
        client.guilds.fetch("00000000000000").then(srv => {
          srv.channels.fetch("00000000000000").then(chnl => {
            chnl.send({
              embeds: [loggingTemplate(msg, "AutoMod", "Message Matched Filter", msg.author.tag, client.user.tag)]
            });
          })
        })
      }
      break;
  }

});

client.on(`interactionCreate`, async int => {
  console.log(`Interaction Created`);
  switch (int.commandId) {
    case "910701676799877140":

      await int.deferReply({
        ephemeral: true
      });
      await int.channel.messages.fetch(int.targetId).then(message => {
        modTemplate.message = message.content;
        modTemplate.username = message.author.username;
      });
      var embed = warnTemplate(
        modTemplate.username,
        modTemplate.message,
        int.user,
        int
      );
      await int.channel.messages.fetch(int.targetId).then(message => {
        message.author.send({
          embeds: [embed]
        });
      });
      await int.editReply(`Warned ${modTemplate.username} with Message ${modTemplate.message} selected.`);

      break;

    case "911345200696270908":
      await int.deferReply({
        ephemeral: true
      });
      await int.guild.members.fetch(int.targetId).then(member => {
        let prechannel = null
        prechannel = member.voice.channelId;
        member.send({
          embeds: [timeoutTemplate(int.targetId, null, int.user, int)]
        })
        member.voice.setChannel(`907844503623323700`, `Timed out by ${int.user.username}`);
        setTimeout(function () {
          member.voice.setChannel(prechannel, `Timeout has elapsed, returned user to channel`)
        }, 60000);
      });
      int.editReply(`Successfully moved user to Time Out!`);
      break;
    case "910704700226166804":
      await int.deferReply();
      await srch(int.options.getString("query"), int);
      break;

    case "939651563939594250":
      await int.deferReply();
      await volumeShit(int);
      break;

    case "937757942927720489":
      await int.deferReply();
      if (int.options.getBoolean("mode")) {
        await client.guilds.cache.get("888257605548535828").channels.cache.get("907029537433452594").send({
          embeds: [lockdownTemplate(int)]
        });
        await int.guild.roles.edit("904256595356160030", {
          permissions: "35718656"
        }, "Server Lockdown Enabled");
        await int.editReply("Server Lockdown **ENABLED**");
      } else {
        await client.guilds.cache.get("888257605548535828").channels.cache.get("907029537433452594").send({
          embeds: [lockdownRlsTemplate(int)]
        });
        await int.guild.roles.edit("904256595356160030", {
          permissions: "517647748673"
        }, "Server Lockdown Released");
        await int.editReply("Server Lockdown **DISABLED**");
      }
      break;
      case "979184285430988841":
        connection = joinVoiceChannel({ /* Initilize the voice channel the user is in */
        channelId: int.member.voice.channelId,
        guildId: int.guildId,
        adapterCreator: int.guild.voiceAdapterCreator,
      });
      var NGENplayer = createAudioPlayer(); /* Initilize the AudioPlayer */
      let NGENresource = createAudioResource("http://ksbj.streamguys1.com/national/ngen.mp3"); /* Fetch MPEG stream of NGEN */
      let subscription = connection.subscribe(NGENplayer); /* Tell Discord that we want to use Voice API */
      await NGENplayer.play(NGENresource); /* Play the MPEG stream */
      await int.reply({embeds:[streamStart(int)]}); /* Reply to user with confirmation */
      break;
      case "979184285430988842":
        connection = joinVoiceChannel({
          channelId: int.member.voice.channelId,
          guildId: int.guildId,
          adapterCreator: int.guild.voiceAdapterCreator,
        });
        await connection.destroy();
        await int.reply(`Disconnecting from Voice Channel!`);
      break;

    case false:
      int.deferReply({
        ephemeral: true
      });

      break;
  }


  /* Connect the Slash Commands to the file based command system - Demonitized 10-5-2021 */
  switch (int.commandName) {
    case `deadbydaylight`:
      await int.reply(`Dead By Daylight is a perfect game with no bugs`);
      break;
    case `link`:
      await int.reply("`link` command not yet implemented");
      break;
    case `generatecode`:
      await int.reply("`generatecode` command not yet implemented");
      break;
    case `dance`:
      await int.deferReply();
      audioPlayer(null, int.member.voice.channelId, int.guildId, int);
      await int.editReply("Creating pain. Please wait...");
      break;
    case `disconnect`:
      await int.deferReply();
      int.editReply("Disconnected from channel.");
      break;
    case `addrule`:
      await int.deferReply({
        ephemeral: true
      });
      console.log(`Interaction passed test: commandName == 'addrule'`);
      try {
        let chnl = int.options.getChannel("rule_chnl");
        chnl.send({
          embeds: [ruleTemplate(int.options.getString("rule_title"), int.options.getString("rule_desc"), int)]
        }).then(msg => {
          int.editReply({
            content: "Success!",
            ephemeral: true
          });
        })
      } catch (err) {
        console.warn(err);
      }
      break;
    case `timeout`:
      await int.deferReply();
      let to_user = int.options.getUser("target");

      await to_user.voice.setChannel(
        `00000000000000`,
        `Timed out by ${int.member}`
      );
      await int.editReply(`Timed out ${to_user}`);
      await wait(4000);
      await int.deleteReply();

      break;
    case `untimeout`:
      await int.deferReply();
      await to_user.voice.setChannel(
        int.member.voice.channelId,
        `Timed out by ${int.member}`
      );
      await int.editReply(`Removed timeout on ${to_user}`);
      await wait(4000);
      await int.deleteReply();

      break;
    case `embedtest`:
      rueGuild.channels.fetch(`00000000000000`).then(chnl => {
        let actionrow = new MessageActionRow().addComponents(
          new MessageButton()
          .setCustomId("ban_usr")
          .setLabel("Ban User")
          .setStyle(`DANGER`)
        );
        let embed = new MessageEmbed()
          .setColor(0xfa6800)
          .setTitle(`Member Join`)
          .setDescription(`${int.author} joined the server.`)
          .setThumbnail(int.author.displayAvatarURL({
            dynamic: true
          }))
          .setTimestamp(new Date());
        int.reply({
          embeds: [embed],
          components: [actionrow]
        });
      });
      break;
    case `stab`:
      await int.reply(
        `${int.author} stabbed ${int.options.getMember}. Imagine not having a shield `
      );
      /* Test out slash commands with Henzoid Commands */
    case `hssp`:
      await int.reply(
        `Do you like the stream music? If you do, then here is the link to the playlist! youtube.com/playlist?list=PLzRMuCNGroGv7yCuCP5BxYIpg9luF5U8b`
      );
      break;
    case `map`:
      await int.reply(
        `Henzoid's current map is: ${configuration.operation.status.map.name}. ${configuration.operation.status.map.name} is ${configuration.operation.status.map.desc}. Make sure to join the Discord and follow for updates on this and future maps!`
      );
      break;
    case `lmms`:
      await int.reply(
        `Do you like the music that Henzoid makes? Do you want to make your own music? If you answered yes then you're in luck! Go to lmms.io and download LMMS to get started making your own music today!`
      );
      break;
    case `donate`:
      await int.reply(
        `Do you want to donate to the "Get henzoid functional internet" fund? Here's the link! streamlabs.com/hen_zoid/tip`
      );
      break;
    case `mcstacker`:
      await int.reply(
        `Do you want to make your own Minecraft maps? Do you strugle with commands? Do you wish there was an easy way to get extremely fucking overpowered items? If you do, then mcstacker.net is for you!`
      );
      break;
    case `pyxel`:
      await int.reply(
        `Do you like the art henzoid makes? Do you want to make your own art? If you said yes, then check out Pyxel! If you said no, then still check out Pyxel! You can buy it at pyxeledit.com`
      );
      break;
    case `discord`:
      await int.reply(
        `Did you know that Henzoid has a Discord? Wait you did... Well he does, and it's free to join! Come on down and join The Henzone! discord.com/invite/Gtj6MeD`
      );
      break;
    case `music`:
      await int.reply(
        `Do you like the music henzoid makes and wish there was an easy way to listen to it? Well wish no more! Apple Music: apple.co/3tPtxzB Spotify: spoti.fi/2Z6L7B5sp Amazon: amzn.to/3qgfgK1 YouTube: bit.ly/3d1gIw9`
      );
      break;
    case `ree`:
      await int.reply(
        `Hey! Please don't use the phrase "REE" here. Henzoid does not like that phrase and will remove your kneecaps if you say it again. Read more about saying "REE" here -> twitter.com/stevenspohn/status/1326310781353340930`
      );
      break;
    case `simps`:
      await int.reply(
        `S.I.M.P.S is an AI henzoid made totally not based on Portal 2's GLAdOS. SIMPS stands for: The Simulated Intelligence Multiple Personality System, which is an AI responsible for the development of advanced learning programs.`
      );
      break;
    case `album`:
      await int.reply(
        `Henzoid has a new album! You can check it out at the link that is so kindly placed right here -> youtube.com/watch?v=Apq-jgJtsVo`
      );
      break;

      /* Moderation Commands */
    case `kick`:
      let kickOpts = {
        user: int.getMember("kick_usr"),
        reason: int.getString("kick_rsn")
      };
      await int.reply(`${int.author} -> Kicked ${kickOpts.user}`);
      break;
    case `ban`:
      let banOpts = {
        user: int.getMember("ban_usr"),
        reason: int.getString("ban_rsn")
      };
      await int.reply(`${int.author} -> Banned ${banOpts.user}`);
      break;
    case `mute`:
      let muteOpts = {
        user: int.getMember("mute_usr"),
        reason: int.getString("mute_rsn"),
        duration: int.getInteger("mute_dur")
      };
      await int.reply(`${int.author} -> Muted ${muteOpts.user}`);
      break;
    case `warn`:
      try {
        int.deferReply();
        let warnOpts = {
          user: undefined,
          reason: undefined
        };
        const dataArray = int.data;
        console.log(`Interaction Data -> ${int.data}`);
        const foundData = dataArray.find(data => data.name === "wrn_rsn");
        if (foundData) {
          warnOpts.reason = foundData.value;
          console.log(foundData.value);
        }
        const foundUser = dataArray.find(data => data.name === "wrn_usr");
        if (foundUser) {
          warnOpts.user = foundUser.value;
          console.log(foundUser.value);
        }
        // int.guild.members.fetch(int.options.getUser("wrn_usr").createDM().finally(usrDM => {
        //     usrDM.send(
        //       `You got warned in ${int.guild.name} for ${int.options.getString("wrn_rsn")}.`
        //     );
        int.followUp(
          `${int.member} -> Warned ${warnOpts.user} for ${warnOpts.reason}`
        );
        // }));
      } catch (err) {
        console.warn(err);
      }
      break;
  }
});

async function reactionRolesHandler(messageReaction, user) {
  await console.log(messageReaction.message.id);
	if(messageReaction.message.id == "00000000000000") {
    await console.log("messsage valid");
		client.guilds.fetch("00000000000000").then(async srv => {
      await console.log(`Fetched ${srv.name}`);
			srv.members.fetch(user.id).then(async usr => {
        await console.log(`Fetched ${usr.user.tag}`);
				await usr.roles.add("00000000000000");
			});
		});
	}
}

async function srch(query, msg) {
  try {
    var stream;
    videoDuration.min = 0;
    videoDuration.sec = 0;
    if (ytdl.validateID(query) || ytdl.validateURL(query)) {
      console.log("ID VALID");
      let embed;
      var connection = joinVoiceChannel({
        channelId: msg.member.voice.channelId,
        guildId: msg.guildId,
        adapterCreator: msg.guild.voiceAdapterCreator
      });

      // Subscribe the connection to the audio player (will play audio on the voice connection)

      var player = createAudioPlayer();
      resource = createAudioResource(
        await ytdl(query, {
          filter: "audioonly"
        }), {
          inlineVolume: true
        }
      );

      await player.play(resource);

      await connection.subscribe(player);

      await ytdl.getInfo(query).then(async data => {
        let videoDurationInt = parseInt(data.videoDetails.lengthSeconds);
        while (videoDurationInt >= 60) {
          videoDuration.min++;
          videoDurationInt = videoDurationInt - 60;
        }
        if (videoDurationInt < 10) {
          videoDuration.sec = `0${videoDurationInt}`;
        } else {
          videoDuration.sec = videoDurationInt;
        }

        let embedRaw = {
          color: 0x0b01105,
          title: "Now Playing:",
          url: `https://youtube.com/watch?v=${data.videoDetails.videoId}`,
          thumbnail: {
            url: data.videoDetails.thumbnails[0].url
          },
          fields: [{
              name: "Track Name",
              value: data.videoDetails.title,
              inline: true
            },
            {
              name: "Track Author",
              value: data.videoDetails.author.name,
              inline: true
            },
            {
              name: "Track Duration",
              value: `${videoDuration.min}:${videoDuration.sec}`,
              inline: true
            }
          ],
          timestamp: new Date(),
        }
        await msg.editReply({
          embeds: [embedRaw]
        });
      });
    } else {
      console.log("ID NOT VALID");
      await msg.editReply({
        embeds: [new MessageEmbed()
          .setTitle("YouTube Search disabled because i broke it")
          .setDescription("Currently you can only use the video URL or ID to play a track. Search has been disabled because Demonitized broke it.")
          .setTimestamp(new Date)
          .setFooter("Sorry for the inconvenience")
        ]
      });
      return;
      // ytsr.getFilters(query, function (err, filters) {
      //   console.log("Fetching filters");
      //   if (err) console.warn(err);
      //   filter = filters.get("Type").find(o => o.name === "Video");
      //   ytsr.getFilters(filter.ref, function (err, filters) {
      //     if (err) console.warn(err);
      //     filter = filters
      //       .get("Duration")
      //       .find(o => o.name.startsWith("Short"));
      let options = {
        limit: 5
      };
      console.log(`Reached before YTSR`);
      ytsr(query, options, function (err, searchResults) {
        console.log(`Reached after YTSR`);
        console.log(`Results Fetched! ${searchResults.items}`);
        if (err) console.warn(err);
        var newLink = searchResults.items[0].link;
        var connection = joinVoiceChannel({
          channelId: msg.member.voice.channelId,
          guildId: msg.guildId,
          adapterCreator: msg.guild.voiceAdapterCreator
        });

        // Subscribe the connection to the audio player (will play audio on the voice connection)

        var player = createAudioPlayer();
        var resource = createAudioResource(
          ytdl(newLink, {
            filter: "audioonly"
          }).on('error', (err) => {
            console.warn(err);
            msg.editReply(`An error occured when trying to play track.`);
            return;
          })
        );
        player.play(resource);

        connection.subscribe(player);

        ytdl.getInfo(newlink).then(async data => {
          let videoDurationInt = parseInt(data.videoDetails.lengthSeconds);
          while (videoDurationInt >= 60) {
            videoDuration.min++;
            videoDurationInt = videoDurationInt - 60;
          }
          if (videoDurationInt < 10) {
            videoDuration.sec = `0${videoDurationInt}`;
          } else {
            videoDuration.sec = videoDurationInt;
          }

          let embedRaw = {
            color: 0x0b01105,
            title: "Now Playing:",
            url: `https://youtube.com/watch?v=${data.videoDetails.videoId}`,
            thumbnail: {
              url: data.videoDetails.thumbnails[0].url
            },
            fields: [{
                name: "Track Name",
                value: data.videoDetails.title,
                inline: true
              },
              {
                name: "Track Author",
                value: data.videoDetails.author.name,
                inline: true
              },
              {
                name: "Track Duration",
                value: `${videoDuration.min}:${videoDuration.sec}`,
                inline: true
              }
            ],
            timestamp: new Date(),
          }
          await msg.editReply({
            embeds: [embedRaw]
          });
        });
      }).catch(err => console.warn(err));
    }
  } catch (err) {
    console.warn(err);
  }
}

async function volumeShit(int) {
  try {
    resource.volume.setVolume() = int.options.getNumber("newvol");
    await int.editReply({
      embeds: [new MessageEmbed()
        .setTitle("Volume Changed")
        .setDescription("The playback volume has been changed.")
        .setTimestamp(new Date())
        .setFooter("This command is in Beta testing and is not guaranteed to work.")
      ]
    });
  } catch (err) {
    console.warn(err);
  }
}

function ruleTemplate(ruleTitle, ruleDesc, int) {
  let embedOut = new MessageEmbed()
    .setColor(0xccccff)
    .setDescription(
      `**${ruleTitle}** ${ruleDesc}`
    );
  return embedOut;
}

function audioPlayer(src, channelId, guildId, int) {
  var connection = joinVoiceChannel({
    channelId: channelId,
    guildId: guildId,
    adapterCreator: int.guild.voiceAdapterCreator
  });

  // Subscribe the connection to the audio player (will play audio on the voice connection)

  var player = createAudioPlayer();
  var resource = createAudioResource(
    "./audio/glaciers.mp3"
  );
  // resource.volume.setVolume(0.5);
  player.play(resource);

  connection.subscribe(player);

  // player.on(AudioPlayerStatus.Idle, () => {
  //   player.play(resource2);
  // });
}

/**
 * Message event
 * @param message - The message parameter for this event.
 */
client.on("messageCreate", async msg => {
  if (msg.author.bot || !msg.guild || msg.type == "REPLY") return;

  const prefix = client.config.prefix;
  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  let command;

  // If the message.member is uncached, message.member might return null.
  // This prevents that from happening.
  // eslint-disable-next-line require-atomic-updates
  if (!msg.member) msg.member = await msg.guild.fetchMember(msg.author);

  if (!msg.content.startsWith(prefix)) return;

  if (cmd.length === 0) return;
  if (client.commands.has(cmd)) command = client.commands.get(cmd);
  else if (client.aliases.has(cmd))
    command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, msg, args);
});

// Here we login the bot with the porvided token in the config file, as login() returns a Promise we catch the error.
client.login(process.env.DISCORD_TOKEN).catch(console.error());
