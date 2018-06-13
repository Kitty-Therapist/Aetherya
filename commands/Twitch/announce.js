const Twitch = require('../../structures/Twitch.js');

class Announce extends Twitch {
  constructor(client) {
    super(client, {
      name: 'announce',
      description: 'Announces a stream.',
      usage: '<aria|azreal|felics|lady> <title> <description>',
      guildOnly: true,
      aliases: ['stream', 'twitch'],
      extended: 'Announce your stream with this command. Requires the title of your stream and a description of it.',
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  async run(message, [rawTitle, ...rawDescription], level) {
    const { prefix, streamChannel } = this.client.settings.get(message.guild.id);
    if (!message.flags.length) return message.channel.send(`The proper usage of this command is \`${prefix}${this.help.name} ${this.help.usage}\``);

    switch (message.flags[0]) {
      case 'aria': {
        const role = 'aria\'s Stream';
        const title = rawTitle.split('_').join(' ');
        const description = rawDescription.join(' ');
        const streamURL = 'https://www.twitch.tv/aria_streams';
        await this.streamEmbed(this.client, message, title, description, streamURL);
        const channel = message.guild.channels.find('name', streamChannel);
        const streamRole = await message.guild.roles.find('name', `${role}`);
        if (streamRole.mentionable === false) await streamRole.edit({ mentionable: true });
        await channel.send(`${streamRole}`);
        await streamRole.edit({ mentionable: false });
        break;
      }

      case 'felics': {
        const role = 'Felic\'s Stream';
        const title = rawTitle.split('_').join(' ');
        const description = rawDescription.join(' ');
        const streamURL = 'https://www.twitch.tv/felixinfintum';
        await this.streamEmbed(this.client, message, title, description, streamURL);
        const channel = message.guild.channels.find('name', streamChannel);
        const streamRole = await message.guild.roles.find('name', `${role}`);
        if (streamRole.mentionable === false) await streamRole.edit({ mentionable: true });
        await channel.send(`${streamRole}`);
        await streamRole.edit({ mentionable: false });
        break;
      }

      case 'joey': {
        const role = 'Joey\'s Stream';
        const title = rawTitle.split('_').join(' ');
        const description = rawDescription.join(' ');
        const streamURL = 'https://www.twitch.tv/goldmanjh';
        await this.streamEmbed(this.client, message, title, description, streamURL);
        const channel = message.guild.channels.find('name', streamChannel);
        const streamRole = await message.guild.roles.find('name', `${role}`);
        if (streamRole.mentionable === false) await streamRole.edit({ mentionable: true });
        await channel.send(`${streamRole}`);
        await streamRole.edit({ mentionable: false });
        break;
      }

      case 'bananakins': {
        const role = 'Bananakin\'s Stream';
        const title = rawTitle.split('_').join(' ');
        const description = rawDescription.join(' ');
        const streamURL = 'https://www.twitch.tv/bananakin_skywalker';
        await this.streamEmbed(this.client, message, title, description, streamURL);
        const channel = message.guild.channels.find('name', streamChannel);
        const streamRole = await message.guild.roles.find('name', `${role}`);
        if (streamRole.mentionable === false) await streamRole.edit({ mentionable: true });
        await channel.send(`${streamRole}`);
        await streamRole.edit({ mentionable: false });
      }

      case 'rashaun': {
        const role = 'Rashaun\'s Stream';
        const title = rawTitle.split('_').join(' ');
        const description = rawDescription.join(' ');
        const streamURL = 'https://www.twitch.tv/reshayshay';
        await this.streamEmbed(this.client, message, title, description, streamURL);
        const channel = message.guild.channels.find('name', streamChannel);
        const streamRole = await message.guild.roles.find('name', `${role}`);
        if (streamRole.mentionable === false) await streamRole.edit({ mentionable: true });
        await channel.send(`${streamRole}`);
        await streamRole.edit({ mentionable: false });
       }

      case 'ghoul': {
        const role = 'Ghoul\'s Stream';
        const title = rawTitle.split('_').join(' ');
        const description = rawDescription.join(' ');
        const streamURL = 'https://www.twitch.tv/ghoulishfantasy';
        await this.streamEmbed(this.client, message, title, description, streamURL);
        const channel = message.guild.channels.find('name', streamChannel);
        const streamRole = await message.guild.roles.find('name', `${role}`);
        if (streamRole.mentionable === false) await streamRole.edit({ mentionable: true });
        await channel.send(`${streamRole}`);
        await streamRole.edit({ mentionable: false });

      }
    }
  }
}

module.exports = Announce;
