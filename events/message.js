// Declare dependencies used to format command timestamps.
const moment = require('moment');
require('moment-duration-format');

// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    //  and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Grab the settings for this server from the PersistentCollection
    // If there is no guild, get default conf (DMs)
    const defaults = this.client.config.defaultSettings;
    const settings = message.guild ? this.client.settings.get(message.guild.id) : defaults;
    message.settings = settings;
    
    // Get the user or member's permission level from the permLevel function, index.js lines 28-42.
    const level = this.client.permlevel(message);
    
    // Create a secondary master prefix. This is the bot's mention.
    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}> `);
    const prefixMention = mentionPrefix.exec(message.content);

    // Declare the prefixes.
    const prefixes = [settings.prefix, defaults.prefix, `${prefixMention}`];
    let prefix = false;

    for (const thisPrefix of prefixes) {
      if (message.content.indexOf(thisPrefix) == 0) prefix = thisPrefix;
    }

    // Check to see if the messages content mentions the bot, and if so, return prefix information.
    if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) {
      let mentionMsg = '';
      settings.prefix === defaults.prefix ? mentionMsg = `The prefix is \`${settings.prefix}\`.` : mentionMsg = `This server's prefix is \`${settings.prefix}\`, whilst the default prefix is \`${defaults.prefix}\``;
      return message.channel.send(mentionMsg);
    }

    // Return if the message doesn't begin with the bot's prefix.
    if (!prefix) return;

    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();    

    // Check whether the command, or alias, exist in the collections defined
    // in index.js.
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;

    // Some commands may not be useable in DMs. This check prevents those commands from running
    // and return a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');

    // Let the user know that they don't have permission to run a command if the systemNotice 
    // value in the server's settings is set to true.
    if (level < this.client.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === 'true') {
        return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name})
This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      } else {
        return;
      }
    }

    // To simplify message arguments, the author's level is now put on level (not member, so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    message.author.permLevel = level;

    // Useful little thing, allows for commands to use switch cases.
    message.flags = [];
    while (args[0] && args[0][0] === '-') {
      message.flags.push(args.shift().slice(1));
    }
    
    // If the command exists, **AND** the user has permission, run it.
    this.client.log('Log', `[${moment(message.createdAt).format('h:mm:ss')}] ${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, 'CMD');

    // Uses the permCheck function, index.js lines 51-54, to let the user know if the bot is missing any required 
    // permissions for a command.
    if (message.channel.type === 'text') {      
      const mPerms = this.client.permCheck(message, cmd.conf.botPerms);
      if (mPerms.length) return message.channel.send(`The bot does not have the following permissions \`${mPerms.join(', ')}\``);
    }

    cmd.run(message, args, level).catch(error => {
      console.log(error);
      message.channel.send(error);
    });
  }
};