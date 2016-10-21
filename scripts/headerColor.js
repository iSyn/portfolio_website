//test
$(() => {
  console.log('headerColor.js is linked')


  const changeColor = (e) => {
    let color = $(e.target).data('color');
    console.log(color);
    $(e.target).css('color', color);
  }

  const originalColor = (e) => {
    $(e.target).css('color', '#3366CC');
  }

  $('.letter').on('mouseover', changeColor);
  $('.letter').on('mouseout', originalColor);

})



