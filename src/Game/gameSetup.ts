import { GameElementFood, GameElementType } from './gameElementTypes'
import { createGameBorderElement, createGameFoodElements } from './createGameElements'
import { isMobile } from '../utils'

export const getView = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  leftX: 100,
  topY: 100,
})

const view = getView()

export const RAY_COUNT = 50
// export const RADAR_LOOP_SPEED = 15000
export const RADAR_LOOP_SPEED = 2000
export const RADAR_VISIBLE_DELAY = RADAR_LOOP_SPEED / 2 // ms
export const playground = {
  width: isMobile ? 5500 : 5500,
  height: isMobile ? 2500 : 5000,
  borders: [
    createGameBorderElement({
      background: 'red',
      // TODO: draw playground in some external program
      points: [
        {
          x: -100 + view.leftX + view.width / 2 + 400,
          y: -50 + view.topY + view.height / 2,
        },
        {
          x: view.leftX + view.width / 2 + 400 + 5,
          y: -50 + view.topY + view.height / 2 + 400,
        },
        {
          x: -350 + view.topY + view.height / 2 + 400,
          y: -160 + view.leftX + view.width / 2 + 400 + 5,
        },
        {
          x: -100 + view.leftX + view.width / 2 + 400 + 5,
          y: 100 + view.topY + view.height / 2 + 500,
        },
      ],
    }),
  ],
}

export const gameElements: GameElementFood[] = [
  ...createGameFoodElements(100, GameElementType.Rectangle, {
    audio: 'scream',
  }),
  ...createGameFoodElements(100, GameElementType.Rectangle, {
    audio: 'growl',
  }),
]
