// Obtain Node.js's current version, and determine if it is above 8.5.0. If not, throw an error, and refuse to start.
if (process.version.slice(1).split('.')[1] < 5) throw new Error('Node 8.5.0 or higher is required. Node 8.9.4 is suggested. Update Node on your system.');

// Declare dependencies.
const { Client } = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const klaw = require('klaw');
const path = require('path');
const fs = require('fs');

// Create the base class, Aetherya, extending the Discord Client, and attach options to this.client.
class Aetherya extends Client {
  constructor(options) {
    super(options);

    this.config = require('./config.js');
    
    this.commands = new Enmap();
    this.aliases = new Enmap();

    this.settings = new Enmap({ provider: new EnmapLevel({ name: 'settings'}) });
    this.applications = new Enmap({ provider: new EnmapLevel({ name: 'applications'}) });
  }

  // Create the permission level functions. Allows for restricting commands to certain permission levels created in config.js.
  permlevel(message) {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  // Create logging function, this.client.log.
  log(type, msg, title) {
    if (!title) title = 'Log';
    console.log(`[${type}] [${title}] ${msg}`);
  }

  // Runs on every command to see if the bot is missing any permissions required by that command. Attached to /events/message.js
  permCheck(message, perms) {
    if (message.channel.type !== 'text') return;
    return message.channel.permissionsFor(message.guild.me).missing(perms);
  }

  // Loading function for commands. Used in init.
  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(client);
      props.conf.location = commandPath;
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return client.log('Log', `Unable to load command ${commandName}: ${e}`, 'ERROR');
    }
  }

  // Unloading function for commands. Used in the reload command.
  async unloadCommand(commandPath, commandName) {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
  
    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`${commandPath}/${commandName}.js`)];
    return false;
  }
}

// Create the actual client, the one that logs in.
const client = new Aetherya({
  fetchAllMembers: true
});
console.log(client.config.permLevels.map(p => `${p.level} ${p.name}`));

require('./util/functions.js')(client);

// All important things are done here. Commands and events are loaded, and a permission level cache is created.
const init = async () => {

  // Loads all commnands in the /commands directory.
  const commandList = [];
  klaw('./commands').on('data', (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== '.js') return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    commandList.push(cmdFile.name);
    if (response) console.log(response);
  }).on('end', () => {
    client.log('Log', `Loaded a total of ${commandList.length} commands.`);
  }).on('error', (error) => client.log('ERROR', error));

  // Loads all events in the /events directory.
  const eventList = [];
  klaw('./events').on('data', (item) => {  
    const eventFile = path.parse(item.path);
    if (!eventFile.ext || eventFile.ext !== '.js') return;
    const eventName = eventFile.name.split('.')[0];
    try {
      const event = new (require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(client);    
      eventList.push(event);      
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)];
    } catch (error) {
      client.log('ERROR', `Error loading event ${eventFile.name}: ${error}`);
    }
  }).on('end', () => {
    client.log('Log', `Loaded a total of ${eventList.length} events.`);
  }).on('error', (error) => client.log('ERROR', error));

  // Magic.
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  // Login. Duh.
  client.login(client.config.token);
};

// Runs init. Actually logs the client in.
init();