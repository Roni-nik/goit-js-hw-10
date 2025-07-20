import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
 import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector(`[data-start]`);
const input = document.querySelector(`#datetime-picker`);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = days; 
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}



let userSelectedDate = null;

startBtn.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
         const now = new Date();
          if (userSelectedDate <= now) {
      iziToast.error({
    title: 'Error',
    message: 'Please choose a date in the future',
    position: 'topRight',
    timeout: 3000,
  });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr(input, options);
         


startBtn.addEventListener("click", timeStart);
function timeStart() {
      startBtn.disabled = true;
    input.disabled = true;
    
    const interval = setInterval(() => {
    const delta = userSelectedDate - Date.now();

        if (delta <= 0) {
                  clearInterval(interval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      startBtn.disabled = true;
      return;
    }
    const time = convertMs(delta);
    updateTimerDisplay(time);
  }, 1000);
}



function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

