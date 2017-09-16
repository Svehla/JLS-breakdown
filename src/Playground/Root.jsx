import React from 'react'
import Playground from './Playground'
import { calculateNewObjPos } from './mathCalc'
import { RECTANGLE, CIRCLE } from '../constants'
import { twoShapesColliding } from './collisions'
import { playground, view } from '../config'
import background from '../background.jpg'
import { sounds } from '../audio'
import { createDataElements } from './createDataElement'

class Root extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      me: {
        x: view.leftX + view.width / 2, // x absolute
        y: view.topY + view.height / 2, // y absolute
        xRel: view.width / 2, // x relative
        yRel: view.height / 2, // y relative
        type: CIRCLE,
        radius: 90,
        shadowOffsetX: 20,
        shadowOffsetY: 25,
        shadowBlur: 40,
        opacity: 0.8,
        background: '#F0F',
        backgroundimage: background,
        maxSpeed: 20,
      },
      timezoneOffset: new Date().getTimezoneOffset(),
      request: 0,
      framePerSec: 33,
      playground,
      view,
      backgroundConfig: {
        type: RECTANGLE,
        x: 0,
        y: 0,
        width: playground.width,
        height: playground.height,
        background: '#EEF',
      },
      mousePos: {
        x: 0,
        y: 0,
      },
      // onEatCircleURL: onEatAudioFast,
      // onEatRectangleURLs: [scream, growl],
      objects: [
        {
          x: 10,
          y: 10,
          type: CIRCLE,
          radius: 150,
          background: '#45F',
          audio: 'patAndMat',
          width: undefined,
          height: undefined,
        },
        ...createDataElements(2, CIRCLE, {
          radius: 150,
          background: '#FFD700',
          audio: 'patAndMat',
        }),
        ...createDataElements(6, RECTANGLE, {
          width: 100,
          height: 100,
          background: '#F00',
          audio: 'omg',
        }),
        ...createDataElements(2, CIRCLE, {
          radius: 160,
          background: '#0FD',
          audio: 'slza',
        }),
        ...createDataElements(2, CIRCLE, {
          radius: 300,
          background: '#00F',
          audio: 'blue',
        }),
        ...createDataElements(20, RECTANGLE, {
          audio: 'growl',
        }),
        ...createDataElements(20, RECTANGLE, {
          audio: 'scream',
        }),
        ...createDataElements(180, CIRCLE, {
          audio: 'fastZero',
        })
      ]
    }
  }

  // LIVECYCLES
  // game loop
  componentDidMount () {
    document.addEventListener('mousemove', this.onMouseMove)
    this.setState({
      request: requestAnimationFrame(this.tick)
    })
  }

  componentWillUnmount () {
    cancelAnimationFrame(this.state.request)
  }

  setMousePositions = ({ x, y }) => {
    this.setState({ mousePos: { x, y } })
  }
  onMouseMove = (e) => {
    const x = e.pageX
    const y = e.pageY
    this.setMousePositions({ x, y })
  }

  tick = () => {
    setTimeout(() => {
      this.recalculatePositions()
    }, 1000 / this.state.framePerSec)
  }

  recalculatePositions = () => {
    // console.time('all')
    const { mousePos, me, playground } = this.state
    const { x, y } = calculateNewObjPos(mousePos, me, me.maxSpeed, playground)
    const unEated = this.state.objects.map((item) => {
      if(item.deleted){
        return item
      }else {
        const isntDeleted = twoShapesColliding(me)(item)
        if(isntDeleted){
          return item
        }else{
          sounds[item.audio].currentTime = 0
          sounds[item.audio].play()
          return { ...item, deleted: true }
        }
      }
    })
    this.setState({
      me: { ...me, x, y, },
      view: {
        ...this.state.view,
        leftX: x - this.state.view.width / 2,
        topY: y - this.state.view.height / 2,
      },
      request: requestAnimationFrame(this.tick),
      objects: unEated,
    })
    // console.timeEnd('all')
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', background:'#DFA' }}>
        <div style={{ background: '#fff', width: this.state.view.width + 'px' }}>
          <Playground
            onClick={(e) => {
              const { x, y } = e.currentTarget.pointerPos
              console.log(x, y)
              this.setMousePositions({ x, y })
            }}
            {...this.state} />
        </div>
        {/*
        <pre>
          { JSON.stringify({
            ...this.state,
            objects: `[..${this.state.objects.length}...]`
          }, null, 2) }
        </pre>
        */}
      </div>
    )
  }
}

export default Root