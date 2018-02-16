const moment = require('moment');
const bot = require('../package.json');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    await this.client.wait(1000);

    if (this.client.users.has('1')) {
      this.client.users.delete('1');
    }

    this.client.log('Log', `${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers on version ${bot.version}.`, 'Ready!');

    this.client.guilds.filter(g => !this.client.settings.has(g.id)).forEach(g => this.client.settings.set(g.id, this.client.config.defaultSettings));
  }
};