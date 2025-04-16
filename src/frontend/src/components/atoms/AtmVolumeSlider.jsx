import { useState, useEffect } from "react";

function AtmVolumeSlider() {
  const [volume, setVolume] = useState(0); // volume de 0 à 1

  useEffect(() => {
    const audio = document.getElementById("global-audio");
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Music</h2>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-48 h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-white"
      />
    </div>
  );
}

export default AtmVolumeSlider;