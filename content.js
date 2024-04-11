let alertTimesPlayed = [];

function playAlertSound(soundFile, volume = 0.5) {
    const alarmSound = new Audio(chrome.runtime.getURL("audio/" + soundFile));
    alarmSound.volume = volume;
    alarmSound.play();
}

function checkTimer() {
    const timerElement = document.querySelector('.clock-bottom .clock-time-monospace[data-cy="clock-time"]');
    if (timerElement) {
        let timeText = timerElement.textContent.trim();

        let [minutes, seconds] = timeText.split(/[:.]/).map(Number);
        const totalSeconds = minutes * 60 + seconds;
        console.log(`Adjusted Current Time: ${totalSeconds} seconds`);

        chrome.storage.local.get(['alertTimes'], function(result) {
            const alertTimes = result.alertTimes || [];
            console.log('Alert Times from Storage:', alertTimes);

            alertTimes.forEach(({ time, sound, volume }) => {
                console.log(`Checking Alert Time: ${time} seconds`);
                if (totalSeconds === time && !alertTimesPlayed.includes(time)) {
                    console.log(`Playing Sound: ${sound} for Time: ${time} seconds at Volume: ${volume}`);
                    playAlertSound(sound, volume);
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
