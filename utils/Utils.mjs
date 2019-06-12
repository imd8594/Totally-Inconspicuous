/* eslint-disable import/extensions */
/* eslint-disable arrow-body-style */
import fs from 'fs';
import path from 'path';
import { FileReadException, FileWriteException } from './exceptions.js';

const dirname = path.resolve('.');
const helpPath = path.join(dirname, 'utils', 'help.js');
const configPath = path.join(dirname, 'data', 'config.json');
const SELF_DESTRUCT_TIMEOUT = 45000;

export const sendMessageWithOptions = async (message, messageBody,
  selfDestruct = false,
  selfDestructTimeout = SELF_DESTRUCT_TIMEOUT) => {
  return message.channel.send(messageBody).then((msg) => {
    if (selfDestruct) {
      msg.delete(selfDestructTimeout);
      message.delete(selfDestructTimeout);
      return true;
    }
    return msg;
  });
};

export const readObjectsFromFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileData) => {
      if (err) {
        reject(new FileReadException(err));
      } else {
        resolve(JSON.parse(fileData));
      }
    });
  });
};

export const writeObjectToFile = async (object, filePath) => {
  const currFile = await readObjectsFromFile(filePath);
  Object.assign(currFile, object);
  const json = JSON.stringify(currFile);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, json, (err) => {
      if (err) {
        reject(new FileWriteException(err));
      } else {
        resolve(JSON.parse(json));
      }
    });
  });
};

export const replaceFileContents = async (updatedFile, filePath) => {
  const json = JSON.stringify(updatedFile);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, json, (err) => {
      if (err) {
        reject(new FileWriteException(err));
      } else {
        resolve(JSON.parse(json));
      }
    });
  });
};

// Checks for Admin privleges, then fires the callback
export const checkPermission = (message, privlege, cb) => {
  if (message.member.hasPermission(privlege)) {
    cb();
  } else {
    sendMessageWithOptions(message, 'You do not have permission to use that command');
  }
};

// gets config from config.json
// optional arg 'channelId' to return specific channel settings from config, else whole config
// does not validate channel value
export const getConfig = async (channelId) => {
  const config = await readObjectsFromFile(configPath);
  const channelConfig = config[channelId];

  if (channelConfig === undefined) {
    // config not found for channel, create new one
    const newChannelConfig = {
      [channelId]: {
        CHANNEL_ID: channelId,
        NSFW_FILTER: false,
      },
    };
    await writeObjectToFile(newChannelConfig, configPath);
    return newChannelConfig;
  }
  // config already exists
  return channelConfig;
};

// provided a channel id and key, value pair, makes appropriate change to config.js
export const changeConfig = async (channelId, key, value) => {
  const config = await getConfig(channelId);
  config[key] = value;
  await writeObjectToFile({ [channelId]: config }, configPath);
};

export const getHelp = (command = null) => {
  const content = fs.readFileSync(helpPath);
  const help = JSON.parse(content);
  if (!command) {
    return help;
  }
  return help.filter(obj => obj.command === command)[0];
};

export const getPrefix = () => (process.env.NODE_ENV === 'dev' ? '!test ' : '!ti ');
