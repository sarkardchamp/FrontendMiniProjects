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
btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    let audio = new Audio("sounds/" + audios[btn.innerHTML] + ".mp3");
    audio.play();
  });
});
