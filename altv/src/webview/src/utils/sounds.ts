import { asset } from "@/utils/asset";

export enum Sound {
  BUY = "buy",
  SELL = "sell",
}

const soundFiles: Record<Sound, string[]> = {
  [Sound.BUY]: [
    asset("assets/sounds/bought-1.mp3"),
    asset("assets/sounds/bought-2.mp3"),
    asset("assets/sounds/bought-3.mp3"),
  ],
  [Sound.SELL]: [asset("assets/sounds/sold.mp3")],
};

const audioCache: Record<string, HTMLAudioElement> = {};

function getAudio(file: string) {
  if (!audioCache[file]) {
    audioCache[file] = new Audio(file);
  }
  return audioCache[file];
}

export function playSound(sound: Sound) {
  const files = soundFiles[sound];
  if (!files) {
    console.warn(`No sound files found for ${sound}`);
    return;
  }

  const randomIndex = Math.floor(Math.random() * files.length);
  const soundFile = files[randomIndex];

  const audio = getAudio(soundFile);

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  audio.play();
}
