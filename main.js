// bg1
const bg1 = "https://cdn.jsdelivr.net/gh/evolify/files/img/202112302229637.jpeg"

const imgs = [
  "http://jsdemo.codeman.top/images/incarnation/heguanzhe.jpg",
  "http://jsdemo.codeman.top/images/incarnation/xiadou.jpg",
  "http://jsdemo.codeman.top/images/incarnation/baiyuekui.jpg",
  "http://jsdemo.codeman.top/images/incarnation/ailika.jpg",
  "http://jsdemo.codeman.top/images/incarnation/jiexika.jpg",
  "http://jsdemo.codeman.top/images/incarnation/chenmin4277.jpg",
  "http://jsdemo.codeman.top/images/incarnation/feixue.jpg",
  "http://jsdemo.codeman.top/images/incarnation/hongkou.jpg", //
  "http://jsdemo.codeman.top/images/incarnation/peini.jpg",
  "http://jsdemo.codeman.top/images/incarnation/suixing.jpg",
  "http://jsdemo.codeman.top/images/incarnation/jingnan.jpg",
]

function initGallery() {
  const gallery = document.querySelector(".gallery")
  const len = imgs.length
  const Deg = 360 / len
  imgs.forEach((t, i) => {
    const img = document.createElement("img")
    img.src = t
    setTimeout(() => {
      img.style.transform = `rotateY(${i * Deg}deg) translateZ(300px)`
      img.style.transition = `transform 1s ${(len - 1 - i) * 0.1}s`
    }, 0)
    gallery.appendChild(img)
  })
  let nowX,
    nowY,
    lastX,
    lastY,
    minusX = 0,
    minusY = 0
  let roY = 0,
    roX = 0
  let timer
  function galleryTransform(trans) {
    return "rotateZ(60deg) " + trans
  }
  window.touchEvents.start.push(e => {
    console.log("start", e)
    e = e || window.event
    //鼠标按下的时候，给前一点坐标赋值，为了避免第一次相减的时候出错
    lastX = e.clientX
    lastY = e.clientY
  })
  window.touchEvents.move.push(e => {
    e = e || window.event
    clearInterval(timer)
    nowX = e.clientX // clientX 鼠标距离页面左边的距离
    nowY = e.clientY // clientY ………………………………顶部………………
    //当前坐标和前一点坐标差值
    minusX = nowX - lastX
    minusY = nowY - lastY
    //更新wrap的旋转角度，拖拽越快-> minus变化大 -> roY变化大 -> 旋转快
    roY += minusX * 0.2 // roY = roY + minusX*0.2;
    roX -= minusY * 0.1
    gallery.style.transform =
      // galleryTransform(
      "rotateX(" + roX + "deg) rotateY(" + roY + "deg)"
    // )
    //前一点的坐标
    lastX = nowX
    lastY = nowY
  })
  window.touchEvents.end.push(e => {
    timer = setInterval(function () {
      minusX *= 0.95
      minusY *= 0.95
      roY += minusX * 0.2 // roY = roY + minusX*0.2;
      roX -= minusY * 0.1
      gallery.style.transform =
        // galleryTransform(
        "rotateX(" + roX + "deg) rotateY(" + roY + "deg)"
      // )
      if (Math.abs(minusX) < 0.1 && Math.abs(minusY) < 0.1) {
        clearInterval(timer)
      }
    }, 13)
  })
}

function bird_fly() {
  VANTA.BIRDS({
    el: ".bg-bird",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 600.0,
    minWidth: 300.0,
    // backgroundColor: "#000",
    backgroundAlpha: 0,
    scale: 1.0,
    scaleMobile: 1.0,
  })
}

function celebrate(x, y) {
  confetti({ origin: { x, y } })
}

function snow() {
  let duration = 15 * 1000
  let animationEnd = Date.now() + duration
  let skew = 1

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  function frame() {
    var timeLeft = animationEnd - Date.now()
    var ticks = Math.max(200, 500 * (timeLeft / duration))
    skew = Math.max(0.8, skew - 0.001)

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: Math.random() * skew - 0.2,
      },
      colors: ["#ffffff"],
      shapes: ["circle"],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    })

    if (timeLeft > 0) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

function initEvents() {
  window.touchEvents = {
    start: [],
    move: [],
    end: [],
  }
  document.body.addEventListener("click", e => {
    const x = e.clientX / document.body.clientWidth
    const y = e.clientY / document.body.clientHeight
    celebrate(x, y)
  })
  // 禁用ios回弹效果
  document.body.addEventListener("touchmove", e => e.preventDefault(), {
    passive: false,
  })
  document.addEventListener("pointerdown", onTouchStart, {
    passive: false,
  })
  function onTouchStart(e) {
    window.touchEvents.start.forEach(t => t(e))
    document.addEventListener("pointermove", onTouchMove)
    document.addEventListener("pointerup", onTouchEnd)
    document.addEventListener("pointercancel", onTouchEnd)
    return false
  }
  function onTouchMove(e) {
    window.touchEvents.move.forEach(t => t(e))
  }
  function onTouchEnd() {
    document.removeEventListener("pointermove", onTouchMove)
    window.touchEvents.end.forEach(t => t())
  }
}

window.addEventListener("load", () => {
  // snow()
  initEvents()
  bird_fly()
  initGallery()
})
