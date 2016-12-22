$(() => {

  // ###################################################################
  // Particles.JS

  particlesJS('particles-js', {
    "particles": {
    "number": {
      "value": 100,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#fff"
    },
    "shape": {
      "type": "edge", // circle, triangle, or edge
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 0.5,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 2,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 3,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
  });


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
