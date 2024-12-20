class QuizzA {
    static DATA_QUIZZA = [
        {
            question: "How to declare a variable in JS?",
            options: ["let", "var", "const", "All of them"],
            answer: 4,
        },
        {
            question: "Have you learn something new everyday?",
            options: ["Always", "Nope", "Sometime", "Never"],
            answer: 1,
        },
        {
            question: "Amazing Quizza, right?",
            options: ["Absolutely", "Nope"],
            answer: 1,
        },
        // {
        //     question: "What do you find is the most boring part of your life at the moment?",
        //     answer: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
        // },
        // {
        //     question: "Have you evet taken a long shot that worked out?",
        //     answer: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        // },
        // {
        //     question: "What is your current go-to song to dance to when nobody is around?",
        //     answer: "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        // },
    ];

    static CONTROL_CLASSES = {
        btnControl: "btn-js",
        startBtn: "startBtn-js",
        answerBtn: "answerBtn-js",
        question: "question-js",
        optionsAnswer: "options-js",
    };

    static TARGET_LIST = {
        id: "target-id",
        action: "target-action",
    };

    constructor() {
        this.dataQuizza = QuizzA.DATA_QUIZZA;
        this.totalQuiz = QuizzA.DATA_QUIZZA.length;
        this.currentQuizza = 1;
        this.statusQuizza = false;
        this.scoreQuizza = 0;
        this.scoreScale = 100;

        this.correctAnswer = 0;
        this.incorrectAnswer = 0;

        this.controls = QuizzA.CONTROL_CLASSES;
        this.questionBlock = document.getElementById(this.controls.question);
        this.answerOption = document.getElementById(this.controls.optionsAnswer);
        this.answerBtn = document.getElementById(this.controls.answerBtn);

        // this.eventBtnControl();
        this.startQuizza();
        this.answerQuizza();
    }

    loadQuizza({ idQuizza }) {
        this.answerBtn.setAttribute("disabled", "");
        const question = this.dataQuizza[idQuizza - 1]["question"];
        this.questionBlock.innerHTML = question;

        this.createAnswerOptions({ idQuizza: idQuizza });
    }
    createAnswerOptions({ idQuizza }) {
        const options = this.dataQuizza[idQuizza - 1]["options"];

        this.answerOption.innerHTML = "";

        for (let i = 0; i < options.length; i++) {
            let divOption = document.createElement("div");
            let input = document.createElement("input");
            input.type = "radio";
            input.name = "answer";
            input.value = i + 1;
            input.id = `answer-${i + 1}`;
            let label = document.createElement("label");
            let textLabel = document.createTextNode(options[i]);
            label.setAttribute("for", `answer-${i + 1}`);
            label.appendChild(textLabel);
            divOption.appendChild(input);
            divOption.appendChild(label);
            this.answerOption.appendChild(divOption);

            input.addEventListener("change", (event) => {
                this.answerBtn.removeAttribute("disabled");
            });
        }
    }

    checkAnswer() {
        let userAnswer = parseInt(document.querySelector("input[name='answer']:checked").value);

        if (!isNaN(userAnswer)) {
            const correctAnswer = this.dataQuizza[this.currentQuizza - 1]["answer"];
            if (userAnswer === correctAnswer) {
                this.scoreQuizza = this.scoreQuizza + this.scoreScale / this.totalQuiz;
                this.correctAnswer++;
                if (this.correctAnswer < this.totalQuiz) {
                    Number(this.scoreQuizza.toFixed(2));
                }
            } else {
                this.incorrectAnswer++;
            }
        }
        this.currentQuizza++;

        if (this.currentQuizza > this.totalQuiz) {
            this.questionBlock.innerHTML =
                "Congrat! You have finished the Quizza. Your score is: " +
                this.scoreQuizza +
                `
                Correct answer: ${this.correctAnswer} <br/>
                Incorect answer: ${this.incorrectAnswer}
            `;
            this.answerOption.innerHTML = "";
            this.statusQuizza = false;
            this.answerBtn.setAttribute("disabled", "");
        } else {
            this.loadQuizza({ idQuizza: this.currentQuizza });
        }
    }
    answerQuizza() {
        this.answerBtn.addEventListener("click", (event) => {
            if (this.statusQuizza) {
                this.checkAnswer();
            }
        });
    }
    startQuizza() {
        const startBtn = document.getElementById(this.controls.startBtn);
        startBtn.addEventListener("click", () => {
            if (this.statusQuizza == false && this.currentQuizza == 1) {
                this.statusQuizza = true;
                this.loadQuizza({ idQuizza: this.currentQuizza });
                startBtn.setAttribute("disabled", "");
            }
        });
    }

    // my first thing idea for use one class for 2 action buttons but it seem not really good :p, just for test and save here, think may be can use this way in another project
    eventBtnControl() {
        let btnControls = document.querySelectorAll(`.${this.controls.btnControl}`);
        btnControls.forEach((btn) => {
            let action = btn.getAttribute(QuizzA.TARGET_LIST.action);
            btn.addEventListener("click", (event) => {
                // check if action start and status is false / not begin the quiz => start quiz
                if (action == "start" && this.statusQuizza == false) {
                    this.statusQuizza = true;
                    console.log(action);
                    this.loadQuizza({ idQuizza: this.currentQuizza });
                    btn.setAttribute("disabled", "");
                    this.eventBtnControl(); // call back to reload state button
                }
            });
        });
    }
}
const quizz = new QuizzA();
