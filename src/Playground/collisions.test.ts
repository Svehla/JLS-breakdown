import { GameElementType } from './gameElementTypes'
import { _isPointArcCollision } from './collisions'

// todo: add more tests
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
