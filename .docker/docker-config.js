const config = {
  'ownerID': '166304313004523520',

  'appID': '379424813170819083',

  'admins': ['186002153066725378'],

  'token': '{{token}}',

  'twitchID': '{{twitchID}}',

  'twitchSecret': '{{twitchSecret}}',

  'defaultSettings' : {
    'prefix': '-',
    'streamChannel': 'announcements',
    'family': 'f a m i l y',
    'moderator': 'm o d e r a t o r s',
    'modLogChannel': 'logs'
  },


  permLevels: [
    { level: 0,
      name: 'User', 
      check: () => true
    },

    { level: 3,
      name: 'Family', 
      check: (message) => {
        try {
          const family = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.family.toLowerCase());
          return (family && message.member.roles.has(family.id));
        } catch (e) {
          return false;
        }
      }
    },
    { level: 4,
      name: 'Moderator',
      check: (message) => {
        try {
          const moderator = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.moderator.toLowerCase());
          return (moderator && message.member.roles.has(moderator.id));
        } catch (e) {
          return false;
        }
      }
    },
    { level: 5,
      name: 'Server Owner', 
      check: (message) => message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id ? true : false) : false
    },

    { level: 6,
      name: 'Bot Admin',
      check: (message) => config.admins.includes(message.author.id)
    },

    { level: 10,
      name: 'Bot Owner', 
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;