import './basicStyle.css'
import { initSounds } from './audio/audio'
import Playground from './Playground'
import React, { Component } from 'react'

const styles = {
  backgroundStyle: {
    width: '100%',
    height: '100%',
    background: '#fff',
  },

  playgroundWrapper: {
    float: 'left',
  },
} as const

type State = {
  position: number
  loading: boolean
}

class App extends Component<{}, State> {
  state = {
    position: 0,
    loading: true,
  }

  async componentDidMount() {
    await initSounds()

    this.setState({ loading: false })
  }

  render() {
    if (this.state.loading) {
      return <div>loading</div>
    }
    return (
      <div style={styles.backgroundStyle}>
        <div style={styles.playgroundWrapper}>
          <Playground />
        </div>
      </div>
    )
  }
}

export default App
