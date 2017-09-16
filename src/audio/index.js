
export const audioSources = [
  'fastZero.wav',
  'scream.mp3',
  'growl.mp3',
  'patAndMat.wav',
  'omg.wav',
  'slza.wav',
  'blue.wav'
]

export const audioNames = audioSources.map(item => item.split('.')[0])

export const sounds = audioSources.reduce((pre, audioNameExt) => {
  const audioName = audioNameExt.split('.')[0]
  const filePath = require(`../audio/${audioNameExt}`)
  pre[audioName] = new Audio(filePath)
  return pre
}, {})