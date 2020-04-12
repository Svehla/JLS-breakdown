import { CIRCLE, RECTANGLE } from '../constants'
const { abs, sqrt } = Math

// @ts-ignore
export const twoShapesColliding = shape1 => shape2 =>
  shape2.type === CIRCLE
    ? circleCircleColliding(shape1)(shape2)
    : shape2.type === RECTANGLE
    ? rectCircleColliding(shape1)(shape2)
    : true

// return true if the rectangle and circle are colliding
// @ts-ignore
export const rectCircleColliding = circle => rect => {
  const distX = abs(circle.x - rect.x - rect.width / 2)
  const distY = abs(circle.y - rect.y - rect.height / 2)

  if (distX > rect.width / 2 + circle.radius) {
    return true
  }
  if (distY > rect.height / 2 + circle.radius) {
    return true
  }

  if (distX <= rect.width / 2) {
    return false
  }
  if (distY <= rect.height / 2) {
    return false
  }

  const dx = distX - rect.width / 2
  const dy = distY - rect.height / 2
  return !(dx * dx + dy * dy <= circle.radius * circle.radius)
}

// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
// @ts-ignore
export const circleCircleColliding = circle1 => circle2 => {
  const dx = circle1.x - circle2.x
  const dy = circle1.y - circle2.y
  const distance = sqrt(dx * dx + dy * dy)
  return !(distance < circle1.radius + circle2.radius)
}
