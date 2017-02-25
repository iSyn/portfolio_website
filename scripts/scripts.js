$(() => {

  $(".subheader").typed({
    strings: ["Full Stack Web Developer", "Powerlifter", 'Boyscout', 'Dragon Boater'],
    typeSpeed: 60,
    loop: true,
    showCursor: false
  });

  let text = [
    'responsive designs.',
    'fluid UX.',
  ]

  let textCount = 0

  setInterval(() => {
    console.log(textCount)
    if (textCount >= text.length-1) {
      textCount = 0
      $('.about-me-text').text('responsive designs.')
    } else {
      textCount++
      $('.about-me-text').text(text[textCount])
    }
  }, 1500)


})
