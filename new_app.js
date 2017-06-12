/*
  A ping pong bot, whenever you send "ping", it replies "pong".
  A logmerlixnet Bot, whatever you send "ping,twitter,add,WelcomeMessage,say"
*/

// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

//Bot Config! #Prefix & Token
const config = require('./config.json');

// the token of your bot - https://discordapp.com/developers/applications/me
// const token = '(token)';

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
//TODO New console.log Output:

// funktions:

function commandIs(str, msg) {
    return msg.content.toLowerCase().startsWith('config.prefix' + str)
}

function pluck(arry) {
    return arry.map(function(item) {
        return item[`name`];
    });
}

function hasRole(mem, role) {
    if (pluck(mem.roles).includes(role)) {
        return true;
    } else {
        return false;
    }
}

bot.on('ready', () => {
    console.log('I am ready!');
    // Set Bot Status
    bot.user.setGame('Prefix: [!] help for commands');
});


//TODO Welcome Message
bot.on("guildMemberAdd", member => {
    let guild = member.guild
    guild.defaultChannel.sendMessage(`Welcome ${member.user} to this Server.`).catch(console.error);
});

bot.on("guildCreate", guild => {
    console.log(`New guild added : ${guild.name}, owned by $(guild.owner.user.username)`);
});
bot.on("guildMemberRemove", member => {
    member.guild.defaultChannel.sendMessage(`${member.user} hat den Discord-Server verlassen!`)
});
// member.displayName

// Change Status / Check Game / He Playing a Game?
bot.on("presenceUpdate", (oldMember, newMember) => {
    let guild = newMember.guild;
    let Minecraft = guild.roles.find("name", "Playing Minecraft");
    if (!Minecraft) return;

    // Play GTA Five
    let Grand_Theft_Auto_V = guild.roles.find("name", "Playing Grand_Theft_Auto_V");
    if (!Grand_Theft_Auto_V) return;

    const game = newMember.user.presence.game;
    if (game && (game.name && game.name.split(" ")[0] === "Minecraft")) {
        //  code
        newMember.addRole(Minecraft).catch(console.error);
    } else if (!game && newMember.roles.has(Minecraft.id)) {
        newMember.removeRole(Minecraft).catch(console.error);
    }
    // Play GTA Five
    if (game && (game.name && game.name.split(" ")[0] === "Grand Theft Auto V")) {
        //  code
        newMember.addRole(Grand_Theft_Auto_V).catch(console.error);
    } else if (!game && newMember.roles.has(Grand_Theft_Auto_V.id)) {
        newMember.removeRole(Grand_Theft_Auto_V).catch(console.error);
    }
});
/*

   1.  Game APi:
    // These code snippets use an open-source library. http://unirest.io/nodejs
    unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&limit=10&offset=0&order=release_dates.date%3Adesc&search=zelda")
    .header("X-Mashape-Key", "m9MdNJIuqfmshzBZkvpNcZOxW1jzp1bSs8wjsn4WiMZXyp3a1d")
    .header("Accept", "application/json")
    .end(function (result) {
    console.log(result.status, result.headers, result.body);
});
https://igdb.github.io/api/endpoints/game/

    https://github.com/igdb/igdb-api-node#setup
    npm install igdb-api-node
    igdb = require('igdb-api-node')
    global.mashapeKey = 'YOUR_KEY'


    // Blocked -  Using 1x 24h
    2. Game APi:
    Your API key for Giant Bomb is...
    d5ef059fd87b0bd2a4037bae384ba29c2696252f
    https://www.giantbomb.com/forums/api-developers-3017/quick-start-guide-to-using-the-api-1427959/#16
    */


/* BACKUP

// Change Status / Check Game / He Playing a Game?
bot.on("presenceUpdate", (oldMember, newMember) => {
  let guild = newMember.guild;
  let playRole = guild.roles.find("name", "Playing Minecraft");
  if (!playRole) return;

  const game = newMember.user.presence.game;
  if (game && (game.name && game.name.split(" ")[0] === "Minecraft")) {
    //  code
    newMember.addRole(playRole).catch(console.error);
  } else if (!newMember.user.presence.game && newMember.roles.has(playRole.id)) {
    newMember.removeRole(playRole).catch(console.error);
  }
  });

END BACKUP */

/* if (newMember.presence.game.name.split(' ')[0] === 'Minecraft') {
    newMember.addRole(playRole).catch(console.error);
  } else if (!newMember.user.presence.game && newMember.roles.has(playRole.id)) {
    newMember.removeRole(playRole).catch(console.error);
  }
  });
*/
/* old methode
  if (newMember.user.presence.game && newMember.user.presence.game.name == Minecraft) {
    newMember.addRole(playRole).catch(console.error);
    //if (newMember.user.presence.game && newMember.user.presence.game.name === "Minecraft 1.8.8")
  }else if (!newMember.user.presence.game && newMember.roles.has(playRole.id)) {
    newMember.removeRole(playRole).catch(console.error);
  }
});
*/

