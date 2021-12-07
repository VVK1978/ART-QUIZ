const settings = JSON.parse(localStorage.getItem('settings'));

export default function playAudio(audioFile) {
  const audio = new Audio(audioFile);
  audio.volume = settings.volume;
  audio.play();
}
