document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    function createCalendar(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add blank days for the previous month
        for (let i = 0; i < firstDay; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            calendarEl.appendChild(dayEl);
        }

        // Add days of the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            dayEl.textContent = i;
            calendarEl.appendChild(dayEl);
        }
    }

    function markReservedDates(reservedDates) {
        const dayElements = document.querySelectorAll('.day');

        reservedDates.forEach(date => {
            const day = new Date(date).getDate();
            dayElements.forEach(dayEl => {
                if (parseInt(dayEl.textContent) === day) {
                    dayEl.classList.add('reserved');
                }
            });
        });
    }

    // Initialize the calendar
    createCalendar(year, month);

    // Fetch and parse iCal data
    fetch('https://www.lodgify.com/4af39afd-1f59-45f8-a3f8-86b592574c73.ics')
        .then(response => response.text())
        .then(data => {
            const jcalData = ICAL.parse(data);
            const comp = new ICAL.Component(jcalData);
            const events = comp.getAllSubcomponents('vevent');
            const reservedDates = events.map(event => event.getFirstPropertyValue('dtstart').toJSDate());

            markReservedDates(reservedDates);
        });
});
