import { Line } from 'react-konva'
import { LineConfig } from 'konva/types/shapes/Line'
import { Point } from './gameElementTypes'
import { View, getRelativePosByAbsPos } from './mathCalc'
import React from 'react'

type KonvaGameElementProps = LineConfig

type Props = {
  view: View
  background: string
  points: Point[]
}

const PolygonBorder = ({ view, points, background: bgColor, ...props }: Props) => {
  const linePoints = points.map(point => getRelativePosByAbsPos(view, point))
  return (
    <Line
      {...props}
      fill={bgColor}
      closed
      points={linePoints.map(({ x, y }) => [x, y]).flat()}
      strokeWidth={4}
    />
  )
}

export default PolygonBorder
