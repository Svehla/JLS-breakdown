import { createDataElements } from './Playground/createDataElement'
import { RECTANGLE, CIRCLE } from './constants'
import jolanda from './img/jolanda.png'
import helloKitty from './img/hello-kitty.png'
import { isMobile } from './utils'
export const LOADING_BG_COLOR = '#333'
export const PLAY_BG_COLOR = '#EEF'
// console.log(helloKitty)
// console.log(mainLogo)
export const view = {
  width: window.innerWidth,
  height: window.innerHeight, // - 150,
  leftX: 20,
  topY: 20,
}
export const playground = {
  width: isMobile ? 3500 : 5000,
  height: isMobile ? 2500 : 3000,
}

export const dataObjects = [
  ...createDataElements(2, CIRCLE, {
    radius: 150,
    background: '#FFD700',
    audio: 'patAndMat',
  }),
  ...createDataElements(9, RECTANGLE, {
    width: 114,
    height: 137,
    backgroundImage: helloKitty,
    background: '#F00',
    audio: 'omg',
  }),
  ...createDataElements(2, CIRCLE, {
    radius: 160,
    background: '#0FD',
    audio: 'slza',
  }),
  ...createDataElements(2, CIRCLE, {
    radius: 300,
    background: '#00F',
    audio: 'blue',
  }),
  ...createDataElements(20, CIRCLE, {
    audio: 'growl',
    backgroundImage: jolanda,
    fillPatternOffset: { x : -59, y : -59 },
    radius: 59,
  }),
  ...createDataElements(20, RECTANGLE, {
    audio: 'scream',
  }),
  ...createDataElements(180, CIRCLE, {
    audio: 'fastZero',
  })
]