export const secondsToMinutesSeconds = (time: number) => {
  let min = Math.floor(time / 60).toString()
  let sec = Math.round(time % 60)
  let secStr
  if (sec < 10) {
    secStr = '0' + sec.toString()
  } else {
    secStr = sec.toString()
  }
  return min + ':' + secStr
}
