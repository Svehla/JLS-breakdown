import { GameElementType } from './gameElementTypes'
import { _isPointArcCollision, isLinePointCollision } from './collisions'

describe.only('point line collision', () => {
  it('collision with point', () => {
    expect(isLinePointCollision({ x1: 0, y1: 0, x2: 10, y2: 10 }, { x: 10, y: 10 })).toEqual(true)
    expect(isLinePointCollision({ x1: 5, y1: 5, x2: 10, y2: 10 }, { x: 2, y: 2 })).toEqual(false)
    // expect(isLinePointCollision({ x1: 5, y1: 5, x2: 10, y2: 10 }, { x: 2, y: 2 })).toEqual(false)
  })
})

describe('arc collisions', () => {
  const radar = {
    x1: 10,
    y1: 10,
    radius: 100,
    sectorAngle: 50,
    rotation: 0,
    anglePerSecond: 10,
  }
  it('collision with point', () => {
    expect(
      _isPointArcCollision(radar, {
        type: GameElementType.Rectangle,
        x: 11,
        y: 11,
        width: 1,
        height: 1,
      })
    ).toEqual(true)

    expect(
      _isPointArcCollision(radar, {
        type: GameElementType.Rectangle,
        x: -9,
        y: -5,
        width: 1,
        height: 1,
      })
    ).toEqual(false)
  })
})
