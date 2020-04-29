import {
  Arc,
  GameElement,
  GameElementType,
  Line,
  Point,
  Radar,
  Rectangle,
} from './gameElementTypes'

import { Angle, distance } from './mathCalc'
import { RAY_COUNT } from '../config'

type PossiblePoint = Point | { x: boolean; y: boolean }
// copied from:
// > https://github.com/bmoren/p5.collide2D/blob/master/p5.collide2d.js#L152
// > https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
// TODO: how to make it work for vector instead of line1?
// export const collideLineLine = function (line1: Line, line2: Line, calcIntersection: boolean) {
//   const { x1, y1, x2, y2 } = line1
//   const { x1: x3, y1: y3, x2: x4, y2: y4 } = line2
const collideLineLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): PossiblePoint => {
  let intersection

  // calculate the distance to intersection point
  const uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  const uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    // calc the point where the lines meet
    const intersectionX = x1 + uA * (x2 - x1)
    const intersectionY = y1 + uA * (y2 - y1)

    intersection = {
      x: intersectionX,
      y: intersectionY,
    }
    return intersection
  }

  intersection = {
    x: false,
    y: false,
  }
  return intersection
}

type CollideRect = {
  left: PossiblePoint
  right: PossiblePoint
  top: PossiblePoint
  bottom: PossiblePoint
}
// inspiration
// > code: https://github.com/bmoren/p5.collide2D/blob/master/p5.collide2d.js#L193
// > docs: https://github.com/bmoren/p5.collide2D#collidelinerect
// return false if there is no collision
// TODO: what about infinite match if line is same as rectangle side?
export const collideLineRect = (line: Line, rect: Rectangle): CollideRect | false => {
  const { x1, y1, x2, y2 } = line
  const { x: rx, y: ry, width: rw, height: rh } = rect

  // check if the line has hit any of the rectangle's sides. uses the collideLineLine function above

  const left = collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh)
  const right = collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh)
  const top = collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry)
  const bottom = collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh)
  const intersection = {
    left: left,
    right: right,
    top: top,
    bottom: bottom,
  }

  // if ANY of the above are true, the line has hit the rectangle
  if (left || right || top || bottom) {
    return intersection
  }
  return false
}

/**
 * return closer collision point between line and rectangle
 */
const getNearestLineRectCollision = (
  line: Line,
  rect: Rectangle
): { point: Point; distance: number } | undefined => {
  const collisions = collideLineRect(line, rect)
  const c: any = collisions
  if (!c) return undefined

  const startPoint = {
    x: line.x1,
    y: line.y1,
  }

  // -> fix of infinite behavior for same lines intersection
  const bottomPointDist = c.bottom.x && c.bottom.y && distance(c.bottom, startPoint)
  const topPointDist = c.top.x && c.top.y && distance(c.top, startPoint)
  const leftPointDist = c.left.x && c.left.y && distance(c.left, startPoint)
  const rightPointDist = c.right.x && c.right.y && distance(c.right, startPoint)

  // Add it to array and iterate coz i want to abstract this operation
  // out of rectangle behavior to more global data process pipeline
  const closerColPoint = [
    { point: c.bottom, distance: bottomPointDist },
    { point: c.left, distance: leftPointDist },
    { point: c.right, distance: rightPointDist },
    { point: c.top, distance: topPointDist },
  ]
    // filter points without collisions
    .filter(({ point }) => point.x && point.y)
    // find the lowest distance -> closest point
    .sort((r1, r2) => r1.distance - r2.distance)[0]

  return closerColPoint
}

// TODO: make optimization -> only elements in radar arc
export const getRayCastCollisions = (
  arc: Arc,
  gameElements: GameElement[]
): (Line & { elementMatchedId: string | null })[] => {
  // generate vectors from radar values
  const rayVectors = Array.from({ length: RAY_COUNT })
    .map((_, index) =>
      Angle.to360Range(arc.startAngle + (arc.sectorAngle / (RAY_COUNT - 1)) * index)
    )
    .map(angle => [Math.cos(Angle.toRadians(angle)), Math.sin(Angle.toRadians(angle))])

  const rayLines = rayVectors
    // recalculate angles to 2D lines
    .map(([x, y]) => ({
      x1: arc.x,
      y1: arc.y,
      x2: x * arc.radius + arc.x,
      y2: y * arc.radius + arc.y,
    }))
    .map(rayLine => {
      // calculate collisions cor each ray
      // make rectangle line collision
      const rayElCollisions = gameElements
        .map(el => {
          switch (el.type) {
            case GameElementType.Rectangle:
              const nearestPoint = getNearestLineRectCollision(rayLine, el)
              if (!nearestPoint) return undefined
              return {
                // @ts-ignore
                id: el.id,
                distance: nearestPoint.distance,
                point: nearestPoint.point,
              }

            // TODO: implement circle collision behavior
            case GameElementType.Circle:
              return undefined
          }
        })
        .filter(Boolean)

      if (rayElCollisions.length === 0) {
        return rayLine
      }

      const rayEndPoint = { x: rayLine.x2, y: rayLine.y2 }

      // const shortestDistance = Math.min(...distances, radar.radius)
      // get nearest point and add radar radius (should be the max one)
      // want to find min (sort is not optimised solution)
      const shortestDistance = [
        ...rayElCollisions,
        { point: rayEndPoint, distance: arc.radius },
        // @ts-ignore
      ].sort((a, b) => a.distance - b.distance)[0]

      return {
        // @ts-ignore
        elementMatchedId: shortestDistance.id ?? null,
        ...rayLine,
        // @ts-ignore
        x2: shortestDistance.point.x,
        // @ts-ignore
        y2: shortestDistance.point.y,
      }
    })

  // @ts-ignore
  return rayLines
}
