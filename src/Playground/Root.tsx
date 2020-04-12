import { CIRCLE, RECTANGLE } from '../constants'
import { allSounds, playAudio } from '../audio/index'
import { calculateNewObjPos, getInRange, isInView, lowerToZero } from './mathCalc'
import { changeCode, newDirection } from '../socket-handling'
import { dataObjects, initSoundsConf, playground, view } from '../config'
import { isMobile } from '../utils'
import { twoShapesColliding } from './collisions'
import ArchitectsMainLogo from '../img/architects.png'
import Config from './Config'
import JLSMainLogo from '../img/JLSMainLogo.jpg'
import Playground from './Playground'
import React from 'react'

const addViewKey = (view: any) => (item: any) => ({
  ...item,
  visibleOnView: item.deleted
    ? false // performance optimalization
    : isInView(view)(item),
})

class Root extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    newDirection(({ beta, gamma }: any) => {
      this.handleOrientation({ beta, gamma })
    })
    this.state = {
      actualBand: 'jake-loves-space',
      me: {
        x: view.leftX + view.width / 2, // x absolute
        y: view.topY + view.height / 2, // y absolute
        xRel: view.width / 2, // x relative
        yRel: view.height / 2, // y relative
        type: CIRCLE,
        radius: isMobile ? 60 : 90,
        backgroundImage: JLSMainLogo,
        fillPatternScale: isMobile ? { x: 0.66, y: 0.66 } : { x: 1, y: 1 },
        fillPatternOffset: { x: -100, y: 100 },
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
      },
      mousePos: {
        x: view.width / 2,
        y: view.height / 2,
      },
      actualDrum: null,
      objects: dataObjects,
      // cache deleted data => high performance
      // 0.15-0.3 ms for 232 items
      deletedObjectsCounter: dataObjects.reduce((pre, curr) => (curr.deleted ? pre + 1 : pre), 0),
      consoleText: '',
      // config
      authCode: '',
      volume: 0,
    }
  }

  // todo: remove it (deprecated i guess)
  componentWillReceiveProps(nextProps: any) {
    if (!nextProps.stop) {
      // init game
      window.addEventListener('deviceorientation', this.handleOrientation, true)
      document.addEventListener('mousemove', this.onMouseMove)
      this.setState({
        request: requestAnimationFrame(this.tick),
        actualDrum: this.play(allSounds.fastDrum, initSoundsConf.fastDrum()),
      })
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.state.request)
    window.removeEventListener('deviceorientation', this.handleOrientation, false)
    window.removeEventListener('mousemove', this.onMouseMove, false)
  }

  setMousePositions = ({ x, y }: any) => {
    if (!this.props.stop) {
      this.setState({ mousePos: { x, y } })
    }
  }

  // audio middleware
  play = (audio: any, config: any) => {
    const volume = this.state.volume
    // @ts-ignore
    return playAudio(audio, { ...config, volume })
    // return playAudio(audio, config)
  }

  // beta nahoru dolů (y)
  // gama doleva doprava (x)
  handleOrientation = ({ beta, gamma }: any) => {
    const { width, height } = this.state.view
    // angle only {angleForMax} deg for 90pos
    const angleForMax = 20
    const gammaRatio = getInRange({ number: gamma / angleForMax })
    const betaRatio = getInRange({ number: beta / angleForMax })
    const xPlayGroundRelPos = (gammaRatio * width) / 2
    const yPlayGroundRelPos = (betaRatio * height) / 2
    const finalX = xPlayGroundRelPos + this.state.me.xRel
    const finalY = yPlayGroundRelPos + this.state.me.yRel

    this.setMousePositions({
      x: finalX,
      y: finalY,
    })
  }

  onMouseMove = (e: any) => {
    const x = e.pageX
    const y = e.pageY
    this.setMousePositions({ x, y })
  }

  tick = () => {
    setTimeout(() => {
      this.recalculateActualState()
    }, 1000 / this.state.framePerSec)
  }

  stopDrumAndGetNew = (drumName: any) => {
    this.state.actualDrum.pause()
    return {
      // @ts-ignore
      actualDrum: this.play(allSounds[drumName], initSoundsConf[drumName]()),
    }
  }

  recalculateActualState = () => {
    const { mousePos, me, playground, camera, view, deletedObjectsCounter } = this.state
    const { x, y } = calculateNewObjPos(mousePos, me, me.maxSpeed, playground, camera)
    // unpure variables for map each cycle
    let newFpsDeduction = camera.fpsDeduction
    let newDrum = {}
    let newDeleteObjectsCounter = deletedObjectsCounter
    // @ts-ignore
    const unEated = this.state.objects.map(addViewKey(view)).map(item => {
      if (item.deleted) {
        return item
      } else {
        if (!item.visibleOnView) {
          return item
        } else {
          const isntColliding = twoShapesColliding(me)(item)
          if (isntColliding) {
            return item
          } else {
            if (item.shakingTime) {
              newDrum = this.stopDrumAndGetNew('slowDrum')
              // bad sad fckng += && ++ :/ sad optimalization
              newFpsDeduction += item.shakingTime
            }
            if (item.vibration && window.navigator.vibrate) {
              window.navigator.vibrate((1000 / this.state.framePerSec) * item.vibration)
            }
            if (newFpsDeduction === 0) {
              // @ts-ignore
              this.play(allSounds[item.audio])
            } else {
              // @ts-ignore
              this.play(allSounds['slowZero'])
            }
            newDeleteObjectsCounter++
            return { ...item, deleted: true }
          }
        }
      }
    })
    if (newFpsDeduction === 1) {
      newDrum = this.stopDrumAndGetNew('fastDrum')
    }

    this.setState({
      me: { ...me, x, y },
      view: {
        ...this.state.view,
        leftX: x - this.state.view.width / 2,
        topY: y - this.state.view.height / 2,
      },
      ...newDrum,
      camera: {
        ...camera,
        fpsDeduction: lowerToZero(newFpsDeduction),
      },
      request: requestAnimationFrame(this.tick),
      objects: unEated,
      deletedObjectsCounter: newDeleteObjectsCounter,
    })
  }

  render() {
    return (
      <div>
        {/*
        <Config
          auth={this.state.authCode}
          onAuthChange={e => {
            const newCode = e.target.value
            changeCode(newCode)
            this.setState({ authCode: e.target.value })
          }}
          volume={this.state.volume}
          onVolumeChange={e => {
            this.setState({ volume: e.target.value })
          }}
        />
        */}
        <Playground
          onMove={(e: any) => {
            const { x, y } = e.currentTarget.pointerPos
            this.setMousePositions({ x, y })
          }}
          stop={this.props.stop}
          {...this.state}
          onBandClick={(bandName: any) => () => {
            this.setState({
              me: {
                ...this.state.me,
                backgroundImage: bandName,
              },
            })
            // this.state.me.backgroundImage;
          }}
        />
      </div>
    )
  }
}

export default Root
