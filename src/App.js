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
      // console.log(allSounds.fastDrum)
      play(allSounds.fastDrum, initSoundsConfig.fastDrum)
    })
  }

  render() {
    return (
      <div>
        {
          this.state.loading
            ? <h1>loading sounds bank</h1>
            : <Playground />
        }
      </div>
    )
  }
}

export default App;
