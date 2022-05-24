exports.run = async (bot,message,args, serverQueue, queue) => {
  //skips the song currently being played in the queue
    if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

exports.help = {
    name: 'skip',
    description: 'skips to the next song in the queue'
    
}