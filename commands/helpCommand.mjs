/* eslint-disable import/extensions */
import Discord from 'discord.js';
import { sendMessageWithOptions } from '../utils/Utils.mjs';

/**
 *
 * @param {Discord.Message} message
 */
// eslint-disable-next-line import/prefer-default-export
export const getHelpCommand = async (args, message) => {
  switch (args[1]) {
    case 'weather':
      return sendMessageWithOptions(message,
        new Discord.RichEmbed()
          .setTitle('Weather')
          .setDescription('Usage : !ti weather <now, today, or forecast> <any location>\nGets the requested weather format for the location provided'),
        true);
    case 'sr':
      return sendMessageWithOptions(message,
        new Discord.RichEmbed()
          .setTitle('Random Reddit Post')
          .setDescription('Usage : !ti sr <any subreddit> [q <search query>]\nGets a random image from specified subreddit. You can specify `q <search query>` to get results related to that query'),
        true);
    case 'roll':
      return sendMessageWithOptions(message,
        new Discord.RichEmbed()
          .setTitle('Roll')
          .setDescription('Usage : !ti roll <number 1> [<number 2>]\nIf number 1 and number 2 are specified it will roll a random number between them. If only number 1 is specifed, it will roll a number between 0 and number 1'),
        true);
    case 'conch':
      return sendMessageWithOptions(message,
        new Discord.RichEmbed()
          .setTitle('Magic Conch')
          .setDescription('Usage : !ti conch <your question for the magic conch>\nAsk the all knowing Magic Conch any question and it will give you an answer'),
        true);
    case 'events':
      return sendMessageWithOptions(message,
        new Discord.RichEmbed()
          .setTitle('Event Scheduler')
          .addField('!ti events schedule <event-name> <mm/dd/yyyy> <hh:mm am/pm>', 'Schedule a new event with you as the host')
          .addField('!ti events sub <eventId>', 'Subscribe to someone elses event')
          .addField('!ti events unsub <eventId>', 'Unsubscribe from someone elses event')
          .addField('!ti events cancel <eventId>', 'Cancel event that you are hosting (Must be event host)')
          .addField('!ti events list [eventId]', 'List all events, or specify eventId to list details for that one event'),
        true);
    // Admin commands
    case 'config':
      return sendMessageWithOptions(message,
        new Discord.RichEmbed()
          .setTitle('Admin Configuration')
          .setDescription('Usage : !ti config nsfw <on/off> or <true/false>\nWill turn on or off the NSFW filter for the sr command'),
        true);
    default:
      return sendMessageWithOptions(message,
        new Discord.RichEmbed()
          .setTitle('__Commands__')
          .setDescription('You can see more informations about the commands by typing !ti help <command>.')
          .addField('User Commands : ', '``events`` ``weather`` ``sr`` ``roll`` ``conch`` ``help``')
          .addField('Admin Commands : ', '``config``'),
        true);
  }
};
