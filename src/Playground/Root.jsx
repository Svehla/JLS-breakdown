import React from 'react'
import Playground from './Playground'
import { calculateNewObjPos, lowerToZero } from './mathCalc'
import { RECTANGLE, CIRCLE } from '../constants'
import { twoShapesColliding } from './collisions'
import { LOADING_BG_COLOR, PLAY_BG_COLOR, playground, view, dataObjects } from '../config'
import mainLogo from '../img/mainLogo.jpg'
import { allSounds } from '../audio/index'
import { isMobile } from '../utils'
import { initSoundsConf } from '../config'
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
        backgroundImage: mainLogo,
        fillPatternScale: (isMobile
          ? { x: 0.66, y: 0.66 }
          : { x: 1 , y: 1 }),
        fillPatternOffset: { x : -100, y : 100 },
        shadowOffsetX: 20,
        shadowOffsetY: 25,
        shadowBlur: 40,
        background: '#F0F',
        maxSpeed: isMobile ? 15 : 20,
      },
      timezoneOffset: new Date().getTimezoneOffset(),
      request: 0,
      camera: {
        fpsDeduction: 0,
      },
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
        x: view.width / 2,
        y: view.height / 2,
      },
      actualDrum: null,
      objects: dataObjects,
      // cache deleted data => high performance
      // 0.15-0.3 ms for 232 items
      deletedObjectsCounter: dataObjects.reduce((pre, curr) => (
        curr.deleted ? pre+1 : pre
      ), 0)
    }
  }

  componentWIllR
  // LIVECYCLES
  // game loop

  componentWillReceiveProps(nextProps){
    if(!nextProps.stop) {
      // init game
      document.addEventListener('mousemove', this.onMouseMove)
      this.setState({
        request: requestAnimationFrame(this.tick),
        backgroundConfig: {
          ...this.state.backgroundConfig,
          background: PLAY_BG_COLOR
        },
        actualDrum: play(allSounds.fastDrum, initSoundsConf.fastDrum())
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
      this.recalculateActualState()
    }, 1000 / this.state.framePerSec)
  }
  stopDrumAndGetNew = (drumName) => {
    this.state.actualDrum.pause()
    return {
      actualDrum: play(allSounds[drumName], initSoundsConf[drumName]())
    }
  }

  recalculateActualState = () => {
    const { mousePos, me, playground, camera, deletedObjectsCounter } = this.state
    const { x, y } = calculateNewObjPos(mousePos, me, me.maxSpeed, playground, camera)
    // unpure variables for map each cycle
    let newFpsDeduction = camera.fpsDeduction
    let newDrum = {}
    let newDeleteObjectsCounter = deletedObjectsCounter
    const unEated = this.state.objects.map((item) => {
      if (item.deleted) {
        return item
      } else {
        const isntDeleted = twoShapesColliding(me)(item)
        if (isntDeleted) {
          return item
        } else {
          if (item.shakingTime) {
            newDrum = this.stopDrumAndGetNew('slowDrum')
            // bad sad fckng += && ++ :/ sad optimalization
            newFpsDeduction += item.shakingTime
          }
          if(newFpsDeduction === 0){
            play(allSounds[item.audio])
          } else {
            play(allSounds['slowZero'])
          }
          newDeleteObjectsCounter ++
          return { ...item, deleted: true }
        }
      }
    })

    if(newFpsDeduction === 1){
      newDrum = this.stopDrumAndGetNew('fastDrum')
    }

    this.setState({
      me: { ...me, x, y, },
      view: {
        ...this.state.view,
        leftX: x - this.state.view.width / 2,
        topY: y - this.state.view.height / 2,
      },
      ...newDrum,
      camera: {
        ...camera,
        fpsDeduction: lowerToZero(newFpsDeduction)
      },
      request: requestAnimationFrame(this.tick),
      objects: unEated,
      deletedObjectsCounter: newDeleteObjectsCounter,
    })
  }

  render() {
    return (
      <Playground
        onMove={(e) => {
          const { x, y } = e.currentTarget.pointerPos
          this.setMousePositions({ x, y })
        }}
        stop={this.props.stop}
        {...this.state}
      />
    )
  }
}
/*
      <div style={{ width: '100%', height: '100%', background:'#DFA' }}>
        <div style={{ background: '#fff', width: this.state.view.width + 'px' }}>
        </div>
      </div>
*/
export default Root