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
  // console.log(isBgImage, bgImage, props.backgroundImage)

  return type === 'RECTANGLE' ? (
    <Rect
      {...(isBgImage ? { fillPatternImage: bgImage } : { fill: background })}
      {...props}
      {...getActualPosition(view, { x, y })}
    />
  ) : type === 'CIRCLE' ? (
    // @ts-ignore
    <Circle
      {...(isBgImage ? { fillPatternImage: bgImage } : { fill: background })}
      {...props}
      {...getActualPosition(view, { x, y })}
    />
  ) : (
    <React.Fragment />
  )
}

export default GameObject
