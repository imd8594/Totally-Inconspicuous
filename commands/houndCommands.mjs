/* eslint-disable import/extensions */
import { sendMessageWithOptions } from '../utils/Utils.mjs';

const HOUND_QUOTES = [
  {
    quote: 'I understand that if any more words come pouring out your cunt mouth, I\'m gonna have to eat every fucking chicken in this room.',
    key_words: ['any more words', 'cunt mouth', 'every chicken', 'every fucking chicken'],
  }, {
    quote: 'I don\'t give two shits about wildlings. It\'s gingers I hate.',
    key_words: ['two shits', 'wildling', 'ginger', 'gingers'],
  }, {
    quote: 'Any man dies with a clean sword, I\'ll rape his fucking corpse!',
    key_words: ['any man', 'dies', 'clean sword'],
  }, {
    quote: 'Fuck the Kingsguard. Fuck the city. Fuck the King.',
    key_words: ['fuck the', 'kingsguard', 'the city', 'the king'],
  }, {
    quote: 'You\'re a cold little b*tch aren\'t you? Guess that\'s why you\'re still alive.',
    key_words: ['cold', 'bitch', 'still alive'],
  }, {
    quote: 'Your even fuckin’ uglier than I am now.',
    key_words: ['ugly', 'uglier'],
  }, {
    quote: 'Lots of cunts.',
    key_words: ['lots of', 'cunts'],
  }, {
    quote: 'I bet his hair is greasier than Joffrey\'s cunt.',
    key_words: ['his hair', 'greasy'],
  }, {
    quote: 'You\'re shit at dying, you know that?',
    key_words: ['shit at', 'dying'],
  }, {
    quote: 'Fuck the water, bring me wine!',
    key_words: ['fuck water', 'fuck the water', 'water'],
  }, {
    quote: 'Man\'s got to have a code.',
    key_words: ['code'],
  }, {
    quote: 'Your lips are moving and you\'re complaining about something. That\'s whinging.',
    key_words: ['complain', 'complaining', 'lips', 'whinging'],
  }, {
    quote: 'How can a man not keep ale in his home?',
    key_words: ['ale', 'his home'],
  }, {
    quote: 'What the fuck\'s a Lommy?',
    key_words: ['lommy'],
  }, {
    quote: 'Look at me! Stannis is a killer. The Lannisters are killers. Your father was a killer. Your brother is a killer. Your sons will be killers someday. The world is built by killers... so you better get used to looking at them.',
    key_words: ['look at me', 'killer'],
  }, {
    quote: 'No, it gives me joy to kill people.',
    key_words: ['kill', 'joy', 'gives'],
  },
];

/*
 * summonDog sends a random message from the list above if the word 'hound' is in message.content
 * Otherwise, it will search the message.content for each string in each key_words array and
 * create a list of each corresponding quote that has a matching string. Then sends a random
 * quote from that list to the channel.
 */
export const summonDog = async (message) => {
  if (message.content.toLowerCase().includes('hound')) {
    return sendMessageWithOptions(
      message,
      HOUND_QUOTES[Math.floor(Math.random() * HOUND_QUOTES.length)].quote,
    );
  }

  const checkForKeyWord = word => message.content.toLowerCase().includes(` ${word} `);

  const quotes = HOUND_QUOTES.filter(quote => quote.key_words.some(checkForKeyWord))
    .map(quote => quote.quote);

  if (quotes.length > 0) {
    return sendMessageWithOptions(message, quotes[Math.floor(Math.random() * quotes.length)]);
  }
  return false;
};

export default summonDog;
