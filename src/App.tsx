import './basicStyle.css'
import GameRoot from './Game/GameRoot'
import React from 'react'

// TODO: add styled components
const styles = {
  backgroundStyle: {
    width: '100%',
    height: '100%',
    background: '#fff',
  },
} as const

const App = () => (
  <div style={styles.backgroundStyle}>
    <GameRoot />
  </div>
)

export default App