// Set Prefix for command!
// const prefix = "!";

// create an event listener for messages
bot.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    let command = message.content.split(" ")[0]
    command = command.slice(config.prefix.length);

    let args = message.content.split(" ").slice(1);
    // if i write add then addiotion this
    if (command === "add") {
        let numArry = args.map(n => parseInt(n));
        let total = numArry.reduce((p, c) => p + c)
        message.channel.sendMessage(total).catch(console.error);
    }

    // if the message is say
    if (command === "say") {
        // sendMessage nach dem Comamnd "say"
        message.channel.sendMessage(args.join(" ")).catch(console.error);
    }

    // if the message is "ping",
    if (message.content.startsWith(config.prefix + "ping")) {
        // send "pong" to the same channel.
        message.channel.sendMessage('pong!').catch(console.error);
    } else

    if (message.content.startsWith(config.prefix + "foo")) {
        let modRole = message.guild.roles.find("name", "Mods");
        if (message.member.roles.has(modRole.id)) {
            message.channel.sendMessage("bar!").catch(console.error);
        } else {
            message.reply("You bleb, you don´t have the permissions to use this Command!").catch(console.error);
        }
    }


    // TODO Avatar!
    // if the message is "what is my avatar",
    if (message.content.startsWith(config.prefix + "avatar")) {
        // send the user's avatar URL
        message.reply(message.author.avatarURL).catch(console.error);
    }

    // TODO twitter APi
    //if the Prefix + Twiter write
    if (message.content.startsWith(config.prefix + "twitter")) {
        // then send this in this channel:
        message.channel.sendMessage("Unser Twitter Acc: https://twitter.com/SoulForgeEU").catch(console.error);
    }

    // TODO TeamSpeak3 APi
    //if the Prefix + Twiter write
    if (message.content.startsWith(config.prefix + "ts")) {
        // then send this in this channel:
        message.channel.sendMessage('Ich lade euch ganz herzlich ein zu meinem Teamspeak3 Server: http://www.teamspeak.com/invite/ts3.soulforge.eu/').catch(console.error);
    }


});
//TODO [!] Help Commands!



// This is the function zu eval command!
function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)); 
    else    return text;
}

// log our bot in - BotToken
bot.login(config.token);

/* ------------------------------------------------------------------------ */
/*                               OLD METHODE!                               */
/* ------------------------------------------------------------------------ */

/* const DiscordDJ = require('DiscordDJ');
var music = new DiscordDJ();

music.on('ready', () => {
  console.log('DiscordDJ is ready!');
});

// play streams using ytdl-core
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const broadcast = client.createVoiceBroadcast();

voiceChannel.join()
 .then(connection => {
   const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', {filter : 'audioonly'});
   broadcast.playStream(stream);
   const dispatcher = connection.playBroadcast(broadcast);
 })
 .catch(console.error);

//bot.on("voice", voiceChannel)
//bot.on("voice", voice => {
//  let voice = member.guild
//  guid.defaultChannel.sendMessage(`Welcome $(member.user) to this Server.`);
*/

/* ------------------------------------------------------------------------ */
//                                  TODO FIX!                               //
/* ------------------------------------------------------------------------ */

// TODO: KICK Function!
/* Kick dont fixxed!
    if (commandIs("kick", message)) {
        if (hasRole(message.member, "Moderator") || hasRole(message.member, "Leitung")) {
            if (args.length === 1) {
                message.channel.sendMessage('Du hast kein Argument definiert. Usage: `!kick @User`')
            } else {
                message.guild.member(message.mentions.users.first()).kick();
            }

        }

    }
*/

/*
      if (message.content.startsWith(config.prefix + "kick")) {
          let modRole = message.guild.roles.find("name", "Moderator")
          if (!message.member.roles.has(modRole.id))
          { return
            message.reply("you bleb, you don´t have the permissions to use this Command!").catch(console.error);
        }
          //let (message.member.roles.has(modRole.id)) {
          if (message.mentions.users.size === 0) {
            return message.reply("Usage: `@User to kick`").catch(console.error);
        }

    let kickMember = message.guild.member(message.mentions.users.first());
    if (!kickMember) {
        return message.reply("That user does not seen valid").catch(console.error);
    }
    if (!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
        return message.reply("I don´t have the permissions (KICK_MEMBERS) to do this.").catch(console.error);
    }
    kickMember.kick().then(member => {
        message.reply(` der Spieler|User: ${member.user} wurde gekicked.`).catch(console.error);
    }).catch(console.error);
}

*/

/* EVAL FEHLER
    if (message.content.startsWith(config.prefix + "eval")) {
        if (message.author.id !== "156473495348314113") return;
        try {
            var code = args.join(" ");
            var evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            message.channel.sendCode("xl", clean(evaled));
        } catch (err) {
            message.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
*/






/* ------------------------------------------------------------------------ */
/*                             Start Code MUSICBOT                          */
/* ------------------------------------------------------------------------ */

