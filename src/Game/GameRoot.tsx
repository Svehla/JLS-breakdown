import './rayCasting'
import { GameElement, GameElementType, Line, Radar } from './gameElementTypes'
import { KonvaEventObject } from 'konva/types/Node'
import { RADAR_VISIBLE_DELAY, gameElements, getView, playground } from './gameSetup'
import {
  View,
  calcNewRadarRotation,
  calculateNewObjPos,
  decreaseBy1ToZero,
  isInView,
} from './mathCalc'
import { getRayCastCollisions } from './rayCasting'
import { isMobile } from '../utils'
import { /*isArcRectCollision,*/ isTwoElementCollision } from './collisions'
import Playground from './Playground'
import React from 'react'

// kinda shitty code
const addViewProperty = <T extends GameElement>(item: T, view: View): T => ({
  ...item,
  visibleInView: (() => {
    switch (item.type) {
      case GameElementType.Polygon:
        return isInView(view, item)
      case GameElementType.Circle:
        // @ts-ignore: typescript inheritance minus :|
        return item.deleted ? false : isInView(view, item)
      case GameElementType.Rectangle:
        // @ts-ignore: typescript inheritance minus :|
        return item.deleted ? false : isInView(view, item)
    }
  })(),
})

const view = getView()

const getGameState = () => ({
  me: {
    // absolute coordinations
    x: view.leftX + view.width / 2,
    y: view.topY + view.height / 2,
    // relative coordinations
    // constants => sign it somehow like final const
    xRel: view.width / 2,
    yRel: view.height / 2,
    type: GameElementType.Circle as GameElementType,
    radius: isMobile ? 60 : 60,
    shadowOffsetX: 20,
    shadowOffsetY: 25,
    shadowBlur: 40,
    background: '#559',
    maxSpeedPerSecond: isMobile ? 125 : 250,
  },
  cameraShakeIntensity: 0,
  playground,
  view: getView(),
  gameElements: gameElements,
  authCode: '',
  volume: 0,
  mousePosition: {
    x: view.width / 2,
    y: view.height / 2,
  },
  // speed of radar is const by timestamp
  // ray cast is calculated from radar view
  radar: {
    // center coordination
    rotation: 0,
    sectorAngle: 30,
    radius: 480,
  } as Radar,
  rayCastRays: [] as Line[],
})

/**
 *
 * base Component for handling game logic
 *
 * TODO: what about to remove react?
 */
