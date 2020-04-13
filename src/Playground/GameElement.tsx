import { Circle, Rect } from 'react-konva'
import { CircleConfig } from 'konva/types/shapes/Circle'
import { GameElementType } from './gameElementTypes'
import { RectConfig } from 'konva/types/shapes/Rect'
import { View, getRelativePosByAbsPos } from './mathCalc'
import React from 'react'
import useImage from 'use-image'

type KonvaGameElementProps = RectConfig & CircleConfig

type Props = KonvaGameElementProps & {
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
    ...getRelativePosByAbsPos(view, { x, y }),
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
