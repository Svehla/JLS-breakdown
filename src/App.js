import React, { Component } from 'react'
import Playground from './Playground'
import Sound from 'react-sound'
import fastDrum from './audio/fastDrum.wav'
import './App.css'
// var _soundmanager2 = require('soundmanager2/script/soundmanager2-nodebug-jsmin.js')
var soundManager = soundManager
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      position: 0,
      showPlayground: false
    }
  }

  componentDidMount(){
    // console.log('soundManager')
    // console.log(soundManager2)
    // soundManager.setup({debugMode: false});
    // audio.addEventListener('canplaythrough', this.isAppLoaded, false);
  }
  render() {
    return (
      <div>
        <Sound
          url={fastDrum}
          position={this.state.position}
          loop
          playStatus={Sound.status.PLAYING}
          onLoading={() => {
            this.setState({
              showPlayground: true
            })
          }}
          onFinishedPlaying={() => this.setState({ position: 10 })}
        />
        <Playground />
      </div>
    )
  }
}

export default App;
