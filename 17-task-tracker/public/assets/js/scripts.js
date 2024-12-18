class TaskTracker {
    static DATA_TRACKER = [
        {
            id: 1,
            title: "Build frontend for Task tracker CLI",
            status: "todo",
            createdAt: "12/4/2024, 8:48:29 AM",
            updatedAt: "12/4/2024, 8:48:29 AM",
        },
        {
            id: 2,
            title: "Try to finish FE - Intermediate before Dec 28, 2024",
            status: "in-progress",
            createdAt: "12/4/2024, 8:48:29 AM",
            updatedAt: "12/4/2024, 8:48:29 AM",
        },
        {
            id: 3,
            title: "All beginer projects",
            status: "done",
            createdAt: "12/4/2024, 8:48:29 AM",
            updatedAt: "12/4/2024, 8:48:29 AM",
        },
        {
            id: 4,
            title: "Lorem isum dolor set amit",
            status: "todo",
            createdAt: "12/4/2024, 8:48:29 AM",
            updatedAt: "12/4/2024, 8:48:29 AM",
        },
    ];
    static TASK_STATUS = { todo: "todo", inprogress: "in-progress", done: "done" };

    static STYLE_CLASSES = { title: "tasklist__title", status: "tasklist__status", actionWrap: "tasklist__actions" };
    static CONTROL_CLASSES = {
        taskListID: "tasklist-js",
        taskDelete: ".delete-js",
        taskUpdate: ".update-js",
        actionBtns: "actionsBtn-js",
        labelTask: ".tasklist__title-js",
        inputTitleID: "inputTitle-js",
        btnInsertID: "btnInsert-js",
    };

    constructor() {
        this.controls = TaskTracker.CONTROL_CLASSES;
        this.styles = TaskTracker.STYLE_CLASSES;

        this.tasks = TaskTracker.DATA_TRACKER;
        this.status = TaskTracker.TASK_STATUS;

        this.renderTasks();
        this.insertTask();
    }

    createTasksNode({ id, title, status }) {
        let tagLabel = status == this.status.done ? "span" : "label";

        let liEle = document.createElement("li");
        let labelEle = document.createElement(tagLabel);
        let spanEle = document.createElement("span");
        let taskTitle = document.createTextNode(`#${id} - ${title}`);
        let statusText = document.createTextNode(status);

        labelEle.classList.add(this.styles.title);
        status != this.status.done ? labelEle.setAttribute("for", `update-${id}`) : (labelEle.style.cursor = "default");
        spanEle.classList.add(...[`${this.styles.status}`, `${this.styles.status}--${status.toLocaleLowerCase()}`]);

        spanEle.appendChild(statusText);
        labelEle.appendChild(taskTitle);
        labelEle.appendChild(spanEle);
        liEle.appendChild(labelEle);

        return liEle;
    }
    createTaskActionsNode({ id, status }) {
        let actionsWrapEle = document.createElement("div");
        let delBtnEle = document.createElement("button");
        let iconDel = document.createElement("img");

        actionsWrapEle.classList.add(...[this.styles.actionWrap, this.controls.actionBtns]);
        iconDel.src = "assets/images/delete.svg";
        iconDel.classList.add("icon");
        delBtnEle.classList.add(...["btn", "delete-js"]);
        delBtnEle.setAttribute("target-id", id);

        if (status == this.status.inprogress) {
            let doneBtnEle = document.createElement("button");
            let iconCheck = document.createElement("img");
            iconCheck.classList.add("icon");
            iconCheck.src = "assets/images/check.svg";
            doneBtnEle.classList.add(...["btn", "setdone-js"]);
            doneBtnEle.setAttribute("target-id", id);
            doneBtnEle.appendChild(iconCheck);

            actionsWrapEle.appendChild(doneBtnEle);
        }

        if (status == this.status.todo || status == this.status.inprogress) {
            let btnEle = document.createElement("label");
            let inputEle = document.createElement("input");
            let iconUpdate = document.createElement("img");
            inputEle.type = "checkbox";
            inputEle.value = id;
            inputEle.id = `update-${id}`;
            inputEle.checked = status == this.status.inprogress ? true : false;
            inputEle.classList.add("checkbox-js");

            iconUpdate.classList.add("icon");
            iconUpdate.src = status == "todo" ? "assets/images/play.svg" : "assets/images/pause.svg";

            btnEle.classList.add(...["btn", "update-js"]);
            btnEle.setAttribute("for", `update-${id}`);
            btnEle.appendChild(iconUpdate);
            btnEle.appendChild(inputEle);

            actionsWrapEle.appendChild(btnEle);
        }

        if (status == this.status.done) {
            let doneEle = document.createElement("div");
            let iconDone = document.createElement("img");
            iconDone.src = "assets/images/done.svg";
            iconDone.classList.add("icon");
            doneEle.classList.add(...["btn", "btn--done"]);
            doneEle.appendChild(iconDone);
            actionsWrapEle.appendChild(doneEle);
        }

        delBtnEle.appendChild(iconDel);
        actionsWrapEle.appendChild(delBtnEle);

        return actionsWrapEle;
    }

    renderTasks() {
        let taskList = document.getElementById(this.controls.taskListID);
        let statusArray = Object.values(this.status);
        taskList.innerHTML = "";
        for (let i = 0; i < statusArray.length; i++) {
            this.tasks.forEach((task) => {
                if (task.status == statusArray[i]) {
                    let taskNode = this.createTasksNode({ id: task.id, title: task.title, status: task.status });
                    let actionsNode = this.createTaskActionsNode({ id: task.id, status: task.status });
                    taskNode.appendChild(actionsNode);
                    taskList.appendChild(taskNode);
                }
            });
        }
        this.markTaskDone();
        this.updateTask();
        this.deleteTask();
    }

    markTaskDone() {
        let btnCheckDone = document.querySelectorAll(".setdone-js");
        btnCheckDone.forEach((checkdone) => {
            checkdone.addEventListener("click", (event) => {
                event.preventDefault();
                let targetID = checkdone.getAttribute("target-id");
                const index = this.tasks.findIndex((task) => task.id == targetID);
                this.tasks[index]["status"] = this.status.done;
                this.renderTasks();
            });
        });
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
    updateTask() {
        let chkInput = document.querySelectorAll(".checkbox-js");

        chkInput.forEach((checkbox) => {
            checkbox.addEventListener("change", (event) => {
                let targetID = event.target.value;
                const index = this.tasks.findIndex((task) => task.id == targetID);

                if (event.target.checked == true) {
                    this.tasks[index]["status"] = this.status.inprogress;
                } else {
                    this.tasks[index]["status"] = this.status.todo;
                }

                this.renderTasks();
            });
        });
    }
    deleteTask() {
        let delBtn = document.querySelectorAll(this.controls.taskDelete);

        delBtn.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                let targetID = btn.getAttribute("target-id");

                const index = this.tasks.findIndex((task) => task.id == targetID);
                if (confirm("Do you want to delete it?")) {
                    this.tasks.splice(index, 1);
                    this.renderTasks();
                }
            });
        });
    }
}

const taskTracker = new TaskTracker();
