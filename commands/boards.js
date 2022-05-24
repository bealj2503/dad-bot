const fetch = require('node-fetch');
const Discord = require('discord.js');
const link = 'https://a.4cdn.org/boards.json'

exports.run = async(bot,message,args) => {
    // returns a list of 4chan boards to use the the rand command
    let fetchMemes = await fetch(link).then(m => m.json())
    let list = new Array();
    for(let i=0; i < fetchMemes.boards.length ;i++)
    {
        list[i] = fetchMemes.boards[i].title +' ----- '+ fetchMemes.boards[i].board
    }
    let boardsEmbed = new Discord.MessageEmbed()
    .setTitle('4chan board list')
    .setDescription(list)
    .setColor('#ff0000');

    message.channel.send(boardsEmbed)
    
}

exports.help = {
    name: 'boards',
    description: 'Displays a list of all boards on 4chan'
}