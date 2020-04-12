import { Circle } from 'react-konva'
import React from 'react'

class BandIcon extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      image: null,
      hover: false,
    }
  }

  componentDidMount() {
    const image = new window.Image()
    image.src = this.props.backgroundImage
    image.onload = () => {
      this.setState({
        image: image,
      })
    }
  }

  render() {
    const { x, y, onClick } = this.props

    const shadow = this.state.hover ? { shadowOffsetX: 5, shadowOffsetY: 5, shadowBlur: 40 } : {}
    return (
      <Circle
        x={x}
        y={y}
        radius={50}
        onMouseMove={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        alpha={0.5}
        fillPatternOffset={{ x: -50, y: 50 }}
        fillPatternImage={this.state.image}
        {...shadow}
        onClick={onClick}
      />
    )
  }
}

export default BandIcon
