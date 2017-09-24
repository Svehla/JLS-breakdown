import React, { Component } from 'react'
import Playground from './Playground'
import { initSounds } from './audio/index'
import { initSoundsConfig } from './config'
import './basicStyle.css'
const play = require('audio-play')

const backgroundStyle = {
  width: '100%',
  height: '100%',
  background: '#fff',
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      position: 0,
      loading: true
    }
  }

  componentDidMount () {
    initSounds().then((allSounds) => {
      this.setState({ loading: false })
      // play(allSounds.fastDrum, initSoundsConfig.fastDrum)
    })
  }

  render() {
    return (
      <div style={backgroundStyle} >
        <Playground
          stop={this.state.loading} />
      </div>
    )
  }
}

export default App;
