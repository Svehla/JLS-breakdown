import React, { Component } from 'react'
import Playground from './Playground'
import './App.css'
import { initSounds } from './audio/index'
import { initSoundsConfig } from './config'
const play = require('audio-play')

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      position: 0,
      loading: true
    }
  }

  componentDidMount () {
    initSounds(initSoundsConfig).then((allSounds) => {
      this.setState({ loading: false })
      play(allSounds.slowDrum, initSoundsConfig.slowDrum)
      // play(allSounds.fastDrum, initSoundsConfig.fastDrum)
    })
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#fff'
        }}
      >
        <Playground stop={this.state.loading} />

      </div>
    )
  }
}

export default App;
