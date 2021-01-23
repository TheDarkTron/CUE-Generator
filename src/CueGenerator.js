let songList = [];
let timer = new Timer(null, null);

// Load local storage
if (Array.isArray(JSON.parse(localStorage.getItem('songList')))) {
    songList = JSON.parse(localStorage.getItem('songList'));
    songList.forEach(song => addSongHtml(song.time, song.performer, song.title));

    let start = JSON.parse(localStorage.getItem('start'));
    if (start !== null) {
        start = moment(start);
    }
    let pauseTime = JSON.parse(localStorage.getItem('pauseTime'));
    if (pauseTime !== null) {
        pauseTime = moment(pauseTime)
    }
    timer = new Timer(start, pauseTime);
}

setInterval(function () {
    document.getElementById("timerDisplay").innerHTML = timer.getTime();
}, 333);

function addSong() {
    startTimer();

    // add html
    let time = document.getElementById('timerDisplay').textContent;
    let songPerformer = document.getElementById('songperformer').value;
    let songTitle = document.getElementById('songtitle').value;
    addSongHtml(time, songPerformer, songTitle);

    clearSongFields();

    // add song to list
    songList.push({
        time: time,
        performer: songPerformer,
        title: songTitle,
    });

    // store list in local storage
    localStorage.setItem('songList', JSON.stringify(songList));
}

function addSongHtml(time, performer, title) {
    let song = document.createElement('li');
    song.classList.add('list-group-item');
    song.innerText = time + " " + performer + " - " + title;

    let songListHtml = document.getElementById('songlist')
    songListHtml.insertBefore(song, songListHtml.firstChild);
}

function clearSongFields() {
    document.getElementById('songtitle').value = "";
    document.getElementById('songperformer').value = "";
    document.getElementById('songperformer').focus();
}

function download() {
    let cueFile = generateCueFile();

    let fileName = document.getElementById('setFile').value;
    downloadFile(cueFile, fileName);
}

function generateCueFile() {
    let result = "";

    let setPerformer = document.getElementById('setPerformer').value;
    let setTitle = document.getElementById('setTitle').value;
    let setFile = document.getElementById('setFile').value;

    result += generateSetHeader(setPerformer, setTitle, setFile);

    for (let i = 0; i < songList.length; i++) {
        let trackNumber = pad(i + 1, 2);
        result += "\tTRACK " + trackNumber + " AUDIO\n";

        result += "\t\tTITLE \"" + songList[i].title + "\"\n";
        result += "\t\tPERFORMER \"" + songList[i].performer + "\"\n";
        result += "\t\tINDEX 01 " + songList[i].time + "\n";
    }

    return result;
}

function generateSetHeader(setPerformer, setTitle, setFile) {
    return "REM created with DJ Rex CUE Generator\n"
        + "PERFORMER \"" + setPerformer + "\"\n"
        + "TITLE \"" + setTitle + "\"\n"
        + "FILE \"" + setFile + "\" " + getFileFormat(setFile) + "\n";
}

function getFileFormat(fileName) {
    let type = fileName.split(".").reverse()[0].toLowerCase();
    switch (type) {
        case "wav":
            return "WAVE";
        case "mp3":
            return "MP3";
        case "aiff":
            return "AIFF";
        case "flac":
            return "WAVE";
        case "wv":
            return "WAVE";
        default:
            return "MP3";
    }
}

// create tmp download link, click it and remove it
function downloadFile(fileContent, fileName) {
    let dlLink = document.createElement('a');
    dlLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
    dlLink.setAttribute('download', fileName + ".cue");

    dlLink.style.display = 'none';
    document.body.appendChild(dlLink);

    dlLink.click();

    document.body.removeChild(dlLink);
}

function startTimer() {
    timer.play();
    saveTimer();
}

function pauseTimer() {
    timer.pause();
    saveTimer();
}

function stopTimer() {
    timer.stop();
    saveTimer();
}

function saveTimer() {
    localStorage.setItem('start', JSON.stringify(timer.start));
    localStorage.setItem('pauseTime', JSON.stringify(timer.pauseTime));
}

function clearList() {
    if (confirm('Clear the song list?')) {
        // clear song list
        localStorage.setItem('songList', JSON.stringify([]));
        document.getElementById('songlist').innerHTML = "";
    }
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
