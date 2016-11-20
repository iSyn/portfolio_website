$(() => {
  console.log('flip.js linked')

  $('.flip-over').click((e) => {
    console.log(e.target)

    $('.front-side-wrapper').css({
      'transform': 'rotateY(180deg)',
      'animation-fill-mode': 'forwards',
      'transition-duration': '1s'
      // 'backface-visibility': 'hidden',
    });


  })




})
