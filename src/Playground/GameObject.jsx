import React from 'react'
import { Circle, Rect } from 'react-konva'
import { RECTANGLE, CIRCLE } from '../constants'
import { getActualPossition } from './mathCalc'

class gameObject extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      image:null
    }
  }

  componentDidMount () {
    const backgroundImage = this.props.backgroundImage
    const image = new window.Image()
    if (backgroundImage) {
      image.src = backgroundImage
      image.onload = () => {
        this.setState({
          image: image
        })
      }
    }
  }

  render () {
    const {
      type,
      view,
      x,
      y,
      background,
      // vibration,
      ...props,
    } = this.props
    return (
      type === RECTANGLE
        ? <Rect
          {...this.state.image
            ? { fillPatternImage: this.state.image }
            : { fill: background }
          }
          {...props}
          {...getActualPossition(view, {x, y})}
        />
        : type === CIRCLE
        ? <Circle
          {...this.state.image
            ? { fillPatternImage: this.state.image }
            : { fill: background }
          }
          {...props}
          {...getActualPossition(view, {x, y})}
        />
        : ''
    )
  }
}

export default gameObject