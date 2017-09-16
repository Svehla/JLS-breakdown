import React from 'react'
import { Layer, Stage, Text } from 'react-konva'
import Me from './Me'
import Player from './Player'
import { isInView } from './mathCalc'
import Borders from './Borders'

const App = ({
  view,
  objects,
  me,
  playground,
  backgroundConfig,
  onClick,
  loading,
}) => {
  const inActualViewFunc = isInView(view)
  // const filteredObjects = objects.filter(isInView(view))
  // console.log(filteredObjects.length)
  return (
    <Stage
      background={'#456'}
      onTap={onClick}
      width={view.width} height={view.height}>
      <Layer>
        <Borders
          view={view}
          {...backgroundConfig} />
        {
          objects.map((item, index) => (
            !inActualViewFunc(item) || item.deleted
              ?  null
              : <Player
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
          loading && <Text
            x={view.width / 2}
            y={30}
            text={`Loading`}
            fontSize={30}
            fontFamily={'Calibri'}
            fill={'#fff'}
          />
        }

        <Text
          x={view.width - 200}
          y={0}
          text={`${objects.reduce((pre, curr) => (
            curr.deleted ? pre+1 : pre
          ), 0)} / ${objects.length}`}
          fontSize={30}
          fontFamily={'Calibri'}
          fill={'#000'}
        />
      </Layer>
    </Stage>
  )
}

export default App
