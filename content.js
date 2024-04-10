let alertTimesPlayed = [];  

function playAlertSound(soundFile) {
    const alarmSound = new Audio(chrome.runtime.getURL('audio/' + soundFile));
    alarmSound.play();
}

function checkTimer() {
    const timerElement = document.querySelector('.clock-bottom .clock-time-monospace[data-cy="clock-time"]');
    if (timerElement) {
        const timeText = timerElement.textContent.trim();
        const [minutes, seconds] = timeText.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;

        chrome.storage.local.get(['alertTimes'], function(result) {
            const alertTimes = result.alertTimes || [];
            alertTimes.forEach(({ time, sound }) => {
                if (totalSeconds === time && !alertTimesPlayed.includes(time)) {
                    playAlertSound(sound);
                    alertTimesPlayed.push(time); 
                } else if (totalSeconds !== time && alertTimesPlayed.includes(time)) {
                    const index = alertTimesPlayed.indexOf(time);
                    alertTimesPlayed.splice(index, 1);  
                }
            });
        });
    }
}

setInterval(checkTimer, 1000);
