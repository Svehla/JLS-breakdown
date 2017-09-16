import React from 'react'
import { Circle } from 'react-konva'

class Me extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      image:null
    }
  }

  componentDidMount() {
    const image = new window.Image()
    image.src = this.props.me.backgroundImage
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
      />
    )
  }
}

/*
) {...(
          this.state.image
            ? { fillPatternImage: this.state.image }
            : { background: '#000' }
        )}
 */

export default Me