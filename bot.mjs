/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Discord from 'discord.js';
import dotenv from 'dotenv';
import {
  changeNicknameCommand, getRandomSubPostCommand, rollNumberCommand,
  setNsfwFilterCommand, magicConchCommand, getRandomSubPostWithSearchCommand,
} from './commands/botCommands.mjs';
import { getPrefix, sendMessageWithOptions } from './utils/Utils.mjs';
import { getWeeklyForecast, getWeatherNow, getWeatherToday } from './commands/weatherCommands.mjs';
import { getHelpCommand } from './commands/helpCommand.mjs';
import { summonBobbyB } from './commands/bobbybCommands.mjs';
import { summonDog } from './commands/houndCommands.mjs';
import {
  scheduleNewEvent, subscribeToEvent, showUpcomingEvents, unsubscribeFromEvent, cancelEvent,
} from './commands/scheduledEventsCommands.mjs';

dotenv.config();

const client = new Discord.Client();

const PREFIX = getPrefix();
console.log(PREFIX);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// WIP
client.on('message', async (message) => {
  // ignore all bot messages
  if (message.author.bot) return;

  // nickname shenanigans
  if (message.author.id === process.env.MESSAGING_USERS_ID) {
    await changeNicknameCommand(message);
  }

  // summon Bobby B
  let bobbyb;
  if (message.content.toLowerCase().includes('bobby b')) {
    bobbyb = await summonBobbyB(message);
  }

  // summon Dog
  const dog = await summonDog(message);

  // check for prefix
  if (!message.content.startsWith(PREFIX)) return;

  // slice out arguments
  const args = message.content.toLowerCase().slice(PREFIX.length).trim().split(/ +/);

  switch (args[0]) {
    // Get random subreddit post, PREFIX sr [subreddit]
    case 'sr':
      if (args[2] === 'q') {
        await getRandomSubPostWithSearchCommand(args, message);
      } else {
        await getRandomSubPostCommand(args, message);
      }
      break;


    case 'events':
      switch (args[1]) {
        case 'schedule':
          await scheduleNewEvent(args, message);
          break;
        case 'sub':
          await subscribeToEvent(args, message);
          break;
        case 'list':
          await showUpcomingEvents(args, message);
          break;
        case 'unsub':
          await unsubscribeFromEvent(args, message);
          break;
        case 'cancel':
          await cancelEvent(args, message);
          break;
        default:
          break;
      }
      break;

    // Sends a random conch message
    case 'conch':
      await magicConchCommand(message);
      break;

    case 'weather':
      switch (args[1]) {
        case 'today':
          await getWeatherToday(args, message);
          break;
        case 'now':
          await getWeatherNow(args, message);
          break;
        case 'forecast':
          await getWeeklyForecast(args, message);
          break;
        default:
          await getWeatherNow(args, message);
          break;
      }
      break;

    // Sends a random number betwwen 0 and args[1]
    case 'roll':
      await rollNumberCommand(args, message);
      break;

    // Configuration settings, PREFIX config [setting, [params...]]
    case 'config':
      switch (args[1]) {
        // NSFW post settings, PREFIX config nsfw [toggle]
        case 'nsfw':
          await setNsfwFilterCommand(args, message);
          break;
        default:
          break;
      }
      break;

    case 'help':
      await getHelpCommand(args, message);
      break;
    case 'prune':
      // Delete previous message
      console.log(message.channel.lastMessage.channel.lastMessage.content);
      break;
    default:
      // command not found/entered
      if (!dog && !bobbyb) await sendMessageWithOptions(message, 'Command not found');
      break;
  }
});

client.login(process.env.BOT_TOKEN);
