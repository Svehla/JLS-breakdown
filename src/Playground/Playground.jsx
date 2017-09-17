import React from 'react'
import { Layer, Stage, Text } from 'react-konva'
import Me from './Me'
import GameObject from './GameObject'
import { isInView } from './mathCalc'
import Borders from './Borders'

const App = ({
  view,
  objects,
  me,
  playground,
  backgroundConfig,
  onMove,
  stop,
  deletedObjects,
  camera,
}) => {
  const inActualViewFunc = isInView(view)
  // console.log(camera)
  // const filteredObjects = objects.filter(isInView(view))
  // console.log(filteredObjects.length)
  return (
    <Stage
      background={'#456'}
      onTap={onMove}
      onTouchStart={onMove}
      onTouchMove={onMove}
      width={view.width} height={view.height}>
      <Layer>
        <Borders
          view={view}
          {...backgroundConfig}
          shaking={camera.fpsDeduction > 0}
        />

        {
          objects.map((item, index) => (
            !inActualViewFunc(item) || item.deleted
              ?  null
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
          text={`${deletedObjects} / ${objects.length}`}
          fontSize={30}
          fontFamily={'Calibri'}
          fill={'#000'}
        />
        {camera.fpsDeduction > 0 &&
          <Text
            x={102}
            y={10}
            text={`${camera.fpsDeduction}`}
            fontSize={30}
            fontFamily={'Calibri'}
            fill={'#FFF'}
          />
        }
      </Layer>
    </Stage>
  )
}

export default App
