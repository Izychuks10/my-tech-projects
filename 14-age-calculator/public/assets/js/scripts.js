class CalendarInitial {
    static CALENDAR_DAYS_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    static CALENDAR_CLASSLIST = {
        rowClasslist: "grid grid-7",
        currentDay: "calendar__current-day",
        expternalDays: "calendar__external-days",
    };
    static CALENDAR_CONTROLS = {
        calendarDays: "calendar__days-js",
        calendarTitle: "calendar__title-js",
        calendarDaysWeek: "calendar__days-name-js",
        prevnextBtn: ".calendar__btn-js",
        resultCalculator: "result__age-js",
        datepickerInput: "datepicker__input-js",
    };

    constructor() {
        this.today = new Date(1970); // get today
        this.currentMonth = this.today.getMonth(); // get month as a number (0-11)
        this.currentYear = this.today.getFullYear(); // get full year number (yyyy)

        this.datepicker = document.getElementById(CalendarInitial.CALENDAR_CONTROLS.datepickerInput);

        // call intial
        this.initCalendar(this.currentMonth, this.currentYear);
        // call controls
        this.calendarControls();
    }

    // initial calendar for the first time
    initCalendar(month, year) {
        this.setCalendarTitle(month, year);
        this.setDaysNameWeek();
        this.fillCalendarDays(month, year);
    }

    // setup calendar control buttons
    calendarControls() {
        // get prev and next element buttons
        const prevNextBtn = document.querySelectorAll(CalendarInitial.CALENDAR_CONTROLS.prevnextBtn);
        prevNextBtn.forEach((item) => {
            // add event click for buttons
            item.addEventListener("click", () => {
                // check data value is prev or next and reset current month
                // let value = item.getAttribute("data-value");
                this.currentMonth =
                    item.getAttribute("data-value") === "prev" ? this.currentMonth - 1 : this.currentMonth + 1;

                // arrange months from 0-11
                if (this.currentMonth < 0 || this.currentMonth > 11) {
                    // set update new current day, current month and current year for re-render calendar
                    this.today = new Date(this.currentYear, this.currentMonth, new Date().getDate()); // get new date
                    this.currentMonth = this.today.getMonth(); // get new month
                    this.currentYear = this.today.getFullYear(); // get new year
                } else {
                    this.today = new Date();
                }
                this.fillCalendarDays(this.currentMonth, this.currentYear); // re-render calendar
                this.setCalendarTitle(this.currentMonth, this.currentYear); // reset title calendar
            });
        });

        this.datepicker.addEventListener("change", (event) => {
            this.today = new Date(event.target.value);
            this.currentMonth = this.today.getMonth();
            this.currentYear = this.today.getFullYear();
            this.calculateAge(this.today.getDate());
        });
    }

    // fill days of the current month
    fillCalendarDays(month, year) {
        const daysWeek = CalendarInitial.CALENDAR_DAYS_WEEK;

        /**
         * getDate() => return day as a number (1-31)
         * Specifying a day or a month higher than max, will not result in an error but add the overflow to the next day or month
         * So in statement above, I pass `0` to `day` and set next month ~ `currentMonth + 1` => get the last day of current month
         * See more explain clearly at here: https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
         */
        // get the day week of first day of the month (0-6 ~ day name)
        let firstDayWeek = new Date(year, month).getDay();
        // get the last day of the month or total days of the month
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        // get the day week of the last day of the month
        // let lastDayWeek = new Date(this.currentYear, this.currentMonth, daysInMonth).getDay();

        // get the last date of the previous month
        let lastDateofPrevMonth = new Date(year, month, 0).getDate();
        /**
         * At this point, must minus for 1 `-1` at parameter month. In my research,
         * I have read at w3school: "Specifying a day or a month higher than max, will not result in an error but add the overflow to the next day or month"
         * so if added out of range max its will add the overflow to the next or prev day and month
         * if added `0` => will back to previous day of month and if added higher than max [1-31] it will overflow the day of next month
         */
        // get day of week of last date of the previous month
        let dayOfLastDatePrevMonth = new Date(year, month - 1, lastDateofPrevMonth).getDay();

        // begin generate calendar
        let calendarDays = document.getElementById(CalendarInitial.CALENDAR_CONTROLS.calendarDays);
        calendarDays.innerHTML = "";

        let date = 1;
        let dateNextMonth = 1; // use for render days next month
        // loop create week
        for (let i = 0; i < 6; i++) {
            // initial week
            let rowWeek = this.createWeekNode();

            // loop add date into week
            for (let j = 0; j < daysWeek.length; j++) {
                if (i === 0 && j < firstDayWeek) {
                    // add days of previous month
                    // let cellDay = this.createDayNode("prev"); // test for add days of previous month
                    let cellDay = this.createDayNode(lastDateofPrevMonth - dayOfLastDatePrevMonth + j);
                    cellDay.classList.add(CalendarInitial.CALENDAR_CLASSLIST.expternalDays);
                    // add days to week
                    rowWeek.appendChild(cellDay);
                } else if (date > daysInMonth) {
                    // add days of next month
                    // let cellDay = this.createDayNode("next"); // test for add days of next month
                    let cellDay = this.createDayNode(dateNextMonth); // render days next month when out of date in current month
                    dateNextMonth++;
                    cellDay.classList.add(CalendarInitial.CALENDAR_CLASSLIST.expternalDays);
                    // add days to week
                    rowWeek.appendChild(cellDay);
                } else {
                    // add days current month
                    let cellDay = this.createDayNode(date);

                    // set active class current day
                    date === this.today.getDate() &&
                    this.currentMonth === new Date().getMonth() &&
                    this.currentYear === new Date().getFullYear()
                        ? cellDay.classList.add(CalendarInitial.CALENDAR_CLASSLIST.currentDay)
                        : "";

                    // add days to week
                    rowWeek.appendChild(cellDay);
                    date++;
                }
            }

            // add weeks to calendar
            calendarDays.appendChild(rowWeek);
        }
    }

    // calculate age
    calculateAge(date) {
        const result = document.getElementById(CalendarInitial.CALENDAR_CONTROLS.resultCalculator);

        let birthDate = new Date(this.currentYear, this.currentMonth, date);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        result.innerHTML = `${age} years and ${month} months old`;

        // console.log(`Age: ${age}`);
        // console.log(`Month: ${month}`);
    }

    // set input date
    setInputDateSelected(date) {
        let selectedDate = new Date(this.currentYear, this.currentMonth, date).toLocaleDateString();

        this.datepicker.value = selectedDate;
        console.log(selectedDate);
    }

    // set calendar title
    setCalendarTitle(month, year) {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        let title = document.getElementById(CalendarInitial.CALENDAR_CONTROLS.calendarTitle);
        return (title.innerHTML = `${months[month]} ${year}`);
    }
    // set days name of week
    setDaysNameWeek() {
        const daysWeek = CalendarInitial.CALENDAR_DAYS_WEEK;
        let calendarDaysWeek = document.getElementById(CalendarInitial.CALENDAR_CONTROLS.calendarDaysWeek);
        daysWeek.forEach((item) => {
            let spanEle = document.createElement("span");
            let textNode = document.createTextNode(item);
            spanEle.appendChild(textNode);
            calendarDaysWeek.appendChild(spanEle);
        });
        return calendarDaysWeek;
    }
    // intial week node element
    createWeekNode() {
        let divEle = document.createElement("div");
        divEle.className = CalendarInitial.CALENDAR_CLASSLIST.rowClasslist;
        return divEle;
    }
    //intial day node element
    createDayNode(date) {
        let spanEle = document.createElement("span");
        let textNode = document.createTextNode(date);
        spanEle.appendChild(textNode);

        spanEle.addEventListener("click", (event) => {
            this.setInputDateSelected(event.target.textContent);
            this.calculateAge(event.target.textContent);
        });

        return spanEle;
    }
}

const calendarInit = new CalendarInitial();
