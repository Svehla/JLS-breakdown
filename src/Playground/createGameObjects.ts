import { playground } from '../config'
import { randomColor } from '../utils'

const randomWidth = () => Math.random() * 20 + 10

export type GameObjectType = 'RECTANGLE' | 'CIRCLE'

export const createGameObject = (type: GameObjectType) => ({
  x = Math.random() * playground.width,
  y = Math.random() * playground.height,
  radius = type === 'RECTANGLE' ? undefined : randomWidth(),
  width = type === 'CIRCLE' ? undefined : randomWidth() * 2,
  height = type === 'CIRCLE' ? undefined : randomWidth() * 2,
  background = randomColor(),
  audio = 'slowZero',
  deleted = false,
  shakingTime = null,
  // performance tuning
  visibleOnView = true,
  ...properties
}) => {
  const propertiesByType =
    type === 'CIRCLE' ? { radius } : type === 'RECTANGLE' ? { height, width } : {}

  return {
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

// @ts-ignore
export const createGameObjects = (counts: number, type: GameObjectType, config) =>
  Array.from({ length: counts }, () => createGameObject(type)(config))
