const API_KEY = "<my API Key>";

var discord = require("discord.js");
var ytdl = require('ytdl-core');
var request = require('superagent');

var bot = new discord.Client();
var voiceChannel = null;
var ytAudioQueue = [];

bot.on('ready', function() {
	console.log('I am ready');
});

bot.on('message', function(message) {
	var messageParts = message.content.split(' ');

	var command = messageParts[0].toLowerCase();
	var parameters = messageParts.splice(1, messageParts.length);

	console.log("command: " + command);
	console.log("parameters: " + parameters);

	switch (command) {
		case "hi":
			message.reply("Hey there!");
			break;
		case "*help":
			HelpCommand(message);
			break;
		case "*join":
			message.reply("Attempting to join channel: " + parameters[0]);
			JoinCommand(parameters[0], message);
			break;
		case "*play":
			PlayCommand(parameters.join(" "), message);
			break;
	}
});

voiceChannel.on('speaking', (user, speaking) => {

	// the audio has finished playing, so remove it from the queue and start playing the next song
	if (!speaking && ytAudioQueue.length > 1) {
		ytAudioQueue.pop();

		if (voiceChannel == null) {
			JoinCommand(bot.channels.find(val => val.type === 'voice').name).then(function() {
				PlayStream(ytAudioQueue.first);
			});
		}
		else {
			PlayStream(ytAudioQueue.first);
		}
	}
});

/* COMMAND HANDLERS */

/// lists out all of the bot commands
function HelpCommand(originalMessage) {
	originalMessage.reply("*join <channel-to-join> - Connects to bot to a channel by channel name");
	originalMessage.reply("*play <YouTube search term> - Plays audio from YouTube based on the search term");
}

/// plays audio based on results from youtube search
function PlayCommand(searchTerm) {
	//bot.sendMessage("Searching Youtube for audio...");
	YoutubeSearch(searchTerm);
}

/// joins the bot to the specified voice channel
function JoinCommand(channelName) {

	if (voiceChannel) {
		voiceChannel.disconnet();
	}

	var voiceChannel = GetChannelByName(channelName);
	return voiceChannel.join();
}

/* END COMMAND HANDLERS */

/* HELPER METHODS */

/// returns the channel that matches the name provided
function GetChannelByName(name) {
	var channel = bot.channels.find(val => val.name === name);

	return channel;
}

function YoutubeSearch(searchKeywords) {
	var requestUrl = 'https://www.googleapis.com/youtube/v3/search' + `?part=snippet&q=${escape(searchKeywords)}&key=${API_KEY}`;

	request(requestUrl, (error, response) => {
		if (!error && response.statusCode == 200) {

			var body = response.body;
			if (body.items.length == 0) {
				console.log("Your search gave 0 results");
				return videoId;
			}

			for (var item of body.items) {
				if (item.id.kind === 'youtube#video') {
					QueueYtAudioStream(item.id.videoId);
				}
			}
		}
		else {
			console.log("Unexpected error when searching YouTube");
			return null;
		}
	});

	return null;
}

/// Queues result of Youtube search into stream
function QueueYtAudioStream(videoId) {
	var streamUrl = `https://www.youtube.com/watch?v=${videoId}`;
	ytAudioQueue.push(streamUrl);
}

// plays a given stream
function PlayStream(streamUrl) {

	const streamOptions = {seek: 0, volume: 1};
	console.log("Streaming audio from " + streamUrl);

	if (streamUrl) {
		const stream = ytdl(streamUrl, {filter: 'audioonly'});
		const dispatcher = bot.voiceConnections.first().playStream(stream, streamOptions);
	}
}

/* END HELPER METHODS */