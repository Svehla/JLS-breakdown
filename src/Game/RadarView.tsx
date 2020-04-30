import { Arc } from 'react-konva'
import { Radar } from './gameElementTypes'
import { View } from './mathCalc'
import React from 'react'

type Props = {
  view: View
  radar: Radar
}

const fillLinearGradientColorStops1 = [0.0, 'rgba(0, 255, 0, 0.05)', 0.94, 'rgba(0, 0, 255, 0.2)']
// TODO: make appear radar view
// https://stackoverflow.com/questions/24271401/fade-out-lines-after-drawing-canvas
const RadarView = ({ view, radar }: Props) => {
  const x1 = view.width / 2
  const y1 = view.height / 2

  // return <React.Fragment />
  return (
    <Arc
      x={x1}
      y={y1}
      innerRadius={100}
      outerRadius={radar.radius}
      // trick with fake radar view
      angle={radar.sectorAngle + 40}
      rotation={radar.rotation - 40}
      fillLinearGradientEndPoint={{ x: view.height / 2, y: view.width / 2 }}
      // fillLinearGradientEndPoint={{ x: view.height / 2, y: view.width / 2 }}
      fillLinearGradientColorStops={fillLinearGradientColorStops1}
    />
  )
}

export default RadarView
//
