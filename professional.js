let emojis = [
  "😍",
  "👍",
  "🎉",
  "😎",
  "😀",
  "👻",
  "🙈",
  "🙉",
  "🙊",
  "👊",
  "🙏",
  "🍟",
  "🍕",
  "🎂",
  "🍰",
  "🍫",
  "🍬",
  "🍭",
  "💯",
  "😂",
  "🔥",
  "✌️",
  "👌",
  "👏",
  "🙌",
];

window.onscroll = () => {
    let randomNum = Math.floor(Math.random() * emojis.length)
    let selectedEmoji = emojis[randomNum];

    let emoji = document.querySelector('.emoji')
    emoji.innerHTML = selectedEmoji;
}

let alfredImg = document.querySelector('.alfred-img')
alfredImg.addEventListener('mouseover', () => {
    alfredImg.src = './professional-assets/alfred-gif.gif'
})
alfredImg.addEventListener('mouseout', () => {
    alfredImg.src = './professional-assets/alfred-img.png'
})

let rpttImg = document.querySelector(".rptt-img");
rpttImg.addEventListener("mouseover", () => {
  rpttImg.src = "./professional-assets/rptt-gif.gif";
});
rpttImg.addEventListener("mouseout", () => {
  rpttImg.src = "./professional-assets/rptt-img.png";
});

