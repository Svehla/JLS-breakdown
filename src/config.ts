import { createGameObjects } from './Playground/createGameObjects'
import { isMobile } from './utils'
import helloKitty from './img/hello-kitty.png'
import jelinek from './img/jelinek.png'
import jolanda from './img/jolanda.png'

export const initSoundsConf = {
  // have to return new instance
  fastDrum: () => ({ loop: true }),
  slowDrum: () => ({ loop: true, volume: 4 }),
}

export const view = {
  width: window.innerWidth,
  height: window.innerHeight,
  leftX: 20,
  topY: 20,
}

export const playground = {
  width: isMobile ? 5500 : 5500,
  height: isMobile ? 2500 : 5000,
}

export const gameObjects = [
  ...createGameObjects(2, 'CIRCLE', {
    radius: 100,
    background: '#FFD700',
    audio: 'patAndMat',
  }),
  ...createGameObjects(9, 'RECTANGLE', {
    width: 114,
    height: 137,
    backgroundImage: helloKitty,
    background: '#F00',
    audio: 'omg',
  }),
  ...createGameObjects(2, 'CIRCLE', {
    radius: 160,
    background: '#0FD',
    audio: 'slza',
  }),
  ...createGameObjects(2, 'CIRCLE', {
    radius: 200,
    background: '#00F',
    audio: 'blue',
  }),
  ...createGameObjects(isMobile ? 2 : 4, 'CIRCLE', {
    shakingTime: 100,
    vibration: 100,
    audio: 'growl',
    backgroundImage: jolanda,
    fillPatternOffset: { x: -59, y: -59 },
    radius: 59,
  }),
  ...createGameObjects(1, 'CIRCLE', {
    x: playground.width / 2,
    y: playground.height / 2,
    shakingTime: 250,
    audio: 'growl',
    backgroundImage: jelinek,
    fillPatternOffset: { x: -150, y: -150 },
    radius: 150,
  }),
  ...createGameObjects(100, 'RECTANGLE', {
    audio: 'scream',
  }),
  ...createGameObjects(100, 'RECTANGLE', {
    audio: 'growl',
  }),
  ...createGameObjects(isMobile ? 150 : 250, 'CIRCLE', {
    audio: 'fastZero',
  }),
]
