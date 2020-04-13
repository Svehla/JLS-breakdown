import { GameElementType } from './gameElementTypes'
import { playground } from '../config'
import { randomColor } from '../utils'

const getRandomWidth = () => Math.random() * 20 + 10
const getRandomId = () => `element-${Math.floor(Math.random() * 1000000000000)}`
console.log(getRandomId)

export const createGameElement = (type: GameElementType) => ({
  // I use curry function for easier setup of default values
  x = Math.random() * playground.width,
  y = Math.random() * playground.height,
  radius = type === GameElementType.Rectangle ? undefined : getRandomWidth(),
  width = type === GameElementType.Circle ? undefined : getRandomWidth() * 2,
  height = type === GameElementType.Circle ? undefined : getRandomWidth() * 2,
  background = randomColor(),
  audio = 'slowZero',
  deleted = false,
  shakingTime = null,
  // performance tuning
  visibleOnView = true,
  ...properties
}) => {
  const propertiesByType =
    type === GameElementType.Circle
      ? { radius }
      : type === GameElementType.Rectangle
      ? { height, width }
      : {}

  return {
    id: getRandomId(),
    type,
    x,
    y,
    background,
    audio,
    deleted,
    shakingTime,
    visibleOnView,
    ...properties,
    ...propertiesByType,
  }
}

export const createGameElements = (counts: number, type: GameElementType, config: object) =>
  Array.from({ length: counts }, () => createGameElement(type)(config))
