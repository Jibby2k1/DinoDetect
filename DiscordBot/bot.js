const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
// Use env vars like so "process.env.DISCORD_API_KEY"


client.once('ready', () => {
    console.log('Ready!');
});

client.login();