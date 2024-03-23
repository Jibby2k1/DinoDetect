const { SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('summarize')
        .setDescription('Summarizes the last X minutes of messages.')
        .addIntegerOption(option => 
            option.setName('minutes')
                  .setDescription('The number of minutes to summarize')
                  .setRequired(true)),
    // Add other commands here
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_API_KEY);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();