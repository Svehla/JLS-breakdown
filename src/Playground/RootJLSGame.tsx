import { Coord, View, calculateNewObjPos, getInRange, isInView, lowerToZero } from './mathCalc'
import { GameObjectType } from './createGameObjects'
import { allSounds, pauseSound, playAudio } from '../audio/audio'
import { gameObjects, initSoundsConf, playground, view } from '../config'
import { isMobile } from '../utils'
// import { newDirection } from '../socket-handling'
import { KonvaEventObject } from 'konva/types/Node'
import { isTwoShapesCollision } from './collisions'
import JLSMainLogo from '../img/JLSMainLogo.jpg'
import Playground from './Playground'
import React from 'react'

const addViewProperty = <T extends { deleted: boolean }>(item: T, view: View) => ({
  ...item,
  visibleOnView: item.deleted
    ? false // performance optimisation
    : isInView(view, item),
})

const defaultState = {
  me: {
    bandName: 'jake-loves-space',
    x: view.leftX + view.width / 2, // x absolute
    y: view.topY + view.height / 2, // y absolute
    xRel: view.width / 2, // x relative
    yRel: view.height / 2, // y relative
    type: 'CIRCLE' as GameObjectType,
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
  // animation frame helper for game loop
  request: 0,
  camera: {
    shakeIntensity: 0,
  },
  // http://cubiq.org/performance-tricks-for-mobile-web-development
  framePerSec: isMobile ? 33 : 44,
  playground,
  view,
  mousePos: {
    x: view.width / 2,
    y: view.height / 2,
  },
  actualDrum: null as null | any,
  objects: gameObjects,
  // consoleText: '',
  // config
  authCode: '',
  volume: 0,
}

class RootJLSGame extends React.Component<{}, typeof defaultState> {
  state = { ...defaultState }

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
    this.setState({ mousePos: { x, y } })
  }

  // audio middleware
  // TODO: refactor
  play = (audio: any, config: any) => {
    const volume = this.state.volume
    // @ts-ignore
    return playAudio(audio, { ...config, volume })
    // return playAudio(audio, config)
  }

  // beta (`up` and `down`) (y)
  // gama (`left` and `right`) (x)
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
    const { mousePos, me, playground, camera, view } = this.state
    const { x, y } = calculateNewObjPos(mousePos, me, me.maxSpeed, playground, camera)

    let newCameraShakeIntensity = camera.shakeIntensity
    let newDrum = {}

    const updatedGameObjects = this.state.objects
      .map(item => addViewProperty(item, view))
      .map(item => {
        if (item.deleted) {
          return item
        }
        if (!item.visibleOnView) {
          return item
        }

        // is not in collision -> just return and ignore next code..
        if (!isTwoShapesCollision(me, item)) {
          return item
        }

        // > <> <> <> <> <> <> <> <> <> <> <
        // unpure shitty side effect while you eat some new game object (collision is happened)
        // > <> <> <> <> <> <> <> <> <> <> <
        if (item.shakingTime) {
          newDrum = this.stopDrumAndGetNew('slowDrum')
          // @ts-ignore
          // increment shaking intensity by each ate object
          newCameraShakeIntensity += item.shakingTime
        }

        // @ts-ignore
        if (item.vibration && window.navigator.vibrate) {
          // @ts-ignore
          window.navigator.vibrate((1000 / this.state.framePerSec) * item.vibration)
        }

        // @ts-ignore
        this.play(allSounds[newCameraShakeIntensity === 0 ? item.audio : allSounds['slowZero']])
        return { ...item, deleted: true }
      })

    // un-effective filter??? todo: some optimisation

    if (newCameraShakeIntensity === 1) {
      newDrum = this.stopDrumAndGetNew('fastDrum')
    }

    // TODO: add setState updater
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
        shakeIntensity: lowerToZero(newCameraShakeIntensity),
      },
      objects: updatedGameObjects,
      // next tick of game loop
      request: requestAnimationFrame(this.tick),
    })
  }

  onBandClick = (bandName: string) => {
    this.setState({
      me: {
        ...this.state.me,
        bandName,
      },
    })
  }

  handlePlaygroundMove = (e: KonvaEventObject<Event>) => {
    // @ts-ignore
    const { x, y } = e.currentTarget.pointerPos
    this.setMousePositions({ x, y })
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
          onMove={this.handlePlaygroundMove}
          onBandClick={this.onBandClick}
          {...(this.state as any)}
        />
      </div>
    )
  }
}

export default RootJLSGame
