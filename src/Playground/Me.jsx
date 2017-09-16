import React from 'react'
import { Circle } from 'react-konva'
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
      this.setState({
        image: image
      })
    }
  }

  render(){
    const {
      me,
      view,
    } = this.props
    return (
      <Circle
        {...me}
        x={view.width / 2 /* highter prioery then ...me */ }
        y={view.height / 2 /* highter prioery then ...me */ }
        fillPatternImage={this.state.image}
        fillPatternOffset={{ x : -100, y : 100 }}
      />
    )
  }
}

export default Me