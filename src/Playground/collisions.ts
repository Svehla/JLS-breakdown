const { abs, sqrt } = Math

// @ts-ignore
export const isTwoShapesCollision = (circleShape1, shape2) =>
  shape2.type === 'CIRCLE'
    ? isCircleCircleCollision(circleShape1, shape2)
    : shape2.type === 'RECTANGLE'
    ? isRectCircleCollision(circleShape1, shape2)
    : false

// return true if the rectangle and circle are colliding
// @ts-ignore
const isRectCircleCollision = (circle, rect) => {
  const distX = abs(circle.x - rect.x - rect.width / 2)
  const distY = abs(circle.y - rect.y - rect.height / 2)

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

// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
// @ts-ignore
const isCircleCircleCollision = (circle1, circle2) => {
  const dx = circle1.x - circle2.x
  const dy = circle1.y - circle2.y
  const distance = sqrt(dx * dx + dy * dy)
  return distance < circle1.radius + circle2.radius
}
