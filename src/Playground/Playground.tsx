import { Circle } from 'react-konva'
import { KonvaEventObject } from 'konva/types/Node'
import { Layer, Stage, Text } from 'react-konva'
import { View } from './mathCalc'
import BandIcon from './BandIcon'
import Borders from './Borders'
import GameObject from './GameObject'
import Me from './Me'
import React from 'react'
import architects from '../img/architects.png'
import jakeLovesSpace from '../img/jakeLovesSpace.png'
// import { playground } from "../config";

type Props = {
  view: View
  objects: any[]
  me: any
  backgroundConfig: any
  onMove: (e: KonvaEventObject<Event>) => void
  onBandClick: any
  deleteObjectCounter: any
  deletedObjectsCounter: number
  camera: any
  consoleText: any
  mousePos: any
}

const Playground = ({
  view,
  objects,
  me,
  backgroundConfig,
  onMove,
  onBandClick,
  deletedObjectsCounter,
  camera,
  consoleText,
  mousePos,
}: Props) => {
  return (
    <Stage
      background={'#456'}
      onTap={onMove}
      onTouchStart={onMove}
      onTouchMove={onMove}
      width={view.width}
      height={view.height}
    >
      <Layer>
        {deletedObjectsCounter !== objects.length && (
          <Borders
            view={view}
            shaking={camera.shakeIntensity > 0}
            width={backgroundConfig.width}
            height={backgroundConfig.height}
          />
        )}

        {objects.map((item, index) =>
          !item.visibleOnView || item.deleted ? null : (
            <GameObject key={index} view={view} {...item} />
          )
        )}

        <Me me={me} view={view} />

        <Text
          x={view.width / 2}
          y={10}
          text={`${deletedObjectsCounter} / ${objects.length}`}
          fontSize={30}
          fontFamily={'Calibri'}
          fill={'#000'}
        />
        {camera.shakeIntensity > 0 && (
          <Text
            x={102}
            y={10}
            text={`${camera.shakeIntensity}`}
            fontSize={30}
            fontFamily={'Calibri'}
            fill={'#FFF'}
          />
        )}

        {deletedObjectsCounter === objects.length && (
          <Text
            x={102}
            y={10}
            text={`You Lost \nthe Game... \n noob`}
            fontSize={70}
            fontFamily={'Calibri'}
            fill={'#330'}
          />
        )}

        <Text x={0} y={10} text={consoleText} fontSize={40} fontFamily={'Calibri'} fill={'#330'} />

        <Circle x={mousePos.x} y={mousePos.y} radius={5} fill='#f45' />

        <BandIcon
          x={view.width - 100}
          y={60}
          backgroundImage={jakeLovesSpace}
          onClick={() => {
            onBandClick('jake-loves-space')()
          }}
        />
        <BandIcon
          x={view.width - 230}
          y={60}
          backgroundImage={architects}
          onClick={onBandClick('architects')}
        />
      </Layer>
    </Stage>
  )
}

export default Playground
