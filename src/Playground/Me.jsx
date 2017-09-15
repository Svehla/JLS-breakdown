import React from 'react'
import { Circle, Image, RegularPolygon } from 'react-konva'
import background from '../background1.jpg'

class Me extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      image:null
    }
  }

  componentDidMount() {
    const image = new window.Image()
    image.src = background
    image.onload = () => {
      console.log('OBRÁZEK SE NAČETL')
      console.log(image)
      this.setState({
        image: image
      })
    }
  }

  render(){
    const {
      me: {
        x,
        y,
        background,
        ...meProps,
      },
      view,
      backgroundImage
    } = this.props
    return (
      <Circle
        x={view.width / 2}
        y={view.height / 2}
        fillPatternImage={this.state.image}
        fillPatternOffset={{ x : -100, y : 100}}
        {...meProps}
      />
    )
  }
}
      {/*<Circle
        x={view.width / 2}
        y={view.height / 2}
        fill={background}
        src={backgroundImage}
        fillPatternImage={this.state.image}
        {...meProps}
      />*/}
export default Me