import { Circle } from 'react-konva'
import { CircleConfig } from 'konva/types/shapes/Circle'
import { View } from './mathCalc'
import React from 'react'

type Props = {
  me: CircleConfig & { bandName: string }
  view: View
}

const Me = (props: Props) => {
  const { me, view } = props
  return <Circle {...me} x={view.width / 2} y={view.height / 2} fill={me.background} />
}

export default Me
