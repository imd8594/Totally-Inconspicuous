/* eslint-disable import/extensions */
import { sendMessageWithOptions } from '../utils/Utils.mjs';

const bobbyBResponses = [
  'YOU GOT FAT!',
  'OHHH, SHOW US YOUR MUSCLES! YOU\'LL BE A SOLDIER!',
  'SURROUNDED BY LANNISTERS! EVERY TIME I CLOSE MY EYES I SEE THEIR BLONDE HAIR AND THEIR SMUG, SATISFIED FACES!',
  'THEY NEVER TELL YOU HOW THEY ALL SHIT THEMSELVES! THEY DON\'T PUT THAT PART IN THE SONGS!',
  'COME, BOW BEFORE YOUR KING! BOW, YA SHITS! https://i.imgur.com/hrCP6Uk.gifv',
  'HE COULD HAVE LINGERED ON THE EDGE OF THE BATTLE WITH THE SMART BOYS, AND TODAY HIS WIFE WOULD BE MAKING HIM MISERABLE, HIS SONS WOULD BE INGRATES, AND HE WOULD BE WAKING THREE TIMES IN THE NIGHT TO PISS INTO A BOWL!',
  'MY, YOU\'RE A PRETTY ONE! AND YOUR NAME IS?',
  'FORCED TO MIND THE DOOR WHILE YOUR KING EATS AND DRINKS AND SHITS AND FUCKS!',
  'THERE\'S A WAR COMING, NED. I DON\'T KNOW WHEN, I DON\'T KNOW WHO WE\'LL BE FIGHTING...BUT IT\'S COMING!',
  'YOU HEARD THE HAND, THE KING\'S TOO FAT FOR HIS ARMOR! GO FIND THE BREASTPLATE STRETCHER! NOW!',
  'YOU\'RE THE KING\'S HAND! YOU\'LL DO AS I COMMAND, OR I\'LL FIND ME A HAND WHO WILL!',
  'THE WHORE IS PREGNANT!',
  'DID YOU EVER MAKE THE EIGHT?',
  'IT MUST WOUND YOUR PRIDE! STANDING OUT THERE, LIKE A GLORIFIED SENTRY!',
  'WEAR IT IN SILENCE, OR I\'LL HONOR YOU AGAIN!',
  'TAKE ME TO YOUR CRYPT, I WANT TO PAY MY RESPECTS!',
  'WHO NAMED YOU? SOME HALFWIT WITH A STUTTER??',
  'THANK THE GODS FOR BESSIE AND HER TITS',
  'GODS WHAT A STUPID NAME!',
  'PISS ON THAT! SEND A RAVEN! I WANT YOU TO STAY! I\'M THE KING, I GET WHAT I WANT!',
  'YOUR MOTHER WAS A DUMB WHORE WITH A FAT ARSE, DID YOU KNOW THAT? https://i.imgur.com/g5SzSKk.gifv',
  'WE\'RE TELLING WAR STORIES! WHO WAS YOUR FIRST KILL, NOT COUNTING OLD MEN?',
  'START THE DAMN JOUST BEFORE I PISS MESELF!',
  'YOU\'RE MY COUNCIL, COUNSEL! SPEAK SENSE TO THIS HONORABLE FOOL!',
  'EASY, BOY! YOU MIGHT BE MY BROTHER BUT YOU\'RE SPEAKING TO THE KING!',
  'A DOTHRAKI HORDE ON AN OPEN FIELD, NED!',
  'IS THAT WHAT EMPTY MEANS??',
  'HOLD YOUR TONGUE!',
  'SOON ENOUGH, THAT CHILD WILL SPREAD HER LEGS AND START BREEDING!',
  'YOU EVER FUCK A RIVERLANDS GIRL?',
  'I\'VE GOT SEVEN KINGDOMS TO RULE! ONE KING, SEVEN KINGDOMS!',
  'CAREFUL, NED! CAREFUL NOW!',
  'OH, IT\'S UNSPEAKABLE TO YOU? WHAT HER FATHER DID TO YOUR FAMILY, THAT WAS UNSPEAKABLE!',
  'WINE! WINE! MOOOOOOOOAR WINE!',
  'THEY NEVER TELL YOU HOW THEY ALL SHIT THEMSELVES! THEY DON\'T PUT THAT PART IN THE SONGS!',
  'SHE SHOULD BE ON A HILL SOMEWHERE WITH THE SUN AND THE CLOUDS ABOVE HER!',
  'I WARNED YOU THIS WOULD HAPPEN! BACK IN THE NORTH, I WARNED YOU, BUT YOU DIDN\'T CARE TO HEAR! WELL, HEAR IT NOW!',
  'OUT! OUT, DAMN YOU! I\'M DONE WITH YOU! GO, RUN BACK TO WINTERFELL! I\'LL HAVE YOUR HEAD ON A SPIKE!',
  'DID YOU HAVE TO BURY HER IN A PLACE LIKE THIS?',
  'STUPID BOY!',
  'YES, IT\'S BEEN A LONG TIME... BUT I STILL REMEMBER EVERY FACE!',
  'GODS I WAS STRONG THEN',
  'WHY HAVE I NOT SEEN YOU? WHERE THE HELL HAVE YOU BEEN?',
  'IS THAT HOW YOU SPEAK TO YOUR KING??',
  'SHE BELONGED WITH ME!',
  'WE WERE AT WAR! NONE OF US KNEW IF WE WERE GONNA GO BACK HOME AGAIN!',
  'STOP THIS MADNESS, IN THE NAME OF YOUR KING!',
];

export const summonBobbyB = async (message) => {
  return sendMessageWithOptions(
    message,
    bobbyBResponses[Math.floor(Math.random() * bobbyBResponses.length)],
  );
};

export default summonBobbyB;