/*
// TODO voiceChannel - MusicBot

var ytdl = require('ytdl-core');            // youtube download library
var youtube = require('./youtube/youtube.js');      // performs youtube API requests
var ytAudioQueue = [];
var dispatcher = null;
/*
bot.on('message', function (message) {
    var messageParts = message.content.split(' ');

    var command = messageParts[0].toLowerCase();
    var parameters = messageParts.splice(1, messageParts.length);

    console.log("command: " + command);
    console.log("parameters: " + parameters);
*/

/*
if (message.content.startsWith(config.prefix + "hi")) {
message.reply("Hey there!");

/*
    if (message.content.startsWith(config.prefix + "help")) {
        if (message.content.startsWith(config.prefix + "join")) {
            if (message.content.startsWith(config.prefix + "play")) {
                if (message.content.startsWith(config.prefix + "play")) {
*/
/*
    switch (command) {
        case "hi":
            message.reply("Hey there!");
            break;
        case "*help":
            HelpCommand(message);
            break;
        case "*join":
            message.reply("Attempting to join channel: " + parameters[0]);
            JoinCommand(parameters[0]);
            break;
        case "*play":
            PlayCommand(parameters.join(" "), message);
            break;
        case "*playqueue":
            PlayQueueCommand(message);
            break;
    }
});
// END MESSAGE HANDLER
/* COMMAND HANDLERS */

/*

/// lists out all of the bot commands
function HelpCommand(originalMessage) {
    originalMessage.reply("*join <channel-to-join> - Connects to bot to a channel by channel name");
    originalMessage.reply("*play <YouTube search term> - Plays audio from YouTube based on the search term");
    originalMessage.reply("*playqueue - Lists the audio remaining in the play queue");
}

/// plays audio based on results from youtube search
function PlayCommand(searchTerm) {

    // if not connected to a voice channel then connect to first one
    if (bot.voiceConnections.array().length == 0) {
        var defaultVoiceChannel = bot.channels.find(val => val.type === 'voice').name;
        JoinCommand(defaultVoiceChannel);
    }

    // search youtube using the given search search term and perform callback action if video is found
    youtube.search(searchTerm, QueueYtAudioStream);
}

/// lists out all music queued to play
function PlayQueueCommand(message) {
    var queueString = "";

    for(var x = 0; x < ytAudioQueue.length; x++) {
        queueString += ytAudioQueue[x].videoName + ", ";
    }

    queueString = queueString.substring(0, queueString.length - 2);
    message.reply(queueString);
}

/// joins the bot to the specified voice channel
function JoinCommand(channelName) {
    var voiceChannel = GetChannelByName(channelName);

    if (voiceChannel) {
        voiceChannel.join();
        console.log("Joined " + voiceChannel.name);
    }

    return voiceChannel;
}

/* END COMMAND HANDLERS */
/*----------------------------------------------------------------------*/
//});
// END MESSAGE HANDLER

/* HELPER METHODS */
/*
/// returns the channel that matches the name provided
function GetChannelByName(name) {
var channel = bot.channels.find(val => val.name === name);
return channel;
}

/// Queues result of Youtube search into stream
function QueueYtAudioStream(videoId, videoName) {
var streamUrl = `${youtube.watchVideoUrl}${videoId}`;

if (!ytAudioQueue.length) {
    ytAudioQueue.push(
        {
            'streamUrl': streamUrl,
            'videoName': videoName
        }
    );

    console.log("Queued audio " + videoName);
    PlayStream(ytAudioQueue[0].streamUrl);
}
else {
    ytAudioQueue.push(
        {
            'streamUrl': streamUrl,
            'videoName': videoName
        }
    );

    console.log("Queued audio " + videoName);
}

}

/// Plays a given stream
function PlayStream(streamUrl) {

const streamOptions = {seek: 0, volume: 1};

if (streamUrl) {
    const stream = ytdl(streamUrl, {filter: 'audioonly'});

    if (dispatcher == null) {

        var voiceConnection = bot.voiceConnections.first();
        //console.log(voiceConnection);

        if (voiceConnection) {

            console.log("Now Playing " + ytAudioQueue[0].videoName);
            dispatcher = bot.voiceConnections.first().playStream(stream, streamOptions);

            dispatcher.on('end', () => {
                PlayNextStreamInQueue();
            });

            dispatcher.on('error', (err) => {
                console.log(err);
            });
        }
    }
    else {
        dispatcher = bot.voiceConnections.first().playStream(stream, streamOptions);
    }
}
}

/// Plays the next stream in the queue
function PlayNextStreamInQueue() {

ytAudioQueue.splice(0, 1);

// if there are streams remaining in the queue then try to play
if (ytAudioQueue.length != 0) {
    console.log("Now Playing " + ytAudioQueue[0].videoName);
    PlayStream(ytAudioQueue[0].streamUrl);
}
});
/* END HELPER METHODS */
/* ------------------------------------------------------------------------ */
/*                             END MUSICBOT                                 */
/* ------------------------------------------------------------------------ */