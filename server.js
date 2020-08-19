const { Client, MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core");
const events = require('events');
const eventEmitter = new events.EventEmitter();
const snekfetch = require('snekfetch');
const client = new Client({ shardCount: 1 });
const prefix = "??";
const fs = require("fs");
const request = require('request');
require('dotenv').config();
const loginBot = process.env.SECRET;
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var broadcast = client.voice.createBroadcast();
const blacklistDB = require('./db.js');
const ytsr = require("ytsr");
const arrays = require('./arrays.json');
const ytpl = require('ytpl');
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
const { setInterval } = require('timers');

client.on('debug', info => {
	console.log(info);
	return
});

client.on('warn', err => {
	console.warn(err);
	return
})

client.on('error', err => {
	console.warn(err);
	return
})


client.on("ready", () => {
	var date = new Date()
	var embed = new MessageEmbed()
		.setColor(0x0b01105)
		.setTitle('BOT STARTUP')
		.setDescription(`The bot has started with the following stats`)
		.addField('GUILDS', client.guilds.cache.size, true)
		.addField('CHANNELS', client.channels.cache.size, true)
		.addField('MEMBERS', client.users.cache.size, true)
		.setTimestamp(date)

	client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send(embed)
	// console.warn("uncomment startup message")

	console.log(`Logged in as ${client.user.tag} at ${new Date}`);
	console.log(`Currently serving ${client.guilds.cache.size} guilds, with a total of ${client.channels.cache.size} channels, with ${client.users.cache.size} total users.`);
/*
	const responses = [
		"Version 1.7.0",
		`With ${client.users.cache.size} awesome people!`,
		"with my face mask"
	];
	function randomizer() {
		let number = Math.floor((Math.random() * 3) + 0);
		let GameActivity = responses[number];
		client.user.setPresence({ activity: { name: `${GameActivity}`, type: 'PLAYING' }, status: 'dnd' });
	};

	setInterval(randomizer, 10000);
*/
	
		client.user.setPresence({ activity: { name: "FELIX WHY DID YOU ADD ME!?", type: 'PLAYING' }, status: 'dnd' });

	var options = {
		method: 'POST',
		url: 'https://discordbotlist.com/api/v1/bots/551194918853410817/stats',
		headers:
		{
			'cache-control': 'no-cache',
			'content-type': 'application/x-www-form-urlencoded',
			authorization: process.env.UPDATE_TOKEN
		},
		form: { guilds: client.guilds.cache.size, users: client.users.cache.size }
	};

	request(options, function (error, response, body) {
		if (error) console.warn(new Error(error));
		console.log(response);
		console.log(body);
	});


	//client.guilds.cache.fetch("guild").members.cache.fetch("user").ban({reason:""})
	//client.guilds.cache.fetch("guild").members.cache.fetch("user").kick({reason:""})
});

setInterval(() => {
	var options = {
		method: 'POST',
		url: 'https://discordbotlist.com/api/v1/bots/551194918853410817/stats',
		headers:
		{
			'cache-control': 'no-cache',
			'content-type': 'application/x-www-form-urlencoded',
			authorization: process.env.UPDATE_TOKEN
		},
		form: { guilds: client.guilds.cache.size, users: client.users.cache.size }
	};

	request(options, function (error, response, body) {
		if (error) console.warn(new Error(error));
		console.log(response);
		console.log(body);
	});

}, 900000);

client.on("message", async msg => {

	if (!msg.guild) return;
	if (!msg.content.startsWith(prefix)) return;
	if (msg.author.bot) return;
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

	if (msg.content.startsWith("<@551194918853410817>")) {
		msg.channel.send(`${msg.author} My prefix is ${prefix}. For help, please type ${prefix}help`);
	}

	if (command === "k") {
		msg.channel.send('<:GWk:742579616891273318>');
	}

	if (command === "play") {
		let args = msg.content.split(`${prefix}play`);
		console.log('PLAY COMMAND USED');
		let query = args[1];
		if (!msg.member.voice.channel) {
			msg.channel.send(`${msg.author} You have to join a voice channel to use music commands.`);
			return;
		}
		if (ytdl.validateURL(query)) {
			console.log('URL VALID');
			msg.member.voice.channel
				.join()
				.then(connection => {
					const stream = ytdl(query, { filter: "audioonly" });
					const dispatcher = connection.play(stream);

					ytdl.getInfo(query).then(data => {
						var videoInfo = data.videoDetails.title
						var videoURL = data.videoDetails.videoId
						var videoTumbnail = data.videoDetails.thumbnail.thumbnails[0].url

						var embed = new MessageEmbed()
							.setTitle('YouTube Player')
							.setDescription(`Now playing: ${videoInfo}`)
							.setThumbnail(videoTumbnail)
							.setURL(`https://youtube.com/watch?v=${videoURL}`)
							.setTimestamp(new Date)
						msg.channel.send(embed)
					})
				})
		} else if (!ytdl.validateURL(query)) {
			console.log('URL NOT VALID')
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

						var newLink = searchResults.items[0].link;
						msg.member.voice.channel
							.join()
							.then(connection => {

								const stream = ytdl(newLink, { filter: "audioonly" });
								const dispatcher = connection.play(stream);

								ytdl.getInfo(newLink).then(data => {
									var videoInfo = data.videoDetails.title
									var videoURL = data.videoDetails.videoId
									var videoTumbnail = data.videoDetails.thumbnail.thumbnails[0].url

									var embed = new MessageEmbed()
										.setTitle('YouTube Player')
										.setDescription(`Now playing: ${videoInfo}`)
										.setURL(`https://youtube.com/watch?v=${videoURL}`)
										.setThumbnail(videoTumbnail)
										.setTimestamp(new Date)
									msg.channel.send(embed)
								})
							})
					})
				});
			});
		} else {
			console.log('UNKNOWN ERROR')
			msg.channel.send('An error occurred. Please try again.');
			return;
		}
	}

	if (command === "leave" || command === "dc" || command === "disconnect") {
		if (msg.author.voiceChannel) {
			msg.author.voiceChannel.leave();
			msg.channel.send('Left the voice channel');
		} else {
			msg.channel.send('Could not leave voice channel');
			return;
		}
	}


	if (command === "membercount" || command === "members") {
		msg.channel.send(`Current member count: ${msg.guild.memberCount}`)
	}

	if (command === "stats") {
		var date = new Date()
		var embed = new MessageEmbed()
			.setColor(0x0b01105)
			.setTitle('BOT STATS')
			.setDescription(`The bot currently has the following stats`)
			.addField('TOTAL GUILDS', client.guilds.cache.size, true)
			.addField('TOTAL CHANNELS', client.channels.cache.size, true)
			.addField('TOTAL MEMBERS', client.users.cache.size, true)
			.setTimestamp(date)
		msg.channel.send(embed)
	}

	if (command === "help") {
		const embed = new MessageEmbed()
			.setTitle('COMMANDS')
			.setColor(0xff0000)
			.addField('??play', "Used to play a song from youtube.", false)
			.addField('??meme', "Used to get a meme from reddit. [BROKEN CURRENTLY]", false)
			.addField('??forcestop', "Used to crash the bot in case it breaks", false)
			.addField('??stats', "Displays bot status", false)
			.addField('??membercount', "Displays the amount of members in your current server", false)
		msg.channel.send(embed);
	}
	if (command === "forcestop" && config.owner.includes(msg.author.id)) {
		msg.channel.send("If the bot breaks it's not my problem")
			.then(() => {
				client.destroy();
			})
	}
	else if (command === "forcestop" && !config.owner.includes(msg.author.id)) {
		msg.channel.send("Permission denied");
		return;
	}

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
			let channel = client.channels.cache.fetch(args[1]);
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
		msg.guild.members.cache.fetch(`${member}`).ban({ reason: `${BanReason}` });

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
		msg.guild.members.cache.fetch(`${member}`).kick({ reason: `${KickReason}` })
	} else if (command === "kick" && !config.admins.includes(msg.author.id)) {
		msg.channel.send("Permission denied")
		return
	}

	if (command === "pl") {
		return

		// command not yet stable 
		const streamOptions = { seek: 0, volume: 1 };
		let args = msg.content.split(`${prefix}pl`);
		let plist = args[1];

		ytpl(`${plist}`, function (err, playlist) {
			if (err) {
				console.warn(err);
				msg.channel.send('An error occurred');
				return;
			}

			var nextPlay = 0

			var plistLength = playlist.total_items;
			var query = playlist.items[nextPlay].id;

			playlistNext()
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
										nextPlay + 1
										playlistNext()
									})
								}).catch(console.error);
						});
					});
				});
			}
		})

	}

	if (command === 'meme') {
			var options = {
				method: 'GET',
				url: 'https://www.reddit.com/r/dankmemes.json?sort=top&t=week'
			};
		
			request(options, function (error, response, body) {
				if (error) console.warn(new Error(error));
				console.log(response);
				console.log(body);
			});
		const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
		if (!allowed.length) return msg.channel.send('It seems we are out of fresh memes!, Try again later.');
		const randomnumber = Math.floor(Math.random() * allowed.length)
		var embed = new MessageEmbed()
			.setColor(0x00A2E8)
			.setTitle(allowed[randomnumber].data.title)
			.setDescription("Posted by: " + allowed[randomnumber].data.author)
			.setImage(allowed[randomnumber].data.url)
			.addField("Other info:", "Up votes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
			.setFooter("Memes provided by r/dankmemes")
		msg.channel.send(embed)
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

	function shutdown() {
		client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send("Bot is now going offline. ")
		client.destroy()
	}

	if (command === "shutdown" && config.master.includes(msg.author.id)) {
		msg.channel.send("Shutting down.")
		client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send('Bot shutting down');
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
		client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send('Bot is now going offline.');
		client.destroy()
	}

	if (command === "restart" && config.master.includes(msg.author.id)) {
		let args = msg.content.split(" ");
		const restartTime = args[1];
		msg.channel.send("Restarting")
		client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send('Bot restarting...');
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
			client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send('EVAL COMMAND USED');
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

client.on("guildCreate", srv => {
	client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send(`Bot added to new Guild. Guild id: ${srv}`);
	guild.id.cache.fetch();
});

//voice system

client.on("message", async m => {
	m.isDM = m.guild ? false : true;
	m.author === client.user ? m.guild = null : undefined;
	if (m.guild === null) {
		client.guilds
		.cache.get("618236743560462356")
		.channels.cache.get("704045958601637918")
		.send(`${m.author} AKA ${m.author.id} said : ${m.content} `);
	}
});
client.login(loginBot);
