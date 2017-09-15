import React from 'react'
import Playground from './Playground'
import { calculateNewObjPos } from './mathCalc'
import { RECTANGLE, CIRCLE } from '../constants'
import { twoShapesColliding } from './collisions'
import { SHADOW_MARGIN } from '../config'
import onEatAudio from '../zero.wav'
import background from '../background.jpg'

const randomWidth = () => Math.random() * 10 + 10
const randomColor = () => "#"+((1<<24)*Math.random()|0).toString(16)

class Root extends React.Component {
  constructor(props) {;
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
      onEatSoundURL: onEatAudio,
      objects: [
      /*  ...[{
          id: 2,
          type: RECTANGLE,
          x: 300,
          y: 300,
          width: 40,
          height: 60,
          background: '#15F',
          deleted: false,
        },
        {
          type: CIRCLE,
          x: 300,
          y: 30,
          radius: 40,
          background: '#0FF',
          deleted: false,
        },
      ],*/
      ...Array(200).fill(0).map(item => ({
        ...(Math.random() > 0.5
          ? {
            type: RECTANGLE,
            width: randomWidth()*2,
            height: randomWidth()*2
          } : {
            type: CIRCLE,
            radius: randomWidth()
          }),
        x: Math.random() * playground.width,
        y: Math.random() * playground.height,
        shadowOffsetX: SHADOW_MARGIN-7,
        shadowOffsetY: SHADOW_MARGIN-7,
        shadowBlur: 30,
        background: randomColor(),
        deleted: false,
      }))
      ]
    }
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

  // LIVECYCLES
  // game loop
  componentDidMount() {
    this.setState({
      request: requestAnimationFrame(this.tick)
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
          var audio = new Audio(this.state.onEatSoundURL);
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
      <div style={{width: '100%', height: '100%', background:'#DFA'}}>
        <div style={{ background: '#fff', width: this.state.view.width +'px' }}>
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