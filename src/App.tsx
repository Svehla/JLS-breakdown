import './basicStyle.css'
import { initSounds } from './audio/audio'
import React, { useEffect, useState } from 'react'
import RootJLSGame from './Playground/RootJLSGame'

// TODO: add styled components
const styles = {
  backgroundStyle: {
    width: '100%',
    height: '100%',
    background: '#fff',
  },
  playBtnWrapper: {
    display: 'flex',
    opacity: 1,
    height: '100vh',
    width: '100%',
  },
  playButton: {
    margin: 'auto',
    fontSize: '3rem',
    background: 'black',
    borderRadius: '50%',
    color: 'white',
    width: '200px',
    height: '200px',
  },
} as const

const App = () => {
  return (
    <div style={styles.backgroundStyle}>
      <RootJLSGame />
    </div>
  )

  const [isLoading, setIsLoading] = useState(true)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    ;(async () => {
      await initSounds()

      setIsLoading(false)
    })()
    return () => undefined
  }, [])

  // TODO: add menu page for enabling sounds -> do not lag it browsers do

  if (!playing) {
    // i need this btn for enable sound api -> for user interaction
    return (
      <div style={styles.playBtnWrapper}>
        <button style={styles.playButton} onClick={() => setPlaying(true)}>
          play!
        </button>
      </div>
    )
  }
  if (isLoading) {
    return <div>loading</div>
  }
  return (
    <div style={styles.backgroundStyle}>
      <RootJLSGame />
    </div>
  )
}

export default App
