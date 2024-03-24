let fetch;

import('node-fetch').then(nodeFetch => {
    fetch = nodeFetch.default;
});

const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log(process.env.DISCORD_API_KEY)
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const CHANNEL_NAME = 'general'; // The channel name you're looking for

client.once('ready', async () => {
    console.log('Bot is online!');

    client.guilds.cache.forEach(async guild => {
        const channels = guild.channels.cache.filter(c => c.name === CHANNEL_NAME);
        
        for (let channel of channels.values()) {
            console.log('inside')
            
            try {
                // Fetch the last 10 messages from each 'general' channel found
                const messages = await channel.messages.fetch({ limit: 100 });
                // TODO: STORE MESSAGES
                console.log(`Last messages in ${guild.name} #${channel.name}:`);
                messages.forEach(msg => console.log(`${msg.author.tag}: ${msg.content}`));
            } catch (error) {
                console.error(`Could not fetch messages from #${channel.name} in ${guild.name}:`, error);
            }
        }
    });
});

client.on('messageCreate', async message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Send the messages to the server on /upload
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
    
    // This is response from server, it contains the confidence level of cheating
    const data = await response.json();
    console.log(data);
    console.log(`Message from ${message.author.tag} in ${message.guild.name}#${message.channel.name}: ${message.content}`);

    // Command for generating Word Clouds
    if (message.content.startsWith('/wordcloud')) {
        console.log('Word Cloud command received');
        const args = message.content.slice('/wordcloud'.length).trim().split(/ +/);
        let name = args[0]; // assuming the first argument is the name of person to generate word cloud for

        if (!name) {
            name = "server"; // set name to server if no argument is passed
        }
        
        // generates a word cloud image and sends it to the channel
        const imageUrl = 'https://imgur.com/a/RkZqsyv.png'; // Placeholder for the image URL

        // EmbedBuilder() was not working, so using a this alternative
        const title = 'Word Cloud';
        message.channel.send(`${title}\n${imageUrl}`);
    }

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
 
});

client.login(process.env.DISCORD_API_KEY);
