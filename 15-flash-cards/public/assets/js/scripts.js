class FlashCards {
    static DATA_FLASH_CARDS = [
        {
            question: "Do you know Javascript what can be?",
            answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique recusandae accusantium deleniti quis cum ut incidunt debitis repellat ipsam perferendis fuga repudiandae minus est eum delectus, amet quod, excepturi reprehenderit.",
        },
        {
            question: "Have you learn somthing new everyday?",
            answer: "Yes, always!",
        },
        {
            question: "What do you find is the most boring part of your life at the moment?",
            answer: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
        },
        {
            question: "Have you evet taken a long shot that worked out?",
            answer: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
            question: "What is your current go-to song to dance to when nobody is around?",
            answer: "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        },
    ];

    // use for setupProgress_V1
    // static CLASSLIST = {
    //     progress: { percent: "progress__percent", steps: "progress__steps" },
    // };

    static CONTROLS_CLASSLIST = {
        prevNextBtnClass: ".prevNext-js",
        showHideBtnClass: ".showHide-js",
        progress: ".progress-js",
        progressBar: ".progressBar-js",
        progressPercent: ".progressPercent-js",
        progressSteps: ".progressSteps-js",

        // content: ".content-js",
        question: ".question-js",
        answer: ".answer-js",
    };

    constructor() {
        this.currentCards = 1;
        this.totalCards = FlashCards.DATA_FLASH_CARDS.length;

        this.showHideBtn = document.querySelector(FlashCards.CONTROLS_CLASSLIST.showHideBtnClass);
        this.prevNextBtn = document.querySelectorAll(FlashCards.CONTROLS_CLASSLIST.prevNextBtnClass);
        this.progress = document.querySelector(FlashCards.CONTROLS_CLASSLIST.progress);

        // this.content = document.querySelector(FlashCards.CONTROLS_CLASSLIST.content);
        this.question = document.querySelector(FlashCards.CONTROLS_CLASSLIST.question);
        this.answer = document.querySelector(FlashCards.CONTROLS_CLASSLIST.answer);

        this.initFlashCards();
    }

    initFlashCards() {
        this.loadFlashCards(this.currentCards, "question");
        this.prevNextControls();
        this.showHideFAQ();
        this.setupProgress((this.currentCards * 100) / this.totalCards);
    }

    loadFlashCards(idCard, typeCard) {
        let dataCard = FlashCards.DATA_FLASH_CARDS[idCard - 1];
        // for only content wrap all
        // typeCard == "question"
        //     ? (this.content.innerHTML = dataCard.question)
        //     : (this.content.innerHTML = dataCard.answer);

        // for seperate content to question and answer
        this.question.innerHTML = dataCard.question;
        this.answer.innerHTML = dataCard.answer;

        if (typeCard == "question") {
            this.question.classList.remove("hide");
            this.answer.classList.add("hide");
        } else {
            this.question.classList.add("hide");
            this.answer.classList.remove("hide");
        }
    }

    showHideFAQ() {
        this.showHideBtn.addEventListener("click", (event) => {
            let targetAction = event.target.getAttribute("target-action");

            if (targetAction === "show") {
                event.target.setAttribute("target-action", "hide");
                event.target.innerHTML = "Hide Answer";
                this.loadFlashCards(this.currentCards, "answer");
            } else {
                event.target.setAttribute("target-action", "show");
                event.target.innerHTML = "Show Answer";
                this.loadFlashCards(this.currentCards, "question");
            }
        });
    }

    prevNextControls() {
        this.prevNextBtn.forEach((button) => {
            button.addEventListener("click", (event) => {
                let targetAction = button.getAttribute("target-action");
                this.currentCards = targetAction === "prev" ? this.currentCards - 1 : this.currentCards + 1;

                // calculate percent
                let percent = (this.currentCards * 100) / this.totalCards;

                // reset status for all control
                // this.content.setAttribute("target-type", "question");
                this.showHideBtn.setAttribute("target-action", "show");
                this.showHideBtn.innerHTML = "Show Answer";

                // process card
                this.setStatusPrevNext();
                this.setupProgress(percent, targetAction);
                this.loadFlashCards(this.currentCards, "question");
            });
        });
    }

    setStatusPrevNext() {
        this.prevNextBtn.forEach((button) => {
            let targetAction = button.getAttribute("target-action");
            if (this.currentCards > 1 && this.currentCards < this.totalCards) {
                // console.log("no disabled");
                button.removeAttribute("disabled");
            } else if (
                (this.currentCards <= 1 && targetAction === "prev") ||
                (this.currentCards >= this.totalCards && targetAction === "next")
            ) {
                // console.log("prev disabled");
                button.setAttribute("disabled", true);
            }
        });
    }

    setupProgress(percent, targetAction = "next") {
        let progressBar = document.querySelector(FlashCards.CONTROLS_CLASSLIST.progressBar);
        let progressPercent = document.querySelector(FlashCards.CONTROLS_CLASSLIST.progressPercent);
        let progressSteps = document.querySelector(FlashCards.CONTROLS_CLASSLIST.progressSteps);

        progressSteps.innerHTML = `${this.currentCards}/${this.totalCards}`;
        percent > 50 ? (progressPercent.style.color = "white") : (progressPercent.style.color = "#6a6e72");
        percent == 100 ? (progressSteps.style.color = "white") : (progressSteps.style.color = "#6a6e72");

        let optionAnimate = {
            startValue: 0,
            endValue: percent,
            speed: this.progress.getAttribute("data-speed") ? this.progress.getAttribute("data-speed") : 12,
        };

        if (targetAction == "next") {
            // if action is next => need get old value percent previous and set to start
            optionAnimate.startValue = ((this.currentCards - 1) * 100) / this.totalCards;
            optionAnimate.endValue = percent;
        } else {
            // if action is prev => need get old value percent next and set to start
            optionAnimate.startValue = ((this.currentCards + 1) * 100) / this.totalCards;
            optionAnimate.endValue = percent;
        }

        // console.log(`start: ${optionAnimate.startValue}`);
        // console.log(`end: ${optionAnimate.endValue}`);

        let percentAnimate = setInterval(() => {
            if (targetAction == "next") {
                // counter increase if action is next
                optionAnimate.startValue++;
                progressPercent.textContent = `${optionAnimate.startValue}%`;
                progressBar.style.width = `${optionAnimate.startValue}%`;
            } else {
                // counter decrease if action is prev
                optionAnimate.startValue--;
                progressPercent.textContent = `${optionAnimate.startValue}%`;
                progressBar.style.width = `${optionAnimate.startValue}%`;
            }

            if (optionAnimate.startValue == optionAnimate.endValue) {
                clearInterval(percentAnimate);
            }
        }, optionAnimate.speed);
    }

    // not really suitable
    setupProgress_V1() {
        let percentEle = document.createElement("div");
        let stepsEle = document.createElement("div");
        percentEle.classList.add(FlashCards.CLASSLIST.progress.percent);
        stepsEle.classList.add(FlashCards.CLASSLIST.progress.steps);

        let percent = (this.currentCards * 100) / this.totalCards;
        let percentTextNode = document.createTextNode(`${percent}%`);
        let stepsTextNode = document.createTextNode(`${this.currentCards}/${this.totalCards}`);
        percentEle.appendChild(percentTextNode);
        stepsEle.appendChild(stepsTextNode);

        this.progressBar.innerHTML = "";
        this.progressBar.appendChild(percentEle);
        this.progressBar.appendChild(stepsEle);
    }
}
const flashCards = new FlashCards();
