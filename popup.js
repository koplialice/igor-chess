document.addEventListener("DOMContentLoaded", function () {
  function createAlertTimeEntry(time = "", sound = "alarm.mp3", volume = 0.5) {
    const container = document.createElement("div");
    container.className = "alert-time-entry";

    container.innerHTML = `
            <input type="number" class="alert-time" min="0" placeholder="Time in seconds" value="${time}">
            <select class="alert-sound">
                <option value="alert1.mp3" ${
                  sound === "alert1.mp3" ? "selected" : ""
                }>Alert1</option>
                <option value="alert2.mp3" ${
                  sound === "alert2.mp3" ? "selected" : ""
                }>Alert2</option>
                <option value="alert3.mp3" ${
                  sound === "alert3.mp3" ? "selected" : ""
                }>Alert3</option>
                <option value="alert4.mp3" ${
                  sound === "alert4.mp3" ? "selected" : ""
                }>Alert4</option>
                <option value="alert5.mp3" ${
                  sound === "alert5.mp3" ? "selected" : ""
                }>Alert5</option>
                <option value="alice10.mp3" ${
                  sound === "alice10.mp3" ? "selected" : ""
                }>Alice 10</option>
                <option value="alice20.mp3" ${
                  sound === "alice20.mp3" ? "selected" : ""
                }>Alice 20</option>
                <option value="alice30.mp3" ${
                  sound === "alice30.mp3" ? "selected" : ""
                }>Alice 30</option>
            </select>
            <div class='volume-control'>
                <label>Volume: <span class='volume-display'>${Math.round(
                  volume * 100
                )}%</span></label>
                <input type='range' class='volume-slider' min='0' max='1' step='0.01' value='${volume}'>
            </div>
            <span class="remove-alert-time">Remove</span>
        `;

    container
      .querySelector(".volume-slider")
      .addEventListener("input", function (e) {
        const volumeDisplay = container.querySelector(".volume-display");
        const volumeValue = e.target.value;
        volumeDisplay.textContent = `${Math.round(volumeValue * 100)}%`;
      });

    container
      .querySelector(".remove-alert-time")
      .addEventListener("click", () => {
        container.remove();
      });

    document.getElementById("alert-times-container").appendChild(container);
  }

  chrome.storage.local.get(["alertTimes"], function (result) {
    const alertTimes = result.alertTimes || [];
    if (alertTimes.length === 0) {
      createAlertTimeEntry();
    } else {
      alertTimes.forEach(({ time, sound, volume }) =>
        createAlertTimeEntry(time, sound, volume)
      );
    }
  });

  document
    .getElementById("add-alert-time")
    .addEventListener("click", function () {
      createAlertTimeEntry();
    });

  document
    .getElementById("save-settings")
    .addEventListener("click", function () {
      const entries = Array.from(
        document.querySelectorAll(".alert-time-entry")
      );
      const alertTimes = entries.map((entry) => ({
        time: parseInt(entry.querySelector(".alert-time").value, 10),
        sound: entry.querySelector(".alert-sound").value,
        volume: parseFloat(entry.querySelector(".volume-slider").value),
      }));

      chrome.storage.local.set({ alertTimes }, function () {});
    });
});
