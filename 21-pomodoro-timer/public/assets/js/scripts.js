class PomorodoApp {
    static CONTROL_CLASSES = {
        focusTimerContainer: "focusTimerContainer-js",
        actionTimerContainer: "actionTimerContainer-js",
        timerContainer: "timerContainer-js",
    };

    static FOCUS_CONTROLS = {
        focus: "focusTime",
        shortBreak: "shortBreak",
        longBreak: "longBreak",
    };
    static ACTION_CONTROLS = {
        start: "start",
        pause: "pause",
        resume: "resume",
        reset: "reset",
    };

    constructor() {
        this.controls = PomorodoApp.CONTROL_CLASSES;
        this.focusControls = PomorodoApp.FOCUS_CONTROLS;
        this.actionControls = PomorodoApp.ACTION_CONTROLS;

        // pomodoro initial
        this.timerContainer = document.getElementById(this.controls.timerContainer); // timer container
        this.focusTime = 25;
        this.shortBreak = 5;
        this.longBreak = 15;

        this.currentActiveTimer = this.focusTime;
        this.timeIntervalID;
        this.timeIntervalPause = 0; // use for store remaining timer when paused
        this.isPaused = false; // use for check pause and resume timer
        this.isActiveTimer = false; // use for check inactive timer focus

        this.getCurrentDatetime();
        this.initFocusControls();
        this.initActionControls();

        // idea when starting task will pass config session work (will auto caculate time base on session work, for example: session work is 2 will have x2 focus time and x1 short break time and go on if more than 4 session work will have x4 focus time 3 short break time and 1 long break time)
        // this.setupControlsFocus({ sessionWork: 1 });
    }

    resetPomodoro() {
        this.currentActiveTimer = this.focusTime;
        this.timeIntervalPause = 0;
        this.isPaused = false;
        this.isActiveTimer = false;
        this.timerContainer.innerHTML = `${this.focusTime < 10 ? "0" : ""}${this.focusTime}:00`;
    }

    // initial focus timer controls
    initFocusControls() {
        const focusContainer = document.getElementById(this.controls.focusTimerContainer);
        focusContainer.innerHTML = "";
        let focusBtn = this.createBtnFocusControl({ typeFocus: this.focusControls.focus });
        let shortBtn = this.createBtnFocusControl({ typeFocus: this.focusControls.shortBreak });
        let longBtn = this.createBtnFocusControl({ typeFocus: this.focusControls.longBreak });
        focusContainer.appendChild(focusBtn);
        focusContainer.appendChild(shortBtn);
        focusContainer.appendChild(longBtn);
    }
    createBtnFocusControl({ typeFocus }) {
        let btnFocusControl = document.createElement("button");
        btnFocusControl.classList.add(...["btn", "btn--actions", "btn--focus-timer", "focusBtn-js"]);

        switch (typeFocus) {
            case this.focusControls.shortBreak:
                let btnTextShort = document.createTextNode("Short Break");
                let iconShortBreak = document.createElement("img");
                iconShortBreak.src = "assets/images/short-break.svg";
                iconShortBreak.classList.add("icon");
                btnFocusControl.appendChild(iconShortBreak);
                btnFocusControl.appendChild(btnTextShort);
                break;
            case this.focusControls.longBreak:
                let btnTextLong = document.createTextNode("Long Break");
                let iconLongBreak = document.createElement("img");
                iconLongBreak.src = "assets/images/long-break.svg";
                iconLongBreak.classList.add("icon");
                btnFocusControl.appendChild(iconLongBreak);
                btnFocusControl.appendChild(btnTextLong);
                break;
            default:
                let btnTextFocus = document.createTextNode("Focus Time");
                let iconFocus = document.createElement("img");
                iconFocus.src = "assets/images/focus-timer.svg";
                iconFocus.classList.add("icon");
                btnFocusControl.classList.add("active");
                btnFocusControl.appendChild(iconFocus);
                btnFocusControl.appendChild(btnTextFocus);
                break;
        }

        btnFocusControl.addEventListener("click", (event) => {
            this.eventBtnFocusControls(typeFocus);
            btnFocusControl.classList.add("active");
        });

        return btnFocusControl;
    }
    eventBtnFocusControls(typeFocus) {
        clearInterval(this.timeIntervalID);
        this.timeIntervalPause = 0;
        this.isPaused = false;
        this.isActiveTimer = false;

        let focusBtns = document.querySelectorAll(".focusBtn-js");
        focusBtns.forEach((btn) => {
            btn.classList.remove("active");
        });

        switch (typeFocus) {
            case this.focusControls.shortBreak:
                this.currentActiveTimer = this.shortBreak;
                if (this.shortBreak < 1) {
                    let seconds = this.shortBreak * 60;
                    this.timerContainer.innerHTML = `00:${seconds}`;
                } else {
                    this.timerContainer.innerHTML = `${this.shortBreak < 10 ? "0" : ""}${this.shortBreak}:00`;
                }
                break;
            case this.focusControls.longBreak:
                this.currentActiveTimer = this.longBreak;
                this.timerContainer.innerHTML = `${this.longBreak < 10 ? "0" : ""}${this.longBreak}:00`;
                break;
            default:
                this.currentActiveTimer = this.focusTime;
                this.timerContainer.innerHTML = `${this.focusTime < 10 ? "0" : ""}${this.focusTime}:00`;
                break;
        }

        this.initActionControls();
    }
    // initial action timer controls
    initActionControls() {
        const actionTimerContainer = document.getElementById(this.controls.actionTimerContainer);
        actionTimerContainer.innerHTML = "";
        if (this.isActiveTimer == false) {
            let startBtn = this.createBtnActions({ actions: this.actionControls.start });
            actionTimerContainer.appendChild(startBtn);
        } else {
            let isPauseOrResume = this.isPaused == true ? this.actionControls.resume : this.actionControls.pause;
            let pauseResumeBtn = this.createBtnActions({ actions: isPauseOrResume });
            let resetBtn = this.createBtnActions({ actions: this.actionControls.reset });

            actionTimerContainer.appendChild(pauseResumeBtn);
            actionTimerContainer.appendChild(resetBtn);
        }
    }
    createBtnActions({ actions }) {
        let btnAction = document.createElement("button");
        btnAction.classList.add(...["btn", "btn--actions"]);

        switch (actions) {
            case this.actionControls.start:
                let btnTextStart = document.createTextNode("Start");
                let iconStart = document.createElement("img");
                iconStart.src = "assets/images/play.svg";
                iconStart.classList.add("icon");
                btnAction.classList.add("btn--todo");
                btnAction.appendChild(iconStart);
                btnAction.appendChild(btnTextStart);
                break;
            case this.actionControls.pause:
                let btnTextPause = document.createTextNode("Pause");
                let iconPause = document.createElement("img");
                iconPause.src = "assets/images/pause.svg";
                iconPause.classList.add("icon");
                btnAction.classList.add("btn--inprogress");
                btnAction.appendChild(iconPause);
                btnAction.appendChild(btnTextPause);
                break;
            case this.actionControls.resume:
                let btnTextResume = document.createTextNode("Resume");
                let iconResume = document.createElement("img");
                iconResume.src = "assets/images/resume.svg";
                iconResume.classList.add("icon");
                btnAction.classList.add("btn--setdone");
                btnAction.appendChild(iconResume);
                btnAction.appendChild(btnTextResume);
                break;
            default:
                let btnTextReset = document.createTextNode("Reset");
                let iconReset = document.createElement("img");
                iconReset.src = "assets/images/reset.svg";
                iconReset.classList.add("icon");
                btnAction.classList.add("btn--delete");
                btnAction.appendChild(iconReset);
                btnAction.appendChild(btnTextReset);
                break;
        }

        btnAction.addEventListener("click", (event) => {
            this.eventBtnActions(actions);
        });

        return btnAction;
    }
    eventBtnActions(actions) {
        switch (actions) {
            case this.actionControls.start:
                if (this.isActiveTimer == false) {
                    this.isPaused = false;
                    this.isActiveTimer = true;
                    this.setupTimer({ timerContainer: this.timerContainer, timeLimit: this.currentActiveTimer });
                    this.initActionControls();
                }
                break;
            case this.actionControls.pause:
                if (this.isActiveTimer == true) {
                    this.isPaused = true;
                    this.initActionControls();
                }
                break;
            case this.actionControls.resume:
                if (this.isPaused == true) {
                    this.isPaused = false;
                    this.initActionControls();

                    this.setupTimer({ timerContainer: this.timerContainer, timeLimit: this.currentActiveTimer });
                }
                break;
            default:
                clearInterval(this.timeIntervalID);
                this.resetPomodoro();
                this.initFocusControls();
                this.initActionControls();
                break;
        }
    }
    endingTimer() {
        if (this.isActiveTimer == false && this.timeIntervalPause == 0) {
            const actionTimerContainer = document.getElementById(this.controls.actionTimerContainer);
            actionTimerContainer.innerHTML = "";
            let resetBtn = this.createBtnActions({ actions: this.actionControls.reset });
            actionTimerContainer.appendChild(resetBtn);
        }
    }
    // setup pomodoro timer
    setupTimer({ timerContainer, timeLimit }) {
        let totalSeconds = this.timeIntervalPause > 0 ? this.timeIntervalPause : timeLimit * 60;

        this.timeIntervalID = setInterval(() => {
            if (this.isPaused != true) {
                totalSeconds--;

                let minutesLeft = Math.floor(totalSeconds / 60);
                let secondsLeft = totalSeconds % 60;
                timerContainer.innerHTML = `${minutesLeft < 10 ? `0` : ""}${minutesLeft}:${
                    secondsLeft < 10 ? "0" : ""
                }${secondsLeft}`;

                // check when time left equal to all length of sound => begin play
                if (totalSeconds == 6) {
                    console.log("done - play sound here");
                    this.playTingTing();
                }

                if (totalSeconds <= 0) {
                    clearInterval(this.timeIntervalID);
                    this.isActiveTimer = false;
                    this.timeIntervalPause = 0;
                    this.endingTimer();

                    // reset timer when focus done => for the first time thing need to be reset
                    // this.resetPomodoro();
                }
            } else {
                // clear interval when pause
                clearInterval(this.timeIntervalID);
                // set remaining seconds when pause
                this.timeIntervalPause = totalSeconds;
            }
        }, 1000);
    }
    getCurrentDatetime() {
        let currentDatetime = document.getElementById("currentDatetime-js");
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const optionDateformat = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        const dateFormat = new Intl.DateTimeFormat("en-US", optionDateformat);
        currentDatetime.innerHTML = `${dateFormat.format(now)} - ${hours}:${minutes}`;
    }
    // play sound
    playTingTing() {
        let audioContainer = document.createElement("audio");
        let audioSource = document.createElement("source");
        audioSource.src = "assets/sounds/alarm-clock-ring.mp3";
        audioSource.type = "audio/mp3";
        audioContainer.appendChild(audioSource);
        audioContainer.play();
    }

    // for test pass session work
    setupControlsFocus({ sessionWork = 1 }) {
        let focusControlsContainer = document.getElementById(this.controls.focusControlsContainer);
        let styleBtn = ["btn", "btnTargetTimer-js"];

        focusControlsContainer.innerHTML = "";

        let btnFocusTime = document.createElement("button");
        let textNodeFocusTime = document.createTextNode(`Focus Time x${sessionWork}`);
        btnFocusTime.appendChild(textNodeFocusTime);
        btnFocusTime.classList.add(...styleBtn);
        btnFocusTime.setAttribute(this.targets.timer.name, this.targets.timer.value.focus);

        focusControlsContainer.appendChild(btnFocusTime);

        if (sessionWork > 1) {
            let btnShortBreak = document.createElement("button");
            let textNodeShortBreak = document.createTextNode(`Short Break x${sessionWork - 1}`);
            btnShortBreak.appendChild(textNodeShortBreak);
            btnShortBreak.classList.add(...styleBtn);
            btnShortBreak.setAttribute(this.targets.timer.name, this.targets.timer.value.short);

            focusControlsContainer.appendChild(btnShortBreak);
        }

        if (sessionWork > 4) {
            let btnLongBreak = document.createElement("button");
            let textNodeShortBreak = document.createTextNode(`Long Break x${sessionWork - 1}`);
            btnShortBreak.appendChild(textNodeShortBreak);
            btnShortBreak.classList.add(...styleBtn);
            btnLongBreak.setAttribute(this.targets.timer.name, this.targets.timer.value.long);

            focusControlsContainer.appendChild(btnLongBreak);
        }

        this.eventControls();
        // return focusControlsContainer;
    }
}

