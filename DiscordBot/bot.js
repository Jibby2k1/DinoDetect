const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Extracting information
    // TODO: process the message
    console.log(`Message from ${message.author.tag} in ${message.guild.name}#${message.channel.name}: ${message.content}`);

    // Command handling for summarizing
    if (message.content.startsWith('/summarize')) {
        const args = message.content.slice('/summarize'.length).trim().split(/ +/);
        let minutes = args[0]; // assuming the first argument is the number of minutes

        if (!minutes) {
            minutes = 100000000; // set minutes to 100000000 if no argument is passed
        }

        // Placeholder for summarization logic
        // TODO: fetch relevant data from the DB
        message.channel.send(`Summarizing the last ${minutes} minutes... (feature not fully implemented)`);
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
});

client.login(process.env.DISCORD_API_KEY);
