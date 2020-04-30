import { Line } from 'react-konva'
import { Line as LineType } from './gameElementTypes'
import { View, getRelativePosByAbsPos } from './mathCalc'
import React from 'react'

type Props = {
  view: View
  rays: LineType[]
}

const fillLinearGradientColorStops1 = [0.0, 'rgba(0, 255, 0, 0.1)', 0.94, 'rgba(0, 0, 255, 0.3)']
const RayCast = (props: Props) => {
  const view = props.view

  // const centerPoint = getRelativePosByAbsPos(view, { x: view.width / 2, y: view.height / 2 })
  const centerPoint = {
    x: view.width / 2,
    y: view.height / 2,
  }

  return (
    <React.Fragment>
      <Line
        points={[
          centerPoint.x,
          centerPoint.y,
          // center point
          ...props.rays
            .map(line => {
              const { x: x2, y: y2 } = getRelativePosByAbsPos(view, { x: line.x2, y: line.y2 })

              return [x2, y2]
            })
            .flat(),
          centerPoint.x,
          centerPoint.y,
        ]}
        closed
        fillLinearGradientEndPoint={{ x: view.height / 2, y: view.width / 2 }}
        fillLinearGradientColorStops={fillLinearGradientColorStops1}
      />
    </React.Fragment>
  )
}

//https://github.com/bmoren/p5.collide2D
export default RayCast
