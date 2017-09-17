import React from 'react'
import { Rect } from 'react-konva'
import { getActualPossition } from './mathCalc'
import gridImage from '../img/grid.png'
import gridReverseImage from '../img/grid-reverse.png'

const backgroundImageConfig = {
  fillPatternScale: { x: 1 , y: 1 },
  fillPatternOffset: { x : -100, y : 100 },
}

class Borders extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      imageLight: null,
      imageDark: null,
    }
  }

  componentDidMount() {
    const imageLight = new window.Image()
    const imageDark = new window.Image()
    imageLight.src = gridImage
    imageDark.src = gridReverseImage
    imageLight.onload = () => {
      this.setState({ imageLight: imageLight })
    }
    imageDark.onload = () => {
      this.setState({ imageDark: imageDark })
    }
  }

  render() {
    const {
      view,
      x,
      y,
      shaking,
      ...props,
    } = this.props
    return (
      <Rect
        {...props}
        {...getActualPossition(view, { x, y })}
        {...backgroundImageConfig}
        fillPatternImage={
          shaking
            ? this.state.imageDark
            : this.state.imageLight
        }
      />
    )
  }
}

export default Borders