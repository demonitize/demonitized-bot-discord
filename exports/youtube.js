const ytdl = require(`ytdl-core`);
const ytsr = require(`ytsr`);
const {
  Client,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Collection,
  CommandInteraction
} = require(`discord.js`);
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
var videoDuration;
class YouTubePlayer {
  srch(query, msg) {
    var stream;
    videoDuration.min = 0;
    videoDuration.sec = 0;
    if (ytdl.validateID(query) || ytdl.validateURL(query)) {
      console.log("ID VALID");

      var connection = joinVoiceChannel({
        channelId: msg.member.voice.channelId,
        guildId: msg.guildId,
        adapterCreator: msg.guild.voiceAdapterCreator
      });

      // Subscribe the connection to the audio player (will play audio on the voice connection)

      var player = createAudioPlayer();
      var resource = createAudioResource(
        ytdl(query, {
          filter: "audioonly"
        })
      );
      resource.volume.setVolume(0.5);

      player.play(resource);

      connection.subscribe(player);

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
        }
        if (videoDurationInt < 10) {
          videoDuration.sec = `0${videoDurationInt}`;
        } else {
          videoDuration.sec = videoDurationInt;
        }
        let embed = new MessageEmbed()
          .setColor(0x0b01105)
          .setTitle("Now Playing:")
          .addField("Song Name", `${videoInfo}`, true)
          .addField("Author", `${videoAuthor.name}`, true)
          .addField(
            "Duration",
            `${videoDuration.min}:${videoDuration.sec}`,
            true
          )
          .setURL(`https://youtube.com/watch?v=${videoURL}`)
          .setThumbnail(videoTumbnail)
          .setTimestamp(new Date())
          .setAuthor(
            `Using YTDL version 4.5.0`,
            `https://cdn.discordapp.com/avatars/551194918853410817/4816379c6f2228417b945a0a12fac407.png?size=128`
          );
        msg.editReply(embed);
      });
    } else {
      console.log("ID NOT VALID");
      let filter;
      ytsr.getFilters(`${query}`, function(err, filters) {
        console.log("Fetching filters");
        if (err) console.warn(err);
        filter = filters.get("Type").find(o => o.name === "Video");
        ytsr.getFilters(filter.ref, function(err, filters) {
          if (err) console.warn(err);
          filter = filters
            .get("Duration")
            .find(o => o.name.startsWith("Short"));
          let options = {
            limit: 5,
            nextpageRef: filter.ref
          };
          ytsr(`${query}`, options, function(err, searchResults) {
            console.log(`Results Fetched! ${searchResults.items}`);
            if (err) console.warn(err);
            let newLink = searchResults.items[0].link;
            var connection = joinVoiceChannel({
              channelId: msg.member.voice.channelId,
              guildId: msg.guildId,
              adapterCreator: msg.guild.voiceAdapterCreator
            });

            // Subscribe the connection to the audio player (will play audio on the voice connection)

            var player = createAudioPlayer();
            var resource = createAudioResource(
              ytdl(query, {
                filter: "audioonly"
              })
            );
            player.play(resource);

            connection.subscribe(player);

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
              }
              if (videoDurationInt < 10) {
                videoDuration.sec = `0${videoDurationInt}`;
              } else {
                videoDuration.sec = videoDurationInt;
              }

              let embed = new MessageEmbed()
                .setColor(0x0b01105)
                .setTitle("Now Playing:")
                .addField("Song Name", `${videoInfo}`, true)
                .addField("Author", `${videoAuthor.name}`, true)
                .addField(
                  "Duration",
                  `${videoDuration.min}:${videoDuration.sec}`,
                  true
                )
                .setURL(`https://youtube.com/watch?v=${videoURL}`)
                .setThumbnail(videoTumbnail)
                .setTimestamp(new Date());
              msg.editReply(embed);
            });
          });
        });
      });
    }
  }
}

module.exports = {
	YouTubePlayer: YouTubePlayer
}
