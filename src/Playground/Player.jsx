import React from 'react'
import { Circle, Rect } from 'react-konva'
import { RECTANGLE, CIRCLE } from '../constants'
import { getActualPossition } from './mathCalc'

const Enemy = ({
  view,
  type,
  background,
  x,
  y,
  ...props,
}) => {
  // const isViewed = isInView(view)({ x, y, ...props })
  // console.log(isViewed)
  return (
    type === RECTANGLE
      ? <Rect
        fill={background}
        {...props}
        {...getActualPossition(view, {x, y})}
      />
      : type === CIRCLE
        ? <Circle
          fill={background}
          {...props}
          {...getActualPossition(view, {x, y})}
        />
      : ''
    )
}

export default Enemy