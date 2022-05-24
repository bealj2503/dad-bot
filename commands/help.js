
const Discord = require('discord.js');
const fs = require("fs");
const path = require('path');
exports.run = async (bot,message,args,serverQueue,queue, opts, jsFile) => {
    let member = message.author;
    let nameList = new Array();
    let i = 0;
    jsFile.forEach(f => {
        let props = require(`./${f}`);
        if(props.help.usage){
            nameList[i] = `>**${props.help.name}** ----- ${props.help.description}\n \t**Usage**: ${props.help.usage}`;
        }
        else {
            nameList[i] = `>**${props.help.name}** ----- ${props.help.description}`
        }
        i++;
    })
    // when help command is run get all command info from each command and private message the user requesting help
    let helpEmbed = new Discord.MessageEmbed()
    .setTitle('DadBot Commands')
    .setDescription(nameList)
    .setColor('#ff0000');

    member.send(helpEmbed);
}

exports.help = {
    name: 'help',
    description: 'DadBot sends the user a list of all commands'

}