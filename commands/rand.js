const fetch = require('node-fetch');
const Discord = require('discord.js');
const link = 'https://a.4cdn.org/boards.json'

exports.run = async(bot,message,args) => {
    // takes user input and selects a 4chan board's catalogged posts
    const newLink = 'https://a.4cdn.org/'+args[0]+'/catalog.json';
    let fetchCatalog = await fetch(newLink).then(m=>m.json())
    //simple random page and thread selectors to be sent back to the user
    let randomPage = fetchCatalog[Math.floor(Math.random() * fetchCatalog.length)]
    let randomThread = randomPage.threads[Math.floor(Math.random() * randomPage.threads.length)]

    let threadLink = 'https://a.4cdn.org/'+args[0]+'/thread/'+randomThread.no+'.json';
    let fetchThread = await fetch(threadLink).then(m=>m.json())

    let randomPost = fetchThread.posts[Math.floor(Math.random() * fetchThread.posts.length)];

    for(let i = 0;i<fetchThread.posts.length;i++){
        
        randomPost = fetchThread.posts[Math.floor(Math.random() * fetchThread.posts.length)];
        if(i == (fetchThread.posts.length-1) && (randomPost.ext !== '.gif' || (randomPost.ext !== '.png') || (randomPost.ext !== '.jpg')))
        {
            randomThread = randomPage.threads[Math.floor(Math.random() * randomPage.threads.length)];

            threadLink = 'https://a.4cdn.org/'+args[0]+'/thread/'+randomThread.no+'.json';

            
            fetchThread = await fetch(threadLink).then(m=>m.json())
            i = 0
        }
        if(randomPost.ext == '.gif' || (randomPost.ext == '.png') || (randomPost.ext == '.jpg')){
            i = fetchThread.posts.length;
        }
        
    }

    let memeEmbed = new Discord.MessageEmbed()
    .setImage('https://is2.4chan.org/'+args[0]+'/'+randomPost.tim+randomPost.ext)
    .setColor('#ff0000')
    message.channel.send(memeEmbed)
}

exports.help = {
    name: 'rand',
    description: 'Posts a random image or gif from the selected board',
    usage: '>rand (board name)'
}