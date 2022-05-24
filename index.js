// MjczOTE3ODQwOTEyODA5OTg1.WIkP3g.PIUyvnKGueAqNQyAasGHlGe8Q6M

const Discord = require('discord.js');
const bot = new Discord.Client({ws: {intents: Discord.Intents.ALL}});
const firebase = require('firebase-admin')
const config = require('./config.json');
const serviceAccount = ('./phonic-botany-321002-firebase-adminsdk-7i1xb-cbc5359c3d.json')
const fs = require("graceful-fs");
const COOKIE = require('./cookie.json');
const ytdl = require("ytdl-core");
bot.commands = new Discord.Collection();
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});
const queue = new Map();
const opts = {
    maxResults: 1,
    key: config.YOUTUBE_API,
    type: 'video'
};
let jsFile;
bot.on('ready', () => {
    console.log('Bot online')
    fs.readdir('./commands',(err,files) => {
        if(err) return console.log(err);

        jsFile = files.filter(f => f.split('.').pop() == 'js');

        if (jsFile.length == 0) return console.log("Could not find any Commands!");

        jsFile.forEach(f => {
            let props = require(`./commands/${f}`);
            bot.commands.set(props.help.name, props);
        })
    })
});

bot.on('message', (message) => {
    if(message.author.bot) return;
    if(message.channel.type !== 'text') return;
    let prefix = '>';
    if(!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(' ');
    let command = (messageArray[0].slice(prefix.length)).toLowerCase();
    let args = messageArray.slice(1);  
    const serverQueue = queue.get(message.guild.id);
    let commandFile = bot.commands.get(command);
    if(commandFile) {
        try{
            commandFile.run(bot,message,args,serverQueue,queue, opts, jsFile, firebase);
        }
            
        catch{
            message.channel.send("something fucked up");
        }
    }
})

bot.on('channelCreate', (channel) => {
    console.log(channel.name)
})

bot.on('guildMemberUpdate', (oldMember,newMember) => {
    if(oldMember.nickname !== newMember.nickname) {
        newMember.send('You changed your nickname!');
    }
    let oldAvatar = oldMember.user.avatarURL();
    let newAvatar = newMember.user.avatarURL();
    if(oldAvatar !== newAvatar){
        newMember.send('Your avatar has changed');
    }
})


bot.login(COOKIE.DISCORD);

