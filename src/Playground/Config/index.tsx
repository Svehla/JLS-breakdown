import React from 'react'

type Props = any
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
