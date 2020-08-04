const { Client, MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core");
const client = new Client({ shardCount: 1 });
const prefix = "??";
const fs = require("fs");
require('dotenv').config();
const loginBot = process.env.SECRET;
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var broadcast = client.voice.createBroadcast();
const blacklistDB = require('./db.js');
const ytsr = require("ytsr");
const arrays = require('./arrays.json');
const ytpl = require('ytpl')
const config = {
	"blacklisted": [
		"409554505500459030",
		""
	],
	"admins": [
		"414602371621060629",
		"628298193922424857",
		"218180379088125955",
		"332293963291557889",
		"473986240832602133"
	  ],
	  "owner": [
		"414602371621060629", 
		"628298193922424857",
		"218180379088125955",
		"473986240832602133"
	  ],
	  "master": [
		  "414602371621060629",
		  "218180379088125955", 
		  "628298193922424857",
		  "473986240832602133"
	  ]
}
const { cpuUsage } = require('process');
const { json } = require('express');

client.on('debug', info => {
	console.log(info);
});

client.on('warn', err => {
	console.warn(err);
})

client.on('error', err => {
	console.warn(err);
})


client.on("ready", () => {

	// client.guilds.cache.fetch("618236743560462356").channels.cache.fetch("647527428784390164").send("Starting Windows 3.1")
	// console.warn("uncomment startup message")
	
	console.log(`Logged in as ${client.user.tag}`);

	client.user.setPresence({ activity: { name: 'The music command is fixed!', type: 'PLAYING' }, status: 'dnd' }) 

 //client.guilds.cache.fetch("guild").members.cache.fetch("user").ban({reason:""})
 //client.guilds.cache.fetch("guild").members.cache.fetch("user").kick({reason:""})
	//  console.log(client.guilds)
	 

});


// client.on("message", async msg => {

// 	if (!msg.guild) return;

// 	const forbiddenWords = arrays.forbiddenWords
	
// 	let foundInText = false;
// 	for (var i in forbiddenWords) {
// 		if (msg.content.toLowerCase().includes(forbiddenWords[i].toLowerCase())) foundInText = true; 
// 	}

// 	if (foundInText) {
// 		msg.delete();
// 		msg.channel.send(`${msg.author} was **BLACKLISTED** for: '[AUTOMOD] Using derogatory language' `);
// 		var user = msg.author.id;
// 		const reason = "[AUTOMOD] Using derogatory language";
// 		blacklistDB.autoBlackList(user, reason)
// 	}
// });



client.on("message", msg => {
//Check Blacklist to see if user can use bot


	// blacklistDB.checkBlackList(msg.author.id, (err, row) => {
	// 	console.log(row)
	// 	if(row){
	// 		msg.channel.send(`It appears as though you have been blacklisted from using the bot. To appeal please contact the bot owner.`);
	// 		console.log(`Blacklisted user ${msg.author.id} tried to use command`);
	// 	}
	// })


	//DM command DLC sold seperately

  if (!msg.guild) return;
  if (!msg.content.startsWith(prefix)) return;
  if (msg.author.bot) return
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!prefixRegex.test(msg.content)) return;

  const matchedPrefix = msg.content.match(prefixRegex);
  const args = msg.content
    .slice(matchedPrefix.length)
    .trim()
    .split(/ +/);
  const command = args.shift().toLowerCase();


  if (command === "membercount" || command === "members") {
	  msg.channel.send(`Current member count: ${msg.guild.memberCount}`)
  }

  if (command === "stats") {
    return msg.channel.send(`Server count: ${client.guilds.cache.size}`);
  }

  if (command === "join") {
    let channel = client.channels.cache.fetch("632286760495480883");
    channel.join();
  }
  
  if (command === "help") {
	const embed = new MessageEmbed()
	.setTitle('HELP DLC Not found')
	.setColor(0xff0000)
	.setDescription('Please purchase the HELP DLC to get help');
	  msg.channel.send(embed);
    console.log("Someone used the help command!");
  }

  if (command === "spam" && config.owner.includes(msg.author.id)) {
    msg.delete();
    msg.channel.send(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );
  } else if (command === "spam" && !config.owner.includes(msg.author.id)) {
	  msg.channel.send("Permission denied")
	  return
  }

  if (command === "forcestop" && config.owner.includes(msg.author.id)) {
	msg.channel.send("If the bot breaks it's not my problem");
	client.destroy();
  }
  else if (command === "forcestop" && !config.owner.includes(msg.author.id)) {
	msg.channel.send("Permission denied");
	return;
}

if (command === "errors") {
	const embed = new MessageEmbed()
	.setTitle('You want to know what the latest errors were?')
	.setDescription('The only error here is you')
	.setFooter('After all you did ask me to do something')
	.setColor(0x0b01105);
	msg.channel.send(embed)
}


// 	var henzoidArgs = msg.content.split(' ');
// 	henzoidArg = msg.content.split('?')
// 	var henzoidQuestion = henzoidArgs.splice(0, 1);
// 	henzoidQuestion = henzoidArgs.join(" ");
// 	var henzoid = henzoidArgs.shift().toLowerCase();
// 	 henzoid = includes('is henzoid a cow');

// if (command === "8ball" && henzoid) {
// 	var embed = new MessageEmbed()
//    .setTitle('8 Ball')
//    .setDescription(`${msg.author} The magic 8 ball has spoken`)
//    .addField('Question', `${henzoidQuestion}`, true)
//    .addField('Response', "Yes. Henzoid is a cow.", true)
//    .setFooter('Command created because I ran out of ideas')
//    .setColor(0x0b01105);

//    msg.channel.send(embed);
// } else if (command === "8ball" && !henzoid) {
// 	let args = msg.content.split(' ');
// 	let question = args.splice(0, 1);
// 	question = args.join(" ");
// 	const responses = [
// 		'You can count on it.',
// 		'No.',
// 		'Yes.',
// 		'My sources say no.',
// 		'Reply foggy. Try again later.',
// 		'Maybe.',
// 		"IDK ask google it. I'm not like an 8ball or something.",
// 		'THE DISCORD GODS SAY YES.'
// 	];

// 	function randomizer() {	
// 		let number = Math.floor((Math.random() * 7) + 0);
// 	   return responses[number];
// 	};

//    const replyToCmd = randomizer();

//    var embed = new MessageEmbed()
//    .setTitle('8 Ball')
//    .setDescription(`${msg.author} The magic 8 ball has spoken`)
//    .addField('Question', `${question}`, true)
//    .addField('Response', `${replyToCmd}`, true)
//    .setFooter('Command created because I ran out of ideas')
//    .setColor(0x0b01105);

//    msg.channel.send(embed);

// }

  try {
    if (command === "msg" && config.admins.includes(msg.author.id)) {
		msg.delete()
    	let args = msg.content.split(" ");
    	let memberToDm = client.users.cache.fetch(args[1]);
      	let dmMsg = args.splice(0, 2);
      	dmMsg = args.join(" ");
      	memberToDm.send(`${dmMsg}`);
      	console.log("msg command used");
	}
	else if (command === "msg" && !config.admins.includes(msg.author.id)) {
		msg.channel.send("Permission denied")
		return
	}
  } catch (error) {
    console.log(error);
  }

  //Audit log feature
  try {
    if (command === "send" && config.admins.includes(msg.author.id)) {
      let args = msg.content.split(" ");
      let channel = client.channels.fetch(args[1]);
      let chanMsg = args.splice(0, 2);
      chanMsg = args.join(" ");
      channel.send(chanMsg);
      console.log("Send command used");
      //Audit Log feature?
	}
	else if (command === "send" && !config.admins.includes(msg.author.id)) {
		msg.channel.send("Permission denied")
		return
	}
  } catch (error) {
    console.log(error);
  }

  if (command === "blacklist-add" && config.master.includes(msg.author.id)) {
	let args = msg.content.split(" ");
	let user = args[1];
	let reason = args.splice(0, 2);
	reason = args.join(" ")
// last three lines are totally not reused from the ??send command
	blacklistDB.autoBlackList(user, reason);
	msg.channel.send(`Blacklisted user: ${user} for reason: ${reason}`);
  } else if (command === "blacklist-add" ** !config.master.includes(msg.author.id)) {
	  msg.channel.send("Permission denied");
	  return;
  }

  if (command === "blacklist-remove" && config.master.includes(msg.author.id)) {
	let args = msg.content.split(" ");
	let user = args[1];
  } else if (command === "blacklist-remove" && !config.master.includes(msg.author.id)) {
	  msg.channel.send("Permission denied");
	  return;
  }

  if (command === "website") {
    msg.channel.send("https://demonitized-bot-website.glitch.me");
  }

  // Command template
  
  
  /*
  if (command === "") {
  
  }
  
  if (command === "") {
  
  }
  
  if (command === "") {
  
  }
  
  
  
*/





  if (command === "disconnect") {
	client.leaveVoiceChannel(msg.author.voiceChannel)
  }
  
  if (command === "warn" && config.master.includes(msg.author.id)) {
	msg.delete()
	let args = msg.content.split(" ");
	let punishInfo = args.splice(0, 3);
	// punishInfo = args.join(" ");
	let member = args[1]
	let warnReason = args[2]
	msg.channel.send(`Warned <@${member}> for: ${warnReason}.`)
	let userMsg = `You were warned on ${msg.guild.name} for: ${warnReason}. This punishment was executed by ${msg.author.id}`;
	client.users.cache.fetch(`${member}`).send(`${userMsg}`);
  } else if (command === "warn" && !config.master.includes(msg.author.id)) {
	msg.channel.send("Permission denied")
	return
}

  if (command === "ban" && config.admins.includes(msg.author.id)) {
    // const userGuild = msg.guild.cache.fetch
	let args = msg.content.split(" ");
	let chanMsg = args.splice(0, 2);
	chanMsg = args.join(" ");
    const member = args[1];
    const BanReason = args[2];
	msg.guild.members.cache.fetch(`${member}`).ban({reason:`${BanReason}`}); 

  } else if (command === "ban" && !config.admins.includes(msg.author.id)) {
	msg.channel.send("Permission denied")
	return
}

  // if (command === "unban") {
  //   const userGuild = msg.guild.cache.fetch
  //   let args = msg.content.split(" ");
  //   const member = args[1];
  //   const UnbanReason = args[2]
  //    guild.members.unban(`${member}`, {reason:`${UnbanReason}`})
  // }

  if (command === "kick" && config.admins.includes(msg.author.id)) {
    // const userGuild = msg.guild.cache.fetch
    let args = msg.content.split(" ");
    const member = args[1];
    const KickReason = args[2]
     msg.guild.members.cache.fetch(`${member}`).kick({reason:`${KickReason}`})
  } else if (command === "kick" && !config.admins.includes(msg.author.id)) {
	msg.channel.send("Permission denied")
	return
}

  // YouTube system

  if (command === "play" || command === "p") {
  	// Play streams using ytdl-core

	// ytlink = args.splice(0, 1);
    const streamOptions = { seek: 0, volume: 1 };
	let args = msg.content.split(" ");
	var ytlink = args[1];


	
    msg.member.voice.channel
      .join()
      .then(connection => {



        const stream = ytdl(ytlink, { filter: "audioonly" });
		const dispatcher = connection.play(stream);
      })
	  .catch(console.error);

	}

	if (command === "search") {
		const streamOptions = { seek: 0, volume: 1 };
		let args = msg.content.split(`${prefix}search`);
		let query = args[1];


	let filter;

	ytsr.getFilters(`${query}`, function(err, filters) {
		if(err) throw err;
		filter = filters.get('Type').find(o => o.name === 'Video');
		ytsr.getFilters(filter.ref, function(err, filters) {
		  if(err) throw err;
		  filter = filters.get('Duration').find(o => o.name.startsWith('Short'));
		  var options = {
			limit: 5,
			nextpageRef: filter.ref,
		  }
		  ytsr(`${query}`, options, function(err, searchResults) {

			if(err) {
				console.warn(err);
				msg.channel.send(`An unexpected error has occurred. ${err}`);
				return
			}

		var ytlink = searchResults.items[0].link;
		


			
		var queue = {
			songs: {
				nowPlaying: ``,
				nextSong: ``,
				third: ``,
				fourth: ``,
				fifth: ``,
				sixth: ``
			}
		}

		if (queue.songs.nowPlaying === ``) {
			queue.songs.nowPlaying = `${ytlink}`;
		} else if (queue.songs.nextSong === ``) {
			queue.songs.nextSong = `${ytlink}`;
		} else if (queue.songs.third === ``) {
			queue.songs.third = `${ytlink}`;
		} else if (queue.songs.fourth === ``) {
			queue.songs.fifth = `${ytlink}`;
		} else if (queue.songs.fifth === ``) {
			queue.songs.fifth = `${ytlink}`;
		} else if (queue.songs.sixth === ``) {
			queue.songs.sixth = `${ytlink}`
		} else {
			msg.channel.send('There is no more room to add more songs :(')
		}

  
			msg.member.voice.channel
			.join()
			.then(connection => {
	  
			  const stream = ytdl(ytlink, { filter: "audioonly" });
			  const dispatcher = connection.play(stream);
			  var songTitle = searchResults.items[0].title;
			  msg.channel.send(`Now playing: ${songTitle}`);

			  dispatcher.on('finish', () => {
				  queue.songs.nowPlaying = queue.songs.nextSong;
				  queue.songs.nextSong = queue.songs.third;
				  queue.songs.third = queue.songs.fourth;
				  queue.songs.fourth = queue.songs.fifth;
				  queue.songs.fifth = queue.songs.sixth;
				  queue.songs.sixth = ``;
				  stream;
			  }).catch(console.error)
			})
			.catch(console.error);
		  });
		});
	  });
	}
	
	if (command === "playlist") {
		const streamOptions = { seek: 0, volume: 1 };
		let args = msg.content.split(`${prefix}playlist`);
		let plist = args[1];

		ytpl(`${plist}`, function(err, playlist) {
			if (err) {
				console.warn(err);
				msg.channel.send('An error occurred');
				return;
			}

			var nextPlay = 0
		
			var plistLength = playlist.total_items;
			var query = playlist.items[nextPlay].id;


		function playlistNext() {





			let filter;


			ytsr.getFilters(`${query}`, function (err, filters) {
			if (err) throw err;
			filter = filters.get('Type').find(o => o.name === 'Video');
			ytsr.getFilters(filter.ref, function (err, filters) {
				if (err) throw err;
				filter = filters.get('Duration').find(o => o.name.startsWith('Short'));
				var options = {
					limit: 5,
					nextpageRef: filter.ref,
				}
				ytsr(`${query}`, options, function (err, searchResults) {

					if (err) {
						console.warn(err);
						msg.channel.send(`An unexpected error has occurred. ${err}`);
						return
					}

					var ytlink = searchResults.items[0].link;

					msg.member.voice.channel
						.join()
						.then(connection => {

							const stream = ytdl(ytlink, { filter: "audioonly" });
							const dispatcher = connection.play(stream);
							var songTitle = searchResults.items[0].title;
							msg.channel.send(`Now playing: ${songTitle}`);

							  dispatcher.on('finish', () => {
								 nextPlay = nextPlay + 1;
								 playlistNext()
							  }).catch(console.error)
						})
								.catch(console.error);
					});
				});
			});
		}

		playlistNext()
	})

}

  if (command === "swick") {
	msg.member.voiceChannel
	.join()
	.then(connection => {
	  const stream = ytdl('zo55RLv8ioI', { filter: "audioonly" });
	  const dispatcher = connection.play(stream);
	})
	.catch(console.error);
  }

  


	if (command === "wegothim" || command === "we-got-him") {
		const embed = new MessageEmbed()
		.setTitle('Ladies and gentelmen,')
		.setColor(0xff0000)
		.setDescription('We got him')
		.setImage('https://media1.tenor.com/images/fe4d5ba31a04ef87422b6537377f89a2/tenor.gif')
		.setURL('https://www.youtube.com/watch?v=6okxuiiHx2w')
		  msg.channel.send(embed);
	  }

	  if (command === "schaffer-plist" && config.master.includes(msg.author.id)) {
		const streamOptions = { seek: 0, volume: 1 };
		broadcast = client.createVoiceBroadcast();
		msg.member.voiceChannel
		  .join()
		  .then(connection => {
			const stream = ytdl("https://www.youtube.com/watch?v=HMnDnEaqkTk", { filter: "audioonly" });
			broadcast.playStream(stream);
			const dispatcher = connection.play(stream);
		  })
		  .catch(console.error);
	  }

	if (command === "schaffer" && config.master.includes(msg.author.id)) {
	msg.delete()
	const ytlinkSchaffer = [
		"https://www.youtube.com/watch?v=FNxgYot0S6Q",
		"https://www.youtube.com/watch?v=IsyCo16pER8",
		"https://www.youtube.com/watch?v=2E8K3rxllh8",
		"https://www.youtube.com/watch?v=1hsgfk6e2tQ",
		"https://www.youtube.com/watch?v=fffQjrTCkLI"
	]

	const streamLink = randomizer()

	function randomizer() {	
	 	let number = Math.floor((Math.random() * 5) + 0)
		return ytlinkSchaffer[number]
	}
	randomizer()
	const streamOptions = { seek: 0, volume: 1 };
	broadcast = client.createVoiceBroadcast();
	msg.member.voiceChannel
	  .join()
	  .then(connection => {
		const stream = ytdl(`${streamLink}`, { filter: "audioonly" });
		broadcast.playStream(stream);
		const dispatcher = connection.play(stream);
	  })
	  .catch(console.error);
  }
  else if (command === "schaffer" && !config.master.includes(msg.author.id)) {
	  msg.delete();
	  msg.channel.send("YOU DO NOT WANT TO KNOW WHAT THIS DOES!!!")
	  .then.setTimeout(deleteMsg, 3000)

	  function deleteMsg() {
		msg.delete()
	  }
	 
	  return;

  }

  


  function shutdown() {
	client.guilds.cache.fetch("618236743560462356").channels.cache.fetch("647527428784390164").send("Bot is going offline. ")
	client.destroy()
  }

  if (command === "shutdown" && config.master.includes(msg.author.id)) {
	  msg.channel.send("Shutting down.")
	  client.guilds.cache.fetch("618236743560462356").channels.cache.fetch("647527428784390164").send("Bot shutting down")
	  client.user.setActivity("Shutting down...", {
		type: "PLAYING",
		url: "https://twitch.tv/demonitized_boi"
	  });
	  client.user.setStatus("idle");
	  setTimeout(shutdown, 30000) 
  } else if (command === "shutdown" && !config.master.includes(msg.author.id)) {
	  msg.channel.send("Permission denied")
	  return
  }

  function restart() {
	client.guilds.cache.fetch("618236743560462356").channels.cache.fetch("647527428784390164").send("Bot is going offline. ")
	client.destroy()
  }

  if (command === "restart" && config.master.includes(msg.author.id)) {
	let args = msg.content.split(" ");
    const restartTime = args[1];
	  msg.channel.send("Restarting")
	  client.guilds.cache.fetch("618236743560462356").channels.cache.fetch("647527428784390164").send("Bot restarting")
	  client.user.setActivity("restarting...", {
		type: "PLAYING",
		url: "https://twitch.tv/demonitized_boi"
	  });
	  client.user.setStatus("idle");
	  setTimeout(restart, restartTime) 
  } else if (command === "restart" && !config.master.includes(msg.author.id)) {
	  msg.channel.send("Permission denied");
	  return;
  }

  if (command === "porn" || command === "nsfw") {
	  msg.channel.send(`Hey ${msg.author}, we don't do that here.`);
  }


  /*
  const ytsr = require('ytsr');

  let filter;

ytsr.cache.fetchFilters('github', function(err, filters) {
  if(err) throw err;
	filter = filters.cache.fetch('Type').find(o => o.name === 'Video');
  ytsr.cache.fetchFilters(filter.ref, function(err, filters) {
    if(err) throw err;
  	filter = filters.cache.fetch('Duration').find(o => o.name.startsWith('Short'));
  	var options = {
  		limit: 5,
  		nextpageRef: filter.ref,
  	}
  	ytsr(null, options, function(searchResults) {
  		if(err) throw err;
  		dosth(searchResults);
  	});
	});
});



if (command === "search") {

const options = console.log("E")

let args = msg.content.split(" ");
const ytsearch = args[1];
ytsr(`${ytsearch}`, options, getContent(result))

function getContent(result) {
  
	const embed = new MessageEmbed()
      .setTitle('These are the results I found')
      .setColor(red)
	  .setDescription(`${result}`);
	  msg.channel.send(`${embed}`)

}
// const ytsrResult = ytsr(ytsearch)

const streamOptions = { seek: 0, volume: 1 };
    broadcast = client.createVoiceBroadcast();
    msg.member.voiceChannel
      .join()
      .then(connection => {
        const stream = ytdl(`${result}`, { filter: "audioonly" });
        broadcast.playStream(stream);
        const dispatcher = connection.play(stream);
    }
	  )}

	  // End YouTube system
*/

client.on("guildCreate", guild => {
	client.guilds.cache.fetch("618236743560462356").channels.cache.fetch("647527428784390164").send(`Bot added to new guild. ID: ${guild.id.cache.fetch}`);
	guild.id.cache.fetch();
})
  
  client.on("message", msg => {
    const args = msg.content.split(" ").slice(1);

    const clean = text => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    };
    if (
      msg.content.startsWith(prefix + "eval") &&
      config.master.includes(msg.author.id)
    ) {
		client.guilds.cache.fetch("618236743560462356").channels.cache.fetch("647527428784390164").send("EVAL command used")
      try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);

        msg.channel.send(clean(evaled), { code: "xl" });
      } catch (err) {
        console.log(err);
        msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    }
  });
  
});

