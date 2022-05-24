const fetch = require('node-fetch');
const Discord = require('discord.js');


exports.run = async(bot,message,args,serverQueue,queue, opts, jsFile, firebase) => {
    let database = firebase.firestore();
    let link = `https://api.jikan.moe/v3/search/anime?q=${args[0]}`
    for(let i = 1; i<args.length;i++){
        link = link.concat(`%20${args[i]}`);
    }
    link = link.concat('&page=1&limit=10');
    // query the users request to search for an anime on MyAnimeList
    let query = '';  
    for(let i = 0;i<args.length;i++){
        query = query.concat(args[i]);
        if(i != (args.length - 1)){
            query = query.concat(' ');
        } 
    }
    
    let fetchCatalog = await fetch(link).then(m=>m.json());
    let results = fetchCatalog.results;
    let english = [];
    // filter results to find the english title for the anime
    for(let i = 0; i<results.length;i++){
        english[i] = '';
        if(!(results[i].title.toLowerCase().includes(query))){
            let newLink = `https://api.jikan.moe/v3/anime/${results[i].mal_id}/`
            let fetchAnime = await fetch(newLink).then(m=>m.json());
            if(fetchAnime.title_english){
                english[i] = fetchAnime.title_english.replace(/[^A-Za-z0-9]/g, ' ');
            }
            
        }
        
    }
    
    let betterResults = new Array();
    let counter = 0;
    for(let i = 0; i<results.length;i++){
        if((english[i].toLowerCase().includes(query) || results[i].title.toLowerCase().includes(query)) && (results[i].type.toLowerCase().includes('tv') /*|| results[i].type.toLowerCase().includes('movie')*/)){
            betterResults[counter] = results[i];
            counter++;
        }
    }
    // output to the user animes that contain their search keys with both links to MyAnimeList and AnimePahe
    for(let i = 0; i<betterResults.length;i++){
        const embed = new Discord.MessageEmbed()
        .setTitle(betterResults[i].title)
        .setURL(betterResults[i].url)
        .setDescription(betterResults[i].synopsis)
        .setImage(betterResults[i].image_url)
        .addField('AnimePahe link', await pahe(betterResults[i].title,database));
        message.channel.send(embed);
    }
}
async function pahe (query,database){
    let url = await readAnime(database,query);
    // if url doesnt exist in the firebase storage parse the animepahe website to find the anime that was searched.
    if(url == 'no url'){
        let paheLink = 'https://animepahe.com/api?m=airing&l=12&page=1'
        let fetchVids = await fetch(paheLink).then(m => m.json());
        console.log(query);
        let match = 0;
        let obj;
        let linkToPrint;
        for(let i = 2;i<=fetchVids.last_page;i++){
            obj = fetchVids.data;
            if(JSON.stringify(obj).includes(`"${query}"`)){
                console.log('this happens irl')
                for(let k = 0;k<12;k++){
                    if(fetchVids.data[k].anime_title == query){
                        linkToPrint = `https://animepahe.com/anime/${fetchVids.data[k].anime_session}`;
                        console.log(fetchVids.data[k].title);
                        writeAnime(database,fetchVids.data[k].anime_title,linkToPrint);
                        return linkToPrint;
                    }
                } 
            }
            if(match != 1){
                paheLink = `https://animepahe.com/api?m=airing&l=12&page=${i}`
                fetchVids = await fetch(paheLink).then(m => m.json())
            }
        }
        return 'no url';    
    }
    else{
        return url;
    }
    
    
}
function writeAnime(database,title, url) {
    // if the anime was not located in the firebase storage add it for smoother parsing in the future.
    animeTitle = title
    if (animeTitle.includes('/')){
        console.log("smh")
        animeTitle = animeTitle.replace(/\//g,'-');
        console.log(animeTitle)
    }
    database.collection('anime').doc(animeTitle).set({
      title: title,
      url: url
    });
  }
async function readAnime(database,title) {
    // read the firebase storage to see if the anime was previously added before scraping the AnimePahe website
    animeTitle = title;
    if (animeTitle.includes('/')){
        animeTitle = animeTitle.replace(/\//g,'-');
    }
    return database.collection('anime').doc(animeTitle).get().then((doc)=>{
      if(doc.exists){
          return doc.data().url;
      }else{
          return 'no url';
      }
    });
    
  }
exports.help = {
    name: 'anime',
    description: 'Sends the searched for anime and any anime that contains that anime keyword with links to both MyAnimeList and AnimePahe\n for example a search for attack on titan would return all seasons of attack on titan',
    usage: '>anime (anime name)'
}