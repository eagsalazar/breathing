const say = require('say')
const player = require('play-sound')

const totalDuration = 5 * 60 * 1000
const stepBasis = 6000
const inhaleDuration = stepBasis
const holdInhaleDuration = stepBasis / 2
const exhaleDuration = stepBasis * 1.6
const holdExhaleDuration = stepBasis / 2
const cycleDuration =
  inhaleDuration + holdInhaleDuration + exhaleDuration + holdExhaleDuration

const inhaleMsgs = ['Inhale deeply.', 'Inhale, fill your belly.']
const holdInhaleMsgs = ['Hold']
const exhaleMsgs = [
  'Exhale fully, through pursed lips.',
  'Exhale fully, constricting your diaphragm',
  'Exhale, flatten tongue along the roof of your mouth',
]
const holdExhaleMsgs = ['Hold']

const speakSync = (text: string) => {
  return new Promise<void>((resolve, reject) => {
    say.speak(text, undefined, 1.0, () => {
      resolve()
    })
  })
}

const sleep = async (milliseconds: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds))
}

let music = player()
let audio: any
const playBackgroundMusic = () => {
  audio = music.play('./relaxing-music.mp3', (err: any) => {
    if (!err) {
      playBackgroundMusic()
    }
  })
}

const main = async () => {
  await speakSync('Welcome to your guided breathing exercise.')

  playBackgroundMusic()
  await sleep(5000)

  for (
    let iteration = 0;
    iteration < totalDuration / cycleDuration;
    iteration++
  ) {
    say.speak(inhaleMsgs[iteration % inhaleMsgs.length])
    await sleep(inhaleDuration)

    say.speak(holdInhaleMsgs[iteration % holdInhaleMsgs.length])
    await sleep(holdInhaleDuration)

    say.speak(exhaleMsgs[iteration % exhaleMsgs.length])
    await sleep(exhaleDuration)

    say.speak(holdExhaleMsgs[iteration % holdExhaleMsgs.length])
    await sleep(holdExhaleDuration)
  }

  await speakSync(
    'Your breathing exercise is complete.  Return to relaxed, natural breathing.'
  )
  await sleep(5000)
  audio.kill()
  process.exit(0)
}

main()
