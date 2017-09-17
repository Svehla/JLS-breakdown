import React from 'react'
import Playground from './Playground'
import { calculateNewObjPos, lowerToZero } from './mathCalc'
import { RECTANGLE, CIRCLE } from '../constants'
import { twoShapesColliding } from './collisions'
import { LOADING_BG_COLOR, PLAY_BG_COLOR, playground, view, dataObjects } from '../config'
import mainLogo from '../img/mainLogo.jpg'
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
        shakingLarge: 50,
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
    const { mousePos, me, playground, camera } = this.state
    const { x, y } = calculateNewObjPos(mousePos, me, me.maxSpeed, playground, camera)
    const unEated = this.state.objects.map((item) => {
      if(item.deleted){
        return item
      }else {
        const isntDeleted = twoShapesColliding(me)(item)
        if(isntDeleted){
          return item
        }else{
          if(camera.fpsDeduction === 0 ){
            play(allSounds[item.audio])
          }else{
            play(allSounds['slowZero'])
          }
          this.setState({
            camera: {
              ...camera,
              fpsDeduction: item.shakingTime
                ? camera.fpsDeduction + item.shakingTime
                : camera.fpsDeduction
            },
            deletedObjects: this.state.deletedObjects + 1
          })
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
      camera: {
        ...camera,
        fpsDeduction: lowerToZero(this.state.camera.fpsDeduction)
      },
      request: requestAnimationFrame(this.tick),
      objects: unEated,
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