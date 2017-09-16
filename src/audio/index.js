
export const audioSources = [
  'fastDrum.wav',
  'fastZero.wav',
  'scream.mp3',
  'growl.mp3',
  'patAndMat.wav',
  'omg.wav',
  'slza.wav',
  'blue.wav'
]
// create a one-time event
function onetime(node, type, callback) {

  // create event
  node.addEventListener(type, function(e) {
    // remove event
    e.target.removeEventListener(e.type, () => {});
    // call handler
    return callback(e);
  });

}

export const audioNames = audioSources.map(item => item.split('.')[0])

export const sounds = audioSources.reduce((pre, audioNameExt) => {
  const audioName = audioNameExt.split('.')[0]
  const filePath = require(`../audio/${audioNameExt}`)
  pre[audioName] = new Audio(filePath)
  // console.time(audioName)

  onetime(pre[audioName], 'canplaythrough', () => {
    // console.log('už je po všem')
    // console.timeEnd(audioName)
  })
  /*
  pre[audioName].addEventListener('canplaythrough', function(e){
    console.log('už se to načetlo')
    // use event listener only 1 times
    // https://www.sitepoint.com/create-one-time-events-javascript/
    console.log(e)
    console.log(arguments)
    e.target.removeEventListener(e.type)
  })
  */
  return pre
}, {})