class TaskTracker {
    static DATA_TRACKER = [];
    static TASK_STATUS = { todo: "todo", inprogress: "in-progress", done: "done" };

    static STYLE_CLASSES = { title: "tasklist__title", status: "tasklist__status", actionWrap: "tasklist__actions" };
    static CONTROL_CLASSES = {
        taskListID: "tasklist-js",
        inputTitleID: "inputTitle-js",
        btnInsertID: "btnInsert-js",
        alertMessage: "alertMsg-js",
    };
    static MESSAGE_ALERT = [
        "Because this is only FE-UI, I do not save data in database, tasks only save in current session work. So, be careful when you want to refresh browser, all tasks will be gone!",
        "The purpose of the Pomodoro Technique is to focus on one task at a moment, so I can only allow you to-do one task at a time.",
    ];

    constructor() {
        this.controls = TaskTracker.CONTROL_CLASSES;
        this.styles = TaskTracker.STYLE_CLASSES;

        this.tasks = TaskTracker.DATA_TRACKER;
        this.status = TaskTracker.TASK_STATUS;

        this.messageAlert = document.getElementById(this.controls.alertMessage);
        this.isTaskInprogress = this.tasks.some((task) => task.status === this.status.inprogress);

        // init pomodoro timer here
        // this.pomodoroTimer = new PomorodoApp();

        this.renderTasks();
        this.insertTask();
        this.messageAlert.innerHTML = TaskTracker.MESSAGE_ALERT[0];
    }

