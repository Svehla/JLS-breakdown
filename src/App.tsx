import './basicStyle.css'
import { initSounds } from './audio/audio'
import React, { Component } from 'react'
import RootJLSGame from './Playground/RootJLSGame'

// TODO: add styled components
const styles = {
  backgroundStyle: {
    width: '100%',
    height: '100%',
    background: '#fff',
  },

  playgroundWrapper: {
    // TODO: remove float: left
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
          <RootJLSGame />
        </div>
      </div>
    )
  }
}

export default App
