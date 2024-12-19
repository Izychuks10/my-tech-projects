class RedditClient {
    static STYLE_CLASSES = {
        wrap: "reddit__lane",
        headLane: {
            wrap: "flex flex--x al-center space-bet reddit__lane-head",
            title: "reddit__source",
            nav: "reddit__nav",
            navBtn: "btn btn--none-style nav_btn-js",
            navAction: "reddit__actions actions-js",
            navActive: "reddit__actions--active",
        },
    };

    static CONTROL_CLASSES = {
        addLaneBtn: "reddit_add-js",
        dynamicLane: "reddit_lane-js",
        actionBlock: "actions-js",
        navActions: "nav_btn-js",
        refreshLane: "refresh_lane-js",
        deleteLane: "delete_lane-js",
        createBlock: "create_block-js",
    };

    constructor() {
        this.controls = RedditClient.CONTROL_CLASSES;
        this.styles = RedditClient.STYLE_CLASSES;
        this.countLanes = 0;

        this.btnShowFormAdd = document.getElementById("showFormAdd-js");
        this.formAddLane = document.getElementById("formAddLane-js");
        this.btnAddLane = document.getElementById("addLane-js");
        this.inputLaneTitle = document.getElementById("laneTitle-js");

        this.showLaneController();
        this.eventCreate();
    }

    createActionsBlock(nameLane) {
        let listAction = document.createElement("div");
        let refreshBtn = document.createElement("button");
        let deleteBtn = document.createElement("button");
        let refreshIcon = document.createElement("img");
        let deleteIcon = document.createElement("img");

        // setup action buttons
        refreshIcon.src = "assets/images/refresh.svg";
        refreshIcon.classList.add("icon");
        refreshBtn.classList = "btn btn--action";
        refreshBtn.setAttribute("target-id", `${nameLane}-${this.countLanes}`);
        deleteIcon.src = "assets/images/delete.svg";
        deleteIcon.classList.add("icon");
        deleteBtn.classList = "btn btn--action";
        deleteBtn.setAttribute("target-id", `${nameLane}-${this.countLanes}`);
        listAction.classList = this.styles.headLane.navAction;

        // refresh lane
        refreshBtn.addEventListener("click", (event) => {
            let targerID = refreshBtn.getAttribute("target-id");
            console.log("call re-fetch data here", targerID);
        });

        // add event for delete lane
        deleteBtn.addEventListener("click", (event) => {
            let targerID = deleteBtn.getAttribute("target-id");
            const laneWrap = document.getElementById(targerID);
            console.log(laneWrap);
            laneWrap.remove();
        });

        refreshBtn.appendChild(refreshIcon);
        deleteBtn.appendChild(deleteIcon);
        listAction.appendChild(refreshBtn);
        listAction.appendChild(deleteBtn);

        return listAction;
    }
    createHeadNav(nameLane) {
        let navLane = document.createElement("div");
        let btnNav = document.createElement("button");
        let imgBtn = document.createElement("img");

        // setup nav button
        imgBtn.src = "assets/images/nav.svg";
        imgBtn.classList.add("icon");
        btnNav.classList = this.styles.headLane.navBtn;
        navLane.classList.add(this.styles.headLane.nav);

        btnNav.addEventListener("click", (event) => {
            let action = btnNav.nextElementSibling;
            action.classList.toggle(this.styles.headLane.navActive);
        });

        const actionBlock = this.createActionsBlock(nameLane);

        btnNav.appendChild(imgBtn);
        navLane.appendChild(btnNav);
        navLane.appendChild(actionBlock);

        return navLane;
    }
    // create headlane
    createHeadLane(nameLane) {
        let headLane = document.createElement("div");
        let titleLane = document.createElement("code");
        let textNode = document.createTextNode(`/r/${nameLane}`);

        headLane.classList = this.styles.headLane.wrap;
        titleLane.classList = this.styles.headLane.title;

        const navLane = this.createHeadNav(nameLane);

        titleLane.appendChild(textNode);
        headLane.appendChild(titleLane);
        headLane.appendChild(navLane);

        return headLane;
    }
    // create new lane node
    createReadditLane({ name }) {
        let laneWrap = document.createElement("div");
        laneWrap.classList = this.styles.wrap;
        this.countLanes++;
        laneWrap.id = `${name}-${this.countLanes}`;

        // create head lane
        const headLane = this.createHeadLane(name);
        // add head to lane
        laneWrap.appendChild(headLane);

        /**
         * after add head call fetch data here
         */

        return laneWrap;
    }

    showLaneController() {
        this.btnShowFormAdd.addEventListener("click", (event) => {
            this.formAddLane.classList.add("reddit__create-block--active");
        });
    }

    eventCreate() {
        this.btnAddLane.addEventListener("click", () => {
            this.createNewLane();
        });
        this.inputLaneTitle.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.createNewLane();
            }
        });
    }
    createNewLane() {
        let msgError = document.querySelector(".error_msg-js");
        if (this.inputLaneTitle.value == "") {
            msgError.innerHTML = "Please enter title of task!";
            msgError.classList.add("form__error-msg--show");
            this.inputLaneTitle.classList.add("form__error");
        } else {
            msgError.innerHTML = "";
            this.inputLaneTitle.classList.remove("form__error");
            const redditLane = document.getElementById(this.controls.dynamicLane);
            const laneWrap = this.createReadditLane({ name: this.inputLaneTitle.value });
            // add before last lane
            redditLane.insertBefore(laneWrap, this.btnShowFormAdd.parentElement);

            // reset form
            this.formAddLane.classList.remove("reddit__create-block--active");
            this.inputLaneTitle.value = "";

            // hide actions block if click outside
            this.hideAllActions();
        }
    }

    hideAllActions() {
        let actions = document.querySelectorAll(`.${this.controls.actionBlock}`);

        document.addEventListener("click", (event) => {
            const isButtonOrNav =
                event.target.closest(`.${this.controls.navActions}`) ||
                event.target.closest(`.${this.controls.actionBlock}`);
            if (!isButtonOrNav) {
                actions.forEach((item) => {
                    item.classList.remove(this.styles.headLane.navActive);
                });
            }
        });
    }
}

const redditClient = new RedditClient();
