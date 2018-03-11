// Declare the bot variable to use to get the version.
const bot = require('../package.json');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    // Wait 1 second to allow for the settings to load.
    await this.client.wait(1000);

    // Delete Clyde from the bot's user cache.
    if (this.client.users.has('1')) {
      this.client.users.delete('1');
    }

    // Log that the bot has logged in.
    this.client.log('Log', `${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers on version ${bot.version}.`, 'Ready!');

    // Filter through the guilds to see if a guild was added while the bot was offline.
    // If so, create the guilds settings.
    this.client.guilds.filter(g => !this.client.settings.has(g.id)).forEach(g => this.client.settings.set(g.id, this.client.config.defaultSettings));
  }
};