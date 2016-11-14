$(() => {

  console.log('backgroundPerspective.js is linked')

  const $background = $('.part-one-header-wrapper')
  const $body = $('body');

  if (navigator.vendor.indexOf('Apple') < 0) {
    document.addEventListener('mousemove', function (event) {

      var middleX = window.innerWidth / 2;
      var middleY = window.innerHeight / 2;

      $background.css({
        top: '50%',
        left: '50%',
        transform:
        `
          perspective(1000px)
          rotateX(${(-1)*(middleY - event.clientY)/90}deg)
          rotateY(${(middleX = event.clientX)/160}deg)
          translate(-50%, -50%)
        `,
      });
    })
  }

});
