import { Circle, Rect } from 'react-konva'
import { CircleConfig } from 'konva/types/shapes/Circle'
import { GameElementType } from './gameElementTypes'
import { RADAR_VISIBLE_DELAY } from './gameSetup'
import { RectConfig } from 'konva/types/shapes/Rect'
import { View, getRelativePosByAbsPos, normalizeInto01 } from './mathCalc'
import React from 'react'
import useImage from 'use-image'

type KonvaGameElementProps = RectConfig & CircleConfig

type Props = KonvaGameElementProps & {
  backgroundImage?: string
  type: GameElementType
  view: View
  x: number
  y: number
  seenByRadar: number
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

  const opacity = normalizeInto01(props.seenByRadar, 0, RADAR_VISIBLE_DELAY)

  return type === GameElementType.Rectangle ? (
    <Rect {...properties} opacity={opacity} />
  ) : type === GameElementType.Circle ? (
    // @ts-ignore
    <Circle {...properties} opacity={opacity} />
  ) : (
    <React.Fragment />
  )
}

export default GameElement
