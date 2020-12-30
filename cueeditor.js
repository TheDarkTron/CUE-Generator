let songlist = [];
let start;
let timerRunning = false;
let timer;
let pauseTime;

if (Array.isArray(JSON.parse(localStorage.getItem('songList')))) {
  songlist = JSON.parse(localStorage.getItem('songList'));
  songlist.forEach(song => addSongHtml(song.time, song.performer, song.title));

  start = moment(JSON.parse(localStorage.getItem('start')));

  let duration = moment.duration(moment().diff(start));
  let time = pad(duration.hours(), 2) + ":" + pad(duration.minutes(), 2) + ":" + pad(duration.seconds(), 2);
  document.getElementById("timerDisplay").innerHTML = time;

  document.getElementById('starttimerbutton').textContent = 'Restart timer';

  timerRunning = true;
  pauseTimer();
}

function addSongHtml(time, performer, title) {
  let song = document.createElement('li');
  song.classList.add('list-group-item');
  song.innerText = time + " " + performer + " - " + title;

  let songlisthtml = document.getElementById('songlist')
  songlisthtml.insertBefore(song, songlisthtml.firstChild);
}

function addSong() {
  // add html
  let songtitle = document.getElementById('songtitle').value;
  let songperformer = document.getElementById('songperformer').value;
  let time = document.getElementById('timerDisplay').textContent;

  addSongHtml(time, songperformer, songtitle);

  // clear fields
  document.getElementById('songtitle').value = "";
  document.getElementById('songperformer').focus();
  document.getElementById('songperformer').value = "";

  // add song to list
  songlist.push({
    title: songtitle,
    performer: songperformer,
    time: time,
  });

  // store list in local storage
  localStorage.setItem('songList', JSON.stringify(songlist));
}

function download() {
  // build file in memory
  let result = "";

  let performer = document.getElementById('setPerformer').value;
  let title = document.getElementById('setTitle').value;
  let file = document.getElementById('setFile').value;

  result += "REM created with DJ Rex CUE Editor\n";
  result += "PERFORMER \"" + performer + "\"\n";
  result += "TITLE \"" + title + "\"\n";
  result += "FILE \"" + file + "\"\n";

  for (let i = 0; i < songlist.length; i++) {
    let tracknumber = pad(i, 2);
    result += "\tTRACK " + tracknumber + " AUDIO\n";

    result += "\t\tTITLE \"" + songlist[i].title + "\"\n";
    result += "\t\tPERFORMER \"" + songlist[i].performer + "\"\n";
    result += "\t\tINDEX 01 " + songlist[i].time + "\n";
  }

  // create tmp download link and click it, then remove it
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
  element.setAttribute('download', "cuesheet.cue");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function startTimer() {
  document.getElementById("timerDisplay").innerHTML = "00:00:00";
  start = moment();
  localStorage.setItem('start', JSON.stringify(start));

  clearInterval(timer);
  timer = setInterval(function() {
    let duration = moment.duration(moment().diff(start));
    let time = pad(duration.hours(), 2) + ":" + pad(duration.minutes(), 2) + ":" + pad(duration.seconds(), 2);
    document.getElementById("timerDisplay").innerHTML = time;
  }, 1000);

  document.getElementById('starttimerbutton').textContent = 'Restart timer';
  document.getElementById('pausetimerbutton').textContent = 'Pause timer';

  timerRunning = true;
}

function pauseTimer() {
  if (timerRunning) {
    pauseTime = moment();
    clearInterval(timer);

    document.getElementById('pausetimerbutton').textContent = 'Continue timer';
    timerRunning = false;
  } else {
    restartTimer();
  }
}

function restartTimer() {
  start.add(moment.duration(moment().diff(pauseTime)));

  localStorage.setItem('start', JSON.stringify(start));

  timer = setInterval(function() {
    let duration = moment.duration(moment().diff(start));
    let time = pad(duration.hours(), 2) + ":" + pad(duration.minutes(), 2) + ":" + pad(duration.seconds(), 2);
    document.getElementById("timerDisplay").innerHTML = time;
  }, 1000);

  document.getElementById('pausetimerbutton').textContent = 'Pause timer';
  timerRunning = true;
}

function clearList() {
  // clear song list
  localStorage.setItem('songList', JSON.stringify([]));
  document.getElementById('songlist').innerHTML = "";

  // clear timer
  clearInterval(timer);
  document.getElementById("timerDisplay").textContent = "00:00:00";

  timerRunning = false;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
