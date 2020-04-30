import {
  GameElementBorder,
  GameElementFood,
  GameElementFoodType,
  GameElementType,
  Point,
} from './gameElementTypes'
import { playground } from './gameSetup'
import { randomColor } from '../utils'

const getRandomWidth = () => Math.random() * 20 + 10
const getRandomId = () => `element-${Math.floor(Math.random() * 1000000000000)}`
type PartialGameElementFood = {
  x?: number
  y?: number
  radius?: number
  width?: number
  height?: number
  background?: string
  audio?: string
  seenByRadar?: number
  deleted?: boolean
  shakingTime?: null | number
  visibleInView?: boolean
}

export const createGameFoodElement = (
  type: GameElementFoodType,
  conf: PartialGameElementFood
): GameElementFood => {
  // destructuring for default values FTW
  const {
    x = Math.random() * playground.width,
    y = Math.random() * playground.height,
    background = randomColor(),
    audio = 'slowZero',
    deleted = false,
    shakingTime = null,
    seenByRadar = 0,
    // performance tuning
    visibleInView = true,
    radius,
    width,
    height,
    ...properties
  } = conf

  const sharedProps = {
    id: `element-${getRandomId()}`,
    type,
    x,
    y,
    background,
    audio,
    deleted,
    seenByRadar,
    shakingTime,
    visibleInView,
    ...properties,
  }
  switch (sharedProps.type) {
    case GameElementType.Rectangle:
      // @ts-ignore
      return {
        ...sharedProps,
        height: height ?? getRandomWidth() * 4,
        width: width ?? getRandomWidth() * 4,
      }
    case GameElementType.Circle:
      // @ts-ignore
      return {
        ...sharedProps,
        radius: radius ?? getRandomWidth(),
      }
  }
}

export const createGameFoodElements = (
  counts: number,
  type: GameElementFoodType,
  config: PartialGameElementFood
) => Array.from({ length: counts }, () => createGameFoodElement(type, config))

type PartialGameElementBorder = {
  id?: string
  visibleInView?: boolean
  points: Point[]
  background?: string
}
export const createGameBorderElement = (
  properties: PartialGameElementBorder
): GameElementBorder => ({
  id: `border-${getRandomId()}`,
  type: GameElementType.Polygon,
  points: properties.points,
  visibleInView: properties.visibleInView ?? false,
  background: properties.background ?? randomColor(),
})
