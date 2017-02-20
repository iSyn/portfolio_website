$(() => {

  // Header scripts

  let subheaderTextNum = 1;
  let subheaderColorNum = 1;

  const subheaderTextArr = [
    '— front end developer —',
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

  $('.proj-1').click(() => {
    window.open("https://isyn.github.io/Doors/game.html")
  })

  $('.proj-2').click(() => {
    window.open("https://tsundokuit.herokuapp.com")
  })

  $('.proj-3').click(() => {
    window.open("https://reask.herokuapp.com")
  })

})
