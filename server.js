// Make this the new server motd: '"'""'"''""''"'""''''"""''""'"'""'"''""
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ok bi i'm leaving

// Create some constant values
const discord = require('discord.js');
const bot = new discord.Client();
const dotenv = require('dotenv');

//mongoDB connection

/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@discordbotcreatorsstorage-njwdx.azure.mongodb.net/admin?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

*/
// Load from the .env file
var parsed = dotenv.config().parsed;
for (var entry in parsed) {
  process.env[entry] = parsed[entry];
}

const botToken = process.env.BOT_TOKEN;

//keepalive system. DO NOT TOUCH
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
	console.log(Date.now() + " Ping Received");
	response.sendStatus(200);
});

//i just found a keepalive
//the bot will never sleep again
//unless we want it to

//Permissions system. DO NOT TOUCH UNLESS A DEVELOPER OF DEMONITIZED BOT

var config = {
	"admins": [
    "154361670188138496",
		"414602371621060629",
		"450429165200736256",
		"450429165200736256",
		"602699878753107973",
    "337285480410513408",
    "000000000000000000"

	],
	"blocked": [
		"000000000000000000",
		"000000000000000000",
		"000000000000000000",
		"000000000000000000",
		"000000000000000000",
		"000000000000000000",
		"000000000000000000"
	],
	owner: "414602371621060629"
}

// Bot startup
bot.on('ready', () => {
	bot.user.setStatus("online").catch(console.error)
	bot.user.setActivity("everything you say", {
		type: "watching"
	}); ;
}); ;

