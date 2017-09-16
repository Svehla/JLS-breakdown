import { createDataElements } from './Playground/createDataElement'
import { RECTANGLE, CIRCLE } from './constants'

export const view = {
  width: window.innerWidth,
  height: window.innerHeight, // - 150,
  leftX: 20,
  topY: 20,
}
export const playground = {
  width: 5000,
  height: 3000,
}

export const dataObjects = [
  ...createDataElements(2, CIRCLE, {
    radius: 150,
    background: '#FFD700',
    audio: 'patAndMat',
  }),
  ...createDataElements(6, RECTANGLE, {
    width: 100,
    height: 100,
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
  ...createDataElements(20, RECTANGLE, {
    audio: 'growl',
  }),
  ...createDataElements(20, RECTANGLE, {
    audio: 'scream',
  }),
  ...createDataElements(180, CIRCLE, {
    audio: 'fastZero',
  })
]