    createTasksNode({ id, title, status }) {
        let liEle = document.createElement("li");
        let labelEle = document.createElement("div");
        let spanEle = document.createElement("span");
        let taskTitle = document.createTextNode(`#${id} - ${title}`);
        let statusText = document.createTextNode(status);

        labelEle.classList.add(this.styles.title);
        spanEle.classList.add(...[`${this.styles.status}`, `${this.styles.status}--${status.toLocaleLowerCase()}`]);

        spanEle.appendChild(statusText);
        labelEle.appendChild(taskTitle);
        labelEle.appendChild(spanEle);
        liEle.appendChild(labelEle);

        return liEle;
    }
    createBtnControls({ id, status }) {
        let btnControl = document.createElement("button");
        let iconControl = document.createElement("img");
        btnControl.classList.add("btn");
        iconControl.classList.add("icon");

        switch (status) {
            case this.status.todo:
                iconControl.src = "assets/images/play.svg";
                btnControl.classList.add("btn--todo");
                if (this.isTaskInprogress) {
                    btnControl.setAttribute("disabled", "");
                    this.messageAlert.innerHTML = TaskTracker.MESSAGE_ALERT[1];
                } else {
                    btnControl.removeAttribute("disabled");
                    this.messageAlert.innerHTML = TaskTracker.MESSAGE_ALERT[0];
                }
                break;
            case this.status.inprogress:
                iconControl.src = "assets/images/pause.svg";
                btnControl.classList.add("btn--inprogress");
                break;
            case this.status.done:
                iconControl.src = "assets/images/check.svg";
                btnControl.classList.add("btn--setdone");
                break;
            default:
                iconControl.src = "assets/images/delete.svg";
                btnControl.classList.add("btn--delete");
                break;
        }

        btnControl.addEventListener("click", (event) => {
            event.preventDefault();
            const indexTask = this.tasks.findIndex((task) => task.id === parseInt(id));
            const task = this.tasks.find((task) => task.id == parseInt(id));
            this.eventBtnControls({ indexTask: indexTask, status: status, sessionWork: task.sessionWork });
            this.renderTasks();
        });

        btnControl.appendChild(iconControl);

        return btnControl;
    }
    eventBtnControls({ indexTask, status, sessionWork }) {
        switch (status) {
            case this.status.todo:
                if (!this.isTaskInprogress) {
                    this.tasks[indexTask]["status"] = this.status.inprogress;
                    this.isTaskInprogress = true;
                    // this.pomodoroTimer.setupControlsFocus({ sessionWork: sessionWork });
                }
                break;
            case this.status.inprogress:
                this.tasks[indexTask]["status"] = this.status.todo;
                this.isTaskInprogress = false;
                break;
            case this.status.done:
                this.tasks[indexTask]["status"] = this.status.done;
                this.isTaskInprogress = false;
                break;
            default:
                // const confirmBlock = document.getElementById("confirm-js");
                // let wrapBlock = confirmBlock.parentElement;
                // wrapBlock.classList.add("active");
                this.confirmDeleteTask(indexTask);

                // this.tasks.splice(indexTask, 1);
                // this.tasks.length == 0 ? (this.isTaskInprogress = false) : (this.isTaskInprogress = true);
                // this.renderTasks();

                break;
        }
    }
    createTaskActionsNode({ id, status }) {
        let actionsWrapEle = document.createElement("div");
        actionsWrapEle.classList.add(this.styles.actionWrap);
        let deleteBtn = this.createBtnControls({ id: id, status: "delete" });

        if (status == this.status.todo) {
            let todoBtn = this.createBtnControls({ id: id, status: this.status.todo });
            actionsWrapEle.appendChild(todoBtn);
        }
        if (status == this.status.inprogress) {
            let pauseBtn = this.createBtnControls({ id: id, status: this.status.inprogress });
            let checkDoneBtn = this.createBtnControls({ id: id, status: this.status.done });
            actionsWrapEle.appendChild(checkDoneBtn);
            actionsWrapEle.appendChild(pauseBtn);
        }

        actionsWrapEle.appendChild(deleteBtn);

        return actionsWrapEle;
    }
    renderTasks() {
        let taskList = document.getElementById(this.controls.taskListID);
        let statusArray = Object.values(this.status);

        taskList.innerHTML = "";
        // use loop for load task by status: todo > in-progress > done
        for (let i = 0; i < statusArray.length; i++) {
            this.tasks.forEach((task) => {
                if (task.status == statusArray[i]) {
                    let taskNode = this.createTasksNode({ id: task.id, title: task.title, status: task.status });
                    let actionsNode = this.createTaskActionsNode({
                        id: task.id,
                        status: task.status,
                    });

                    taskNode.appendChild(actionsNode);
                    taskList.appendChild(taskNode);
                }
            });
        }
    }

