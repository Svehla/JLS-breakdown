import React from 'react'
import Playground from './Playground'
import { calculateNewObjPos } from './mathCalc'
import { RECTANGLE, CIRCLE } from '../constants'
import { twoShapesColliding } from './collisions'
import { SHADOW_MARGIN } from '../config'
import fastZero from '../audio/fast-zero.mp3'
import scream from '../audio/scream.mp3'
import growl from '../audio/growl.mp3'
import slza from '../audio/slza.wav'
import omg from '../audio/omg.wav'
import blue from '../audio/blue.wav'
import patAndMat from '../audio/pat-and-mat.wav'
import background from '../background.jpg'

const randomWidth = () => Math.random() * 20 + 10
const randomColor = () => "#"+((1<<24)*Math.random()/5|0).toString(16)
const sounds = {}
//require v forEachu
const audioSources = {
  fastZero,
  scream,
  growl,
  patAndMat,
  omg,
  slza,
  blue,
  default: fastZero,
}

console.log(audioSources)

class Root extends React.Component {

  constructor(props) {
    super(props)

    const view = {
      width: window.innerWidth,
      height: window.innerHeight, // - 150,
      leftX: 20,
      topY: 20,
    }
    const playground = {
      width: 4000,
      height: 3000,
    }
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
        ...Array(2).fill(0).map(item => ({
          id: 2,
          type: CIRCLE,
          x: Math.random() * playground.width,
          y: Math.random() * playground.height,
          radius: 150,
          background: '#FFD700',
          audio: 'patAndMat',
          deleted: false,
        })),
        ...Array(6).fill(0).map(item => ({
          id: 2,
          type: RECTANGLE,
          x: Math.random() * playground.width,
          y: Math.random() * playground.height,
          width: 100,
          height: 100,
          background: '#F00',
          audio: 'omg',
          deleted: false,
        })),
        ...Array(2).fill(0).map(item => ({
          id: 2,
          type: CIRCLE,
          x: Math.random() * playground.width,
          y: Math.random() * playground.height,
          radius: 160,
          background: '#0FD',
          audio: 'slza',
          deleted: false,
        })),
        ...Array(1).fill(0).map(item => ({
          id: 2,
          type: CIRCLE,
          x: Math.random() * playground.width,
          y: Math.random() * playground.height,
          radius: 300,
          background: '#00F',
          audio: 'blue',
          deleted: false,
        })),
          /* {
             type: CIRCLE,
             x: 300,
             y: 30,
             radius: 40,
             background: '#0FF',
             deleted: false,
           },*/
      ...Array(120).fill(0).map(item => ({
        ...(Math.random() > 0.80
          ? {
            type: RECTANGLE,
            width: randomWidth()*2,
            height: randomWidth()*2,
            audio: Math.random() > 0.5 ? 'growl' : 'scream',
          } : {
            type: CIRCLE,
            radius: randomWidth(),
            audio: 'fastZero',
          }),
        x: Math.random() * playground.width,
        y: Math.random() * playground.height,
        // shadowOffsetX: SHADOW_MARGIN-7,
        shadowOffsetY: SHADOW_MARGIN-7,
        shadowBlur: 30,
        background: randomColor(),
        deleted: false,
      }))
      ]
    }
  }

  // LIVECYCLES
  // game loop
  componentDidMount () {
    Object.keys(audioSources).forEach(audioName => {
      console.log(audioSources[audioName])
      sounds[audioName] = () => new Audio(audioSources[audioName])
    })
    console.log(this)
    this.setState({
      request: requestAnimationFrame(this.tick)
    })
  }

  // ZPRACOVÁNÍ POHBYU MYŠI
  componentDidUpdate(props, state) {
    document.addEventListener('mousemove', this.onMouseMove)
  }

  componentWillUnmount () {
    cancelAnimationFrame(this.state.request)
  }

  onMouseMove = (e) => {
    this.setState({
      mousePos: {
        x: e.pageX,
        y: e.pageY
      }
    })
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
          var audio = sounds[item.audio]()
          audio.play()
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
          <Playground {...this.state} />
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