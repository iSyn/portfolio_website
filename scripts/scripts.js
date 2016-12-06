$(() => {


  // ###################################################################
  // Toggles the flipped class

  $('.flip-click').click(() => {
    $('.card').toggleClass('flipped');
  })

  // ###################################################################
  // Window perspective shit
  // scrapped from BobbyDigital https://github.com/gittheking

  if (navigator.vendor.indexOf('Apple') < 0) {
    $(document).mousemove((e) => {

      var middleX = window.innerWidth / 3;
      var middleY = window.innerHeight / 3;

      $('.card-wrapper').css({
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
        top: '9.5%',
        left: '9.5%'
      });
    })
  }

  // ###################################################################
  // Header scripts

  let subheaderTextNum = 1;
  let subheaderColorNum = 1;

  const subheaderTextArr = [
    '— developer —',
    '— boy scout —',
    '— powerlifter —',
    '— dragon boater —',
  ]

  const subheaderColorArr = [
    '#F56857',
    '#3884C1',
    '#F89387',
    '#1BB1B2',
    '#F97206',
  ]

  const updateSubheader = (() => {

    setInterval(() => {
      if (subheaderTextNum >= subheaderTextArr.length) {
        subheaderTextNum = 0;
      }
      if (subheaderColorNum >= subheaderColorArr.length) {
        subheaderColorNum = 0;
      }

      $('.front-subheader').text(subheaderTextArr[subheaderTextNum])
      $('.front-subheader').css('color', subheaderColorArr[subheaderColorNum])
      $('.front-subheader').addClass('animated flipInX').one('animationend', function() {
        $(this).removeClass('animated flipInX')
      })

      subheaderTextNum++
      subheaderColorNum++

    }, 1500)
  })


  updateSubheader()

  // colors

  const changeColor = (e) => {
    $(e.target).css('color', 'crimson')
  }

  const randomColor = (e) => {
    const colorsILike = [
      'deepskyblue',
      'cyan',
      'turquoise',
      'mediumturquoise',
      'aqua',
      'darkturquoise',
      'skyblue',
      'lightskyblue',
      'steelblue',
      'dodgerblue',
      'cornflowerblue',
      'royalblue',
      'midnightblue',
      'navy',
    ]
    let colorChoice = Math.floor(Math.random() * colorsILike.length)
    $(e.target).css('color', colorsILike[colorChoice])
  }

  const originalColor = () => {
    setTimeout(function() {
      $('.letter').css('color', '#FDFDFD')
    },100)
    $('.letter').css('color', 'crimson')
  }

  $('.letter').on('mouseover', changeColor)
  $('.letter').on('mouseout', randomColor)
  $('.letter').on('click', originalColor)

  // ###################################################################

  $('project-1').hover(() => {
    console.log('hovering')
  })

})
