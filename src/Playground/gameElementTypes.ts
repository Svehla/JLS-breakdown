export enum GameElementType {
  Rectangle = 'Rectangle',
  Circle = 'Circle',
}

export type Rectangle = {
  type: GameElementType.Rectangle
  x: number
  y: number
  width: number
  height: number
}

export type Circle = {
  type: GameElementType.Circle
  radius: number
  x: number
  y: number
}

export type Radar = {
  sectorAngle: number
  rotation: number
  radius: number
  anglePerSecond: number
}

// TODO: only used for Radar -> should join them
export type Arc = {
  x: number
  y: number
  sectorAngle: number
  startAngle: number
  radius: number
}

export type Line = {
  x1: number
  y1: number
  x2: number
  y2: number
}

export type Point = {
  x: number
  y: number
}

export type GameElement = Rectangle | Circle
