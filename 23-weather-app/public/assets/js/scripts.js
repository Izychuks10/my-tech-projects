class WeatherApp {
    static CONTROL_CLASSES = {
        btnLocation: "show_weather-js",
        inputLocation: "location-js",
        dataWeather: "wwa_data-js",
    };

    static TARGET_DATA = {
        name: "target-data",
        data: {
            location: "location",
            datetime: "datetime",
            daynight: "daynight",
            temperature: "temperature",
            rainly: "rainly",
            snowfall: "snowfall",
            winddirection: "wind",
            windspeed: "windspeed",
        },
    };

    constructor() {
        this.controls = WeatherApp.CONTROL_CLASSES;
        this.targetData = WeatherApp.TARGET_DATA;

        this.btnLocation = document.getElementById(this.controls.btnLocation);
        this.inputLocation = document.getElementById(this.controls.inputLocation);

        this.dataWeather = {
            location: null,
            datetime: null,
            daynight: null,
            temperature: null,
            rainly: null,
            snowfall: null,
            winddirection: null,
            windspeed: null,
        };
        // this.dataCollect = [];

        this.init();
    }

    init() {
        this.btnLocation.addEventListener("click", (event) => {
            this.getGeocoding({ cityname: this.inputLocation.value });
        });
    }

    renderDataWeather() {
        // get all element need to fill data
        const dataClass = document.querySelectorAll(`.${this.controls.dataWeather}`);
        dataClass.forEach((item) => {
            // get data target
            let target = item.getAttribute(this.targetData.name);
            if (target == this.targetData.data.daynight) {
                item.innerHTML = "";
                let imgIcon = document.createElement("img");
                imgIcon.src = "assets/images/" + `${this.dataWeather.daynight == 0 ? "night.svg" : "day.svg"}`;
                item.appendChild(imgIcon);
            } else if (target == this.targetData.data.datetime) {
                let date = new Date(this.dataWeather.datetime);

                // option format date time
                const optionDateformat = {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                };
                const dateFormat = new Intl.DateTimeFormat("vn-VN", optionDateformat);

                item.innerHTML = "";
                item.innerHTML = `${dateFormat.format(date)} ${date.getHours >= 12 ? "PM" : "AM"}`;
            } else {
                // fill data to element
                item.innerHTML = this.dataWeather[target];
            }
        });
    }

    getGeocoding({ cityname }) {
        const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityname}&count=1&language=en&format=json`;

        this.fetchData({ url: apiUrl }).then((res) => {
            this.dataWeather.location = res.data.results[0].name;
            this.getWeather({ latitude: res.data.results[0].latitude, longitude: res.data.results[0].longitude });
        });
    }
    getWeather({ latitude, longitude, options = null }) {
        const apiMain = "https://api.open-meteo.com/v1/forecast";
        const timeZone = "GMT";
        const currentWeather = "temperature_2m,is_day,rain,showers,snowfall,wind_speed_10m,wind_direction_10m";

        const apiUrl = `${apiMain}?latitude=${latitude}&longitude=${longitude}&current=${currentWeather}&timezone=${timeZone}`;

        this.fetchData({ url: apiUrl })
            .then((results) => {
                // first idea create an array and use loop, but after I think use object is good choice
                // this.dataCollect.push(
                //     ...[
                //         { datetime: results.data.current.time },
                //         { daynight: results.data.current.is_day },
                //         {
                //             temperature:
                //                 results.data.current.temperature_2m + results.data.current_units.temperature_2m,
                //         },
                //         { rain: results.data.current.rain + results.data.current_units.rain },
                //         { snowfall: results.data.current.snowfall + results.data.current_units.snowfall },
                //     ]
                // );

                // setup data to object
                this.dataWeather.datetime = results.data.current.time;
                this.dataWeather.daynight = results.data.current.is_day;
                this.dataWeather.temperature =
                    results.data.current.temperature_2m + results.data.current_units.temperature_2m;
                this.dataWeather.rainly = results.data.current.rain + results.data.current_units.rain;
                this.dataWeather.snowfall = results.data.current.snowfall + results.data.current_units.snowfall;
                this.dataWeather.winddirection =
                    results.data.current.wind_direction_10m + results.data.current_units.wind_direction_10m;
                this.dataWeather.windspeed =
                    results.data.current.wind_speed_10m + results.data.current_units.wind_speed_10m;

                // console.log(results);
                // console.log(results.data.current);
                // console.log(results.data.current_units);
            })
            .then(() => {
                // fill data
                this.renderDataWeather();
            });
    }

    async fetchData({ url }) {
        let results = {
            data: null,
            isError: { status: false, error: null },
        };

        try {
            const response = await fetch(url);
            const dataFetch = await response.json();
            results.data = dataFetch;
        } catch (error) {
            results.isError.status = true;
            results.isError.error = error;
        }
        return results;
    }
}
const weatherApp = new WeatherApp();
