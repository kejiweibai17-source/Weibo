/** 首頁背景音樂：進站播放一次，preloader 結束後持續播完、不循環 */

const HOME_MUSIC_SRC =
  "/music/poradovskyi-fashion-luxury-sensual-music-519482.mp3";

/** 預設音量為先前 0.4 的一半 */
export const HOME_MUSIC_DEFAULT_VOLUME = 0.2;

let homeAudio: HTMLAudioElement | null = null;
let started = false;
let volumeBeforeMute = HOME_MUSIC_DEFAULT_VOLUME;

type HomeMusicListener = () => void;
const listeners = new Set<HomeMusicListener>();

function notify() {
  listeners.forEach((fn) => fn());
}

function attachGestureResume(audio: HTMLAudioElement) {
  const resumeOnInteraction = () => {
    audio.play().catch(() => {});
    document.removeEventListener("click", resumeOnInteraction);
    document.removeEventListener("touchstart", resumeOnInteraction);
    notify();
  };
  document.addEventListener("click", resumeOnInteraction, { once: true });
  document.addEventListener("touchstart", resumeOnInteraction, {
    once: true,
  });
}

function bindAudioEvents(audio: HTMLAudioElement) {
  const onChange = () => notify();
  audio.addEventListener("play", onChange);
  audio.addEventListener("pause", onChange);
  audio.addEventListener("volumechange", onChange);
  audio.addEventListener("ended", onChange);
}

/**
 * 開始首頁音樂（同一次瀏覽只啟動一次）
 * - loop = false：播完即停
 * - 不在 preloader 結束時停止，讓音樂延續到首頁
 */
export function startHomeMusic(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (started && homeAudio) return homeAudio;

  started = true;
  const audio = new Audio(HOME_MUSIC_SRC);
  audio.loop = false;
  audio.volume = HOME_MUSIC_DEFAULT_VOLUME;
  audio.preload = "auto";
  homeAudio = audio;
  volumeBeforeMute = HOME_MUSIC_DEFAULT_VOLUME;
  bindAudioEvents(audio);

  audio.play().catch(() => {
    attachGestureResume(audio);
  });

  notify();
  return audio;
}

export function getHomeMusic(): HTMLAudioElement | null {
  return homeAudio;
}

export function getHomeMusicVolume(): number {
  return homeAudio?.volume ?? HOME_MUSIC_DEFAULT_VOLUME;
}

export function isHomeMusicMuted(): boolean {
  if (!homeAudio) return false;
  return homeAudio.muted || homeAudio.paused || homeAudio.volume === 0;
}

export function isHomeMusicPlaying(): boolean {
  return Boolean(homeAudio && !homeAudio.paused && !homeAudio.ended);
}

/** 喇叭按鈕：暫停 ↔ 繼續播放 */
export function toggleHomeMusicPlayback(): void {
  const audio = startHomeMusic();
  if (!audio) return;

  if (audio.paused || audio.ended) {
    if (audio.ended) {
      audio.currentTime = 0;
    }
    if (audio.muted) audio.muted = false;
    if (audio.volume === 0) {
      audio.volume = volumeBeforeMute || HOME_MUSIC_DEFAULT_VOLUME;
    }
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
  notify();
}

export function setHomeMusicVolume(level: number): void {
  const audio = startHomeMusic();
  if (!audio) return;

  const next = Math.min(1, Math.max(0, level));
  audio.volume = next;
  audio.muted = next === 0;

  if (next > 0) {
    volumeBeforeMute = next;
    if (audio.paused && !audio.ended) {
      audio.play().catch(() => {});
    }
  }
  notify();
}

export function subscribeHomeMusic(listener: HomeMusicListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
