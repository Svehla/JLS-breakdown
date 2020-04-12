import { Rect } from 'react-konva'
import { View, getActualPosition } from './mathCalc'
import { playground } from '../config'
import React from 'react'
import gridImage from '../img/grid.png'
import gridReverseImage from '../img/grid-reverse.png'
import useImage from 'use-image'

const fillPatternScale = { x: 1, y: 1 }
const fillPatternOffset = { x: -100, y: 100 }

const playgroundCoords = {
  x: 0,
  y: 0,
}

type Props = {
  view: View
  isDark: boolean
}

const Borders = ({ view, isDark }: Props) => {
  const [imageLight] = useImage(gridImage)
  const [imageDark] = useImage(gridReverseImage)

  const { x, y } = getActualPosition(view, playgroundCoords)

  return (
    <Rect
      type={'RECTANGLE'}
      x={x}
      y={y}
      width={playground.width}
      height={playground.height}
      fillPatternImage={isDark ? imageDark : imageLight}
      fillPatternScale={fillPatternScale}
      fillPatternOffset={fillPatternOffset}
    />
  )
}

export default Borders