class GameRoot extends React.Component<{}> {
  /**
   * it's like React.ref
   *
   * don't want to rerender react app (aka change state)
   * while i catch event for mouse is moved -> i will wait till game loop will check it by itself
   *
   * i don't care about immutability
   *
   * I use this.state for triggering of render method -> its triggered by `requestAnimationFrame`
   */
  _gameState = getGameState()
  _highResTimestamp = 0
  /**
   * this is used for: `request animation frame`
   *
   * inspiration:
   * > https://gist.github.com/jacob-beltran/aa114af1b6fd5de866aa365e3763a90b
   */
  _frameId = 0

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove)

    // init infinite gameLoop
    this._frameId = requestAnimationFrame(this.tick)
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._frameId)
    window.removeEventListener('mousemove', this.handleMouseMove)
  }

  // --------------------------
  // ---- event listeners -----
  // --------------------------

  // use for desktop support
  handleMouseMove = (e: MouseEvent) => {
    const x = e.pageX
    const y = e.pageY
    this._gameState.mousePosition = { x, y }
  }

  // use for mobile devices support
  handlePlaygroundMove = (e: KonvaEventObject<Event>) => {
    // @ts-ignore
    const { x, y } = e.target.getStage().getPointerPosition()
    this._gameState.mousePosition = { x, y }
  }

  // --------------------------
  // --------- others --------
  // --------------------------

  tick = (highResTimestamp: number) => {
    const timeSinceLastTick = highResTimestamp - this._highResTimestamp
    this._highResTimestamp = highResTimestamp

    this.recalculateGameLoopState(timeSinceLastTick)
    // let react call render method
    // TODO: is react efficient way for app like this? what about pure canvas/konva?
    this.setState({})

    this._frameId = requestAnimationFrame(this.tick)
  }

  /**
   *
   * this is heart of whole game
   * each actions is recalculated by each frame in this function
   */
  recalculateGameLoopState = (timeSinceLastTick: number) => {
    // todo: does not work.....
    this._gameState.playground.borders = this._gameState.playground.borders.map(item =>
      addViewProperty(item, view)
    )
    // TODO: add border collisions (optimise it with addViewProperty)
    const { x, y } = calculateNewObjPos(
      this._gameState.mousePosition,
      this._gameState.me,
      timeSinceLastTick,
      this._gameState.playground,
      {
        cameraShakeIntensity: this._gameState.cameraShakeIntensity,
      }
    )

    // update static tick stuffs (radar & view & my position)
    this._gameState = {
      ...this._gameState,
      me: { ...this._gameState.me, x, y },
      view: {
        ...this._gameState.view,
        leftX: x - this._gameState.view.width / 2,
        topY: y - this._gameState.view.height / 2,
      },
    }

    const newRadarRotationAngle = calcNewRadarRotation()
    this._gameState.radar.rotation = newRadarRotationAngle

    // borders
    this._gameState.playground.borders = this._gameState.playground.borders.map(
      item => addViewProperty(item, view) as any
    )

    // check collisions
    const updatedGameElements = this._gameState.gameElements
      // add max speed threshold around the view
      .map(item => addViewProperty(item, this._gameState.view))
      // todo: outdated value of radar (one frame out -> change order of setting values)
      // todo: does it make sense for implemented rayCasting?
      // .map(item => addArcViewProperty(this._gameState.radar, me, item as any))
      .map(item => {
        // @ts-ignore
        if (item.deleted) {
          return item
        }
        if (!item.visibleInView) {
          return item
        }
        // is not in collision -> just return and ignore next code..
        // @ts-ignore
        if (!isTwoElementCollision(this._gameState.me, item)) {
          return item
        }
        if (item.shakingTime) {
          // increment shaking intensity by each ate object
          this._gameState.cameraShakeIntensity += item.shakingTime
        }
        return { ...item, deleted: true }
      })

    this._gameState.gameElements = updatedGameElements.map(item => ({
      ...item,
      seenByRadar: item.seenByRadar > 0 ? item.seenByRadar - timeSinceLastTick : 0,
    }))

    this._gameState.cameraShakeIntensity = decreaseBy1ToZero(this._gameState.cameraShakeIntensity)

    const visibleGameElements = this._gameState.gameElements.filter(
      e => e.visibleInView && !e.deleted
    )

    const rayCastCollisions = getRayCastCollisions(
      {
        x: this._gameState.me.x,
        y: this._gameState.me.y,
        ...this._gameState.radar,
        startAngle: this._gameState.radar.rotation,
      },
      [...visibleGameElements, ...this._gameState.playground.borders]
    )

    // make radar elements collisions visible
    rayCastCollisions.forEach(r => {
      const id = r.collisionId
      const el = this._gameState.gameElements.find(({ id: elId }) => elId === id)
      if (el) {
        el.seenByRadar = RADAR_VISIBLE_DELAY
      }
    })
    this._gameState.rayCastRays = rayCastCollisions
  }

  render() {
    return (
      <Playground
        view={this._gameState.view}
        gameElements={this._gameState.gameElements}
        me={this._gameState.me}
        radar={this._gameState.radar}
        cameraShakeIntensity={this._gameState.cameraShakeIntensity}
        mousePos={this._gameState.mousePosition}
        handlePlaygroundMove={this.handlePlaygroundMove}
        rayCastRays={this._gameState.rayCastRays}
        playground={this._gameState.playground}
      />
    )
  }
}

export default GameRoot
