import { useEffect } from "react";

const playlist = [
  "public/assets/music/track1.mp3",
    "public/assets/music/track2.mp3",
    "public/assets/music/track3.mp3",
    "public/assets/music/track4.mp3",
    "public/assets/music/track5.mp3",
    "public/assets/music/track6.mp3",
    "public/assets/music/track7.mp3",
    "public/assets/music/track8.mp3",
    "public/assets/music/track9.mp3",
    "public/assets/music/track10.mp3",
    "public/assets/music/track11.mp3",
    "public/assets/music/track12.mp3",
    "public/assets/music/track13.mp3",
    "public/assets/music/track14.mp3",
    "public/assets/music/track15.mp3",
    "public/assets/music/track16.mp3",
    "public/assets/music/track17.mp3",
    "public/assets/music/track18.mp3",
    "public/assets/music/track19.mp3",
    "public/assets/music/track20.mp3",
    "public/assets/music/track21.mp3",
    "public/assets/music/track22.mp3",
    "public/assets/music/track23.mp3",
];

function AtmMusicManager() {
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
