//https://discordapp.com/oauth2/authorize?client_id=216730326179774464&scope=bot&permissions=117760

var discordAPIKey = "";
var witAiAPIKey = 'OXN5TP4XPSODFX3PY3MI3FVCAHXTEIN3';
var channelId = '216771528337915905';

var bot = require('./bot')(discordAPIKey, witAiAPIKey, channelId);

bot.events.on('ready', function(){
    bot.names(); // Scan messages and extract the usernames
});


var greetings = ['Hi %s', 'Hello %s!', 'Hey %s', 'Yo %s'];
bot.add('intent', 'greeting', greetings);

var conditions = ['I\'m doing pretty good, thanks!', 'I am well today', 'Great! How about you %s?'];
bot.add('intent', 'wellness', conditions);

var conditions = ['I am playing with cats in space'];
bot.add('intent', 'actions', conditions);

var conditions = ['Nice to meet you %s!'];
bot.add('intent', 'introduction', conditions);