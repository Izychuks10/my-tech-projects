class RedditClient {
    static STYLE_CLASSES = {
        wrap: "reddit__lane",
        headLane: {
            wrap: "flex flex--x al-center space-bet reddit__lane-head",
            title: "reddit__source",
            nav: "reddit__nav",
            navActionBtn: "btn btn--none-style",
            navActionBlock: "reddit__actions",
            navActive: "reddit__actions--active",
        },
        bodyLane: {
            container: "reddit__lane-body",
            postsWrap: "reddit__posts",
            postItem: "flex flex--x flex--x-start gap-2 reddit__post-item",
            postVote: "flex flex--y al-center reddit__votes",
            postTitleWrap: "flex flex--y flex--y-end gap-2",
        },
    };

    static CONTROL_CLASSES = {
        dynamicLane: "reddit_lane-js",
        actionBtn: "nav_btn-js",
        actionBlock: "actions_block-js",
        postsWrap: "reddit_posts-js",
        refreshLane: "refresh_lane-js",
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

    // action control in lane
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
        listAction.classList.add(...[`${this.styles.headLane.navActionBlock}`, `${this.controls.actionBlock}`]);

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
    // header navigation lane
    createHeadNav(nameLane) {
        let navLane = document.createElement("div");
        let btnNav = document.createElement("button");
        let imgBtn = document.createElement("img");

        // setup nav button
        imgBtn.src = "assets/images/nav.svg";
        imgBtn.classList.add("icon");

        btnNav.classList = this.styles.headLane.navActionBtn; // change
        btnNav.classList.add(this.controls.actionBtn);

        navLane.classList.add(this.styles.headLane.nav);

        // add event for button navigation
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
    // create header lane
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

    // post item
    createPostItem({ title, author, permalink, ups }) {
        let postItem = document.createElement("div");
        postItem.classList = this.styles.bodyLane.postItem;

        // post vote
        let postVote = document.createElement("div");
        let voteIcon = document.createElement("img");
        let voteCount = document.createElement("span");
        let voteText = document.createTextNode(ups);
        postVote.classList = this.styles.bodyLane.postVote;
        voteIcon.src = "assets/images/cheron-up.svg";
        voteIcon.classList.add("icon");
        voteCount.classList.add("reddit__ups");

        voteCount.appendChild(voteText);
        postVote.appendChild(voteIcon);
        postVote.appendChild(voteCount);

        // post title
        let postTitleWrap = document.createElement("div");
        postTitleWrap.classList = this.styles.bodyLane.postTitleWrap;
        let postTitle = document.createElement("a");
        let titleText = document.createTextNode(title);
        postTitle.href = `${permalink}`;
        postTitle.target = "_blank";
        postTitle.classList.add("reddit__title");
        postTitle.appendChild(titleText);
        let authorWrap = document.createElement("span");
        let authorText = document.createTextNode(author);
        authorWrap.classList.add("reddit__author");
        authorWrap.appendChild(authorText);
        postTitleWrap.appendChild(postTitle);
        postTitleWrap.appendChild(authorWrap);

        postItem.appendChild(postVote);
        postItem.appendChild(postTitleWrap);

        return postItem;
    }
    // body
    createBodyLane() {
        let postsWrap = document.createElement("div");

        let postItem = this.createPostItem({
            title: "let try make another title with    more spaces    ",
            author: "iampine",
            permalink: "local",
            ups: "23.6599",
        });

        postsWrap.appendChild(postItem);

        return postsWrap;
    }

    // create new lane node
    createRedditLane({ name }) {
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
        let lanePosts = this.createBodyLane();
        laneWrap.appendChild(lanePosts);

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

            // format string name
            let nameLane = this.inputLaneTitle.value;
            nameLane = nameLane.replace(/ /g, "");
            // begin create lane
            const laneWrap = this.createRedditLane({ name: nameLane });

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
                event.target.closest(`.${this.controls.actionBtn}`) ||
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
