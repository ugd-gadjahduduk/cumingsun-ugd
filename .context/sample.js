/** @format */
const svg = document.getElementById('svg')
const tl = gsap.timeline({
  onComplete: () => {
    document.body.style.overflow = 'visible'
  },
})

const curve = 'M0 502S175 272 500 272s500 230 500 230V0H0Z'
const flat = 'M0 2S175 1 500 1s500 1 500 1V0H0Z'

tl.from('.loader-wrap-heading h1', {
  delay: 0.5,
  y: 200,
  skewY: 20,
}).to('.loader-wrap-heading h1', {
  delay: 0.5,
  y: -200,
  skewY: 20,
})
tl.to(svg, {
  duration: 0.8,
  attr: { d: curve },
  ease: 'power2.easeIn',
}).to(svg, {
  duration: 0.8,
  attr: { d: flat },
  ease: 'power2.easeOut',
})
tl.to('.loader-wrap', {
  y: -1500,
})
tl.to('.loader-wrap', {
  zIndex: -1,
  display: 'none',
})
tl.from(
  '.container',
  {
    y: 100,
    opacity: 0,
  },
  '-=1.5'
)

tl.from(
  'nav',
  {
    duration: 1,
    opacity: 0,
  },
  '-=1.2'
)