// Defaults message => msg
bot.on('message', msg => {  
	"Bot online"
  
  //you can do that, I port forward port 
	const prefix = "??";
  const block = [
      ""];
	// Keeps the bot from triggering commands from other bots

	if (msg.author.bot)
		return;
	if (config.blocked.includes(msg.author.id))
		msg.channel.send
    return

		if (msg.guild === null) {
			bot.guilds.get("551182232320999425").channels.get("593657309733978114").send(`${msg.author} said : ${msg.content}`)
		}

	// If a piece of text does not start with the prefix just ignore
	if (!msg.content.startsWith(prefix))
		return;

	// Splits the command from the prefix
	const args = msg.content.slice(prefix.length).trim().split(/ +/g);

	// Turns any upper case letters to lower case
	const command = args.shift().toLowerCase();

	// Command that makes a 50/50 coin flip
	if (command === "ad") {
		const ad = [
			"Welcome to Good Burger home of the Good Burger can I take your order?"];
		let randVal = ad[Math.floor(Math.random() * ad.length)];
		msg.channel.send(randVal);
	}

	if (command === "config") {
		msg.reply(JSON.stringify(config))
		console.log(command === "ban" && config.admins.includes(msg.author.id))
	}



	// Command that acts as an eight ball
	if (command === "8ball") {
		const eightBall = [
			'It is decidedly so',
			'Without a doubt',
			'Yes definitely',
			'You may rely on it',
			'As I see it, yes',
			'Most likely',
			'Outlook good',
			'Yes',
			'Signs point to yes',
			'Reply hazy, try again',
			'Ask again later',
			'Better not tell you now',
			'Cannot predict now',
			'Concentrate and ask again',
			"Don't count on it",
			'My reply is no',
			'My sources say no',
			'Outlook not so good',
			'Very doubtful',
			'befor3 is trap',
			'WHERE ARE YOUR FINGERS?',
			'Why is you breathing?',
			'Charlie, Charlie are you here? Yes.',
			'Charlie, Charlie are you here? No.',
			'Keanu Reeves said yes',
      'NANI?',
      'My daddy says no',                                                                                                                                            // galaxtone was here
      '**BAD TOUCH**'
    ]

		let randVal = eightBall[Math.floor(Math.random() * eightBall.length)];
		msg.channel.send(randVal);
	}

	if (command === "wild") {
		const wild = [
			"https://youtu.be/hlE5eOfwxZo"];
		let randVal = wild[Math.floor(Math.random() * wild.length)];
		msg.channel.send(randVal);
	}

	if (command === "hed") {
		const hed = [
			"HED>EC"];
		let randVal = hed[Math.floor(Math.random() * hed.length)];
		msg.channel.send(randVal);
	}

	if (command === "msg" && config.admins.includes(msg.author.id)) {
		let args = msg.content.split(" ")
			let memberToDm = msg.guild.members.get(args[1])
			let dmMsg = args.splice(0, 2)
			dmMsg = args.join(" ")
			memberToDm.send(`${dmMsg}`)
	}

	if (command === "send" && config.admins.includes(msg.author.id)) {
		let args = msg.content.split(" ")
			let channel = bot.channels.get(args[1])
			let chanMsg = args.splice(0, 2)
			chanMsg = args.join(" ")
			channel.send(chanMsg)
	}
	
	//Logging.
	
	//
// Event Handlers
//

//bot is ready to start working, print status update to console
bot.on('ready', function() {
    console.log('[META][INFO] Connected to Discord API Service');
});

//bot disconnected from Discord
bot.on('disconnected', function() {
    console.log('[META][WARN] Disconnected from Discord API Service. Attempting to reconnected...');
});

//warning from Discord.js
bot.on('warn', function(msg) {
    console.log('[META][WARN] ' + msg);
});

//error from Discord.js
bot.on('error', function(err) {
    console.log('[META][ERROR] ' + err.message);
    process.exit(1);
});

//message received
bot.on('message', function(message) {
    if(message.author.id != bot.user.id) {
        if (message.channel.type == 'text')
            console.log('[' + message.guild.id + '][#' + message.channel.id + '][MSG] ' + message.author.id + ': ' + formatConsoleMessage(message));
        else if (message.channel.type == 'dm')
            message.channel.sendMessage('Beep boop! Sorry, I can\'t respond to direct messages. Try inviting me to your ' +
                'server!\n https://discordapp.com/api/oauth2/authorize?client_id=551194918853410817&permissions=8&redirect_uri=https%3A%2F%2Fdemonitized-bot-website.glitch.me%2Fsuccess.html&response_type=code&scope=identify%20email%20guilds%20bot');
        else if (message.channel.type == 'group')
            message.channel.sendMessage('Beep boop! Sorry, I can\'t log group messages. Try inviting me to your server!\n' +
                'https://discordapp.com/api/oauth2/authorize?client_id=551194918853410817&permissions=8&redirect_uri=https%3A%2F%2Fdemonitized-bot-website.glitch.me%2Fsuccess.html&response_type=code&scope=identify%20email%20guilds%20bot');
    }
});

//message deleted
bot.on('messageDelete', function(message) {

    if(message.channel.type == 'text') {

        //log to console
        console.log('[' + message.guild.id + '][#' + message.channel.id + '][DELMSG] ' + message.author.id + ': ' + formatConsoleMessage(message));

        //post in the guild's log channel
        var log = message.guild.channels.find('logging', CHANNEL);
        if (log != null)
            log.sendMessage('**[Message Deleted]** ' + message.author + ': ' + message.cleanContent);

    }

});

//message update
bot.on('messageUpdate', function(oldMessage, newMessage) {

    if (newMessage.channel.type == 'text' && newMessage.cleanContent != oldMessage.cleanContent) {

        //log to console
        console.log('[' + newMessage.guild.id + '][#' + newMessage.channel.id + '][UPDMSG] ' +
            newMessage.author.id + ':\n\tOLDMSG: ' +
            formatConsoleMessage(oldMessage) + '\n\tNEWMSG: ' + formatConsoleMessage(newMessage));

        //post in the guild's log channel
        var log = newMessage.guild.channels.find('logging', CHANNEL);
        if (log != null)
            log.sendMessage('**[Message Updated]** *' + newMessage.author + '*:\n*Old Message*: ' + oldMessage.cleanContent +
                '\n*New Message*: ' + newMessage.cleanContent);
    }

});

//user has been banned
bot.on('guildBanAdd', function(guild, user) {

    //log to console
    console.log('[' + guild.id + '][BAN] ' + user.id );

    //post in the guild's log channel
    var log = guild.channels.find('logging', CHANNEL);
    if (log != null)
        log.sendMessage('**[Banned]** ' + user);

});

//user has been unbanned
bot.on('guildBanRemove', function(guild, user) {

    //log to console
    console.log('[' + guild.id + '][UNBAN] ' + user.id );

    //post in the guild's log channel
    var log = guild.channels.find('logging', CHANNEL);
    if (log != null)
        log.sendMessage('**[Unbanned]** ' + user);

});

//user has joined a guild
bot.on('guildMemberAdd', function(guild, user) {

    //log to console
    console.log('[' + guild.id + '][JOIN] ' + user.id );

    //post in the guild's log channel
    var log = guild.channels.find('logging', CHANNEL);
    if (log != null) {
        log.sendMessage('**[Joined]** ' + user);
    }

});

//user has joined a guild
bot.on('guildMemberRemove', function(guild, user) {

    //log to console
    console.log('[' + guild.id + '][LEAVE] ' + user.id );

    //post in the guild's log channel
    var log = guild.channels.find('logging', CHANNEL);
    if (log != null)
        log.sendMessage('**[Left]** ' + user);

});

//user in a guild has been updated
bot.on('guildMemberUpdate', function(guild, oldMember, newMember) {

    //declare changes
    var Changes = {
        unknown: 0,
        addedRole: 1,
        removedRole: 2,
        username: 3,
        nickname: 4,
        avatar: 5
    };
    var change = Changes.unknown;

    //check if roles were removed
    var removedRole = '';
    oldMember.roles.every(function(value) {
        if(newMember.roles.find('id', value.id) == null) {
            change = Changes.removedRole;
            removedRole = value.name;
        }
    });

    //check if roles were added
    var addedRole = '';
    newMember.roles.every(function(value) {
        if(oldMember.roles.find('id', value.id) == null) {
            change = Changes.addedRole;
            addedRole = value.name;
        }
    });

    //check if username changed
    if(newMember.user.username != oldMember.user.username)
        change = Changes.username;

    //check if nickname changed
    if(newMember.nickname != oldMember.nickname)
        change = Changes.nickname;

    //check if avatar changed
    if(newMember.user.avatarURL != oldMember.user.avatarURL)
        change = Changes.avatar;

    //log to console
    switch(change) {
        case Changes.unknown:
            console.log('[' + guild.name + '][UPDUSR] ' + newMember.user.username + '#' + newMember.user.discriminator);
            break;
        case Changes.addedRole:
            console.log('[' + guild.name + '][ADDROLE] ' + newMember.user.username +'#' +  newMember.user.discriminator +
                ': ' + addedRole);
            break;
        case Changes.removedRole:
            console.log('[' + guild.name + '][REMROLE] ' + newMember.user.username + '#' + newMember.user.discriminator +
                ': ' + removedRole);
            break;
        case Changes.username:
            console.log('[' + guild.name + '][UPDUSRNM] ' + oldMember.user.username + '#' + oldMember.user.discriminator +
                ' is now ' + newMember.user.username + '#' + newMember.user.discriminator);
            break;
        case Changes.nickname:
            console.log('[' + guild.name + '][UPDUSRNK] ' + newMember.user.username + '#' + newMember.user.discriminator +
                (oldMember.nickname != null ? ' (' + oldMember.nickname + ')' : '') +
                (newMember.nickname != null ? ' is now ' + newMember.nickname : ' no longer has a nickname.'));
            break;
        case Changes.avatar:
            console.log('[' + guild.name + '][UPDAVT] ' + newMember.user.username + '#' + newMember.user.discriminator);
            break;
    }


    //post in the guild's log channel
    var log = guild.channels.find('name', CHANNEL);
    if (log != null) {
        switch(change) {
            case Changes.unknown:
                log.sendMessage('**[User Update]** ' + newMember);
                break;
            case Changes.addedRole:
                log.sendMessage('**[User Role Added]** ' + newMember + ': ' + addedRole);
                break;
            case Changes.removedRole:
                log.sendMessage('**[User Role Removed]** ' + newMember + ': ' + removedRole);
                break;
            case Changes.username:
                log.sendMessage('**[User Username Changed]** ' + newMember + ': Username changed from ' +
                    oldMember.user.username + '#' + oldMember.user.discriminator + ' to ' +
                    newMember.user.username + '#' + newMember.user.discriminator);
                break;
            case Changes.nickname:
                log.sendMessage('**[User Nickname Changed]** ' + newMember + ': ' +
                    (oldMember.nickname != null ? 'Changed nickname from ' + oldMember.nickname +
                        + newMember.nickname : 'Set nickname') + ' to ' +
                    (newMember.nickname != null ? newMember.nickname + '.' : 'original username.'));
                break;
            case Changes.avatar:
                log.sendMessage('**[User Avatar Changed]** ' + newMember);
                break;
        }
    }

});

//
// Startup Sequence
//
console.log('Logger v' + VERSION);
console.log('A bot for Discord that logs moderator actions.\n');
console.log('Copyright © Richard Kriesman 2016. Released under the MIT license.');
console.log('----------------------------------------------');

console.log('[META][INFO] Started Logger v' + VERSION);

bot.login(TOKEN); //log in to discord

function formatConsoleMessage(message) {
    return message.cleanContent.replace(new RegExp('\n', 'g'), '\n\t');
}

	//restart command


	if (command === "die" && config.admins.includes(msg.author.id)) {
		msg.channel.send("ok dying now")
		console.log(msg.author.tag + " just killed the bot")
		bot.destroy()
	}
	

  
//MODERATION SYSTEM
  
  //moderation module toggle
  
  
  
   //moderation commands
  
  	if (command === "ban" && config.admins.includes(msg.author.id)) {
		let args = msg.content.split(" ")
			let toBan = msg.guild.members.get(args[1])
			if (toBan.bannable) {
				msg.channel.send("The user was successfully banned!")
        toBan.send('You were banned from the server: ' + msg.content)
				toBan.ban()
			} else {
				msg.channel.send("ERROR: Invalid permission")
			}
	}
  
  	if (command === "kick" && config.admins.includes(msg.author.id)) {
		let args = msg.content.split(" ")
			let toKick = msg.guild.members.get(args[1])
			if (toKick.kickable) {
				msg.channel.send("The user was successfully kicked")
        toKick.send('You were kicked from the server: ' + msg.content)
				toKick.kick()
			} else {
				msg.channel.send("ERROR: Invalid permission")
			}
	}
  
  //HED CODE
  
	bot.on("ready", () => {
  const channel = bot.channels.get("603761576683634713");
  if (!channel) return console.error("The channel does not exist!");
  channel.join().then(connection => {
    // Yay, it worked!
    console.log("Successfully connected.");
  }).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
  });
});



