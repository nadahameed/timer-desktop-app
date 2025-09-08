let timerInterval;
let remainingSeconds = 0;
let running = false;

const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const swapBtn = document.getElementById('swap');

const alarm1 = document.getElementById('song1');
const alarm2 = document.getElementById('song2');
const alarm3 = document.getElementById('song3');
const clickSound = document.getElementById('clickSound');
const typeSound = document.getElementById('typeSound');

let currentTheme = 'red';
let currentAlarm = alarm1;

const themes = {
    red: {
        bodyBg: '#991010',
        containerBg: '#FFD7D1',
        titleColor: '#882121',
        timeColor: '#CA0F0F',
        alarm: alarm1,
        buttonBg: '#FFF1EF',
        buttonHover: '#FB9383',
        buttonText: '#882121',
        swapText: "#CA0F0F"
    },
    purple: {
        bodyBg: '#4033B4',
        containerBg: '#E0C7FF',
        titleColor: '#26096F',
        timeColor: '#1903E1',
        alarm: alarm2,
        buttonBg: '#F4EFFF',
        buttonHover: '#9F71F5',
        buttonText: '#26096F',
        swapText: "#1903E1"
    },
    teal: {
        bodyBg: '#188994',
        containerBg: '#B2F7F7',
        titleColor: '#004C4C',
        timeColor: '#00C0D1',
        alarm: alarm3,
        buttonBg: '#E0FFFF',
        buttonHover: '#44DDEB',
        buttonText: '#004C4C',
        swapText: '#00C0D1'
    }
};

const themeOrder = ['red', 'purple', 'teal'];

function applyTheme(themeName) {
    const theme = themes[themeName];
    document.body.style.backgroundColor = theme.bodyBg;
    document.querySelector('.container').style.backgroundColor = theme.containerBg;
    document.querySelector('.title').style.color = theme.titleColor;
    timeEl.style.color = theme.timeColor;

    currentAlarm.pause();
    currentAlarm.currentTime = 0;
    currentAlarm = theme.alarm;

    [startBtn, pauseBtn, resetBtn].forEach(btn => {
        btn.style.backgroundColor = theme.buttonBg;
        btn.style.color = theme.buttonText;

        btn.onmouseover = () => btn.style.backgroundColor = theme.buttonHover;
        btn.onmouseout = () => btn.style.backgroundColor = theme.buttonBg;
    });

    swapBtn.style.color = theme.swapText;
}

swapBtn.addEventListener('click', () => {
    const currentIndex = themeOrder.indexOf(currentTheme);
    currentTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    applyTheme(currentTheme);

    // play click sound
    clickSound.currentTime = 0;
    clickSound.play();
});

applyTheme(currentTheme);

let inputDigits = [0,0,0,0,0,0];

function formatDigitsToTime(digits) {
    const hrs = digits.slice(0,2).join('');
    const mins = digits.slice(2,4).join('');
    const secs = digits.slice(4,6).join('');
    return `${hrs}:${mins}:${secs}`;
}

function updateDisplay() {
    timeEl.textContent = formatDigitsToTime(inputDigits);
}

function digitsToSeconds(digits) {
    const hrs = parseInt(digits.slice(0,2).join('')) || 0;
    const mins = parseInt(digits.slice(2,4).join('')) || 0;
    const secs = parseInt(digits.slice(4,6).join('')) || 0;
    return hrs*3600 + mins*60 + secs;
}

document.addEventListener('keydown', (e) => {
    if (running) return;

    if (e.key >= '0' && e.key <= '9') {
        inputDigits.shift();
        inputDigits.push(parseInt(e.key));
        updateDisplay();

        typeSound.currentTime = 0;
        typeSound.play();
    } else if (e.key === 'Backspace') {
        inputDigits.pop();
        inputDigits.unshift(0);
        updateDisplay();

        typeSound.currentTime = 0;
        typeSound.play();
    }
});

startBtn.addEventListener('click', () => {
    if (!running) {
        remainingSeconds = digitsToSeconds(inputDigits);
        if (remainingSeconds > 0) {
            running = true;
            timerInterval = setInterval(() => {
                if (remainingSeconds > 0) {
                    remainingSeconds--;
                    const hrs = Math.floor(remainingSeconds / 3600);
                    const mins = Math.floor((remainingSeconds % 3600) / 60);
                    const secs = remainingSeconds % 60;
                    inputDigits = [
                        Math.floor(hrs/10), hrs%10,
                        Math.floor(mins/10), mins%10,
                        Math.floor(secs/10), secs%10
                    ];
                    updateDisplay();
                } else {
                    clearInterval(timerInterval);
                    running = false;
                    currentAlarm.currentTime = 0;
                    currentAlarm.play();
                }
            }, 1000);
        }
    }
});

pauseBtn.addEventListener('click', () => {
    running = false;
    clearInterval(timerInterval);
});

resetBtn.addEventListener('click', () => {
    running = false;
    clearInterval(timerInterval);
    inputDigits = [0,0,0,0,0,0];
    remainingSeconds = 0;
    updateDisplay();
    currentAlarm.pause();
    currentAlarm.currentTime = 0;
});

[startBtn, pauseBtn, resetBtn].forEach(btn => {
    btn.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

updateDisplay();
