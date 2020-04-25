import { GameElement, GameElementType } from './gameElementTypes'

// todo: extract types out of `mathCalc.js` to another file
export type View = {
  width: number
  height: number
  // absolute coordination for view in playground
  leftX: number
  topY: number
}

// Coordination
export type Coord = {
  x: number
  y: number
}

export type AbsoluteCoord = {
  x: number
  y: number
}

export type MousePos = {
  x: number
  y: number
}

export type CurrentPosition = {
  xRel: number
  yRel: number
}

export type CenterElement = { maxSpeedPerSecond: number } & CurrentPosition & AbsoluteCoord

export const decreaseBy1ToZero = (num: number) => Math.max(num - 1, 0)

export const pythagorC = (a: number, b: number) => Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))

export const calculateProgress = (
  axisMousePos: number,
  currPosAbs: number,
  currPosRel: number,
  distance: number
) => {
  return axisMousePos > currPosRel ? currPosAbs + distance : currPosAbs - distance
}

/**
 * return new relative movement for element
 */
export const getDistance = (
  mousePos: MousePos,
  currentPos: CenterElement,
  maxSpeedPerSecond: number,
  timeSinceLastTick: number
) => {
  const xDiff = mousePos.x - currentPos.xRel // division by zero => .js Infinity
  const yDiff = mousePos.y - currentPos.yRel
  const tanRatio = yDiff / xDiff
  const tanAngle = Math.atan(tanRatio)
  const c = pythagorC(xDiff, yDiff)
  // TODO: some random constants?
  const possibleAcceleration = Math.pow(c / 40, 2)
  const finAcceleration = Math.min(
    possibleAcceleration,
    maxSpeedPerSecond / (1000 / timeSinceLastTick)
  )
  const newX = Math.cos(tanAngle) * finAcceleration || 0
  const newY = Math.sin(tanAngle) * finAcceleration || 0
  return {
    distanceX: Math.abs(newX),
    distanceY: Math.abs(newY),
  }
}

const stayInRange = (num: number, { min, max }: { min: number; max: number }) =>
  Math.min(Math.max(min, num), max)

const addShaking = (cameraShakeIntensity: number, axisPosition: number) =>
  cameraShakeIntensity > 0
    ? axisPosition + Math.random() * cameraShakeIntensity - cameraShakeIntensity / 2
    : axisPosition

export const calculateNewObjPos = (
  mousePos: MousePos,
  meElement: CenterElement,
  timeSinceLastTick: number,
  playground: { width: number; height: number },
  { cameraShakeIntensity }: { cameraShakeIntensity: number }
) => {
  const { distanceX, distanceY } = getDistance(
    mousePos,
    meElement,
    meElement.maxSpeedPerSecond,
    timeSinceLastTick
  )
  const x = calculateProgress(mousePos.x, meElement.x, meElement.xRel, distanceX)
  const y = calculateProgress(mousePos.y, meElement.y, meElement.yRel, distanceY)
  // calculate new pos and stay in playground
  const xWithBorder = stayInRange(x, { min: 0, max: playground.width })
  const yWithBorder = stayInRange(y, { min: 0, max: playground.height })
  return {
    x: addShaking(cameraShakeIntensity, xWithBorder),
    y: addShaking(cameraShakeIntensity, yWithBorder),
  }
}

const isInAxios = (axisPosition: number, larger: number, lower: number, halfWidth: number) =>
  axisPosition + halfWidth >= larger && axisPosition <= lower + halfWidth

/**
 * range define borders like:
 *  -1 ... 1
 *  -5 ... 5
 *
 * this function check if `num` is inside of that range
 * if not -> move it to max/min value
 */
export const getInRange = (num: number, range = 1) => stayInRange(num, { min: -range, max: range })

/**
 * check if `gameElement` is in view (screen that user can see)
 *
 * collisions of screen and elements are compared by absolute coordinations
 */
export const isInView = (view: View, gameElement: GameElement): boolean => {
  let height = null
  let width = null
  // make square position for easier calculating of `isInView` fn
  if (gameElement.type === GameElementType.Circle) {
    width = gameElement.radius
    height = gameElement.radius
  } else {
    width = gameElement.width
    height = gameElement.height
  }

  const rightX = view.leftX + view.width
  const bottomY = view.topY + view.height

  const isInX = isInAxios(gameElement.x, view.leftX, rightX, width)
  const isInY = isInAxios(gameElement.y, view.topY, bottomY, height)

  return isInX && isInY
}

/**
 * calculate player position from absolute playground coordinations
 * to screen view relative coordinations
 */
export const getRelativePosByAbsPos = (view: View, { x, y }: Coord): Coord => {
  const relativeXCoord = x - view.leftX
  const relativeYCoord = y - view.topY
  return {
    x: relativeXCoord,
    y: relativeYCoord,
  }
}
