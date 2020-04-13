import { Circle } from 'react-konva'
import { CircleConfig } from 'konva/types/shapes/Circle'
import { View } from './mathCalc'
import JLSMainLogo from '../img/JLSMainLogo.jpg'
import React from 'react'
import architectsMainLogo from '../img/architectsMainLogo.png'
import useImage from 'use-image'

type Props = {
  me: CircleConfig & { bandName: string }
  view: View
}

const Me = (props: Props) => {
  const [jlsImg] = useImage(JLSMainLogo)
  const [architectsImg] = useImage(architectsMainLogo)

  const { me, view } = props
  const bandName = me.bandName
  return (
    <Circle
      {...me}
      x={view.width / 2}
      y={view.height / 2}
      fillPatternImage={bandName === 'jake-loves-space' ? jlsImg : architectsImg}
    />
  )
}

export default Me
