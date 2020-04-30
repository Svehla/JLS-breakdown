import { Angle, decreaseBy1ToZero, distance, isAngleInArcSector } from './mathCalc'

describe('angles', () => {
  it('add', () => {
    expect(Angle.add(300, 300)).toEqual(240)
    expect(Angle.add(-300, 310)).toEqual(10)
    expect(Angle.add(-600, -100)).toEqual(20)
    expect(Angle.add(-6, -4)).toEqual(350)
    expect(Angle.add(359, 1)).toEqual(0)
  })
  it('sub', () => {
    expect(Angle.sub(-6, -4)).toEqual(358)
    expect(Angle.sub(6, 4)).toEqual(2)
    expect(Angle.sub(370, 380)).toEqual(350)
    expect(Angle.sub(370, 380)).toEqual(350)
  })
  it('to460range', () => {
    expect(Angle.to360Range(370)).toEqual(10)
    expect(Angle.to360Range(-20)).toEqual(340)
    expect(Angle.to360Range(-370)).toEqual(350)
    expect(Angle.to360Range(-360)).toEqual(0)
  })
  it('toDegrees', () => {
    expect(Angle.toDegrees(2 * Math.PI)).toEqual(360)
    expect(Angle.toDegrees(Math.PI / 2)).toEqual(90)
    expect(Angle.toDegrees(Math.PI / 4)).toEqual(45)
    expect(Angle.toDegrees(0)).toEqual(0)
  })
  it('toRadians', () => {
    expect(Angle.toRadians(360)).toEqual(2 * Math.PI)
    expect(Angle.toRadians(90)).toEqual(Math.PI / 2)
    expect(Angle.toRadians(45)).toEqual(Math.PI / 4)
    expect(Angle.toRadians(0)).toEqual(0)
  })
  it('isAngleInArcSector', () => {
    expect(isAngleInArcSector(60, 20, 40)).toEqual(false)
    expect(isAngleInArcSector(60, 20, 61)).toEqual(true)
    expect(isAngleInArcSector(60, 20, 60)).toEqual(true)
    expect(isAngleInArcSector(300, 280, 60)).toEqual(true)
    expect(isAngleInArcSector(200, 280, 60)).toEqual(false)
    expect(isAngleInArcSector(180, 181, 179)).toEqual(false)
    expect(isAngleInArcSector(180, 180, 179)).toEqual(true)
  })
})

describe('math', () => {
  it('distance', () => {
    expect(distance({ x: 0, y: 0 }, { x: 10, y: 0 })).toEqual(10)
    expect(distance({ x: 0, y: 10 }, { x: 0, y: 20 })).toEqual(10)
    expect(distance({ x: 10, y: 10 }, { x: 14, y: 13 })).toEqual(5)
  })
})

describe('utils', () => {
  it('decreaseBy1ToZero', () => {
    expect(decreaseBy1ToZero(-10)).toEqual(0)
    expect(decreaseBy1ToZero(0)).toEqual(0)
    expect(decreaseBy1ToZero(1)).toEqual(0)
    expect(decreaseBy1ToZero(10)).toEqual(9)
  })
})
