// audio loader is loaded from cdn in index.html -> nodegyp compiler does not work on node v12
// const load = require('audio-loader')
// // const play = require('audio-play')
import axios from 'axios'

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

export const pauseSound = (audioBufferInstance: any) => {
  // console.log('should pause: ', name, allData[name])
  // now i support only one instance per sound

  audioBufferInstance.stop()
}
// possible middleware
// export const playAudio = () => ({ pause: () => 'play' })
export const playAudio = async (name: any, conf: any) => {
  // create audio context
  const audioContext = getAudioContext()
  // create audioBuffer (decode audio file)
  // copy buffers: https://stackoverflow.com/questions/10100798/whats-the-most-straightforward-way-to-copy-an-arraybuffer-object
  const audioBuffer = await audioContext.decodeAudioData(allData[name].slice(0))

  // create audio source
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)

  if (conf.loop) {
    source.loop = true
  }
  // // play audio
  source.start()
  // wtf api
  // todo: figure it how to make some normal consistent api for work with sound and better performance without libraries
  // prefer to find some lib for handling that sounds
  return source
}
export const audioNames = audioSources.map(item => item.split('.')[0])

const getAudioContext = () => {
  // does it work on older browsers?
  AudioContext = window.AudioContext // || window.webkitAudioContext
  const audioContent = new AudioContext()
  return audioContent
}

// my custom polyfill for audio-loader lib
// custom implementation of audio-loader (it stopped working after updating nodejs version)
// https://apiko.com/blog/how-to-work-with-sound-java-script/
const load = async (url: string) => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  })
  // todo: figure it how to copy and paste sounds -> how to work with buffers
  return response.data
}

// side effect shitty shit initSounds() se from bad scope
// todo: shitty types
export let allSounds: any = {}
export let allData: any = {}
// export let allSounds = Object.fromEntries(audioNames.map(name => ([name, null])))

export const initSounds = async () => {
  console.time('loadSounds')
  // load audio file from server

  const audioBuffers = await Promise.all(audioSources.map(audioSrc => load(requirePath(audioSrc))))

  // write to global object ... -> rofl
  allData = Object.fromEntries(audioBuffers.map((buffer, index) => [audioNames[index], buffer]))

  allSounds = Object.fromEntries(
    audioBuffers.map((buffer, index) => [audioNames[index], audioNames[index]])
  )

  console.log('###sounds are ready###')
  console.timeEnd('loadSounds')
  return allSounds
}

export const sounds = audioSources.reduce((pre, audioNameExt) => {
  const audioName = audioNameExt.split('.')[0]
  const filePath = require(`../audio/${audioNameExt}`)

  console.log(filePath)
  ;(pre as any)[audioName] = new Audio(filePath)
  // pre[audioName] = new Audio(filePath)
  return pre
}, {})
