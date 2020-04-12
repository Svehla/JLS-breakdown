import { Circle, Rect } from 'react-konva'
import { getActualPosition } from './mathCalc'
import React from 'react'

class GameObject extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      image: null,
    }
  }

  componentDidMount() {
    const backgroundImage = this.props.backgroundImage
    const image = new window.Image()
    if (backgroundImage) {
      image.src = backgroundImage
      image.onload = () => {
        this.setState({
          image: image,
        })
      }
    }
  }

  render() {
    const {
      type,
      view,
      x,
      y,
      background,
      // vibration,
      ...props
    } = this.props
    return type === 'RECTANGLE' ? (
      <Rect
        {...(this.state.image ? { fillPatternImage: this.state.image } : { fill: background })}
        {...props}
        {...getActualPosition(view, { x, y })}
      />
    ) : type === 'CIRCLE' ? (
      // @ts-ignore
      <Circle
        {...(this.state.image ? { fillPatternImage: this.state.image } : { fill: background })}
        {...props}
        {...getActualPosition(view, { x, y })}
      />
    ) : (
      ''
    )
  }
}

export default GameObject
