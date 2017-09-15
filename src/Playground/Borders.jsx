import React from 'react'
import { Rect } from 'react-konva'
import { getActualPossition } from './mathCalc'

const Borders = ({
  view,
  x,
  y,
  background,
  ...props,
}) => {
  return (
    <Rect
      fill={background}
      {...props}
      {...getActualPossition(view, {
        x,
        y
      })}
    />
  )
}

export default Borders