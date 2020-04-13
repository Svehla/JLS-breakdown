import { Circle } from 'react-konva'
import { GameElementShape } from './createGameElements'
import { KonvaEventObject } from 'konva/types/Node'
import { Layer, Stage, Text } from 'react-konva'
import { View } from './mathCalc'
import BandIcon from './BandIcon'
import Borders from './Borders'
import GameElement from './GameElement'
import Me from './Me'
import React from 'react'
import architects from '../img/architects.png'
import jakeLovesSpace from '../img/jakeLovesSpace.png'

type Props = {
  view: View
  gameElements: GameElementShape[]
  me: any
  handlePlaygroundMove: (e: KonvaEventObject<Event>) => void
  handleBandClick: any
  cameraShakeIntensity: any
  mousePos: any
}

const Playground = (props: Props) => {
  const {
    view,
    gameElements,
    me,
    handlePlaygroundMove,
    handleBandClick,
    cameraShakeIntensity,
    mousePos,
  } = props

  const deletedObjectsCounter = gameElements.filter(item => item.deleted).length

  return (
    <Stage
      background={'#456'}
      onTap={handlePlaygroundMove}
      onTouchStart={handlePlaygroundMove}
      onTouchMove={handlePlaygroundMove}
      width={view.width}
      height={view.height}
    >
      <Layer>
        {deletedObjectsCounter !== gameElements.length && (
          <Borders view={view} isDark={cameraShakeIntensity > 0} />
        )}

        {gameElements.map(
          item =>
            item.visibleOnView &&
            // @ts-ignore
            !item.deleted && <GameElement key={item.id} view={view} {...item} />
        )}

        <Me me={me} view={view} />

        <Text
          x={view.width / 2}
          y={10}
          text={`${deletedObjectsCounter} / ${gameElements.length}`}
          fontSize={30}
          fontFamily={'Calibri'}
          fill={'#000'}
        />
        {cameraShakeIntensity > 0 && (
          <Text
            x={102}
            y={10}
            text={`${cameraShakeIntensity}`}
            fontSize={30}
            fontFamily={'Calibri'}
            fill={'#FFF'}
          />
        )}

        {deletedObjectsCounter === gameElements.length && (
          <Text
            x={102}
            y={10}
            text={`You Lost \nthe Game... \n noob`}
            fontSize={70}
            fontFamily={'Calibri'}
            fill={'#330'}
          />
        )}

        <Circle x={mousePos.x} y={mousePos.y} radius={5} fill='#f45' />

        <BandIcon
          x={view.width - 100}
          y={60}
          backgroundImage={jakeLovesSpace}
          bandName={'jake-loves-space'}
          onBandClick={handleBandClick}
        />
        <BandIcon
          x={view.width - 230}
          y={60}
          backgroundImage={architects}
          bandName={'architects'}
          onBandClick={handleBandClick}
        />
      </Layer>
    </Stage>
  )
}

export default Playground
