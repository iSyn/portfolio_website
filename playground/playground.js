window.onload = () => {

  let canvas = document.querySelector('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight


  let c = canvas.getContext('2d')

  let randomX = () => Math.random() * window.innerWidth
  let randomY = () => Math.random() * window.innerHeight

  // c.fillRect(x, y, width, height)
  // c.fillStyle = 'green'
  // c.fillRect(randomX(), randomY(), 100, 100)
  // c.fillStyle = 'blue'
  // c.fillRect(randomX(), randomY(), 100, 100)
  // c.fillStyle = 'pink'
  // c.fillRect(randomX(), randomY(), 100, 100)

  // draw a path
  // c.beginPath()
  // // c.moveTo(x, y)
  // c.moveTo(50, 300)
  // c.lineTo(300, 100)
  // c.lineTo(400, 300)
  // c.strokeStyle = 'red'
  // c.stroke()

  // arcs & circles
  // c.arc(x:int, y:int, radius:int, startAngle:float, endAngle:float, drawCounterClockwise:bool)
  // c.beginPath() // remember to beginPath on strokes
  // c.arc(300, 300, 30, 0, Math.PI * 2, false)
  // c.strokeStyle = 'blue'
  // c.stroke()

  // for (i = 0; i < 100; i++) {
  //   let x = Math.random() * window.innerWidth
  //   let y = Math.random() * window.innerHeight
  //   c.beginPath() // remember to beginPath on strokes
  //   c.arc(x, y, 30, 0, Math.PI * 2, false)
  //   c.strokeStyle = 'blue'
  //   c.stroke()
  // }



  let Circle = function(x, y, dx, dy, radius) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius

    this.draw = () => {
      c.beginPath()
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      c.strokeStyle = 'black'
      c.stroke()
      c.fill()
      c.fillStyle = `rgb(${Math.floor(Math.random() * 255) + 1},${Math.floor(Math.random() * 255) + 1},${Math.floor(Math.random() * 255) + 1})`
    }

    this.update = () => {
      if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
        this.dx = -this.dx
      }

      if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
        this.dy = -this.dy
      }

      this.x += this.dx
      this.y += this.dy

      this.draw()
    }
  }

  // let circle = new Circle(200, 200, 3, 3, 30)
  let circleArr = []
  for (i = 0; i < 200; i++) {

    let radius = Math.floor(Math.random() * (50 - 20 + 1)) + 20
    let x = Math.random() * (innerWidth - radius * 2) + radius
    let y = Math.random() * (innerHeight - radius * 2) + radius
    let dx = (Math.random() - .5) * 10
    let dy = (Math.random() - .5) * 10

    circleArr.push(new Circle(x, y, dx, dy, radius))
  }

  let animate = () => {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight) // clear whole screen
    for (i in circleArr) circleArr[i].update()
  }

  animate()
}
