let fetch;

import('node-fetch').then(nodeFetch => {
    fetch = nodeFetch.default;
});

const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log(process.env.DISCORD_API_KEY)
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Extracting information
    // TODO: process the message
    const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            author: message.author.tag,
            guild: message.guild.name,
            channel: message.channel.name,
            message: message.content
        })
    });
    const data = await response.json();
    console.log(data);

    console.log(`Message from ${message.author.tag} in ${message.guild.name}#${message.channel.name}: ${message.content}`);

    // Command handling for summarizing
    if (message.content.startsWith('/analysis')) {
        console.log('Summarize command received');
        const args = message.content.slice('/summarize'.length).trim().split(/ +/);
        let minutes = args[0]; // assuming the first argument is the number of minutes

        if (!minutes) {
            minutes = 100000000; // set minutes to 100000000 if no argument is passed
        }

        // Placeholder for summarization logic
        // TODO: fetch relevant data from the DB
        const response = await fetch(`http://localhost:3000/analysis?minutes=${minutes}`);
        const data = await response.json();
        message.channel.send(`Summarize: ${data.count} messages from the last ${minutes} minutes\n${JSON.stringify(data)}`);
    }

    // Command handling for scraping
    if (message.content.startsWith('/scrape')) {
        const args = message.content.slice('/scrape'.length).trim().split(/ +/);
        const numMessages = parseInt(args[0]);

        if (isNaN(numMessages)) {
            return message.channel.send("Please provide a valid number of messages to scrape.");
        }

        // Fetching the last x messages
        try {
            const fetchedMessages = await message.channel.messages.fetch({ limit: numMessages });
            const messageContent = fetchedMessages.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');

            // Responding with the fetched messages
            // Note: Be mindful of message length limits (2000 characters)
            if (messageContent.length > 2000) {
                return message.channel.send("The fetched messages are too long to display.");
            }
            message.channel.send(`Last ${numMessages} messages:\n${messageContent}`);
        } catch (error) {
            console.error('Error fetching messages: ', error);
            message.channel.send("An error occurred while fetching messages.");
        }
    }

    // Set of keywords
 
    cheatListener = ['cheat', 'homework', 'quiz', 'test', 'exam', 'midterm', 'number', '(?:#|-?\d+(\.\d+)?)(?=#|\))', 'answers', 'discord', 'sc', 'screenshot', 'carry', 'google doc', 'DM', 'spoilers', 'boost', 'spoiler']
    // Check if the message contains any of the keywords
    if (cheatListener.some(cheatListener => message.content.includes(cheatListener))) {
        // Handle the message with the keywords
        // TODO: Add your code here
        
    }
});

client.login(process.env.DISCORD_API_KEY);
