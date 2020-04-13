import {
  Coord,
  View,
  calculateNewObjPos,
  decreaseBy1ToZero,
  getInRange,
  isInView,
} from './mathCalc'
import { GameElementType } from './gameElementTypes'
import { KonvaEventObject } from 'konva/types/Node'
import { gameObjects, getView, initSoundsConf, playground } from '../config'
import { isMobile } from '../utils'
import { isTwoShapesCollision } from './collisions'
import { pauseSound, playAudio } from '../audio/audio'
import JLSMainLogo from '../img/JLSMainLogo.jpg'
import Playground from './Playground'
import React from 'react'

const addViewProperty = <T extends { deleted: boolean }>(item: T, view: View) => ({
  ...item,
  visibleOnView: item.deleted
    ? false // performance optimisation
    : isInView(view, item as any),
})

const view = getView()

const get_gameState = () => ({
  me: {
    bandName: 'jake-loves-space',
    // absolute coordinations
    x: view.leftX + view.width / 2,
    y: view.topY + view.height / 2,
    // relative coordinations
    xRel: view.width / 2,
    yRel: view.height / 2,
    type: GameElementType.Circle as GameElementType,
    radius: isMobile ? 60 : 90,
    backgroundImage: JLSMainLogo,
    fillPatternScale: isMobile ? { x: 0.66, y: 0.66 } : { x: 1, y: 1 },
    fillPatternOffset: { x: -100, y: 100 },
    shadowOffsetX: 20,
    shadowOffsetY: 25,
    shadowBlur: 40,
    background: '#F0F',
    maxSpeed: isMobile ? 5 : 10,
  },
  cameraShakeIntensity: 0,
  playground,
  view: getView(),
  actualDrum: null as any,
  gameObjects: gameObjects,
  authCode: '',
  volume: 0,
  mousePosition: {
    x: view.width / 2,
    y: view.height / 2,
  },
})

class RootJLSGame extends React.Component<{}> {
  /**
   * it's like React.ref
   *
   * don't want to rerender react app (aka change state)
   * while i catch event for mouse is moved -> i will wait till game loop will check it by itself
   *
   * i don't care about immutability
   *
   * I use this.state for triggering of render method -> its triggered primarly by requestAnimationFrame
   */
  _gameState = get_gameState()

  /**
   * this is used for: `request animation frame`
   *
   * inspiration:
   * > https://gist.github.com/jacob-beltran/aa114af1b6fd5de866aa365e3763a90b
   */
  _frameId = 0

  componentDidMount() {
    window.addEventListener('deviceorientation', this.handleOrientation)
    window.addEventListener('mousemove', this.handleMouseMove)

    // init infinite gameLoop

    this._frameId = requestAnimationFrame(this.tick)

    // setup music for background
    this._gameState.actualDrum = this.play('fastDrum', initSoundsConf.fastDrum())
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._frameId)
    window.removeEventListener('deviceorientation', this.handleOrientation)
    window.removeEventListener('mousemove', this.handleMouseMove)
  }

  // --------------------------
  // ---- event listeners -----
  // --------------------------

  // beta (`up` and `down`) (y)
  // gama (`left` and `right`) (x)
  handleOrientation = ({ beta, gamma }: DeviceOrientationEvent) => {
    if (!beta || !gamma) {
      return
    }
    const { width, height } = this._gameState.view
    // angle only {angleForMax} deg for 90pos
    const angleForMax = 20
    const gammaRatio = getInRange(gamma / angleForMax)
    const betaRatio = getInRange(beta / angleForMax)
    const xPlayGroundRelPos = (gammaRatio * width) / 2
    const yPlayGroundRelPos = (betaRatio * height) / 2
    const x = xPlayGroundRelPos + this._gameState.me.xRel
    const y = yPlayGroundRelPos + this._gameState.me.yRel

    this._gameState.mousePosition = { x, y }
  }

  handleMouseMove = (e: MouseEvent) => {
    const x = e.pageX
    const y = e.pageY
    this._gameState.mousePosition = { x, y }
  }

  handleBandClick = (bandName: string) => {
    this._gameState.me.bandName = bandName
  }

  // support of mobile devices
  handlePlaygroundMove = (e: KonvaEventObject<Event>) => {
    // @ts-ignore
    if (e.currentTarget.pointerPos) {
      // @ts-ignore
      const { x, y } = e.currentTarget.pointerPos
      this._gameState.mousePosition = { x, y }
    }
  }

  // --------------------------
  // --------- others --------
  // --------------------------

  // audio middleware
  // TODO: refactor
  play = (audio: any, config: any) => {
    const volume = this._gameState.volume
    // @ts-ignore
    return playAudio(audio, { ...config, volume })
    // return playAudio(audio, config)
  }
  tick = () => {
    this.recalculateGameLoopState()
    // let rerender react app
    this.setState({})
  }

  stopDrumAndGetNew = (drumName: string) => {
    // make async call inside of sync fn (should refactor it somehow?)
    ;(async () => {
      const currDrum = await this._gameState.actualDrum
      pauseSound(currDrum)
    })()

    // todo: create new structure for saving audio data
    // @ts-ignore
    return this.play(drumName, initSoundsConf[drumName]())
  }

  recalculateGameLoopState = () => {
    const { me, playground, cameraShakeIntensity, view } = this._gameState
    const mousePos = this._gameState.mousePosition
    const { x, y } = calculateNewObjPos(mousePos, me, me.maxSpeed, playground, cameraShakeIntensity)

    let newCameraShakeIntensity = cameraShakeIntensity
    let newDrum = null as any

    // check collisions + add deleted items
    const updatedGameObjects = this._gameState.gameObjects
      .map(item => addViewProperty(item, view))
      .map(item => {
        if (item.deleted) {
          return item
        }
        if (!item.visibleOnView) {
          return item
        }

        // is not in collision -> just return and ignore next code..
        // @ts-ignore
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
        this.play(newCameraShakeIntensity === 0 ? item.audio : 'slowZero')
        return { ...item, deleted: true }
      })

    if (newCameraShakeIntensity === 1) {
      newDrum = this.stopDrumAndGetNew('fastDrum')
    }

    // update game state and wait for next tick
    // don't give a fuck about immutability
    this._gameState.me = { ...me, x, y }
    this._gameState.view = {
      ...this._gameState.view,
      leftX: x - this._gameState.view.width / 2,
      topY: y - this._gameState.view.height / 2,
    }
    this._gameState.cameraShakeIntensity = decreaseBy1ToZero(newCameraShakeIntensity)
    this._gameState.gameObjects = updatedGameObjects
    if (newDrum) {
      this._gameState.actualDrum = newDrum
    }

    this._frameId = requestAnimationFrame(this.tick)
  }

  render() {
    return (
      <Playground
        view={this._gameState.view}
        gameObjects={this._gameState.gameObjects}
        me={this._gameState.me}
        cameraShakeIntensity={this._gameState.cameraShakeIntensity}
        mousePos={this._gameState.mousePosition}
        handlePlaygroundMove={this.handlePlaygroundMove}
        handleBandClick={this.handleBandClick}
      />
    )
  }
}

export default RootJLSGame
