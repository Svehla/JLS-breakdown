import { Circle, GameElement, GameElementType, Rectangle } from './gameElementTypes'

export const isTwoElementCollision = (circleShape1: Circle, shape2: GameElement) => {
  switch (shape2.type) {
    case GameElementType.Circle:
      return isCircleCircleCollision(circleShape1, shape2)
    case GameElementType.Rectangle:
      return isRectangleCircleCollision(circleShape1, shape2)
  }
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
