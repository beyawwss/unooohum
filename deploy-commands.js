// deploy-commands.js
// Jalankan sekali (atau setiap kali ada command baru/berubah) dengan: node deploy-commands.js
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('./config/config');
const logger = require('./utils/logger');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of files) {
  const command = require(path.join(commandsPath, file));
  if (command?.data) commands.push(command.data.toJSON());
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    logger.info(`Mendaftarkan ${commands.length} slash command...`);

    const route = config.guildId
      ? Routes.applicationGuildCommands(config.clientId, config.guildId)
      : Routes.applicationCommands(config.clientId);

    await rest.put(route, { body: commands });

    logger.info(`✅ Berhasil mendaftarkan ${commands.length} slash command${config.guildId ? ' (guild, langsung muncul)' : ' (global, bisa butuh ~1 jam untuk muncul)'}.`);
  } catch (err) {
    logger.error('Gagal mendaftarkan command:', err);
    process.exit(1);
  }
})();
