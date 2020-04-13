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

export type GameElement = Rectangle | Circle
