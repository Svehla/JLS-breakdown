import { Circle } from 'react-konva'
import { GameElementFood, Line, Point, Radar } from './gameElementTypes'
import { KonvaEventObject } from 'konva/types/Node'
import { Layer, Stage, Text } from 'react-konva'
import { View } from './mathCalc'
import { playground } from './gameSetup'
import BorderGrid from './BorderGrid'
import GameElement from './GameElement'
import Me from './Me'
import PolygonBorder from './PolygonBorder'
import RadarView from './RadarView'
import RayCast from './RayCast'
import React from 'react'

type Props = {
  view: View
  gameElements: GameElementFood[]
  me: any
  handlePlaygroundMove: (e: KonvaEventObject<Event>) => void
  cameraShakeIntensity: number
  radar: Radar
  mousePos: Point
  rayCastRays: Line[]
  playground: typeof playground
}

const PlaygroundGrid = (props: Props) => {
  const {
    view,
    gameElements,
    me,
    handlePlaygroundMove,
    cameraShakeIntensity,
    radar,
    mousePos,
    rayCastRays,
    playground,
  } = props

  const deletedObjectsCounter = gameElements.filter(item => item.deleted).length

  return (
    <Stage
      onTap={handlePlaygroundMove}
      onTouchStart={handlePlaygroundMove}
      onTouchMove={handlePlaygroundMove}
      width={view.width}
      height={view.height}
    >
      <Layer>
        <BorderGrid view={view} isDark={cameraShakeIntensity > 0} />
        {/* bad naming with mountains etc... */}
        {playground.borders.map(
          border =>
            border.visibleInView && <PolygonBorder view={view} key={border.id} {...border} />
        )}
        {gameElements.map(
          item =>
            item.visibleInView &&
            item.seenByRadar > 0 &&
            // @ts-ignore
            !item.deleted && <GameElement key={item.id} view={view} {...item} />
        )}
        <Me me={me} view={view} />
        <RayCast rays={rayCastRays} view={view} />
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
        <RadarView view={view} radar={radar} />
      </Layer>
    </Stage>
  )
}

export default PlaygroundGrid
