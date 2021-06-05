const {
	Client,
	MessageEmbed
} = require('discord.js');
const ytdl = require("ytdl-core");
const events = require('events');
const eventEmitter = new events.EventEmitter();
const snekfetch = require('snekfetch');
const client = new Client({
	shardCount: 1,
	messageCacheLifetime: 600,
	messageSweepInterval: 43200
});

const prefix = "??";
const fs = require("fs");
const request = require('request');
require('dotenv').config();
const loginBot = process.env.SECRET;
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var broadcast = client.voice.createBroadcast();
const blacklistDB = require('./sql.js');
const ytsr = require("ytsr");
const arrays = require('./arrays.json');
const packageJson = require('./package.json');
const ytpl = require('ytpl');
var dispatcher;
const {
	FFMPEG,
	ffmpeg
} = require('ffmpeg');
const config = require('./users.json');
const {
	cpuUsage
} = require('process');
const {
	json,
	express
} = require('express');
const {
	setInterval
} = require('timers');

var videoDuration = {
	min: 0,
	sec: 0
};


client.on('debug', info => {
	console.log(info);
	return;
});

client.on('warn', err => {
	console.warn(err);
	return;
});

client.on('error', err => {
	console.warn(err);
	return;
});




client.on("ready", () => {
	var date = new Date()
	var embed = new MessageEmbed()
		.setColor(0x0b01105)
		.setTitle('BOT STARTUP')
		.setDescription(`The bot has started with the following stats`)
		.addField('GUILDS', client.guilds.cache.size, true)
		.addField('CHANNELS', client.channels.cache.size, true)
		.addField('MEMBERS', client.users.cache.size, true)
		.addField('VERSION', packageJson.version, true)
		.setTimestamp(date)

	client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send(embed)
	// console.warn("uncomment startup message")

	console.log(`Logged in as ${client.user.tag} at ${new Date}`);
	console.log(`Currently serving ${client.guilds.cache.size} guilds, with a total of ${client.channels.cache.size} channels, with ${client.users.cache.size} total users.`);

	const responses = [
		`BOT SLASH COMMANDS ARE HERE!`,
		`Version ${packageJson.version}`,
		`YAGPDB.xyz is a cool bot`,
		`Everything you say`,
		`${client.guilds.cache.size} servers`,
		`SWEEWS`
	];
	var number = 0;

	function randomizer() {
		if (number == 5) {
			number = -1;
		};
		number++
		let GameActivity = responses[number];
		client.user.setPresence({
			activity: {
				name: `${GameActivity}`,
				type: 'WATCHING',
				url: 'https://twitch.tv/quimbly3'
			},
			status: 'dnd'
		});
	};

	setInterval(randomizer, 10000);

	var options = {
		method: 'POST',
		url: 'https://discordbotlist.com/api/v1/bots/551194918853410817/stats',
		headers: {
			'cache-control': 'no-cache',
			'content-type': 'application/x-www-form-urlencoded',
			authorization: process.env.UPDATE_TOKEN
		},
		form: {
			guilds: client.guilds.cache.size,
			users: client.users.cache.size
		}
	};

	request(options, function (error, response, body) {
		if (error) console.warn(new Error(error));
		// console.log(response);
		console.log(body);
	});


	//client.guilds.cache.fetch("guild").members.cache.fetch("user").ban({reason:""})
	//client.guilds.cache.fetch("guild").members.cache.fetch("user").kick({reason:""})
});


function errorLogger(err) {
	var message = msg;
	console.warn(`An exception was thrown at ${new Date}. Error: ${err}`);
	embed = new MessageEmbed()
		.setColor(0xfa6800)
		.setTitle("ERROR")
		.setDescription("An unexpected error occurred. Error message below:")
		.addField("Error message", "```" + err + "```")
		.setTimestamp(new Date)
	msg.channel.send(embed)
}

setInterval(() => {
	var options = {
		method: 'POST',
		url: 'https://discordbotlist.com/api/v1/bots/551194918853410817/stats',
		headers: {
			'cache-control': 'no-cache',
			'content-type': 'application/x-www-form-urlencoded',
			authorization: process.env.UPDATE_TOKEN
		},
		form: {
			guilds: client.guilds.cache.size,
			users: client.users.cache.size
		}
	};

	request(options, function (error, response, body) {
		if (error) console.warn(new Error(error));
		console.log(response);
		console.log(body);
	});

}, 900000);

