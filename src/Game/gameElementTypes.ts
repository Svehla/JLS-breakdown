// the simplest geometry shapes
// todo: extract functions into engine folder
// primarily used for engine calculations
// ---------------------------------------------------------------
export type Arc = {
  x: number
  y: number
  sectorAngle: number
  startAngle: number
  radius: number
}

export type Polygon = {
  // points size have to be larger than 2 & last item is redirected to the first one (closed shape)
  points: Point[]
}

// todo: refactor to from: Point, to: Point -> for easier integrations
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

// todo: should inherit from point?
export type Rectangle = {
  x: number
  y: number
  width: number
  height: number
}

// todo: should inherit from point?
export type Circle = {
  radius: number
  x: number
  y: number
}
export type BorderElement = {}

// game elements used in canvas and game and for custom game logic
// ---------------------------------------------------------------
// similar to arc but customized for the current game
export type Radar = {
  sectorAngle: number
  rotation: number
  radius: number
  anglePerSecond: number
}

export enum GameElementType {
  Rectangle = 'Rectangle',
  Circle = 'Circle',
  Polygon = 'Polygon',
}

// shared between food and borders
export type GameElementProps = {
  id: string
  visibleInView: boolean
  background: string
}

// what about to use classes and inheritance?
export type GameElementFoodProps = GameElementProps & {
  audio: string
  seenByRadar: number
  deleted: boolean
  shakingTime: null | number
}

export type GameElementFoodType = GameElementType.Rectangle | GameElementType.Circle

export type GameElementFood =
  | (Rectangle &
      GameElementFoodProps & {
        type: GameElementType.Rectangle
      })
  | (Circle &
      GameElementFoodProps & {
        type: GameElementType.Circle
      })

export type GameElementBorder = Polygon &
  GameElementProps & {
    type: GameElementType.Polygon
  }

export type GameElement = GameElementFood | GameElementBorder
