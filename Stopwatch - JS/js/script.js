var body = document.querySelector('body');
var ms = 0;
var sec = 0;
var min = 0;
var h = 0;
var delay = 0;
var start = 0;

var TimerHTML = {
    createWrapper () {
        var wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        wrapper.style.margin = '0 auto';
        wrapper.style.width = '200px';
        document.body.appendChild(wrapper);
    },

    createBoard () {
        wrapper = body.querySelector('.wrapper');
        var board = document.createElement('div');
        board.style.marginBottom = '10px';
        board.innerHTML = '00 : 00 : 00 : 000';
        board.id = 'board';
        board.classList.add('center-block', 'bg-info', 'text-center');
        wrapper.appendChild(board);
    },

     createStartBtn () {
        wrapper = body.querySelector('.wrapper');
        var StartBtn = document.createElement('a');
        StartBtn.innerHTML = 'Start';
        StartBtn.id = 'StartBtn';
        StartBtn.classList.add('col-md-5', 'btn', 'btn-success');
        wrapper.appendChild(StartBtn);
        StartBtn.addEventListener("click", timerStart);

    },

     createClearBtn () {
        wrapper = body.querySelector('.wrapper');
        var ClearBtn = document.createElement('a');
        ClearBtn.innerHTML = 'Clear';
        ClearBtn.id = 'ClearBtn';
        ClearBtn.classList.add('col-md-5', 'btn', 'btn-danger', 'pull-right');
        wrapper.appendChild(ClearBtn);
        ClearBtn.addEventListener("click", timerClear);
    },
};

TimerHTML.createWrapper();
TimerHTML.createBoard();
TimerHTML.createStartBtn();
TimerHTML.createClearBtn();

function addZeros(n, needLength) {

  needLength = needLength || 2;
  n = String(n);
  while (n.length < needLength) {
    n = "0" + n;
  }
  return n;
}

function timerStart() {

    this.classList.remove('btn-success');
    this.classList.add('btn-primary');
    this.innerHTML = 'Pause';
    StartBtn.removeEventListener("click", timerStart);
    StartBtn.addEventListener("click", timerPause);

    var board = document.getElementById('board');

    if (delay) {
        start = start + Date.now() - delay;
    } else {
        start = Date.now();
    }

    timerId = setInterval(function() {

        ms = Date.now() - start;
        sec = ms / 1000 ^ 0;
        min = sec / 60 ^ 0;
        h = min / 60 ^ 0;

        board.innerHTML = addZeros(h % 60) + ' : ' + addZeros(min % 60) + ' : ' + addZeros(sec % 60) + ' : ' + addZeros(ms % 1000, 3);

    }, 1);
}

function timerPause() {
    var StartBtn = document.getElementById('StartBtn');
    StartBtn.classList.remove('btn-primary');
    StartBtn.classList.add('btn-success');
    StartBtn.innerHTML = 'Continue';

    StartBtn.removeEventListener("click", timerPause);
    StartBtn.addEventListener("click", timerStart);

    delay = Date.now();

    clearInterval(timerId);
}

function timerClear() {
    var StartBtn = document.getElementById('StartBtn');
    StartBtn.classList.remove('btn-primary');
    StartBtn.classList.add('btn-success');
    StartBtn.innerHTML = 'Start';

    var board = document.getElementById('board');
    board.innerHTML = '00 : 00 : 00 : 000';
    ms = 0;
    sec = 0;
    min = 0;
    h = 0;

    StartBtn.removeEventListener("click", timerPause);
    StartBtn.addEventListener("click", timerStart);

    delay = 0;

    clearInterval(timerId);
}