bot.on("guildMemberRemove", function(member) {   
  const hedGuild = bot.guilds.get("565968409452478464");
  const resignChannel = hedGuild.channels.get("581106092948586496");
  const resignLogs = hedGuild.channels.get("607282549089370122");
  const joins = hedGuild.channels.get("566333597548675090");
  const name = member.user.tag;
  var msgUrl;
  var resignMessage = false;
  resignChannel.fetchMessages().then(messages => {
    messages.forEach(message => {
      if (message.author.id == member.id) {
        resignMessage = true;
        msgUrl = message.url;
      }
    });
  });
  setTimeout(function() {
    if (resignMessage == true) {
      resignLogs.send("`" + name + "` : has left us properly : " + msgUrl);
      joins.send("`" + name + "` got bored of cooking food.")
      resignMessage = false;
    } else {
      resignLogs.send("`" + name + "` : has left without submitting a resignation request");
      joins.send("`" + name + "` got bored of cooking food.")
    }
  }, 5000);
;

  /* disabled codes *(/
  

bot.on("guildMemberAdd", function(member) { 
  setTimeout(function() {
      joins.send("`" + name + "` : has joined the server!");
    }         
    , 5000)
}});
                    } 
   
/* disabled codes) */


         // End of bot.on('message')

// Since there is no actual preview for the bot (unless you add your own website code)
// It will be an error or continious refresh loop, consider this part of the code that keeps the bot alive
// Though you will still need an uptime robot in order to truely keep the bot alive
// This is NOT my code, the code is directly from this page: https://anidiotsguide_old.git
bot.login(botToken); })})
