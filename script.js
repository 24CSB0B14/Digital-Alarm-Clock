function updateClock() {
    let now = new Date();
    
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let ampm = h >= 12 ? 'PM' : 'AM';
    
    h = h % 12;
    h = h ? h : 12; 
    
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    
    document.getElementById('clock').textContent = h + ':' + m + ':' + s + ' ' + ampm;
    document.getElementById('date').textContent = now.toDateString();
    
    checkAlarms();
}

let alarms = [];
let currentAlarm = null;

function setAlarm() {
    let alarmTime = document.getElementById('input-time').value;
    
    if (!alarmTime) {
        alert("Please select a time!");
        return;
    }
    
    alarms.push({
        time: alarmTime, id: Date.now()
    });
    
    showAlarms();
    document.getElementById('input-time').value = '';
}

function showAlarms() {
    let list = document.getElementById('alarm-list');
    list.innerHTML = '';
    
    if (alarms.length === 0) {
        list.innerHTML = '<p>No alarms set</p>';
        return;
    }
    
    alarms.forEach(alarm => {
        let alarmDiv = document.createElement('div');
        alarmDiv.className = 'alarm';
        alarmDiv.innerHTML = `
            <span>${alarm.time}</span>
            <button class="delete-btn" onclick="removeAlarm(${alarm.id})">Delete</button>
        `;
        list.appendChild(alarmDiv);
    });
}

function removeAlarm(id) {
    alarms = alarms.filter(alarm => alarm.id !== id);
    showAlarms();
}

function checkAlarms() {
    let now = new Date();
    let currentTime = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes());
    
    alarms.forEach(alarm => {
        if (alarm.time === currentTime && !currentAlarm) {
            currentAlarm = alarm.id;
            ringAlarm();
        }
    });
}

function ringAlarm() {
    let sound = document.getElementById('alarm-sound');
    sound.play();
    
    if (!confirm("ALARM! Click OK to stop.")) {
        sound.pause();
        sound.currentTime = 0;
        currentAlarm = null;
    }
}

let stopwatchInterval;
let stopwatchTime = 0;
let isStopwatchRunning = false;

function startStopwatch() {
    if (!isStopwatchRunning) {
        stopwatchInterval = setInterval(updateStopwatch, 1000);
        isStopwatchRunning = true;
    }
}

function pauseStopwatch() {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    updateStopwatchDisplay();
    isStopwatchRunning = false;
}

function updateStopwatch() {
    stopwatchTime++;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    let hours = Math.floor(stopwatchTime / 3600);
    let minutes = Math.floor((stopwatchTime % 3600) / 60);
    let seconds = stopwatchTime % 60;
    
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    document.getElementById('stopwatch').textContent = `${hours}:${minutes}:${seconds}`;
}

let timerInterval;
let timerTime = 0;
let isTimerRunning = false;

function startTimer() {
    if (!isTimerRunning) {
        let minutes = parseInt(document.getElementById('minutes').value) || 0;
        let seconds = parseInt(document.getElementById('seconds').value) || 0;
        
        timerTime = minutes * 60 + seconds;
        
        if (timerTime <= 0) {
            alert("Please set a valid time!");
            return;
        }
        
        updateTimerDisplay();
        timerInterval = setInterval(updateTimer, 1000);
        isTimerRunning = true;
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('minutes').value = 1;
    document.getElementById('seconds').value = 0;
    timerTime = 60;
    updateTimerDisplay();
    isTimerRunning = false;
}

function updateTimer() {
    timerTime--;
    updateTimerDisplay();
    
    if (timerTime <= 0) {
        clearInterval(timerInterval);
        alert("Time's up!");
        isTimerRunning = false;
    }
}

function updateTimerDisplay() {
    let minutes = Math.floor(timerTime / 60);
    let seconds = timerTime % 60;
    
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    document.getElementById('countdown').textContent = `${minutes}:${seconds}`;
}

function changeTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme', 'neon-theme');
    
    document.body.classList.add(theme + '-theme');
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.theme-btn.' + theme).classList.add('active');
}

function darkenColor(color, percent) {
    if (color.startsWith('#')) {
        return color; 
    }
    return `color-mix(in srgb, ${color}, black ${percent}%)`;
}

function lightenColor(color, percent) {
    if (color.startsWith('#')) {
        return color; 
    }
    return `color-mix(in srgb, ${color}, white ${percent}%)`;
}

setInterval(updateClock, 1000);
updateClock();
resetStopwatch();
resetTimer();
