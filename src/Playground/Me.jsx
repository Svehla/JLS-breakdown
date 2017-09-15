import React from 'react'
import { Circle } from 'react-konva'

const Me = ({
  me: {
    x,
    y,
    background,
    ...meProps,
  },
  view
}) => {
  return (
    <Circle
      x={view.width / 2}
      y={view.height / 2}
      fill={background}
      {...meProps}
    />
  )
}

export default Me