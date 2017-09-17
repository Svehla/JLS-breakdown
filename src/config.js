import { createDataElements } from './Playground/createDataElement'
import { RECTANGLE, CIRCLE } from './constants'
import jolanda from './img/jolanda.png'
import helloKitty from './img/hello-kitty.png'
import { isMobile } from './utils'
export const LOADING_BG_COLOR = '#DEF'
export const PLAY_BG_COLOR = '#EEF'

export const initSoundsConfig = {
  fastDrum: { loop: true },
  slowDrum: { loop: true },
}

export const view = {
  width: window.innerWidth,
  height: window.innerHeight, // - 150,
  leftX: 20,
  topY: 20,
}
export const playground = {
  width: isMobile ? 3500 : 7000,
  height: isMobile ? 2500 : 5000,
}

export const dataObjects = [
  ...createDataElements(2, CIRCLE, {
    radius: 110,
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
    radius: 200,
    background: '#00F',
    audio: 'blue',
  }),
  ...createDataElements(isMobile ? 2 : 4, CIRCLE, {
    shakingTime: 200,
    audio: 'growl',
    backgroundImage: jolanda,
    fillPatternOffset: { x : -59, y : -59 },
    radius: 59,
  }),
  ...createDataElements(50, RECTANGLE, {
    audio: 'scream',
  }),
  ...createDataElements(isMobile ? 200 : 350, CIRCLE, {
    audio: 'fastZero',
  })
]