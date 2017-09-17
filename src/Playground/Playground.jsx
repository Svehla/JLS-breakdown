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
  deletedObjects
}) => {
  const inActualViewFunc = isInView(view)
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
          {...backgroundConfig} />
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
            fontSize={150}
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
      </Layer>
    </Stage>
  )
}

export default App
