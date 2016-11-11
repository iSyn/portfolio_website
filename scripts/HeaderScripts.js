$(() => {

  console.log('updateHeaderColor.js is linked')

  // setTimeout(() => {
  //   $('.part-one-header').css('display', 'block')
  //   $('.part-one-header').addClass('animated zoomIn')
  // }, 500)

  //WHY THO

  const changeColor = (e) => {
    // let color = $(e.target).data('color')
    $(e.target).css('color', 'lightpink')
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


})



