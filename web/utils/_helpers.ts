export const secondsToMinutesSeconds = (time: number) => {
    return Math.floor(time / 60) + ":" + (time % 60 ? Math.round(time % 60) : '00')
}