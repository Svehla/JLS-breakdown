import { Coord, View, calculateNewObjPos, getInRange, isInView, lowerToZero } from './mathCalc'
import { GameObjectType } from './createGameObjects'
import { allSounds, pauseSound, playAudio } from '../audio/audio'
import { gameObjects, getView, initSoundsConf, playground } from '../config'
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

const view = getView()
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
  cameraShakeIntensity: 0,
  // http://cubiq.org/performance-tricks-for-mobile-web-development
  framePerSec: isMobile ? 33 : 44,
  playground,
  view: getView(),
  mousePos: {
    x: view.width / 2,
    y: view.height / 2,
  },
  actualDrum: null as any,
  gameObjects: gameObjects,
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
    window.addEventListener('mousemove', this.handleMouseMove)

    this.setState({
      request: requestAnimationFrame(this.tick),
      actualDrum: this.play(allSounds.fastDrum, initSoundsConf.fastDrum()),
    })
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.state.request)
    window.removeEventListener('deviceorientation', this.handleOrientation)
    window.removeEventListener('mousemove', this.handleMouseMove)
  }

  // --------------------------
  // ---- event listeners -----

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
    const x = xPlayGroundRelPos + this.state.me.xRel
    const y = yPlayGroundRelPos + this.state.me.yRel

    this.setMousePositions({ x, y })
  }

  handleMouseMove = (e: MouseEvent) => {
    const x = e.pageX
    const y = e.pageY
    this.setMousePositions({ x, y })
  }

  handleBandClick = (bandName: string) => {
    this.setState({
      me: {
        ...this.state.me,
        bandName,
      },
    })
  }

  // support of mobile devices
  handlePlaygroundMove = (e: KonvaEventObject<Event>) => {
    // @ts-ignore
    const { x, y } = e.currentTarget.pointerPos
    this.setMousePositions({ x, y })
  }

  // --------------------------
  // --------- others --------
  // --------------------------

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
  tick = () => {
    setTimeout(() => {
      this.recalculateGameLoopState()
    }, 1000 / this.state.framePerSec)
  }

  stopDrumAndGetNew = (drumName: string) => {
    // make async call inside of sync fn (should refactor it somehow?)
    ;(async () => {
      const currDrum = await this.state.actualDrum
      pauseSound(currDrum)
    })()

    // todo: create new structure for saving audio data
    // @ts-ignore
    return this.play(allSounds[drumName], initSoundsConf[drumName]())
  }

  recalculateGameLoopState = () => {
    const { mousePos, me, playground, cameraShakeIntensity, view } = this.state
    const { x, y } = calculateNewObjPos(mousePos, me, me.maxSpeed, playground, cameraShakeIntensity)

    let newCameraShakeIntensity = cameraShakeIntensity
    let newDrum = null as any

    const updatedGameObjects = this.state.gameObjects
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
        // unpure shitty side effect while you
        // eat some new game object (aka collision is happened)
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
      cameraShakeIntensity: lowerToZero(newCameraShakeIntensity),
      gameObjects: updatedGameObjects,
      // TODO: change drum audio structure
      ...(newDrum ? ({ actualDrum: newDrum } as any) : {}),
      // next tick of game loop
      request: requestAnimationFrame(this.tick),
    })
  }

  render() {
    return (
      <div>
        {/*
        // old configuration for debugging purposes
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
          view={this.state.view}
          gameObjects={this.state.gameObjects}
          me={this.state.me}
          cameraShakeIntensity={this.state.cameraShakeIntensity}
          mousePos={this.state.mousePos}
          handlePlaygroundMove={this.handlePlaygroundMove}
          handleBandClick={this.handleBandClick}
        />
      </div>
    )
  }
}

export default RootJLSGame
