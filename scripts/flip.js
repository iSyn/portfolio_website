// transform: rotateY(180deg);

$(() => {
  console.log('flip.js linked')

  $('.flip-over').click((e) => {
    if (e.currentTarget.id === 'right') {
      $('.front-side-wrapper').css({
        transform: 'rotateY(180deg)',
        // display: 'none',
        transition: 'transform 0.6s ease-in-out',
        'transform-style': 'preserve-3d',
        position: 'relative'
      });
    } else {
      $('.front-side-wrapper').css({
        transform: 'rotateY(-180deg)',
        // display: 'none',
        transition: 'transform 0.6s ease-in-out',
        'transform-style': 'preserve-3d',
        position: 'relative'
      });
    }
    setTimeout(() => {
      $('.front-side-wrapper').css('display', 'none');
      $('.back-side-wrapper').css('display', 'block');
    }, 0.3 * 1000)
  })

})
