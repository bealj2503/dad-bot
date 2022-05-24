exports.run = async (bot,message,args, serverQueue) => {
    if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");
  // remove all songs from the queue and end the current song playing
  serverQueue.songs = [];
  try{
    serverQueue.connection.dispatcher.end();
  }
  catch{
    message.channel.send("I am already disconnected");
  }  
      
}

exports.help = {
    name: 'stop',
    description: 'stops the music'
  
}