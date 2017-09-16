import { SHADOW_MARGIN } from '../constants'
const {
  PI,
  cos,
  sin,
  atan,
  sqrt,
  pow,
  abs
} = Math

export const pythagorC = (a, b) => sqrt(pow(a, 2) + pow(b, 2))
export const toDegrees = angle => angle * (180 / PI)
export const toRadians = angle => angle * (PI / 180)

export const calculateProgress = (mousePos, currPosAbs, currPosRel, distance) => {
  return mousePos > currPosRel
      ? currPosAbs + distance
      : currPosAbs - distance
}

export const getDistance = (mousePos, actualPos, maxSpeed) => {
  const xDiff = mousePos.x - actualPos.xRel // division by zero => .js Infinity
  const yDiff = mousePos.y - actualPos.yRel
  const c = pythagorC(xDiff, yDiff)
  const tanRatio = yDiff / xDiff
  const tanAngle = atan(tanRatio)
  const possibleAcceleration = pow(c / 40, 2)
  const finAcceleration = possibleAcceleration < maxSpeed ? possibleAcceleration : maxSpeed
  const newX = cos(tanAngle) * finAcceleration || 0
  const newY = sin(tanAngle) * finAcceleration || 0
  return {
    distanceX: abs(newX),
    distanceY: abs(newY),
  }
}

const borderCollisions = (coordinate, min, max) => (
  coordinate < min
    ? min
  : coordinate > max
    ? max
  : coordinate
)

export const calculateNewObjPos = (mousePos, meElement, maxSpeed, playground) => {
  const {
    distanceX,
    distanceY
  } = getDistance(mousePos, meElement, maxSpeed)
  const x = calculateProgress(mousePos.x, meElement.x, meElement.xRel, distanceX)
  const y = calculateProgress(mousePos.y, meElement.y, meElement.yRel, distanceY)
  return {
    x: borderCollisions(x, 0, playground.width),
    y: borderCollisions(y, 0, playground.height),
  }
}
const isInAxios = (position, larger, lower, halfWidth) => (
  position + halfWidth + SHADOW_MARGIN >= larger && position <= lower + SHADOW_MARGIN + halfWidth
)

export const isInView = view => ({
  x,
  y,
  width, // width of element
  height,
  radius,
}) => {
  // circle has only width -> ractangle has width and height
  height = height || width || radius
  width = width || radius
  const v = view // abbrevation for me
  const rightX = v.leftX + v.width
  const bottomY = v.topY + v.height

  const isInX = isInAxios(x, v.leftX, rightX, width)
  const isInY = isInAxios(y, v.topY, bottomY, height)

  return isInX && isInY
}

export const getActualPossition = (view, {x, y}) => {
  const relativeXCoor = x - view.leftX
  const relativeYCoor = y - view.topY
  return {
    x: relativeXCoor,
    y: relativeYCoor
  }
}

