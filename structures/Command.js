// Create the base class, Command.
class Command {
  constructor(client, {
    name = null,
    description = 'No description provided.',
    category = 'Miscellaneous',
    usage = 'No usage provided.',
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    extended = 'No information provided.',
    botPerms = [],
    permLevel = 'User',
    location = ''
  }) {
    this.client = client;
    this.conf = { 
      enabled, 
      guildOnly,
      aliases,
      permLevel,
      botPerms,
      location
    };
    this.help = { 
      name,
      description,
      category,
      usage,
      extended
    };
  }

  // Verifies that a user is actually a user on Discord.
  async verifyUser(user) {
    try {
      const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
      if (!match) throw 'Invalid user';
      const id = match[1];
      const check = await this.client.fetchUser(id);
      if (check.username !== undefined) return check;
    } catch (error) {
      throw error;
    }
  }

  // Makes sure a user is actually in the guild.
  async verifyMember(guild, member) {
    const user = await this.verifyUser(member);
    const target = await guild.fetchMember(user);
    return target;
  }

  // Verifies that a message actually exists.
  async verifyMessage(message, msgid) {
    try {
      const match = /([0-9]{17,20})/.exec(msgid);
      if (!match) throw 'Invalid message id.';
      const id = match[1];
      const check = await message.channel.fetchMessage(id);
      if (check.cleanContent !== undefined) return id;
    } catch (error) {
      throw error;
    }
  }

  // Verifies that a channel actually exists in the guild.
  async verifyChannel(message, chanid) {
    try {
      const match = /([0-9]{17,20})/.exec(chanid);
      if (!match) return message.channel.id;
      const id = match[1];
      const check = await message.guild.channels.get(id);
      if (check.name !== undefined && check.type === 'text') return id;
    } catch (error) {
      throw error;
    }
  }
}

// Export the class for use in commands.
module.exports = Command;