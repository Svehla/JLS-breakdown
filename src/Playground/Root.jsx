import React from 'react'
import Playground from './Playground'
import { calculateNewObjPos } from './mathCalc'
import { RECTANGLE, CIRCLE } from '../constants'
import { twoShapesColliding } from './collisions'
import { LOADING_BG_COLOR, PLAY_BG_COLOR, playground, view, dataObjects } from '../config'
import background from '../background.jpg'
import { allSounds } from '../audio/index'
import { isMobile } from '../utils'
const play = require('audio-play')

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
        radius: isMobile ? 60 : 90,
        fillPatternScale: (isMobile
          ? { x: 0.66, y: 0.66 }
          : { x: 1 , y: 1 }),
        fillPatternOffset: { x : -100, y : 100 },
        shadowOffsetX: 20,
        shadowOffsetY: 25,
        shadowBlur: 40,
        background: '#F0F',
        backgroundimage: background,
        maxSpeed: isMobile ? 15 : 20,
      },
      timezoneOffset: new Date().getTimezoneOffset(),
      request: 0,
      // http://cubiq.org/performance-tricks-for-mobile-web-development
      framePerSec: isMobile ? 33 : 44,
      playground,
      view,
      backgroundConfig: {
        type: RECTANGLE,
        x: 0,
        y: 0,
        width: playground.width,
        height: playground.height,
        background: LOADING_BG_COLOR,
      },
      mousePos: {
        x: 0,
        y: 0,
      },
      objects: dataObjects,
      // cache deleted data => high performance
      // 0.15-0.3 ms for 232 items
      deletedObjects: dataObjects.reduce((pre, curr) => (
        curr.deleted ? pre+1 : pre
      ), 0)
    }
  }

  componentWIllR
  // LIVECYCLES
  // game loop
  componentWillReceiveProps(nextProps){
    if(!nextProps.stop){
      document.addEventListener('mousemove', this.onMouseMove)
      this.setState({
        request: requestAnimationFrame(this.tick),
        backgroundConfig: {
          ...this.state.backgroundConfig,
          background: PLAY_BG_COLOR
        }
      })
    }
  }
  componentWillUnmount () {
    cancelAnimationFrame(this.state.request)
  }

  setMousePositions = ({ x, y }) => {
    if(!this.props.stop){
      this.setState({ mousePos: { x, y } })
    }
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
    // console.time('myPos')
    const { x, y } = calculateNewObjPos(mousePos, me, me.maxSpeed, playground)
    // console.timeEnd('myPos')
    // console.time('eated')
    const unEated = this.state.objects.map((item) => {
      if(item.deleted){
        return item
      }else {
        const isntDeleted = twoShapesColliding(me)(item)
        if(isntDeleted){
          return item
        }else{
          play(allSounds[item.audio])
          this.setState({
            deletedObjects: this.state.deletedObjects +1
          })
          return { ...item, deleted: true }
        }
      }
    })
    // console.timeEnd('eated')
    // console.time('setState')
    this.setState({
      me: { ...me, x, y, },
      view: {
        ...this.state.view,
        leftX: x - this.state.view.width / 2,
        topY: y - this.state.view.height / 2,
      },
      request: requestAnimationFrame(this.tick),
      objects: unEated,
    }, () => {
    //  console.timeEnd('setState')
    })
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', background:'#DFA' }}>
        <div style={{ background: '#fff', width: this.state.view.width + 'px' }}>
          <Playground
            onMove={(e) => {
              const { x, y } = e.currentTarget.pointerPos
              this.setMousePositions({ x, y })
            }}
            stop={this.props.stop}
            {...this.state}
          />
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