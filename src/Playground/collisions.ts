import { Circle, GameElement, GameElementType, Radar, Rectangle } from './gameElementTypes'
import { isAngleInArcSector, toDegrees } from './mathCalc'

export const isTwoElementCollision = (circleShape1: Circle, shape2: GameElement) => {
  switch (shape2.type) {
    case GameElementType.Circle:
      return isCircleCircleCollision(circleShape1, shape2)
    case GameElementType.Rectangle:
      return isRectangleCircleCollision(circleShape1, shape2)
  }
}

// todo: add arc collision (no just circle fake)
export const arcRectCollision = (arc: Radar, shape2: GameElement) => {
  switch (shape2.type) {
    case GameElementType.Circle:
      return isRectangleArcCollision(arc, {
        // temporary transform circles into rectangles
        type: GameElementType.Rectangle,
        x: shape2.x,
        y: shape2.y,
        width: shape2.radius,
        height: shape2.radius,
      })
    case GameElementType.Rectangle:
      return isRectangleArcCollision(arc, shape2)
  }
}

// TODO: add docs
// make it via line & angle ...
const isRectangleArcCollision = (arc: Radar, rect: Rectangle) => {
  const xDistance = rect.x - arc.x1 // division by zero => .js Infinity
  const yDistance = rect.y - arc.y1
  const tanRatio = yDistance / xDistance

  const arcRecAngle = toDegrees(Math.atan(tanRatio))

  // right half of game
  let finalAngle
  if (xDistance > 0) {
    finalAngle = (360 + arcRecAngle) % 360
  } else {
    // it works coz of negative angles
    finalAngle = 180 + arcRecAngle
  }

  const startAngle = arc.rotation
  const endAngle = (arc.rotation + arc.sectorAngle) % 360
  return isAngleInArcSector(finalAngle, startAngle, endAngle)
}

const isRectangleCircleCollision = (circle: Circle, rect: Rectangle) => {
  const distanceX = Math.abs(circle.x - rect.x - rect.width / 2)
  const distanceY = Math.abs(circle.y - rect.y - rect.height / 2)

  if (distanceX > rect.width / 2 + circle.radius) {
    return false
  }

  if (distanceY > rect.height / 2 + circle.radius) {
    return false
  }

  if (distanceX <= rect.width / 2) {
    return true
  }

  if (distanceY <= rect.height / 2) {
    return true
  }

  const dx = distanceX - rect.width / 2
  const dy = distanceY - rect.height / 2
  return dx * dx + dy * dy <= circle.radius * circle.radius
}

/**
 * inspiration:
 * > https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 */
const isCircleCircleCollision = (circle1: Circle, circle2: Circle): boolean => {
  const dx = circle1.x - circle2.x
  const dy = circle1.y - circle2.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < circle1.radius + circle2.radius
}
