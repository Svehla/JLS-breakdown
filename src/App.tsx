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
} as const

const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      await initSounds()

      setIsLoading(false)
    })()
    return () => undefined
  }, [])

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
