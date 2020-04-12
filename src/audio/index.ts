// const load = require('audio-loader')
// const play = require('audio-play')

// @ts-ignore
const requirePath = fileName => require(`../audio/${fileName}`)

export const audioSources = [
  'fastDrum.wav',
  'fastZero.wav',
  'slowZero.wav',
  'scream.mp3',
  'growl.mp3',
  'patAndMat.wav',
  'omg.wav',
  'slza.wav',
  'blue.wav',
  'slowDrum.mp3',
]

// possible middleware
export const playAudio = () => 'play'
// export const playAudio = play
// (...props) => {
// play(...props)
// }

export const audioNames = audioSources.map(item => item.split('.')[0])

// side effect shitty shit initSounds() se from bad scope
// todo: shitty types
export let allSounds: any = {}
// export let allSounds = Object.fromEntries(audioNames.map(name => ([name, null])))

export const initSounds = async () => {
  console.time('loadSounds')
  const values = await Promise.all(audioSources.map(audioSrc => requirePath(audioSrc)))

  const finalObject = values.reduce((obj, audio, index) => {
    const audioName = audioNames[index]
    obj[audioName] = null // audio
    return obj
  }, {})
  allSounds = finalObject

  console.log(allSounds)
  console.log('###sounds are ready###')
  console.timeEnd('loadSounds')
  return finalObject
}

export const sounds = audioSources.reduce((pre, audioNameExt) => {
  const audioName = audioNameExt.split('.')[0]
  const filePath = require(`../audio/${audioNameExt}`)

  console.log(filePath)
  ;(pre as any)[audioName] = new Audio(filePath)
  // pre[audioName] = new Audio(filePath)
  return pre
}, {})
