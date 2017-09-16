import React from 'react'
import { Rect } from 'react-konva'
import { getActualPossition } from './mathCalc'
import background from '../img/grid.png'
const backgroundImageConfig = {
  backgroundimage: background,
  fillPatternScale: { x: 1 , y: 1 },
  fillPatternOffset: { x : -100, y : 100 },
}

class Borders extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      image: null
    }
  }

  componentDidMount() {
    const image = new window.Image()
    image.src = background
    image.onload = () => {
      this.setState({
        image: image
      })
    }
  }

  render() {
    const {
      view,
      x,
      y,
      // background,
      ...props,
    } = this.props
    return (
      <Rect
        {...props}
        {...getActualPossition(view, { x, y })}
        {...backgroundImageConfig}
        fillPatternImage={this.state.image}
      />
    )
  }
}
/*
const Borders = ({
  view,
  x,
  y,
  background,
  ...props,
}) => {
  return (
    <Rect
      fill={background}
      {...props}
      {...getActualPossition(view, { x, y })}
      {...backgroundImageConfig}
    />
  )
}
*/
export default Borders