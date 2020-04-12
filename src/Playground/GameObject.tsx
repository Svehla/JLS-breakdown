import { Circle, Rect } from 'react-konva'
import { View, getActualPosition } from './mathCalc'
import React from 'react'
import useImage from 'use-image'

type Props = {
  backgroundImage?: any
  type: any
  view: View
  x: number
  y: number
  background: any
}

const GameObject = ({ type, view, x, y, background, ...props }: Props) => {
  const [bgImage] = useImage(props.backgroundImage)

  const isBgImage = Boolean(bgImage)

  const properties = {
    ...(isBgImage ? { fillPatternImage: bgImage } : { fill: background }),
    ...props,
    ...getActualPosition(view, { x, y }),
  }
  return type === 'RECTANGLE' ? (
    <Rect {...properties} />
  ) : type === 'CIRCLE' ? (
    // @ts-ignore
    <Circle {...properties} />
  ) : (
    <React.Fragment />
  )
}

export default GameObject
