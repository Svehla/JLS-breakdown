import { Circle } from 'react-konva'
import JLSMainLogo from '../img/JLSMainLogo.jpg'
import React from 'react'
import architectsMainLogo from '../img/architectsMainLogo.png'

class Me extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      image1: null,
      image2: null,
    }
  }

  componentDidMount() {
    const jlsImage = new window.Image()
    const architectsImage = new window.Image()
    jlsImage.src = JLSMainLogo
    architectsImage.src = architectsMainLogo
    architectsImage.onload = () => {
      this.setState({
        architectsImage,
      })
    }
    jlsImage.onload = () => {
      this.setState({
        jlsImage,
      })
    }
  }

  render() {
    const { me, view } = this.props
    const bandName = me.backgroundImage
    return (
      <Circle
        {...me}
        x={view.width / 2 /* highter prioery then ...me */}
        y={view.height / 2 /* highter prioery then ...me */}
        fillPatternImage={
          bandName === 'jake-loves-space' ? this.state.jlsImage : this.state.architectsImage
        }
      />
    )
  }
}

export default Me
