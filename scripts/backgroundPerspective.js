$(() => {

  console.log('backgroundPerspective.js is linked')

  if (navigator.vendor.indexOf('Apple') < 0) {
    $(document).mousemove((e) => {
      console.log('mousemove')

      var middleX = window.innerWidth / 3;
      var middleY = window.innerHeight / 3;

      $('.part-one-header-wrapper').css({
        transform:
        `
          perspective(1000px)
          rotateX(${(middleY - e.clientY)/90}deg)
          rotateY(${(middleX - e.clientX)/160}deg)
        `,
        display: 'fixed',
        top: '5%',
        left: '5%'
      });
    })
  }

});

