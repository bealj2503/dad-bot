const ytdl = require("ytdl-core");
const search = require('youtube-search')
const COOKIEOBJ = require('./cookie.json')
const COOKIE = COOKIEOBJ.COOKIE;
exports.run = async(bot,message,args,serverQueue, queue, opts ) => {
    const voiceChannel = message.member.voice.channel;
    //check if the command came froma user in the voice channel and they have permissions
    if(!voiceChannel) return message.channel.send('You need to be in a voice channel to play music');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has('CONNECT') || !permissions.has("SPEAK")) {
        return message.channel.send("I need permissions to join the voice channel");
    }
    let songInfo;
    // check if user entered in a direct url or just a name of a video
    if(message.content.includes(".com")|| message.content.includes("t=")){
        songInfo = await ytdl.getInfo(args[0]);
    }
    else{
        let query;
        for(let i = 0; i<args.length; i++){
            if(i==0){
                query= args[0]
            } else{
                query = query.concat(' ');
                query = query.concat(args[i]);
            }
            
        }
        //query the search results and add to the song info object
        let results = await search(query, opts).catch(err => console.log(err));
        if(results){
            songInfo = await ytdl.getInfo(results.results[0].link, { requestOptions:
            {
                headers: {
                    cookie: COOKIE
                }
            }});
        }
    }
    
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };
    // check if a queue of songs already exists for the specific server
    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        
        queue.set(message.guild.id, queueContruct);
    
        queueContruct.songs.push(song);
        // check if the bot successfully joined the voice channel
        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0],queue);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }    
}
function play(guild, song, queue) {
    const serverQueue = queue.get(guild.id);
    //if there is no song leave the voice channel
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    //Plays a youtube video using ytdl module 
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url,{requestOptions:{ headers: { cookie: COOKIE}}, filter: "audioonly"}))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0], queue);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    return;
}

exports.help = {
    name: 'play',
    description: 'Plays the song a user searched for or adds it to queue',
    usage: '>play (youtube link) or >play (name of song or video you would like)'
}