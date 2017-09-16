import React from 'react'
import Playground from './Playground'
import { calculateNewObjPos } from './mathCalc'
import { RECTANGLE, CIRCLE } from '../constants'
import { twoShapesColliding } from './collisions'
import { LOADING_BG_COLOR, PLAY_BG_COLOR, playground, view, dataObjects } from '../config'
import background from '../background.jpg'
import { allSounds } from '../audio/index'
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
        background: LOADING_BG_COLOR,
      },
      mousePos: {
        x: 0,
        y: 0,
      },
      objects: dataObjects,
    }
  }

  componentWIllR
  // LIVECYCLES
  // game loop
  componentWillReceiveProps(nextProps){
    console.log('nextProps')
    console.log(nextProps)
    if(!nextProps.loading){
      document.addEventListener('mousemove', this.onMouseMove)
      this.setState({
        request: requestAnimationFrame(this.tick),
        backgroundConfig: {
          ...this.state.backgroundConfig,
          background: PLAY_BG_COLOR
        }
      })
    }
    //if(nextProps.)
  }
  componentDidMount () {
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
          //console.log(allSounds)
          //console.log(allSounds.audio)
          //console.log(allSounds.fastZero)
          // console.log(allSounds[item.audio])
          // allSounds[item.audio]
          play(allSounds[item.audio])
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
  }

  render() {
    console.log(this.props.loading)
    return (
      <div style={{ width: '100%', height: '100%', background:'#DFA' }}>
        <div style={{ background: '#fff', width: this.state.view.width + 'px' }}>
          <Playground
            onClick={(e) => {
              const { x, y } = e.currentTarget.pointerPos
              this.setMousePositions({ x, y })
            }}
            loading={this.props.loading}
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