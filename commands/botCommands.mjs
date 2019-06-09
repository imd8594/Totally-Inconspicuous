/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable import/extensions */
import axios from 'axios';
import { NoImagesFoundException } from '../utils/exceptions.js';
import {
  getConfig, checkPermission, changeConfig, getPrefix, sendMessageWithOptions,
} from '../utils/Utils.mjs';

const ImageRegex = /((\.jpg)|(\.png)|(\.gifv*))$|imgur|v*i*\.redd\.it|gfycat|youtube/;

const PREFIX = getPrefix();

const CONCH_MESSAGES = [
  'Maybe someday.',
  'Nothing.',
  'Neither.',
  'I don\'t think so.',
  'Yes.',
  'Try asking again.',
  'No.',
  'Who are you?',
];

const getPost = (subreddit, sort = 'top', t = 'month') => {
  console.log('getting post');
  return new Promise((resolve, reject) => {
    axios.get(`https://reddit.com/r/${subreddit}/.json?sort=${sort}&t=${t}`)
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
};

const getPostWithSearch = async (subreddit, searchQuery, sort = 'relevance', t = 'month') => {
  console.log('getting posts');
  return new Promise((resolve, reject) => {
    axios.get(`https://www.reddit.com/r/${subreddit}/search.json?q=${searchQuery}&restrict_sr=on&sort=${sort}&t=${t}`)
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
};

const filterResultOfAxiosGet = async (promise, NSFW_FILTER) => {
  // receives a "promise" which contains all the results of the query in children
  const images = promise.data.children.filter((post) => {
    // Filter out the NSFW posts if NSFW_FILTER is set to true
    if ((!NSFW_FILTER) || (post.data.over_18 ? !NSFW_FILTER : NSFW_FILTER)) {
      return true;
    } return false;
  })
    // Filter out posts that don't pass the ImageRegex
    .filter(filteredPost => ImageRegex.test(filteredPost.data.url))
    // Return just the urls
    .map(mapPost => mapPost.data.url);

  if (!images.length) {
    throw new NoImagesFoundException();
  } else {
    return images;
  }
};

export const changeNicknameCommand = async (message) => {
  console.log('message received');
  // idk make a number between 1 and 10 and if thats your number than it changes the nickname
  const randomVal = Math.floor(Math.random() * 10);
  const nickname = message.content.substring(0, 32);
  console.log(`RandomVal= ${randomVal}`);
  if (randomVal === 2) {
    // change nickname to msg.content
    console.log('changing nickname');
    message.guild.members
      .get(process.env.NICKNAME_TO_CHANGE_ID)
      .setNickname(nickname);

    // Log change to username if no error is thrown
    if (!process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error))) {
      console.log(
        `RandomVal= ${randomVal}, changed user 
          ${message.guild.members.get(process.env.NICKNAME_TO_CHANGE_ID).displayName} to nickname:
          ${message.content.substring(0, 32)}`,
      );
    }
  }
};

export const getRandomSubPostCommand = async (args, message) => {
  const config = await getConfig(message.channel.id);
  const { NSFW_FILTER } = config;
  const subreddit = args[1];
  const sort = args[2];
  const time = args[3];
  let images = [];
  try {
    images = await filterResultOfAxiosGet(
      await getPost(subreddit, sort, time),
      NSFW_FILTER,
    );
  } catch (error) {
    if (error instanceof NoImagesFoundException) {
      return sendMessageWithOptions(message, error.message, true);
    }
    return sendMessageWithOptions(message, 'Nah', true);
  }
  return sendMessageWithOptions(message, images[Math.floor(Math.random() * images.length)]);
};

export const getRandomSubPostWithSearchCommand = async (args, message) => {
  const config = await getConfig(message.channel.id);
  const { NSFW_FILTER } = config;
  const subreddit = args[1];
  const searchQuery = args.slice(3).join('+');
  let images = [];
  try {
    images = await filterResultOfAxiosGet(
      await getPostWithSearch(subreddit, searchQuery),
      NSFW_FILTER,
    );
  } catch (error) {
    if (error instanceof NoImagesFoundException) {
      return sendMessageWithOptions(message, `No images found in \`/r/${subreddit}\` for search ${args.slice(3).join('')}`, true);
    }
    return sendMessageWithOptions(message, 'Nah', true);
  }
  return sendMessageWithOptions(message, images[Math.floor(Math.random() * images.length)]);
};

export const rollNumberCommand = async (args, message) => {
  if (!args[1]) {
    return sendMessageWithOptions(message, `Use ${PREFIX} roll <max number>`);
  }
  // First check for dubs
  if (args[1] === 'dubs') {
    const NUM = Math.floor(Math.random() * 100);
    const NUM_ARRAY = (`${NUM}`).split('').map(Number);
    const checkem = message.guild.emojis.find(emoji => emoji.name === 'checkem');
    const bleach = message.guild.emojis.find(emoji => emoji.name === 'bleach');

    const MSG = sendMessageWithOptions(message, `**🎲  ${NUM}  🎲**`);
    if (NUM_ARRAY[0] === NUM_ARRAY[1]) {
      /* DUBS */
      return sendMessageWithOptions(message, `** CHECKEM ** \n${checkem}${checkem}`);
    }
    if (Math.abs(NUM_ARRAY[0] - NUM_ARRAY[1]) === 1) {
      /* OFF BY ONE */
      return sendMessageWithOptions(message, `**OFF BY ONE** \n ${bleach}${bleach}`);
    }
    if (NUM === 69) {
      MSG.react('🍆');
    }
    return null;
  }

  if (!parseInt(args[1])) {
    return sendMessageWithOptions(message, 'Invalid Number', true);
  }

  if (parseInt(args[1]) && parseInt(args[2])) {
    /* roll between two numbers */
    const MAX = Math.max(parseInt(args[1]), parseInt(args[2]));
    const MIN = Math.min(parseInt(args[1]), parseInt(args[2]));

    return sendMessageWithOptions(message, `**🎲 ${Math.floor(Math.random() * (MAX - MIN + 1) + MIN)}**`);
  }
  if (parseInt(args[1]) && !parseInt(args[2])) {
    /* roll between 0 and one number */
    const NUM = parseInt(args[1]);
    return sendMessageWithOptions(message, `**🎲 ${Math.floor(Math.random() * NUM)}**`);
  }
  return sendMessageWithOptions(message, 'Invalid number', true);
};

export const setNsfwFilterCommand = async (args, message) => {
  if (args[2] === 'on' || args[2] === 'true') {
    checkPermission(message, 'ADMINISTRATOR', async () => {
      await changeConfig(message.channel.id, 'NSFW_FILTER', false);
      return sendMessageWithOptions(message, 'NSFW posts are now allowed.');
    });
  } else if (args[2] === 'off' || args[2] === 'false') {
    checkPermission(message, 'ADMINISTRATOR', async () => {
      await changeConfig(message.channel.id, 'NSFW_FILTER', true);
      return sendMessageWithOptions(message, 'NSFW posts are now prohibited.');
    });
  } else {
    const config = await getConfig(message.channel.id);
    const { NSFW_FILTER } = config;
    return sendMessageWithOptions(message, `NSFW posts are currently ${NSFW_FILTER ? 'prohibited.' : 'allowed.'}`);
  }
};

export const setBotActiveCommand = async (args, message) => {
  const bot = args[1].toUpperCase();
  const set = args[2].toLowerCase();
  if (set === 'on' || set === 'true') {
    checkPermission(message, 'ADMINISTRATOR', async () => {
      await changeConfig(message.channel.id, bot, true);
      return sendMessageWithOptions(message, `${bot} is now active in this channel.`);
    });
  } else if (set === 'off' || set === 'false') {
    checkPermission(message, 'ADMINISTRATOR', async () => {
      await changeConfig(message.channel.id, bot, false);
      return sendMessageWithOptions(message, `${bot} is not disabled in this channel.`);
    });
  } else {
    const config = await getConfig(message.channel.id);
    const { botConfig } = config[bot];
    return sendMessageWithOptions(message, `${bot} is currently ${botConfig ? 'active' : 'disabled'}.`);
  }
};

export const magicConchCommand = async message => sendMessageWithOptions(message, `🐚 ***${CONCH_MESSAGES[Math.floor(Math.random() * CONCH_MESSAGES.length)]}***`);
