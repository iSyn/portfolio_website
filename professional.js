let gifs = ['rptt-gif', 'alfred-gif']

for (let i = 0; i < gifs.length; i++) {
    let preloadGif = new Image()
    preloadGif.src = `./professional-assets/${gifs[i]}.gif`
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

let currentTab = 'portfolio'

let changeTab = (selectedTab) => {
    
    if (selectedTab != currentTab) {
        currentTab = selectedTab
        console.log('changing tab to', currentTab)
        let all = document.querySelectorAll('.content')
        let tab = document.querySelector(`.content__${selectedTab}`);
        all.forEach((single) => { single.style.display = 'none' })
        tab.style.display = 'block'
    }
}