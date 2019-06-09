/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import path from 'path';
import Discord from 'discord.js';
import {
  readObjectsFromFile, writeObjectToFile, sendMessageWithOptions, replaceFileContents,
} from '../utils/Utils.mjs';
import { FileWriteException, InvalidDateException } from '../utils/exceptions.js';


const dirname = path.resolve('.');
const eventsFilePath = path.join(dirname, 'data', 'events.json');

const convertTextToDate = (dateString, timeString) => {
  const dateParts = dateString.split('/').map(part => parseInt(part, 10));
  if (dateParts.length !== 3 || dateParts[2].toString().length < 4) {
    throw new InvalidDateException();
  }
  const timeParts = timeString.split(':').map(part => parseInt(part, 10));
  const date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1]);
  if (!date || timeParts.some(Number.isNaN) || dateParts.some(Number.isNaN)) {
    throw new InvalidDateException();
  }
  return date;
};

// Server will set an environment variable `TZ=America/New_York
// If this is not the case, you will run into problems with events expiring
const checkEventExpired = (event) => {
  const { date } = event;
  const eventDay = Date.parse(date.day);
  const eventDayMidnight = new Date(eventDay).setHours(23, 59, 59, 999);
  if (eventDayMidnight < Date.now()) {
    const expiredEvent = event;
    expiredEvent.expired = true;
    return expiredEvent;
  }
  return false;
};

/**
 * sample event:
 * { 'id': '1234',
 *   'eventName': 'name',
 *   'hostId: 1341342142342141234,
 *   'host': 'hostname',
 *   'participants': ['person1', 'person'2],
 *   'date':
 *    {
 *      'day': '5/29/19',
 *      'time': '5:30pm'
 *    }
 *   'expired': false
 * }
 */
export const scheduleNewEvent = async (args, message) => {
  let eventDate = '';
  try {
    console.log('here');
    eventDate = convertTextToDate(args[3], args.slice(4).join(' '));
  } catch (err) {
    return sendMessageWithOptions(message, err.message, true);
  }
  const eName = args[2];
  const eHostId = message.author.id;
  const eHost = message.author.username;
  const eParticipants = [`<@${message.author.id}>`];
  const eDay = eventDate.toDateString();
  const eTime = args.slice(4).join(' ');
  const uid = message.id.substring(message.id.length - 4);

  const newEvent = {
    [uid]: {
      id: uid,
      eventName: eName,
      hostId: eHostId,
      host: eHost,
      participants: eParticipants,
      date: { day: eDay, time: eTime },
      expired: false,
    },
  };

  await writeObjectToFile(newEvent, eventsFilePath).then((response) => {
    if (response instanceof FileWriteException) {
      return sendMessageWithOptions(message, response.toString(), true);
    }
    const event = response[uid];
    return sendMessageWithOptions(message,
      new Discord.RichEmbed()
        .setTitle(`**${event.host}** created new event`)
        .addField('Event name: ', `**${event.eventName}**`)
        .addField('Participants: ', `${event.participants.map(participant => participant)}`)
        .addField('Date: ', `${event.date.day} @ ${event.date.time}`)
        .addField('Event ID: ', `${event.id}`));
  });
};

export const cancelEvent = async (args, message) => {
  const eventId = args[2];
  const events = await readObjectsFromFile(eventsFilePath);
  const event = events[eventId];

  if (event === undefined) {
    return sendMessageWithOptions(message, `Event ${eventId} does not exist`, true);
  }
  if (!Object.keys(events).length) {
    return sendMessageWithOptions(message, 'There are currently no events', true);
  }
  const { id } = message.author;

  if (event.hostId !== id) {
    return sendMessageWithOptions(message, 'Only the host of this event can cancel it', true);
  }

  delete events[eventId];

  await replaceFileContents(events, eventsFilePath).then((response) => {
    if (response instanceof FileWriteException) {
      return sendMessageWithOptions(message, response.toString(), true);
    }
    return sendMessageWithOptions(message, `Event ${eventId} has been canceled`);
  });
};

