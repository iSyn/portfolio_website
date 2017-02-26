$(() => {

  $(".subheader").typed({
    strings: ["Full Stack Web Developer", "Powerlifter", 'Boyscout', 'Dragon Boater'],
    typeSpeed: 60,
    loop: true,
    showCursor: false
  });

  let doorPics = [
    './assets/doors1.png',
    './assets/doors2.png',
    './assets/doors3.png',
  ]

  let counter = 0

  setInterval(() => {
    if (counter < doorPics.length - 1) {
      counter++
      $('.door-images').attr('src', doorPics[counter]);
    } else {
      counter = 0;
      $('.door-images').attr('src', doorPics[counter]);
    }
  }, 1000)


})
