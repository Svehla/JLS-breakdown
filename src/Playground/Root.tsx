import { Coord, View, calculateNewObjPos, getInRange, isInView, lowerToZero } from './mathCalc'
import { allSounds, pauseSound, playAudio } from '../audio/audio'
import { gameObjects, initSoundsConf, playground, view } from '../config'
import { isMobile } from '../utils'
// import { newDirection } from '../socket-handling'
import { twoShapesColliding } from './collisions'
import JLSMainLogo from '../img/JLSMainLogo.jpg'
import Playground from './Playground'
import React from 'react'

const addViewProperty = <T extends { deleted: boolean }>(item: T, view: View) => ({
  ...item,
  visibleOnView: item.deleted
    ? false // performance optimalization
    : isInView(view, item),
})

type Props = any
type State = any

class Root extends React.Component<Props, State> {
  state = {
    actualBand: 'jake-loves-space',
    me: {
      x: view.leftX + view.width / 2, // x absolute
      y: view.topY + view.height / 2, // y absolute
      xRel: view.width / 2, // x relative
      yRel: view.height / 2, // y relative
      type: 'CIRCLE' as 'CIRCLE',
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
      width: playground.width,
      height: playground.height,
    },
    mousePos: {
      x: view.width / 2,
      y: view.height / 2,
    },
    actualDrum: null,
    objects: gameObjects,
    // cache deleted data => high performance
    // 0.15-0.3 ms for 232 items
    deletedObjectsCounter: gameObjects.reduce((pre, curr) => (curr.deleted ? pre + 1 : pre), 0),
    consoleText: '',
    // config
    authCode: '',
    volume: 0,
  }

  componentDidMount() {
    // todo: solve socket.io somehow
    // newDirection(({ beta, gamma }: any) => {
    //   this.handleOrientation({ beta, gamma })
    // })

    // init game
    window.addEventListener('deviceorientation', this.handleOrientation)
    document.addEventListener('mousemove', this.onMouseMove)

    this.setState({
      request: requestAnimationFrame(this.tick),
      actualDrum: this.play(allSounds.fastDrum, initSoundsConf.fastDrum()),
    })
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.state.request)
    window.removeEventListener('deviceorientation', this.handleOrientation)
    window.removeEventListener('mousemove', this.onMouseMove)
  }

  setMousePositions = ({ x, y }: Coord) => {
    if (!this.props.stop) {
      this.setState({ mousePos: { x, y } })
    }
  }

  // audio middleware
  // TODO: refactor
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

  onMouseMove = (e: MouseEvent) => {
    const x = e.pageX
    const y = e.pageY
    this.setMousePositions({ x, y })
  }

  tick = () => {
    setTimeout(() => {
      this.recalculateActualState()
    }, 1000 / this.state.framePerSec)
  }

  stopDrumAndGetNew = (drumName: string) => {
    // make async call inside of sync fn (should refactor it somehow?)
    ;(async () => {
      const currDrum = await this.state.actualDrum
      pauseSound(currDrum)
    })()

    return {
      // todo: what about await??
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

    const visibleGameObjects = this.state.objects
      .map(item => addViewProperty(item, view))
      .map(item => {
        if (item.deleted) {
          return item
        }
        if (!item.visibleOnView) {
          return item
        }
        // TODO: bad name???
        const isntColliding = twoShapesColliding(me, item)
        if (isntColliding) {
          return item
        }

        // do i need it to make it for each item in the game?
        if (item.shakingTime) {
          newDrum = this.stopDrumAndGetNew('slowDrum')
          // @ts-ignore
          newFpsDeduction += item.shakingTime
        }
        // @ts-ignore
        if (item.vibration && window.navigator.vibrate) {
          // @ts-ignore
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
      })

    console.log(visibleGameObjects)

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
      objects: visibleGameObjects,
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
          onBandClick={(bandName: any) => () => {
            this.setState({
              me: {
                ...this.state.me,
                backgroundImage: bandName,
              },
            })
            // this.state.me.backgroundImage;
          }}
          {...(this.state as any)}
        />
      </div>
    )
  }
}

export default Root
