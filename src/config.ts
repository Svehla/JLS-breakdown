import { GameElementType } from './Playground/gameElementTypes'
import { createGameElements } from './Playground/createGameElements'
import { isMobile } from './utils'
import helloKitty from './img/hello-kitty.png'
import jolanda from './img/jolanda.png'
import megaBoss from './img/mega-boss.jpg'

export type DrumType = 'fastDrum' | 'slowDrum'
export const initSoundsConf = {
  fastDrum: { loop: true },
  slowDrum: { loop: true, volume: 4 },
} as const

export const getView = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  leftX: 20,
  topY: 20,
})

export const RAY_COUNT = 50
export const RADAR_LOOP_SPEED = 5000
// export const RADAR_LOOP_SPEED = 1500
export const RADAR_VISIBLE_DELAY = RADAR_LOOP_SPEED / 2 // ms
export const playground = {
  width: isMobile ? 5500 : 5500,
  height: isMobile ? 2500 : 5000,
} as const

const view = getView()

export const gameElements = [
  ...createGameElements(1, GameElementType.Rectangle, {
    background: '#0FD700',
    x: view.leftX + view.width / 2 + 400,
    y: 50 + view.topY + view.height / 2,
    width: 5,
    height: 500,
  }),
  ...createGameElements(1, GameElementType.Rectangle, {
    background: '#0F0700',
    x: view.leftX + view.width / 2 + 300,
    y: -450 + view.topY + view.height / 2,
    width: 5,
    height: 410,
  }),
  ...createGameElements(1, GameElementType.Rectangle, {
    background: '#0FD700',
    x: view.leftX + view.width / 2 + 200,
    y: 50 + view.topY + view.height / 2,
    width: 5,
    height: 500,
  }),
  /*
  ...createGameElements(2, GameElementType.Circle, {
    radius: 100,
    background: '#FFD700',
    audio: 'patAndMat',
  }),
  ...createGameElements(9, GameElementType.Rectangle, {
    width: 114,
    height: 137,
    backgroundImage: helloKitty,
    background: '#F00',
    audio: 'omg',
  }),
  ...createGameElements(2, GameElementType.Circle, {
    radius: 160,
    background: '#0FD',
    audio: 'slza',
  }),
  ...createGameElements(2, GameElementType.Circle, {
    radius: 200,
    background: '#00F',
    audio: 'blue',
  }),
  ...createGameElements(isMobile ? 2 : 4, GameElementType.Circle, {
    shakingTime: 100,
    vibration: 100,
    audio: 'growl',
    backgroundImage: jolanda,
    fillPatternOffset: { x: -59, y: -59 },
    radius: 59,
  }),
  ...createGameElements(1, GameElementType.Circle, {
    x: playground.width / 2,
    y: playground.height / 2,
    shakingTime: 250,
    audio: 'growl',
    backgroundImage: megaBoss,
    fillPatternOffset: { x: -150, y: -150 },
    radius: 150,
  }),
  */
  ...createGameElements(200, GameElementType.Rectangle, {
    audio: 'scream',
  }),
  ...createGameElements(100, GameElementType.Rectangle, {
    audio: 'growl',
  }),
  /*
  ...createGameElements(isMobile ? 150 : 250, GameElementType.Circle, {
    audio: 'fastZero',
  }),
  */
]
