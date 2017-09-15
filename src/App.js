import React, { Component } from 'react'
import Playground from './Playground'
import Sound from 'react-sound'
import cymbal from './fast-drum.mp3'
import './App.css'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      position: 0
    }
  }
  render() {
    return (
      <div>
        <Sound
          url={cymbal}
          position={this.state.position}
          loop
          playStatus={Sound.status.PLAYING}
          onFinishedPlaying={() => this.setState({ position: 10 })}
        />

        <Playground />
      </div>
    )
  }
}

export default App;
