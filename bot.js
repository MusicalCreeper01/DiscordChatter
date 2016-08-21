// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();

var intentLists = {};

var bot;
var botReady = false;


module.exports = (discordapikey, witapikey, channel) => {
    if(channel == undefined)
        channel = null;

    const {Wit, log} = require('node-wit');
    var util = require('util');

    var Discord = require('discord.io');
    bot = new Discord.Client({
        autorun: true,
        token: discordapikey
    });

    const client = new Wit({accessToken: witapikey});

    bot.on('ready', function(event) {
        botReady = true;
        eventEmitter.emit('ready');
        console.log('Logged in as %s - %s\n', bot.username, bot.id);
        bot.setPresence( {
            idle_since: null,
            game: {
                name: "in space!"
            }
        } );
    });

    bot.on('message', function(user, userID, channelID, message, event) {
        if(channel != channelID && channel != null)
            return;

        if(userID != bot.id){
            console.log('[MESSAGE]' + channelID + ': ' + message);

            client.converse(userID, message, {name:user.username})
                .then((data) => {
                console.log('Confidence: ' + data.confidence);
                console.log('Data: ' + JSON.stringify(data));
                if(data.confidence < 0.04){
                    bot.sendMessage({
                        to: channelID,
                        message: "Pardon?",
                        typing: true
                    });
                }else {
                    if(data.entities != undefined){
                        var name = null;
                        if(data.entities.name != null){
                            name = data.entities.name[0].value;
                        }
                        for(var key in data.entities){ // loop through entities
                            if(intentLists[key] != undefined){ 
                                for(var key2 in data.entities[key]){ //Loop through entity values
                                    var k = data.entities[key][key2].value;
                                    if( intentLists[key][k] != undefined){
                                        var msgs = intentLists[key][k];
                                        
                                        var msg = msgs[getRandomInt(0, msgs.length-1)];
                                        if(name != null)
                                            msg = util.format(msg, '<@!'+name+'>');
                                        else if(msg.indexOf('%s') > 0)
                                            msg = util.format(msg, '<@'+userID+'>');
                                        console.log('Responce: ' + msg);
                                        bot.sendMessage({
                                            to: channelID,
                                            message: msg,
                                            typing: true
                                        });   
                                    }
                                }
                            }    
                        }
                    }
                }
            })
                .catch(console.error);
        }
    }); 
    return {
        add: (entity, value, phrases) => {
            if(intentLists[entity] === undefined)
                intentLists[entity] = {};

            intentLists[entity][value] = phrases;
        },
        names: () => {
            bot.getMessages( {
                channelID: channel,
                limit: 50
            }, function(err, msgs){
                console.log(JSON.stringify(err));
                msgs.forEach(function(message){
                    var author = message.author;
                    var username = author.username;
                    var userid = author.discriminator;
                    
                    var body = message.content;
                    
                    
                    
                });
            });
        },
        events: eventEmitter
    };
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
                ? args[number] 
            : match
            ;
        });
    };
}