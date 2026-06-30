// index.js
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config/config');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const logger = require('./utils/logger');

if (!config.token) {
  logger.error('DISCORD_TOKEN belum diset di environment variable / file .env!');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.reloadHandlers = function reloadHandlers() {
  loadCommands(client);
  // event listener tidak di-remove otomatis oleh EventEmitter saat reload,
  // jadi reload event hanya dianjurkan dilakukan lewat restart proses penuh.
};

loadCommands(client);
loadEvents(client);

process.on('unhandledRejection', (err) => logger.error('Unhandled promise rejection:', err));
process.on('uncaughtException', (err) => logger.error('Uncaught exception:', err));

client.login(config.token);
