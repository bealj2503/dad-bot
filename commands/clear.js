const fetch = require('node-fetch');

exports.run = async(bot,message,args) => {
    // Useful clear command to delete spam in the discord text channel
    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("You do not have enough permission to clear messages")
    if(isNaN(args[0])) return message.reply("You must enter a number");
    if(!args[0]) return message.reply("You must enter a number of messages to be deleted");
    if(args[0] > 100) return message.reply('you cannot delete more than 100 messages');
    if(args[0] < 0) return message.reply('you must delete at least one message');
    message.channel.bulkDelete(parseInt(args[0]))
    
    
        
}

exports.help = {
    name: 'clear',
    description: 'clears messages in chat',
    usage: '>clear (number of messages to be cleared)'
}