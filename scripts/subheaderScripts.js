$(() => {

  let subheaderTextNum = 1;
  let subheaderColorNum = 1;

  const subheaderTextArr = [
    '— developer —',
    '— eagle scout —',
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

})
