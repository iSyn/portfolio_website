let pageLoaded = () => {
  let el = document.querySelector('.description-app')
  el.addEventListener('click', () => {
    let win = window.open('https://isyn.github.io/More-Ore/', '_blank')
    win.focus
  })
}


window.onload = () => pageLoaded()
