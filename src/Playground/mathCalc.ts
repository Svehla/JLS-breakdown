const {
  // PI,
  cos,
  sin,
  atan,
  sqrt,
  pow,
  abs,
} = Math

export type View = {
  width: number
  height: number
  leftX: number
  topY: number
}

// Coordination
export type Coord = {
  x: number
  y: number
}

// TODO: what about to use Math.min/max
export const lowerToZero = (num: number) => (num - 1 < 0 ? 0 : num - 1)

export const pythagorC = (a: number, b: number) => sqrt(pow(a, 2) + pow(b, 2))

// export const toDegrees = angle => angle * (180 / PI)
// export const toRadians = angle => angle * (PI / 180)

export const calculateProgress = (
  mousePos: any,
  currPosAbs: any,
  currPosRel: any,
  distance: any
) => {
  return mousePos > currPosRel ? currPosAbs + distance : currPosAbs - distance
}

// @ts-ignore
export const getDistance = (mousePos, actualPos, maxSpeed) => {
  const xDiff = mousePos.x - actualPos.xRel // division by zero => .js Infinity
  const yDiff = mousePos.y - actualPos.yRel
  const tanRatio = yDiff / xDiff
  const tanAngle = atan(tanRatio)
  const c = pythagorC(xDiff, yDiff)
  const possibleAcceleration = pow(c / 40, 2)
  const finAcceleration = possibleAcceleration < maxSpeed ? possibleAcceleration : maxSpeed
  const newX = cos(tanAngle) * finAcceleration || 0
  const newY = sin(tanAngle) * finAcceleration || 0
  return {
    distanceX: abs(newX),
    distanceY: abs(newY),
  }
}

// @ts-ignore
const borderCollisions = (coordinate, min, max) =>
  coordinate < min ? min : coordinate > max ? max : coordinate

// @ts-ignore
const addShaking = shakingParam => position =>
  shakingParam.fpsDeduction > 0
    ? position + Math.random() * shakingParam.fpsDeduction - shakingParam.fpsDeduction / 2
    : position

export const calculateNewObjPos = (
  mousePos: any,
  meElement: any,
  maxSpeed: any,
  playground: any,
  cameraShaking: any
) => {
  const { distanceX, distanceY } = getDistance(mousePos, meElement, maxSpeed)
  const x = calculateProgress(mousePos.x, meElement.x, meElement.xRel, distanceX)
  const y = calculateProgress(mousePos.y, meElement.y, meElement.yRel, distanceY)
  const xWithBorder = borderCollisions(x, 0, playground.width)
  const yWithBorder = borderCollisions(y, 0, playground.height)
  const shakingFunc = addShaking(cameraShaking)
  return {
    x: shakingFunc(xWithBorder),
    y: shakingFunc(yWithBorder),
  }
}

// @ts-ignore
const isInAxios = (position, larger, lower, halfWidth) =>
  position + halfWidth >= larger && position <= lower + halfWidth

// @ts-ignore
export const getInRange = ({ range = 1, number }) =>
  number > range ? range : number < -range ? -range : number

// @ts-ignore
export const isInView = (
  view: View,
  {
    x,
    y,
    width, // width of element
    height,
    radius,
  }: any
) => {
  // circle has only radis -> ractangle has width and height
  height = height || radius
  width = width || radius
  const v = view // abbrevation for me
  const rightX = v.leftX + v.width
  const bottomY = v.topY + v.height

  const isInX = isInAxios(x, v.leftX, rightX, width)
  const isInY = isInAxios(y, v.topY, bottomY, height)

  return isInX && isInY
}

// @ts-ignore
export const getActualPosition = (view: View, { x, y }: Coord): Coord => {
  const relativeXCoord = x - view.leftX
  const relativeYCoord = y - view.topY
  return {
    x: relativeXCoord,
    y: relativeYCoord,
  }
}
