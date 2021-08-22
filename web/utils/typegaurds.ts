export const playbackIsTrack = (playback: SpotifyApi.CurrentlyPlayingObject) => {
    if(playback.item === null) {
        return false
    }
    if('album' in playback.item) {
        return true
    }
    else {
        return false
    }
}