import { Arc, Line } from 'react-konva'
import { Radar } from './gameElementTypes'
import { View } from './mathCalc'
import React from 'react'

type Props = {
  view: View
  radar: Radar
}

// make appear radar view
// https://stackoverflow.com/questions/24271401/fade-out-lines-after-drawing-canvas
const RadarView = ({ view, radar }: Props) => {
  return (
    <Arc
      x={view.width / 2}
      y={view.height / 2}
      innerRadius={100}
      outerRadius={900}
      angle={radar.sectorAngle}
      rotation={radar.rotation}
      fillLinearGradientEndPoint={{ x: view.height / 2, y: view.width / 2 }}
      fillLinearGradientColorStops={[0.0, 'rgba(255, 0, 0, 0.1)', 0.94, 'rgba(0, 0, 255, 1)']}
    />
  )
}

export default RadarView