client.on(`guildMemberAdd`, onGuildJoin);

function onGuildJoin(member) {
	if (member.user.bot) return;
	if (member.guild.id == `676949569908506624`) {
		let channel = client.guilds.cache.get(`676949569908506624`).channels.cache.get(`677308073047490610`);
		embed = new MessageEmbed()
			.setColor(0xfa6800)
			.setTitle(`Member Join`)
			.setDescription(`Welcome to **${client.guilds.cache.get('676949569908506624').name}** ${member}!`)
			.setTimestamp(new Date);
		channel.send(embed);
		member.edit({
			roles: [708545200921903166],
			reason: `Member joined server. Auto assigned Unverified role.`
		});
	}
}

client.on("message", async msg => {

	if (!msg.guild) return;
	if (!msg.content.startsWith(prefix)) return;
	if (msg.author.bot) return;
	const prefixRegex = new RegExp(
		`^(${escapeRegex(prefix)})\\s*`
	);
	if (!prefixRegex.test(msg.content)) return;
	const matchedPrefix = msg.content.match(prefixRegex);
	const args = msg.content
		.slice(matchedPrefix.length)
		.trim()
		.split(/ +/);
	const command = args.shift().toLowerCase();


	// Emoji command. I know this code is not going to run but I dont care because it's commented out. 


	// if (command === "emoji-list" || command === "emojis") {
	// 	let fetchGuilds = client.guilds;
	// 	fetchGuilds.toString()
	// 	fetchGuilds.forEach(server => {
	// 		if (client.guild(server).available) {
	// 			var jkr = [server, true];
	// 			return jkr;
	// 		} else {
	// 			var jkr = [server, false];
	// 			return jkr;
	// 		}	
	// 	})
	// jkr.split(',');
	// if (jkr[1] == true) {
	// 	client.guilds.cache.fetch(jkr[0]).emojis.cache.array()
	// }
	// }



	switch (command) {
		case 'apply':
			if (msg.guild.id == `453600574554767370`) {

			}
			break;
		case 'lockdown':
			if (config.owner.includes(msg.author.id)) {
				msg.delete();
				embed = new MessageEmbed()
					.setColor(0xfa6800)
					.setTitle("CHANNEL LOCKDOWN")
					.setDescription("This channel is now locked down.")
					.addField("Reason", "```" + "Roblox Verify bot is broken. Use <#708548941251215421> and react instead" + "```")
					.setTimestamp(new Date);
				msg.channel.send(embed)
			}
			break;
		case 'k':
			msg.channel.send('<:GWk:742579616891273318>'); // this is just a fancy letter K
			break;
		case 'gandalf':
			msg.channel.send(`<a:gandalf:815757062260260874>`);
			break;
		case 'poglin':
			msg.channel.send(`<:poglin:815773920820068402>`);
			break;
		case 'pause':
		case 'stop':

			break;
		case 'resume':
		case 'continue':

			break;
		case 'p':
		case 'play':
			let args = msg.content.split(` `);
			console.log('PLAY COMMAND USED');
			let query = args[1]
			if (!msg.member.voice.channel) {
				msg.channel.send(`${msg.author} You have to join a voice channel to use music commands.`);
				return;
			}
			ytPLAY(query)
			break;
		case 'dc':
		case 'disconnect':
		case 'leave':
			if (msg.member.voice.channel) {
				try {
					msg.member.voice.channel.leave();
				} catch (err) {
					errorLogger(err);
				}
				msg.channel.send('Left the voice channel!');
			} else {
				msg.channel.send('Error: Could not leave voice channel');
				return;
			}
			break;
		case 'members':
		case 'membercount':
			msg.channel.send(`Current member count: ${msg.guild.memberCount}`);
			break;
		case 'stats':
		case 'status':
		case 'info':
			let date = new Date();
			embed = new MessageEmbed()
				.setColor(0x0b01105)
				.setTitle('BOT STATS')
				.setDescription(`The bot currently has the following stats`)
				.addField('TOTAL GUILDS', client.guilds.cache.size, true)
				.addField('TOTAL CHANNELS', client.channels.cache.size, true)
				.addField('TOTAL MEMBERS', client.users.cache.size, true)
				.setTimestamp(date);
			msg.channel.send(embed);
			break;
		case 'help':
			embed = new MessageEmbed()
				.setTitle(`COMMANDS`)
				.setColor(0xff0000)
				.addField(`??play`, `Used to play a song from youtube.`, false)
				.addField(`??dc`, `Makes the bot disconnect from your voice channel.`, false)
				.addField(`??help`, `Brings up this menu.`, false)
				.addField(`??nsfw`, `This is a Christian Minecraft Server we don't do that here`, false)
				.addField(`??forcestop`, `Used to forcefully crash the bot in case it breaks (You can't use this command)`, false)
				.addField(`??stats`, `Displays bot status`, false)
				.addField(`??membercount`, `Displays the amount of members in your current server`, false);
			msg.channel.send(embed);
			break;
		case 'forcestop':
			if (config.owner.includes(msg.author.id)) {
				msg.channel.send("Force stopping bot.")
					.then(() => {
						client.destroy();
					})
			} else if (!config.owner.includes(msg.author.id)) {
				msg.channel.send("Permission denied");
				return;
			}
			break;
		case 'msg':
			try {
				if (config.admins.includes(message.author.id)) {
					message.delete()
					let args = message.content.split(" ");
					let memberToDm = client.users.fetch(args[1]);
					let dmMsg = args.splice(0, 2);
					dmMsg = args.join(" ");
					memberToDm.send(`${dmMsg}`);
					console.log("msg command used");
				} else if (!config.admins.includes(msg.author.id)) {
					message.channel.send("Permission denied")
					return
				}
			} catch (error) {
				errorLogger(error)
			}
			break;
		case 'send':
			try {
				if (config.admins.includes(msg.author.id)) {
					let args = msg.content.split(" ");
					let channel = client.channels.cache.fetch(args[1]);
					let chanMsg = args.splice(0, 2);
					chanMsg = args.join(" ");
					channel.send(chanMsg);
					console.log("Send command used");
					//Audit Log feature?
				} else if (!config.admins.includes(msg.author.id)) {
					msg.channel.send("Permission denied")
					return
				}
			} catch (error) {
				errorLogger(error)
			}
			break;
		case 'ban':
			if (config.admins.includes(msg.author.id) || client.user.fetch(msg.author.id).hasPermission('BAN_MEMBERS')) {
				// const userGuild = msg.guild.cache.fetch
				let args = msg.content.split(" ");
				let chanMsg = args.splice(0, 2);
				chanMsg = args.join(" ");
				let member = args[1];
				let BanReason = args[2];
				msg.guild.members.cache.fetch(`${member}`).ban({
					reason: `${BanReason}`
				});

			} else if (command === "ban" && !config.admins.includes(msg.author.id)) {
				msg.channel.send("Permission denied");
				return;
			}
			break;
		case 'kick':
			if (config.admins.includes(msg.author.id) || client.user.fetch(msg.author.id).hasPermission('KICK_MEMBERS')) {
				// const userGuild = msg.guild.cache.fetch
				let args = msg.content.split(" ");
				let member = args[1];
				let KickReason = args[2];
				msg.guild.members.cache.fetch(`${member}`).kick({
					reason: `${KickReason}`
				})
			} else if (command === "kick" && !config.admins.includes(msg.author.id)) {
				msg.channel.send("Permission denied");
				return;
			}
			break;
		case 'nsfw':
		case 'porn':
			msg.channel.send(`Hey ${msg.author}, keep it PG.`);
			break;
		case 'meme':
			// memeCmd();
			break;
		case `debug`:
			if (config.master.includes(msg.author.id)) {
				let args = msg.content.split(" ");
				let cmd = args[1];
				switch (cmd) {
					case `clean-cache`:
						client.sweepMessages();
						msg.channel.send(`Successfully removed all data from the cache.`);
						break;
				}
			}
	}

	function ytPLAY(query) {
		var stream;
		videoDuration.min = 0;
		videoDuration.sec = 0;
		if (ytdl.validateID(query) || ytdl.validateURL(query)) {
			console.log('ID VALID');
			msg.member.voice.channel
				.join()
				.then(connection => {
					stream = ytdl(query, {
						filter: "audioonly"
					});
					dispatcher = connection.play(stream);

					ytdl.getInfo(query).then(data => {
						let videoInfo = data.videoDetails.title;
						let videoAuthor = data.videoDetails.author;
						let videoURL = data.videoDetails.videoId;
						let videoTumbnail = data.videoDetails.thumbnails[0].url;
						let videoDurationString = data.videoDetails.lengthSeconds;
						let videoDurationInt = parseInt(videoDurationString);
						while (videoDurationInt >= 60) {
							videoDuration.min++;
							videoDurationInt = videoDurationInt - 60;
						};
						if (videoDurationInt < 10) {
							videoDuration.sec = `0${videoDurationInt}`
						} else {
							videoDuration.sec = videoDurationInt;
						}
						embed = new MessageEmbed()
							.setColor(0x0b01105)
							.setTitle('Now Playing:')
							.addField("Song Name", `${videoInfo}`, true)
							.addField("Author", `${videoAuthor.name}`, true)
							.addField("Duration", `${videoDuration.min}:${videoDuration.sec}`, true)
							.setURL(`https://youtube.com/watch?v=${videoURL}`)
							.setThumbnail(videoTumbnail)
							.setTimestamp(new Date)
							.setAuthor(`Using YTDL version 4.5.0`, `https://cdn.discordapp.com/avatars/551194918853410817/4816379c6f2228417b945a0a12fac407.png?size=128`)
						msg.channel.send(embed);
					})
				})
		} else {
			console.log('ID NOT VALID');
			let filter;
			ytsr.getFilters(`${query}`, function (err, filters) {
				console.log("Fetching filters");
				if (err) console.warn(err);
				filter = filters.get('Type').find(o => o.name === 'Video');
				ytsr.getFilters(filter.ref, function (err, filters) {
					if (err) console.warn(err);
					filter = filters.get('Duration').find(o => o.name.startsWith('Short'));
					let options = {
						limit: 5,
						nextpageRef: filter.ref,
					}
					ytsr(`${query}`, options, function (err, searchResults) {
						console.log(`Results Fetched! ${searchResults.items}`);
						if (err) console.warn(err);
						let newLink = searchResults.items[0].link;
						msg.member.voice.channel
							.join()
							.then(connection => {

								stream = ytdl(newLink, {
									filter: "audioonly"
								});
								dispatcher = connection.play(stream);

								ytdl.getInfo(newLink).then(data => {
									let videoInfo = data.videoDetails.title;
									let videoAuthor = data.videoDetails.author;
									let videoURL = data.videoDetails.videoId;
									let videoTumbnail = data.videoDetails.thumbnails[0].url;
									let videoDurationString = data.videoDetails.lengthSeconds;
									let videoDurationInt = parseInt(videoDurationString);
									while (videoDurationInt >= 60) {
										videoDuration.min++;
										videoDurationInt = videoDurationInt - 60;
									};
									if (videoDurationInt < 10) {
										videoDuration.sec = `0${videoDurationInt}`
									} else {
										videoDuration.sec = videoDurationInt;
									}

									embed = new MessageEmbed()
										.setColor(0x0b01105)
										.setTitle('Now Playing:')
										.addField("Song Name", `${videoInfo}`, true)
										.addField("Author", `${videoAuthor.name}`, true)
										.addField("Duration", `${videoDuration.min}:${videoDuration.sec}`, true)
										.setURL(`https://youtube.com/watch?v=${videoURL}`)
										.setThumbnail(videoTumbnail)
										.setTimestamp(new Date);
									msg.channel.send(embed);
								})
							})
					})
				});
			});
		}



		// Blacklist system is not stable.

		// if (command === "blacklist-add" && config.master.includes(msg.author.id)) {
		// 	let args = msg.content.split(" ");
		// 	let user = args[1];
		// 	let reason = args.splice(0, 2);
		// 	reason = args.join(" ")
		// 	// last three lines are totally not reused from the ??send command
		// 	blacklistDB.autoBlackList(user, reason);
		// 	msg.channel.send(`Blacklisted user: ${user} for reason: ${reason}`);
		// } else if (command === "blacklist-add" && !config.master.includes(msg.author.id)) {
		// 	msg.channel.send("Permission denied");
		// 	return;
		// }

		// if (command === "blacklist-remove" && config.master.includes(msg.author.id)) {
		// 	let args = msg.content.split(" ");
		// 	let user = args[1];
		// } else if (command === "blacklist-remove" && !config.master.includes(msg.author.id)) {
		// 	msg.channel.send("Permission denied");
		// 	return;
		// }

		// Warn command is unstable.


		// if (command === "warn" && config.master.includes(msg.author.id)) {
		// 	msg.delete()
		// 	let args = msg.content.split(" ");
		// 	let punishInfo = args.splice(0, 3);
		// 	// punishInfo = args.join(" ");
		// 	let member = args[1]
		// 	let warnReason = args[2]
		// 	msg.channel.send(`Warned <@${member}> for: ${warnReason}.`)
		// 	let userMsg = `You were warned on ${msg.guild.name} for: ${warnReason}. This punishment was executed by ${msg.author.id}`;
		// 	client.users.cache.fetch(`${member}`).send(`${userMsg}`);
		// } else if (command === "warn" && !config.master.includes(msg.author.id)) {
		// 	msg.channel.send("Permission denied")
		// 	return
		// }



		// if (command === "unban") {
		//   const userGuild = msg.guild.cache.fetch
		//   let args = msg.content.split(" ");
		//   const member = args[1];
		//   const UnbanReason = args[2]
		//    guild.members.unban(`${member}`, {reason:`${UnbanReason}`})
		// }



		if (command === "pl") {
			return

			// command not yet stable 
			const streamOptions = {
				seek: 0,
				volume: 1
			};
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

										const stream = ytdl(ytlink, {
											filter: "audioonly"
										});
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


		if (command === "wegothim" || command === "we-got-him") {
			embed = new MessageEmbed()
				.setTitle('Ladies and gentelmen,')
				.setColor(0xff0000)
				.setDescription('We got him')
				.setImage('https://media1.tenor.com/images/fe4d5ba31a04ef87422b6537377f89a2/tenor.gif')
				.setURL('https://www.youtube.com/watch?v=6okxuiiHx2w')
			msg.channel.send(embed);
		}

		// function shutdown() {
		// 	client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send("Bot is now going offline. ")
		// 	client.destroy()
		// }

		// if (command === "shutdown" && config.master.includes(msg.author.id)) {
		// 	msg.channel.send("Shutting down.")
		// 	client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send('Bot shutting down');
		// 	client.user.setActivity("Shutting down...", {
		// 		type: "PLAYING",
		// 		url: "https://twitch.tv/demonitized_boi"
		// 	});
		// 	client.user.setStatus("idle");
		// 	setTimeout(shutdown, 30000)
		// } else if (command === "shutdown" && !config.master.includes(msg.author.id)) {
		// 	msg.channel.send("Permission denied")
		// 	return
		// }

		// function restart() {
		// 	client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send('Bot is now going offline.');
		// 	client.destroy()
		// }

		// if (command === "restart" && config.master.includes(msg.author.id)) {
		// 	let args = msg.content.split(" ");
		// 	const restartTime = args[1];
		// 	msg.channel.send("Restarting")
		// 	client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send('Bot restarting...');
		// 	client.user.setActivity("restarting...", {
		// 		type: "PLAYING",
		// 		url: "https://twitch.tv/demonitized_boi"
		// 	});
		// 	client.user.setStatus("idle");
		// 	setTimeout(restart, restartTime)
		// } else if (command === "restart" && !config.master.includes(msg.author.id)) {
		// 	msg.channel.send("Permission denied");
		// 	return;
		// }



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

					msg.channel.send(clean(evaled), {
						code: "xl"
					});
				} catch (err) {
					console.log(err);
					msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
				}
			}
		});
	}

	function memeCmd() {
		var options = {
			method: 'GET',
			url: 'https://www.reddit.com/r/softwaregore.json?sort=top&t=week'
		};

		request(options, function (error, response, body) {
			if (error) console.warn(new Error(error));
			// console.log(response);
			// console.log(body);
			const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
			if (!allowed.length) return msg.channel.send('It seems we are out of fresh memes!, Try again later.');
			const randomnumber = Math.floor(Math.random() * allowed.length)
			embed = new MessageEmbed()
				.setColor(0x00A2E8)
				.setTitle(allowed[randomnumber].data.title)
				.setDescription("Posted by: " + allowed[randomnumber].data.author)
				.setImage(allowed[randomnumber].data.url)
				.addField("Other info:", "Up votes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
				.setFooter("Memes provided by r/softwaregore");
			msg.channel.send(embed)
		});

	}

})


client.on("guildCreate", srv => {
	client.guilds.cache.get("618236743560462356").channels.cache.get("704045958601637918").send(`Bot added to new Guild. Guild name: ${srv}`);
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
