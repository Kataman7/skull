import { useEffect } from "react";
import useIsMobile from "../../lib/hooks/useIsMobile";

const playlist = [
    "public/assets/sounds/music/track1.mp3",
    "public/assets/sounds/music/track2.mp3",
    "public/assets/sounds/music/track3.mp3",
    "public/assets/sounds/music/track4.mp3",
    "public/assets/sounds/music/track5.mp3",
    "public/assets/sounds/music/track6.mp3",
    "public/assets/sounds/music/track8.mp3",
    "public/assets/sounds/music/track9.mp3",
    "public/assets/sounds/music/track10.mp3",
    "public/assets/sounds/music/track13.mp3",
    "public/assets/sounds/music/track15.mp3",
    "public/assets/sounds/music/track16.mp3",
    "public/assets/sounds/music/track17.mp3",
    "public/assets/sounds/music/track18.mp3",
    "public/assets/sounds/music/track19.mp3",
    "public/assets/sounds/music/track20.mp3",
    "public/assets/sounds/music/track22.mp3",
    "public/assets/sounds/music/track23.mp3",
];

function AtmMusicManager() {

  if (useIsMobile) return false;

  useEffect(() => {
    const audio = document.getElementById("global-audio");

    // 🎲 Position aléatoire au démarrage
    let currentIndex = Math.floor(Math.random() * playlist.length);
    audio.src = playlist[currentIndex];
    
    window.addEventListener("click", () => {
        document.getElementById("global-audio").play();
    }, { once: true });

    const playNextTrack = () => {
      currentIndex = (currentIndex + 1) % playlist.length;
      audio.src = playlist[currentIndex];
      audio.play();
    };

    audio.addEventListener("ended", playNextTrack);

    return () => {
      audio.removeEventListener("ended", playNextTrack);
    };
  }, []);

  return null;
}

export default AtmMusicManager;
