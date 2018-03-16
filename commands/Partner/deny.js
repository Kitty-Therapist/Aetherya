const Partner = require('../../structures/Partner.js');

class Deny extends Partner {
  constructor(client) {
    super(client, {
      name: 'deny',
      description: 'Deny a partner application.',
      usage: 'deny <app number>',
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message, [id], level) {
    const settings = message.settings;

    const partnerlog = message.guild.channels.find('name', settings.partnerLog);
    await partnerlog.fetchMessages({ linit: 100 }).then((messages) => {
      const appLog = messages.filter(m => m.author.id === this.client.user.id &&
        m.embeds[0] &&
        m.embeds[0].type === 'rich' &&
        m.embeds[0].footer &&
        m.embeds[0].footer.text.startsWith('Application') &&
        m.embeds[0].footer.text === `Application ${id}` 
      ).first();

      partnerlog.fetchMessage(appLog.id).then(async appMsg => {
        const app = appMsg.embeds[0];
        app.invite = app.description.split(' ')[2];
        app.count = app.description.split(' ')[5];
        app.split = app.description.split(' ');

        const embed = await this.appDeny('0xfe908a', app.invite, app.count, app.author.name, app.author.iconURL, new Date(), id);
        partnerlog.send({ embed });
      });
    });
  }
}

module.exports = Approve;