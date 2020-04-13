import { Circle, GameElement, GameElementType, Rectangle } from './gameElementTypes'

export const isTwoShapesCollision = (circleShape1: Circle, shape2: GameElement) =>
  shape2.type === GameElementType.Circle
    ? isCircleCircleCollision(circleShape1, shape2)
    : shape2.type === GameElementType.Rectangle
    ? isRectangleCircleCollision(circleShape1, shape2)
    : false

const isRectangleCircleCollision = (circle: Circle, rect: Rectangle) => {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2)
  const distY = Math.abs(circle.y - rect.y - rect.height / 2)

  if (distX > rect.width / 2 + circle.radius) {
    return false
  }
  if (distY > rect.height / 2 + circle.radius) {
    return false
  }

  if (distX <= rect.width / 2) {
    return true
  }
  if (distY <= rect.height / 2) {
    return true
  }

  const dx = distX - rect.width / 2
  const dy = distY - rect.height / 2
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
