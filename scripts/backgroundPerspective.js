$(() => {

  console.log('backgroundPerspective.js is linked')

  const $background = $('.part-one-header-wrapper')
  const $body = $('body');

  if (navigator.vendor.indexOf('Apple') < 0) {
    document.addEventListener('mousemove', function (event) {

      var middleX = window.innerWidth / 2;
      var middleY = window.innerHeight / 2;

      $background.css('transform', `perspective(1000px)
                                    rotateX(${(-1)*(middleY - event.clientY)/2}deg)
                                    rotateY(${(middleX = event.clientX)/2}deg)`)
    })
  }


  window.addEventListener('resize', function(event) {
    console.log('resize function running')
    $background.style.height   = `${window.innerHeight}px`;
    $background.style.width    = `${window.innerWidth}px`;
  });

});
