$(() => {

  console.log('updateSubheader.js is linked')

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
      console.log(subheaderTextNum)
      if (subheaderTextNum >= subheaderTextArr.length) {
        subheaderTextNum = 0;
      }
      if (subheaderColorNum >= subheaderColorArr.length) {
        subheaderColorNum = 0;
      }

      $('.part-one-subheader').text(subheaderTextArr[subheaderTextNum])
      $('.part-one-subheader').css('color', subheaderColorArr[subheaderColorNum])
      $('.part-one-subheader').addClass('animated flipInX').one('animationend', function() {
        $(this).removeClass('animated flipInX')
      })

      subheaderTextNum++
      subheaderColorNum++

    }, 1800)
  })


  updateSubheader()

})
