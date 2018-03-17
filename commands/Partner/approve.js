const Partner = require('../../structures/Partner.js');

class Approve extends Partner {
  constructor(client) {
    super(client, {
      name: 'approve',
      description: 'Approve a partner application.',
      usage: 'approve <app number> <optional message>',
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
      permLevel: 'Moderator'
    });
  }

  async run(message, [id, ...reason], level) {
    const settings = message.settings;

    if (isNaN(id)) return message.reply(`Please supply a valid application. \`${id}\` is not a valid application.`);

    if (!reason || !reason.length) return message.reply('Please supply a message that you would like to send to the applicant.');

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
        app.authorID = app.author.name.split('(')[1].split(')')[0];
      
        await this.client.users.get(app.authorID).send('Your application has been approved!');
        const embed = await this.appApprove('0xaff5d2', app.invite, app.count, app.author.name, app.author.iconURL, new Date(), id);
        partnerlog.send({ embed });
      });
    });
  }
}

module.exports = Approve;