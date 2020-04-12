import { Rect } from 'react-konva'
import { View, getActualPosition } from './mathCalc'
import React from 'react'
import gridImage from '../img/grid.png'
import gridReverseImage from '../img/grid-reverse.png'
import useImage from 'use-image'

const backgroundImageConfig = {
  fillPatternScale: { x: 1, y: 1 },
  fillPatternOffset: { x: -100, y: 100 },
}
const playgroundCoords = {
  x: 0,
  y: 0,
}

type Props = {
  view: View
  shaking: boolean
  width: number
  height: number
}

const Borders = ({ view, shaking, width, height }: Props) => {
  const [imageLight] = useImage(gridImage)
  const [imageDark] = useImage(gridReverseImage)

  const { x, y } = getActualPosition(view, playgroundCoords)
  return (
    <Rect
      type={'RECTANGLE'}
      x={x}
      y={y}
      width={width}
      height={height}
      fillPatternImage={shaking ? imageDark : imageLight}
      {...backgroundImageConfig}
    />
  )
}

export default Borders
