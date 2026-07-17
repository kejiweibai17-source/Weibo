/** 首頁背景音樂：進站播放一次，preloader 結束後持續播完、不循環 */

const HOME_MUSIC_SRC =
  "/music/poradovskyi-fashion-luxury-sensual-music-519482.mp3";

let homeAudio: HTMLAudioElement | null = null;
let started = false;

function attachGestureResume(audio: HTMLAudioElement) {
  const resumeOnInteraction = () => {
    audio.play().catch(() => {});
    document.removeEventListener("click", resumeOnInteraction);
    document.removeEventListener("touchstart", resumeOnInteraction);
  };
  document.addEventListener("click", resumeOnInteraction, { once: true });
  document.addEventListener("touchstart", resumeOnInteraction, {
    once: true,
  });
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
  audio.volume = 0.4;
  audio.preload = "auto";
  homeAudio = audio;

  audio.play().catch(() => {
    attachGestureResume(audio);
  });

  return audio;
}

export function getHomeMusic(): HTMLAudioElement | null {
  return homeAudio;
}
