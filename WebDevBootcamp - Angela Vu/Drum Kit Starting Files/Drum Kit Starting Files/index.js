const btns = document.querySelectorAll("button.drum");
const audios = {
  w: "tom-1",
  a: "tom-2",
  s: "tom-3",
  d: "tom-4",
  j: "snare",
  k: "crash",
  l: "kick-bass",
};
let temp = "tom-1";
let audio = new Audio("sounds/" + temp + ".mp3");
btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    temp = audios[btn.innerHTML];
    audio.src = "sounds/" + temp + ".mp3";
    audio.play();
  });
});
