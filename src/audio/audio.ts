// audio loader is loaded from cdn in index.html -> nodegyp compiler does not work on node v12
// const load = require('audio-loader')
// // const play = require('audio-play')
// import { AudioContext } from 'standardized-audio-context'
import { isMobile } from '../utils'
import axios from 'axios'

// Audio context polyfill
// inspiration>
// >https://stackoverflow.com/a/22996293/8995887
const GoodAudioContext =
  window.AudioContext ||
  // @ts-ignore
  window.webkitAudioContext ||
  // @ts-ignore
  window.mozAudioContext ||
  // @ts-ignore
  window.oAudioContext ||
  // @ts-ignore
  window.msAudioContext

// --------------
//   helper fns
// --------------
// TODO: should i let there this dynamic require?
const requirePath = (fileName: string) => require(`../audio/${fileName}`)

const getAudioContext = () => {
  const audioContent = new GoodAudioContext()
  // const audioContent = new window.AudioContext()
  return audioContent
}

// my custom polyfill for audio-loader lib
// custom implementation of audio-loader (it stopped working after updating nodejs version)
// https://apiko.com/blog/how-to-work-with-sound-java-script/
const load = async (soundName: string, url: string) => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  })
  return [soundName, response.data]
}

// --------------
//   load audios
// --------------
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

let buffersByName: Record<string, ArrayBuffer> = {}

/**
 * unpure async fn that load data from server
 * http://jake-loves-space.svehlik.eu/
 */
export const initSounds = async () => {
  // load audio file from server
  const audioBuffers = await Promise.all(
    audioSources.map(audioSrc => load(audioSrc.split('.')[0], requirePath(audioSrc)))
  )

  // write to global object
  buffersByName = Object.fromEntries(audioBuffers)
}

// --------------
// control audios
// --------------

export type PlayAudioConf = { loop?: boolean; volume?: number }
export const playAudio = async (
  name: string,
  conf: PlayAudioConf = {}
): Promise<AudioBufferSourceNode> => {
  // TODO: does not support mobile sounds at the moment
  if (isMobile) {
    // @ts-ignore
    return
  }
  // TODO: control output volume somehow
  // create audio context
  const audioContext = getAudioContext()
  // create audioBuffer (decode audio file)
  // copy buffers: https://stackoverflow.com/questions/10100798/whats-the-most-straightforward-way-to-copy-an-arraybuffer-object
  // const audioBuffer = await audioContext.decodeAudioData(buffersByName[name])
  const audioBuffer = await audioContext.decodeAudioData(buffersByName[name].slice(0))
  // create audio source
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  if (conf.loop) {
    source.loop = true
  }
  // play audio
  // TODO: there is too long time till the sound is started (from collision)
  source.start()
  // wtf api
  // todo: figure it how to make some normal consistent api for work with sound and better performance without libraries
  // prefer to find some lib for handling that sounds
  return source
}

export const pauseSound = (audioBufferInstance: AudioBufferSourceNode) => {
  // todo: does not support mobile sounds at the moment
  if (isMobile) {
    return
  }
  audioBufferInstance.stop()
}
