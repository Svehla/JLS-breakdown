import './basicStyle.css'
import { initSounds } from './audio/index'
import Playground from './Playground'
import React, { Component } from 'react'

const backgroundStyle = {
  width: '100%',
  height: '100%',
  background: '#fff',
}

class App extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      position: 0,
      loading: true,
    }
  }

  componentDidMount() {
    initSounds().then((/* allSounds */) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div style={backgroundStyle}>
        <div style={{ float: 'left' }}>
          <Playground stop={this.state.loading} />
        </div>
      </div>
    )
  }
}

export default App
