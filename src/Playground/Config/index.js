import React from 'react'

const Config = ({
  sounds,
  onSoundsClick,
  authCode,
  onAuthChange,
}) => {

  return (
    <div>
      <button
        onClick={() => onSoundsClick(!sounds)}
      >NEJEDE { sounds ? 'stop' : 'play' } Sounds</button>
      <input
        placeholder={'remote device code'}
        maxLength={3}
        onChange={onAuthChange}
        type='text'
        value={authCode}
      />
    </div>
  )
}

export default Config