export const subscribeToEvent = async (args, message) => {
  const eventId = args[2];
  const events = await readObjectsFromFile(eventsFilePath);
  const event = events[eventId];

  if (event === undefined) {
    return sendMessageWithOptions(message, `Event ${eventId} does not exist`, true);
  }
  if (!Object.keys(events).length) {
    return sendMessageWithOptions(message, 'There are currently no events', true);
  }

  const { id } = message.author;
  const formattedId = `<@${id}>`;

  if (!event.participants.includes(formattedId)) {
    event.participants.push(formattedId);
  } else {
    return sendMessageWithOptions(message, `${formattedId} is already subsribed to event ${eventId}`, true);
  }
  events[eventId] = event;

  await writeObjectToFile(events, eventsFilePath).then((response) => {
    if (response instanceof FileWriteException) {
      return sendMessageWithOptions(message, response.toString(), true);
    }
    const updatedEvent = response[eventId];
    return sendMessageWithOptions(message,
      new Discord.RichEmbed()
        .setTitle(`Event: **${updatedEvent.eventName}**`)
        .addField('Event name: ', `**${updatedEvent.eventName}**`)
        .addField('Participants: ', `${updatedEvent.participants.map(participant => `${participant} `).join(', ')}`)
        .addField('Date: ', `${updatedEvent.date.day} @ ${updatedEvent.date.time}`)
        .addField('Event ID: ', `${updatedEvent.id}`), true);
  });
};

export const unsubscribeFromEvent = async (args, message) => {
  const eventId = args[2];
  const events = await readObjectsFromFile(eventsFilePath);
  const event = events[eventId];
  if (event === undefined) {
    return sendMessageWithOptions(message, `Event ${eventId} does not exist`, true);
  }
  if (!Object.keys(events).length) {
    return sendMessageWithOptions(message, 'There are currently no events', true);
  }
  if (message.author.id === event.hostId) {
    return sendMessageWithOptions(message, `The host cannot unsubscribe from their own event. Try !ti events cancel ${eventId} instead if you meant to cancel the event`, true);
  }

  const { id } = message.author;
  const formattedId = `<@${id}>`;

  if (!event.participants.includes(formattedId)) {
    return sendMessageWithOptions(message, `${formattedId} is not subsribed to event ${eventId}`, true);
  }
  event.participants = event.participants.filter(participant => participant !== formattedId);
  events[eventId] = event;

  await writeObjectToFile(events, eventsFilePath).then((response) => {
    if (response instanceof FileWriteException) {
      return sendMessageWithOptions(message, response.toString(), true);
    }
    const updatedEvent = response[eventId];
    return sendMessageWithOptions(message,
      new Discord.RichEmbed()
        .setTitle(`Event: **${updatedEvent.eventName}**`)
        .addField('Event name: ', `**${updatedEvent.eventName}**`)
        .addField('Participants: ', `${updatedEvent.participants.map(participant => `${participant} `).join(', ')}`)
        .addField('Date: ', `${updatedEvent.date.day} @ ${updatedEvent.date.time}`)
        .addField('Event ID: ', `${updatedEvent.id}`), true);
  });
};

export const showUpcomingEvents = async (args, message) => {
  const events = await readObjectsFromFile(eventsFilePath);
  if (!Object.keys(events).length) {
    return sendMessageWithOptions(message, 'There are currently no events', true);
  }

  if (args[2]) {
    const eventId = args[2];
    const event = events[eventId];
    if (event === undefined) {
      return sendMessageWithOptions(message, `Event ${eventId} does not exist`, true);
    }
    return sendMessageWithOptions(message,
      new Discord.RichEmbed()
        .setTitle(`Event: **${event.eventName}**`)
        .addField('Host: ', `**${event.host}**`)
        .addField('Participants: ', `${event.participants.map(participant => participant).join(', ')}`)
        .addField('Date: ', `${event.date.day} @ ${event.date.time}`)
        .addField('Event ID: ', `${event.id}`), true);
  }

  const expiredEventIds = [];
  Object.keys(events).map((eventId) => {
    const event = events[eventId];
    const eventExpired = checkEventExpired(event);
    if (eventExpired === false) {
      sendMessageWithOptions(message,
        new Discord.RichEmbed()
          .setTitle(`Event: **${event.eventName}**`)
          .addField('Host: ', `**${event.host}**`)
          .addField('Participants: ', `${event.participants.map(participant => participant).join(', ')}`)
          .addField('Date: ', `${event.date.day} @ ${event.date.time}`)
          .addField('Event ID: ', `${event.id}`), true);
    } else {
      expiredEventIds.push(eventId);
    }
  });

  // cleanup expired events from file
  if (expiredEventIds.length > 0) {
    expiredEventIds.map(id => (
      delete events[id]
    ));

    await replaceFileContents(events, eventsFilePath).then((response) => {
      if (response instanceof FileWriteException) {
        return sendMessageWithOptions(message, response.toString(), true);
      }
    });
  }
};
