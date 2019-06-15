/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/**
 * @fileoverview
 * Bot commands for interacting with the Dark Sky API for weather information
 */
import Simplesky from 'simplesky';
import dotenv from 'dotenv';
import { sendMessageWithOptions } from '../utils/Utils.mjs';

dotenv.config();


const { DARK_SKY_API_KEY } = process.env;
const { GOOGLE_MAPS_API_KEY } = process.env;

const weather = new Simplesky(GOOGLE_MAPS_API_KEY, DARK_SKY_API_KEY);
const coordsRecord = [];
console.log(weather);
const getWeekDay = (day) => {
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return weekdays[day];
};

/**
 * This function will take in a location and return the coordinates for that location
 * It is used to reduce the number of Google API calls by storing the location and its coords
 * in a file, and then only calling the API to fetch the coords if we don't already have them
 * @param location - The plain text location we want the coords of
 */
/* eslint-disable prefer-destructuring */
const recordCoordsFromLocation = async (location) => {
  let lat = 0;
  let long = 0;
  const loc = location.toLowerCase();
  if (loc in coordsRecord) {
    lat = coordsRecord[loc].lat;
    long = coordsRecord[loc].long;
  } else {
    await weather.getCoordinates(loc).then((response) => {
      lat = response.lat;
      long = response.lng;
      coordsRecord[loc] = { lat, long };
    }).catch((error) => {
      console.log('error', error);
    });
  }
  return coordsRecord[loc];
};


export const getWeatherToday = async (args, message) => {
  const location = args.slice(2).join();
  const coords = await recordCoordsFromLocation(location);
  if (location) {
    weather.getHourly(false, coords.lat, coords.long).then((response) => {
      return sendMessageWithOptions(message, `Today: ${response.summary}`);
    }).catch((error) => {
      return sendMessageWithOptions(message, error, true);
    });
  }
};

export const getWeatherNow = async (args, message) => {
  const location = args.slice(2).join();
  const coords = await recordCoordsFromLocation(location);
  if (location) {
    weather.getMinutely(false, coords.lat, coords.long).then((response) => {
      return sendMessageWithOptions(message, `Next Hour: ${response.summary}`);
    }).catch((error) => {
      return sendMessageWithOptions(message, error, true);
    });
  }
};

export const getWeeklyForecast = async (args, message) => {
  const date = new Date();
  const today = date.getDay();
  const location = args.slice(2).join();
  const coords = await recordCoordsFromLocation(location);
  let msg = '';
  if (location) {
    await weather.getDaily(false, coords.lat, coords.long).then((response) => {
      response.data.map(async (day, i) => {
        const dayIndex = (today + i) % 7;
        let dayOfWeek = getWeekDay(dayIndex);
        if (i === 0) {
          dayOfWeek += ' (today)';
        }
        msg += `**${dayOfWeek}**: High of ${day.temperatureMax}°F, ${day.summary} Winds ${day.windSpeed} mph\n`;
      });
      return sendMessageWithOptions(message, msg);
    }).catch((error) => {
      return sendMessageWithOptions(message, error, true);
    });
  } else {
    return sendMessageWithOptions(message, 'Please specify a location and try again! ex. !ti weather forecast 01056', true);
  }
  return false;
};
