import React from 'react'
import { Layer, Stage, Text } from 'react-konva'
import Me from './Me'
import GameObject from './GameObject'
// import { isInView } from './mathCalc'
import Borders from './Borders'
import { Circle } from 'react-konva'
const Playground = ({
  view,
  objects,
  me,
  backgroundConfig,
  onMove,
  stop,
  deletedObjectsCounter,
  camera,
  consoleText,
  mousePos,
}) => {
  // const inActualViewFunc += isInView(view)
  // inActualViewFunc(item)
  return (
    <Stage
      background={'#456'}
      onTap={onMove}
      onTouchStart={onMove}
      onTouchMove={onMove}
      width={view.width} height={view.height}>
      <Layer>

        { deletedObjectsCounter !== objects.length &&
        <Borders
          view={view}
          {...backgroundConfig}
          shaking={camera.fpsDeduction > 0}
        />
        }
        {
          objects.map((item, index) => (
            !item.visibleOnView || item.deleted
              ? null
              : <GameObject
                key={index}
                view={view}
                {...item} />
          ))
        }
        <Me
          me={me}
          view={view}
        />

        {
          stop && <Text
            x={10}
            y={20}
            text={`Loading`}
            fontSize={30}
            fontFamily={'Calibri'}
            fill={'#000'}
          />
        }

        <Text
          x={view.width / 2}
          y={10}
          text={`${deletedObjectsCounter} / ${objects.length}`}
          fontSize={30}
          fontFamily={'Calibri'}
          fill={'#000'}
        />
        {
          camera.fpsDeduction > 0 &&
          <Text
            x={102}
            y={10}
            text={`${camera.fpsDeduction}`}
            fontSize={30}
            fontFamily={'Calibri'}
            fill={'#FFF'}
          />
        }

        {deletedObjectsCounter === objects.length &&
          <Text
            x={102}
            y={10}
            text={`You Lost \nthe Game... \n noob`}
            fontSize={70}
            fontFamily={'Calibri'}
            fill={'#330'}
          />
        }

        <Text
          x={0}
          y={10}
          text={consoleText}
          fontSize={40}
          fontFamily={'Calibri'}
          fill={'#330'}
        />


        <Circle
          x={mousePos.x}
          y={mousePos.y}
          radius={5}
          fill='#f45' />
      </Layer>
    </Stage>
  )
}

export default Playground
