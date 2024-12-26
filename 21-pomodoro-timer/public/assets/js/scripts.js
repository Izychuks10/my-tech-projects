class TaskTracker {
    static DATA_TRACKER = [
        {
            id: 1,
            title: "Build frontend for Task tracker CLI",
            status: "todo",
            sessionWork: 2,
            createdAt: "12/4/2024, 8:48:29 AM",
            updatedAt: "12/4/2024, 8:48:29 AM",
        },
        {
            id: 2,
            title: "Try to finish FE - Intermediate before Dec 28, 2024",
            status: "in-progress",
            sessionWork: 3,
            createdAt: "12/4/2024, 8:48:29 AM",
            updatedAt: "12/4/2024, 8:48:29 AM",
        },
        {
            id: 3,
            title: "All beginer projects",
            status: "done",
            sessionWork: 2,
            createdAt: "12/4/2024, 8:48:29 AM",
            updatedAt: "12/4/2024, 8:48:29 AM",
        },
        {
            id: 4,
            title: "Lorem isum dolor set amit",
            status: "todo",
            sessionWork: 1,
            createdAt: "12/4/2024, 8:48:29 AM",
            updatedAt: "12/4/2024, 8:48:29 AM",
        },
    ];
    static TASK_STATUS = { todo: "todo", inprogress: "in-progress", done: "done" };

    static STYLE_CLASSES = { title: "tasklist__title", status: "tasklist__status", actionWrap: "tasklist__actions" };
    static CONTROL_CLASSES = {
        taskListID: "tasklist-js",
        inputTitleID: "inputTitle-js",
        btnInsertID: "btnInsert-js",
        alertMessage: "alertMsg-js",
    };
    static MESSAGE_ALERT = [
        "Tasks only save in current session work. So, be careful when you want to refresh browser, all tasks will be gone! I will try to create some place for store data file ASAP!",
        "The purpose of the Pomodoro Technique is to focus on one task at a moment, so I can only allow you to-do one task at a time.",
    ];

    constructor() {
        this.controls = TaskTracker.CONTROL_CLASSES;
        this.styles = TaskTracker.STYLE_CLASSES;

        this.tasks = TaskTracker.DATA_TRACKER;
        this.status = TaskTracker.TASK_STATUS;

        this.messageAlert = document.getElementById(this.controls.alertMessage);
        this.isTaskInprogress = this.tasks.some((task) => task.status === this.status.inprogress);

        this.renderTasks();
        this.insertTask();
        this.messageAlert.innerHTML = TaskTracker.MESSAGE_ALERT[0];
    }

    createTasksNode({ id, title, status }) {
        let liEle = document.createElement("li");
        let labelEle = document.createElement("span");
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
                this.tasks.splice(indexTask, 1);
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
}

const taskTracker = new TaskTracker();
