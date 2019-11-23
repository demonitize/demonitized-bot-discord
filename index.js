//Thanks for downloading my Command Handler.
console.log("Modified by Doug#1337")
console.log("Made for DEMONITIZED BOT")

const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
const {token, prefix, defaultCooldownInMinutes} = require('./config.json');
bot.commands = new Discord.Collection();
var arrayOfCommands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    arrayOfCommands.push({description: command.description, syntax: command.syntax})
}
const cooldowns = new Discord.Collection();

exports.exportArray = arrayOfCommands;


bot.on('message', msg =>{
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args = msg.content.slice(prefix.length).split(" ");
    const commandName = args.shift().toLowerCase();
    if (!bot.commands.has(commandName)){
        msg.channel.send({embed : {
            fields: [{
                name: "Error!",
                value: "Unknown command"
            }]
        }});
        return;
    }
    const command = bot.commands.get(commandName);
    if(command.args && !args.length || command.args && args.length < command.numOfArgs && !command.argsExact || command.args && args.length !== command.numOfArgs && command.argsExact) {
        return msg.channel.send({embed: {
            fields: [{
                name: "Invalid syntax!",
                value: `${prefix}${command.syntax}`
            }]
        }});
    }
    if (!cooldowns.has(command.name) && command.cooldown){
        cooldowns.set(command.name, new Discord.Collection());
        var cooldownAmount;
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        if (command.cooldown === "default"){
            cooldownAmount = (defaultCooldownInMinutes) * 60000;
        } else if (command.cooldown){
            cooldownAmount = (command.cooldown) * 60000;
        }
        if (timestamps.has(msg.author.id)){
            const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
    
            if(now < expirationTime){
                const timeLeft = (expirationTime - now) / 60000;
                return msg.channel.send({embed : {
                    fields: [{
                        name: "Error!",
                        value: `You must wait ${timeLeft.toFixed(1)} more minute(s) before running this command again!`
                    }]
                }});
            }
        } else {
            timestamps.set(msg.author.id, now);
            setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
        }
    } else if (cooldowns.has(command.name) && command.cooldown){
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        if (command.cooldown === "default"){
            cooldownAmount = (defaultCooldownInMinutes) * 60000;
        } else if (command.cooldown){
            cooldownAmount = (command.cooldown) * 60000;
        }

        if (timestamps.has(msg.author.id)){
            const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
    
            if(now < expirationTime){
                const timeLeft = (expirationTime - now) / 60000;
                return msg.channel.send({embed : {
                    fields: [{
                        name: "Error!",
                        value: `You must wait ${timeLeft.toFixed(1)} more minute(s) before running this command again!`
                    }]
                }});
            }
        } else {
            timestamps.set(msg.author.id, now);
            setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
        }
    }

    command.execute(msg, args)
})

bot.login(token);
