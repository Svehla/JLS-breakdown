import { Circle, Rect } from 'react-konva'
import { GameElementType } from './gameElementTypes'
import { View, getCurrentPosition } from './mathCalc'
import React from 'react'
import useImage from 'use-image'

type Props = {
  backgroundImage?: string
  type: GameElementType
  view: View
  x: number
  y: number
  background: string
}

const GameElement = ({ type, view, x, y, background: bgColor, ...props }: Props) => {
  const [bgImage] = useImage(props.backgroundImage || '')

  const isBgImage = Boolean(bgImage)

  const properties = {
    ...(isBgImage ? { fillPatternImage: bgImage } : { fill: bgColor }),
    ...props,
    ...getCurrentPosition(view, { x, y }),
  }
  return type === GameElementType.Rectangle ? (
    <Rect {...properties} />
  ) : type === GameElementType.Circle ? (
    // @ts-ignore
    <Circle {...properties} />
  ) : (
    <React.Fragment />
  )
}

export default GameElement