    insertTask() {
        let btnInsert = document.getElementById(this.controls.btnInsertID);
        let inputInsert = document.getElementById(this.controls.inputTitleID);
        let msgError = document.querySelector(".error_msg-js");
        btnInsert.addEventListener("click", (event) => {
            if (inputInsert.value == "") {
                msgError.innerHTML = "Please enter title of task!";
                msgError.classList.add("form__error-msg--show");
                inputInsert.classList.add("form__error");
            } else {
                msgError.innerHTML = "";
                inputInsert.classList.remove("form__error");
                let newTask = {
                    id: this.tasks.length + 1,
                    title: inputInsert.value,
                    status: "todo",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                this.tasks.push(newTask);
                this.renderTasks();
            }
        });
        inputInsert.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                if (inputInsert.value == "") {
                    msgError.innerHTML = "Please enter title of task!";
                    msgError.classList.add("form__error-msg--show");
                    inputInsert.classList.add("form__error");
                } else {
                    msgError.innerHTML = "";
                    inputInsert.classList.remove("form__error");
                    let newTask = {
                        id: this.tasks.length + 1,
                        title: inputInsert.value,
                        status: "todo",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    this.tasks.push(newTask);
                    this.renderTasks();
                }
                event.target.value = "";
            }
        });
    }
    confirmDeleteTask(indexTask) {
        const confirmBlock = document.getElementById("confirm-js");
        let wrapBlock = confirmBlock.parentElement;
        wrapBlock.classList.add("active");
        confirmBlock.innerHTML = "";

        let yesBtn = document.createElement("button");
        let textYesBtn = document.createTextNode("Yes");
        yesBtn.classList.add("btn");
        yesBtn.appendChild(textYesBtn);
        yesBtn.addEventListener("click", () => {
            this.tasks.splice(indexTask, 1);
            wrapBlock.classList.remove("active");
            this.tasks.length == 0 ? (this.isTaskInprogress = false) : (this.isTaskInprogress = true);
            this.renderTasks();
        });

        let noBtn = document.createElement("button");
        let textNoBtn = document.createTextNode("No");
        noBtn.classList.add("btn");
        noBtn.appendChild(textNoBtn);
        noBtn.addEventListener("click", () => {
            wrapBlock.classList.remove("active");
        });

        let titleConfirm = document.createElement("h3");
        let textTitle = document.createTextNode("Confirm Delete");
        titleConfirm.appendChild(textTitle);
        let confirm = document.createTextNode(`Do you want delete this task: "${this.tasks[indexTask].title}"`);
        confirmBlock.appendChild(titleConfirm);
        confirmBlock.appendChild(confirm);
        confirmBlock.appendChild(yesBtn);
        confirmBlock.appendChild(noBtn);
    }
}

const taskTracker = new TaskTracker();
const pomodoroApp = new PomorodoApp();
