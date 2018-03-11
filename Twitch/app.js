const tmi = require('tmi.js');

const options = require('./options');

const client = new tmi.client(options);

client.connect();

client.on('chat', async function(channel, user, message, self) {
  if (message === '!twitter') {
    const mods = await client.mods('OGNovuh');
    console.log(mods);
    console.log(channel);
  }  
});

client.on('connected', function(address, port) {
  // console.log(`Address: ${address} Port: ${port}`);
  client.action('OGNovuh', 'Hello. You made me.');
});

client.on('chat', async function(channel, user, message, args) {
  if (message === '!ban') {
    const mods = await client.mods(`${channel}`);
    console.log(mods);
    if (mods.includes(user)) {
      client.action('OGNovuh', 'You aren\'t a mod. Y u do dis.');
    }
  }
});