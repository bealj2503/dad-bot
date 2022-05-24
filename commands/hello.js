exports.run = async (bot,message,args) => {
    let member = message.mentions.members.first();
    // testing command
    if(!member){ message.channel.send('hello')
    }
    else{
        message.channel.send(`hello ${member.user.tag}`)
    }
}

exports.help = {
    name: 'hello',
    description: 'says hello'
}