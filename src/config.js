import { createDataElements } from './Playground/createDataElement'
import { RECTANGLE, CIRCLE } from './constants'
import jolanda from './img/jolanda.png'
import jelinek from './img/jelinek.png'
import helloKitty from './img/hello-kitty.png'
import { isMobile } from './utils'
export const LOADING_BG_COLOR = '#DEF'
export const PLAY_BG_COLOR = '#EEF'

export const initSoundsConf = {
// have to return new instance
  fastDrum: () => ({ loop: true }),
  slowDrum: () => ({ loop: true, volume: 4 }),
}

export const view = {
  width: window.innerWidth,
  height: window.innerHeight, // - 150,
  leftX: 20,
  topY: 20,
}
export const playground = {
  width: isMobile ? 5500 : 5500,
  height: isMobile ? 2500 : 5000,
}

export const dataObjects = [
  ...createDataElements(2, CIRCLE, {
    radius: 100,
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
    shakingTime: 100, // 20
    vibration: 100,
    audio: 'growl',
    backgroundImage: jolanda,
    fillPatternOffset: { x : -59, y : -59 },
    radius: 59,
  }),
  ...createDataElements(1, CIRCLE, {
    x: playground.width / 2,
    y: playground.height / 2,
    shakingTime: 250,
    audio: 'growl',
    backgroundImage: jelinek,
    fillPatternOffset: { x : -150, y : -150 },
    radius: 150,
  }),
  ...createDataElements(100, RECTANGLE, {
    audio: 'scream',
  }),
  ...createDataElements(100, RECTANGLE, {
    audio: 'growl',
  }),
  ...createDataElements(isMobile ? 200 : 500, CIRCLE, {
    audio: 'fastZero',
  })
]