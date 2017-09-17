const play = require('audio-play')
const load = require('audio-loader')

const requirePath = fileName => require(`../audio/${fileName}`)
export const audioSources = [
  'fastDrum.wav',
  'fastZero.wav',
  'scream.mp3',
  'growl.mp3',
  'patAndMat.wav',
  'omg.wav',
  'slza.wav',
  'blue.wav',
  'slowDrum.mp3'
]

export const audioNames = audioSources.map(item => item.split('.')[0])

// side effect shitty shit initSounds() se from bad scope
export let allSounds = {}

export const initSounds = async () => {
  console.time('loadSounds')
  const values = await Promise.all(audioSources.map(audioSrc => load(requirePath(audioSrc))))// .then(values => {
  const finalObject = values.reduce((obj, audio, index) => {
    const audioName = audioNames[index]
    obj[audioName] = audio
    return obj
  }, {})
  allSounds = finalObject
  console.log('###sounds are ready###')
  console.timeEnd('loadSounds')
  return finalObject
}

export const sounds = audioSources.reduce((pre, audioNameExt) => {
  const audioName = audioNameExt.split('.')[0]
  const filePath = require(`../audio/${audioNameExt}`)
  pre[audioName] = new Audio(filePath)
  return pre
}, {})