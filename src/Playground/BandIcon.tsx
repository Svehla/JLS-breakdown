import { Circle } from 'react-konva'
import React, { useCallback, useState } from 'react'
import useImage from 'use-image'

const styles = {
  hover: {
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowBlur: 40,
  },
}
const fillPatternOffset = { x: -50, y: 50 }

type Props = {
  bandName: string
  backgroundImage: string
  x: number
  y: number
  onBandClick: (bandName: string) => void
}

const BandIcon = ({ onBandClick, bandName, x, y, backgroundImage }: Props) => {
  const [isHover, setIsHover] = useState(false)
  const [img] = useImage(backgroundImage)
  const setHoverTrue = useCallback(() => setIsHover(true), [])
  const setHoverFalse = useCallback(() => setIsHover(false), [])
  const handleClick = useCallback(() => onBandClick(bandName), [onBandClick, bandName])

  return (
    <Circle
      x={x}
      y={y}
      onClick={handleClick}
      radius={50}
      onMouseMove={setHoverTrue}
      onMouseLeave={setHoverFalse}
      fillPatternOffset={fillPatternOffset}
      fillPatternImage={img}
      {...(isHover ? styles.hover : {})}
    />
  )
}

export default BandIcon
