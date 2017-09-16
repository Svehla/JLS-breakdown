import React, { Component } from 'react'
import Playground from './Playground'
import './App.css'
import { initSounds } from './audio/index'
const play = require('audio-play')

const initSoundsConfig = {
  fastDrum: {
    loop: true,
    // autoplay: true
  }
}

const fullScreenDiv = {
  background: 'rgba(10, 10, 10, .5)',
  width: '100%',
  height: '100%',
  position: 'relative',
  top: 0,
  left: 0,
  zIndex: 80000,
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
    initSounds(initSoundsConfig).then((allSounds) => {
      this.setState({ loading: false })
      play(allSounds.fastDrum, initSoundsConfig.fastDrum)
    })
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#486'
        }}
        onKeyDown={(e) => {
          console.log(e)
          console.log(e.key)
        }}
      >
        <Playground loading={this.state.loading} />

      </div>
    )
  }
}

export default App;
