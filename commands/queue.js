const Discord = require('discord.js');
exports.run = async (bot,message,args, serverQueue, queue) => {
    // lists a queue of current songs that have been selected to be played
    if (!serverQueue){
        return message.channel.send("There is no songs in the queue");
    } else{
        let list = new Array();
        for(let i = 0;i<serverQueue.songs.length;i++){
            if(i == 0){
                list[i] = `**Currently Playing:** ${serverQueue.songs[i].title}`
            }
            else{
                list[i] = `**In queue [${i}]:** ${serverQueue.songs[i].title}`
            }
        }
        let boardsEmbed = new Discord.MessageEmbed()
    .setTitle('DadBot Song queue')
    .setDescription(list)
    .setColor('#ff0000');

    message.channel.send(boardsEmbed)
    }
}

exports.help = {
    name: 'queue',
    description: 'Shows currently playing and songs in queue'
    
}