//voice system

client.on('message', async msg => {
	// Voice only works in guilds, if the message does not come from a guild,
	// we ignore it
	if (!msg.content.startsWith(prefix)) return;
	if (msg.author.bot) return
	const prefixRegex = new RegExp(
	  `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
	);
	if (!prefixRegex.test(msg.content)) return;
  
	const [, matchedPrefix] = msg.content.match(prefixRegex);
	const args = msg.content
	  .slice(matchedPrefix.length)
	  .trim()
	  .split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'meme') {
		try {
			const snekfetch = require('snekfetch');
			const { body } = await snekfetch
			.cache.fetch('https://www.reddit.com/r/dankmemes.json?sort=top&t=week')
				.query({ limit: 800 });
			const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
			if (!allowed.length) return msg.channel.send('It seems we are out of fresh memes!, Try again later.');
			const randomnumber = Math.floor(Math.random() * allowed.length)
			const embed = new MessageEmbed()
			.setColor(0x00A2E8)
			.setTitle(allowed[randomnumber].data.title)
			.setDescription("Posted by: " + allowed[randomnumber].data.author)
			.setImage(allowed[randomnumber].data.url)
			.addField("Other info:", "Up votes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
			.setFooter("Memes provided by r/dankmemes")
			msg.channel.send(embed)
		} catch (err) {
			return console.log(err);
		}
	}
  });


client.on("message", async m => {
  m.isDM = m.guild ? false : true;
  m.author === client.user ? m.guild = null : undefined;
  if (m.guild === null) {
    client.guilds
      .cache.fetch("618236743560462356")
      .channels.cache.fetch("647527428784390164")
      .send(`${m.author} AKA ${m.author.id} said : ${m.content} `);
  }
});
client.login(loginBot);

