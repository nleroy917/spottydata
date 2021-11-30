export interface Segment {
    start: number;
    duration: number;
    confidence: number;
    loudness_start: number;
    loudness_max: number;
    loudness_max_time: number;
    loudness_end: number;
    pitches: number[];
    timbre: number[];
}

export const findNearestSegment = (progress: number | null, segments: Segment[] | undefined) => {
    if(progress !== null && segments !== undefined) {
        // convert progress to seconds
        progress = progress / 1000
        var closest = segments[0]

        for (var i = 1; i < segments.length; i++) {

          // does date[i] match the requirement better than best_item?
          if (Math.abs (closest.start - progress) > Math.abs (segments[i].start - progress)) {

            // it does ... so update best_item
            closest = segments[i];
          }
        }

        return closest
    }
}