module.exports.run = async (bot, msg, args) => {
	const ytdl = require("ytdl-core");
	const ytsr = require("ytsr");
	const MessageEmbed = require("discord.js")
	const {
		NoSubscriberBehavior,
		StreamType,
		createAudioPlayer,
		createAudioResource,
		entersState,
		AudioPlayerStatus,
		VoiceConnectionStatus,
		joinVoiceChannel,
		getVoiceConnection
	} = require('@discordjs/voice');
	var videoDuration = {
		min: 0,
		sec: 0
	};
	args = msg.content.split(` `);
	console.log('PLAY COMMAND USED');
	let query = args[1];
	if (!msg.member.voice.channel) {
		msg.channel.send(`${msg.author} You have to join a voice channel to use music commands.`);
		return;
	}
	ytPLAY(query);

	function ytPLAY(query) {
		var audioPlayer = createAudioPlayer();

		videoDuration.min = 0;
		videoDuration.sec = 0;
		if (ytdl.validateID(query) || ytdl.validateURL(query)) {
			resource = createAudioResource(ytdl(query, {
				filter: "audioonly"
			}));
			console.log('ID VALID');
			joinVoiceChannel({
				channelId: msg.member.voice.channel.id,
				guildId: msg.guild.id,
				adapterCreator: msg.guild.voiceAdapterCreator,
			})
			const connection = getVoiceConnection(`853093045385953320`);
			connection.subscribe(audioPlayer)

			// dispatcher = connection.play(stream);

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
				// let embed = MessageEmbed()
				// 	.setColor(0x0b01105)
				// 	.setTitle('Now Playing:')
				// 	.addField("Song Name", `${videoInfo}`, true)
				// 	.addField("Author", `${videoAuthor.name}`, true)
				// 	.addField("Duration", `${videoDuration.min}:${videoDuration.sec}`, true)
				// 	.setURL(`https://youtube.com/watch?v=${videoURL}`)
				// 	.setThumbnail(videoTumbnail)
				// 	.setTimestamp(new Date)
				// 	.setAuthor(`Using YTDL version 4.5.0`, `https://cdn.discordapp.com/avatars/551194918853410817/4816379c6f2228417b945a0a12fac407.png?size=128`)
				// msg.channel.send(embed);
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
						joinVoiceChannel({
								channelId: interaction.member.voice.channel.id,
								guildId: interaction.guild.id,
								adapterCreator: interaction.guild.voiceAdapterCreator,
							})
							.then(connection => {

								stream = ytdl(newLink, {
									filter: "audioonly"
								});
								// dispatcher = connection.play(stream);

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

									let embed = new MessageEmbed()
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
	}

};

// Help Object
module.exports.help = {
	name: "play",
	description: "Plays a YouTube video",
	usage: "??play <[youtube video ID] [youtube search query]>",
	category: "Music",
	aliases: [
		"p"
	]
};