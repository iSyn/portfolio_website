$(() => {
  // scrapped from BobbyDigital https://github.com/gittheking
  console.log('backgroundPerspective.js is linked')

  if (navigator.vendor.indexOf('Apple') < 0) {
    $(document).mousemove((e) => {
      console.log('mousemove')
      console.log(e.clientY)

      var middleX = window.innerWidth / 3;
      var middleY = window.innerHeight / 3;

      $('.front-side-wrapper').css({
        transform:
        `
          perspective(1000px)
          rotateX(${(-1)*(middleY - e.clientY)/90}deg)
          rotateY(${(middleX - e.clientX)/260}deg)
        `,
        '-webkit-transform':
        `
          perspective(1000px)
          rotateX(${(-1)*(middleY - e.clientY)/90}deg)
          rotateY(${(middleX - e.clientX)/260}deg)
        `,
        display: 'fixed',
        top: '5%',
        left: '5%'
      });
    })
  }

});

