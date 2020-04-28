import { Angle, View } from './mathCalc'
import { Arc, Line } from 'react-konva'
import { Radar } from './gameElementTypes'
import React from 'react'

type Props = {
  view: View
  radar: Radar
}

const fillLinearGradientColorStops1 = [0.0, 'rgba(0, 255, 0, 0.1)', 0.94, 'rgba(0, 0, 255, 0.3)']
// const fillLinearGradientColorStops = [0.0, 'rgba(255, 0, 0, 0.1)', 0.94, 'rgba(0, 0, 255, 1)']

const RADAR_LENGTH = 500
// TODO: make appear radar view
// https://stackoverflow.com/questions/24271401/fade-out-lines-after-drawing-canvas
const RadarView = ({ view, radar }: Props) => {
  const x1 = view.width / 2
  const y1 = view.height / 2

  // const radarLineAngle = Angle.add(radar.rotation, radar.sectorAngle)
  // const x2 = x1 + Math.cos(Angle.toRadians(radarLineAngle)) * RADAR_LENGTH
  // const y2 = y1 + Math.sin(Angle.toRadians(radarLineAngle)) * RADAR_LENGTH

  return (
    <>
      {/* show line just for debugging purposes */}
      {/* <Line strokeWidth={2} width={3} stroke={'green'} points={[x1, y1, x2, y2]} /> */}
      <Arc
        x={x1}
        y={y1}
        innerRadius={100}
        outerRadius={900}
        // trick with fake radar view
        angle={radar.sectorAngle + 40}
        rotation={radar.rotation - 40}
        fillLinearGradientEndPoint={{ x: view.height / 2, y: view.width / 2 }}
        // fillLinearGradientEndPoint={{ x: view.height / 2, y: view.width / 2 }}
        fillLinearGradientColorStops={fillLinearGradientColorStops1}
      />
    </>
  )
}

export default RadarView
//
