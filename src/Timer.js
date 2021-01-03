class Timer {
    constructor(start, pauseTime) {
        this.start = start;
        this.pauseTime = pauseTime;
    }

    play() {
        if (this.start === null) {
            this.start = moment();
        } else if (this.pauseTime !== null) {
            this.start = this.start.add(moment.duration(moment().diff(this.pauseTime)));
            this.pauseTime = null;
        }
    }

    pause() {
        if (this.start !== null && this.pauseTime === null) { // only pause if timer is running
            this.pauseTime = moment();
        }
    }

    stop() {
        this.start = null;
        this.pauseTime = null;
    }

    getDuration() {
        if (this.pauseTime !== null) { // timer is paused
            return moment.duration(this.pauseTime.diff(this.start));
        }

        if (this.start !== null) { // timer is running
            return moment.duration(moment().diff(this.start));
        }

        return moment.duration(0);
    }

    getTime() {
        let duration = this.getDuration();
        return pad(Math.floor(duration.asMinutes()), 3)
            + ":" + pad(duration.seconds(), 2)
            + ":" + pad(duration.milliseconds(), 3);
    }
}
