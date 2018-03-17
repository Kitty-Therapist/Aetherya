const Partner = require('../../structures/Partner.js');

const { RichEmbed } = require('discord.js');

const regex = /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i;

class Apply extends Partner {
  constructor(client) {
    super(client, {
      name: 'apply',
      description: 'Submit an application for Partner.',
      usage: 'apply <server link> <member count> <reason>'
    });
  }

  async run(message, [invite, count, ...reason]) {
    const pyes = this.client.emojis.get('423664501083340811');
    const pno = this.client.emojis.get('423664500999192598');
    try {
      reason = reason.join(' ');
      // if (message.channel.type !== 'dm') return message.reply('Please execute this command in a **Direct Message** for confidentiality.');
      if (!invite || !invite.length) return message.reply('Please provide a invite to your server.');
      if (!count || !count.length) return message.reply('Please provide the current member count for your server.');
      if (!reason || !reason.length) return message.reply('You must supply a reason as to why you would like to partner with us.');

      if (!regex.test(invite)) return message.reply('That is not a valid server invite.');
      if (isNaN(count)) return message.reply('That is not a valid member count.');
      if (Number(count) < 75) return message.reply('You do not meet the minimum requirements for partnership `Not enough members`.');
      if (reason.length <= 10) return message.reply('You must supply a reason as to why you would like to partner with us.');

      await message.delete();

      await this.buildPartnerApp(this.client, message.guild, invite, count, reason, message.author);

      return message.reply('Thank you for your application, a member of staff will review it as soon as possible.');
    } catch (e) {
      console.log(e);
    }
  }

}

module.exports = Apply;