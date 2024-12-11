class DynamicForm {
    static ICON_SRC = "assets/images";

    constructor() {
        this.initCircularProgress();
        this.showPassword();
        this.comparePw();
    }

    initCircularProgress() {
        let circularProgress = document.querySelector(".progress--circular");
        let valueProgress = document.querySelector(".progress__value");
        let dotProgress = document.querySelector(".progress__dot");

        // get data from circular progress
        let circularStartColor = getComputedStyle(circularProgress).getPropertyValue("--bg-circular-start");
        let circularEndColor = getComputedStyle(circularProgress).getPropertyValue("--bg-circular-end");
        let radiusCircular = parseFloat(getComputedStyle(circularProgress).getPropertyValue("--radius-circular"));
        let circularEndvalue = circularProgress.getAttribute("data-value");
        let circularSpeed = circularProgress.getAttribute("data-speed");

        // setup option for interval progress
        let options = {
            startValue: 1, // initial for run progress
            endValue: circularEndvalue ? circularEndvalue : 100, // ending value progress
            speed: circularSpeed ? circularSpeed : 10, // speed running
        };

        // calculate position for dot progress animation
        let orbitDot = radiusCircular - (radiusCircular * (2 - 1.9)) / 3.9;
        console.log(orbitDot);

        let progress = setInterval(() => {
            options.startValue++;

            // interval text value
            valueProgress.textContent = `${options.startValue}%`;

            //interval circular progress
            circularProgress.style.background = `conic-gradient(${circularStartColor} ${
                (options.startValue * 360) / 100
            }deg, ${circularEndColor} 0deg)`;

            // interval circular dot
            dotProgress.style.transform = `rotateZ(${(options.startValue * 360) / 100}deg) translateY(-${orbitDot}rem)`;

            // stop interval
            if (options.startValue == options.endValue) {
                clearInterval(progress);
            }
        }, options.speed);
    }

    showPassword() {
        let eyes = document.querySelectorAll(".eyes-js");

        eyes.forEach((item) => {
            item.addEventListener("click", (e) => {
                let prevEleInputType = item.previousElementSibling.getAttribute("type");
                if (prevEleInputType === "password") {
                    item.previousElementSibling.setAttribute("type", "text");
                    item.setAttribute("src", `${DynamicForm.ICON_SRC}/eye-slash.svg`);
                } else {
                    item.previousElementSibling.setAttribute("type", "password");
                    item.setAttribute("src", `${DynamicForm.ICON_SRC}/eye.svg`);
                }
            });
        });
    }

    comparePw() {
        let pw = document.getElementById("password");
        let confirmPw = document.getElementById("confirm_pw");
        confirmPw.addEventListener("change", (event) => {
            if (event.target.value !== pw.value) {
                console.log("Error");
                event.target.classList.add("form__input--error");
                pw.classList.add("form__input--error");
            } else {
                event.target.classList.remove("form__input--error");
                pw.classList.remove("form__input--error");
            }
        });
    }
}

const dynamicForm = new DynamicForm();
