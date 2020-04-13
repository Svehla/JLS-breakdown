import React from 'react'

type Props = {
  volume: number
  authCode: string
  onAuthChange: any
  onVolumeChange: any
}

/*
  old configuration for debugging purposes
  -> i don't want to delete this code at the moment (for purpose that I'll support volume again)
  example of use:
------------------------

<Config
  auth={this.state.authCode}
  onAuthChange={e => {
    const newCode = e.target.value
    changeCode(newCode)
    this.setState({ authCode: e.target.value })
  }}
  volume={this.state.volume}
  onVolumeChange={e => {
    this.setState({ volume: e.target.value })
  }}
/>

*/
const Config = ({ authCode, onAuthChange, volume, onVolumeChange }: Props) => {
  return (
    <div>
      <input type='range' onChange={onVolumeChange} min={0} max={1} step={0.05} value={volume} />
      <input
        placeholder={'remote device code'}
        maxLength={3}
        onChange={onAuthChange}
        type='number'
        value={authCode}
      />
    </div>
  )
}

export default Config
