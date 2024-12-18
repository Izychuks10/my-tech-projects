class RandomRepoGH {
    static API_URLS = {
        // languages:
        //     "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json",
        searchRepo: "https://api.github.com/search/repositories?q=",
    };

    static DEFAULT_LANGUAGES = [
        { title: "Select Languages", value: "0" },
        { title: "Javascript", value: "javascript" },
        { title: "TypeScript", value: "TypeScript" },
        { title: "HTML", value: "HTML" },
        { title: "SCSS", value: "SCSS" },
        { title: "PHP", value: "PHP" },
        { title: "C", value: "c" },
    ];

    static STYLE_CLASSES = { classDiv: "select__value", classInput: "select__input", classLabel: "select__input-text" };
    static CONTROL_CLASSES = {
        listNode: ".select__list-js",
        inputNode: ".select__current-js",
        resultArea: ".resultArea-js",
        btnRefreshID: "refresh-js",
    };

    constructor() {
        this.APIURLs = RandomRepoGH.API_URLS;
        this.controlClasses = RandomRepoGH.CONTROL_CLASSES;
        this.dataResult = {};
        this.resultArea = document.querySelector(this.controlClasses.resultArea);

        this.btnRefresh = document.getElementById(this.controlClasses.btnRefreshID);

        this.renderListLanguageSelect();
        this.refreshRepo();
    }

    async renderListLanguageSelect() {
        let listSelect = document.querySelector(this.controlClasses.listNode);
        let inputSelect = document.querySelector(this.controlClasses.inputNode);
        let data;

        if (!this.APIURLs.languages) {
            data = RandomRepoGH.DEFAULT_LANGUAGES;
        } else {
            const url = this.APIURLs.languages;

            data = await this.fetchData({ url: url });
        }

        data.forEach((item, index) => {
            let liNode = this.createListNode({ textNode: item.title, targetFor: item.value });
            let inputNode = this.createInputNode({
                textNode: item.title,
                value: item.value,
                checkDefault: index == 0 ? "checked" : "",
            });
            listSelect.appendChild(liNode);
            inputSelect.appendChild(inputNode);
        });
    }

    renderRepoInfo({ stars, forks, issues }) {
        return `
            <ul class="flex flex--x flex--wrap al-center gap-6 repo__list">
                <li class="flex flex--x flex--wrap al-center gap-2">
                    <svg height="16" width="16" viewBox="0 0 16 16" fill="#59636e">
                        <path
                            d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z">
                        </path>
                    </svg>
                    <span>${stars}</span>
                </li>
                <li class="flex flex--x flex--wrap al-center gap-2">
                    <svg height="16" width="16" viewBox="0 0 16 16" fill="#59636e">
                        <path
                            d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z">
                        </path>
                    </svg>
                    <span>${forks}</span>
                </li>
                <li class="flex flex--x flex--wrap al-center gap-2">
                    <svg height="16" width="16" viewBox="0 0 16 16" fill="#59636e">
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                        <path
                            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z">
                        </path>
                    </svg>
                    <span>${issues}</span>
                </li>
            </ul>
        `;
    }
    renderRepoLang(languageArray) {
        let htmlRepoLang = `<ul class="flex flex--x flex--wrap al-center gap-2 repo__list">`;
        let strLi = "";

        languageArray.forEach((item) => {
            let bgColor = Math.floor(Math.random() * 16777215).toString(16);

            strLi += `
                <li class="flex flex--x flex--wrap al-center gap-1">
                    <svg height="16" width="16" viewBox="0 0 16 16" fill="#${bgColor}">
                        <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
                    </svg>
                    <span>${item}</span>
                </li>
            `;
        });

        return (htmlRepoLang += strLi);
    }

    async renderResult() {
        let repoData = this.dataResult.data.items;
        const randomIndex = Math.floor(Math.random() * repoData.length);

        let languageData = await this.getLanguagesInRepo(repoData[randomIndex].languages_url);
        let headerInfo = `
                <a href="${repoData[randomIndex].html_url}" target="_blank"><h5 class="repo__name">${repoData[randomIndex].name}</h5></a>
                <p class="repo__desc">${repoData[randomIndex].description}</p>
            `;
        let renderRepoInfo = this.renderRepoInfo({
            stars: repoData[randomIndex].stargazers_count,
            forks: repoData[randomIndex].forks_count,
            issues: repoData[randomIndex].open_issues_count,
        });
        let renderRepoLang = this.renderRepoLang(languageData);

        this.resultArea.innerHTML = headerInfo + renderRepoInfo + renderRepoLang;
    }

    refreshRepo() {
        this.btnRefresh.addEventListener("click", async () => {
            this.resultArea.innerHTML = "Refreshing repository...";
            this.renderResult();
        });
    }

    createListNode({ textNode, targetFor }) {
        let liEle = document.createElement("li");
        let labelEle = document.createElement("label");
        let labelText = document.createTextNode(textNode);

        labelEle.classList.add("list_lang-js");
        labelEle.setAttribute("for", targetFor.toLocaleLowerCase());
        labelEle.addEventListener("click", (event) => {
            this.resetListActive("list_lang-js");
            event.target.classList.add("active");
        });

        labelEle.appendChild(labelText);
        liEle.appendChild(labelEle);

        return liEle;
    }
    createInputNode({ textNode, value, checkDefault }) {
        let classes = RandomRepoGH.STYLE_CLASSES;

        let divEle = document.createElement("div");
        let inputEle = document.createElement("input");
        let labelEle = document.createElement("label");
        let labelText = document.createTextNode(textNode);

        divEle.classList.add(classes.classDiv);
        inputEle.classList.add(classes.classInput);
        labelEle.classList.add(classes.classLabel);

        inputEle.type = "radio";
        inputEle.id = value.toLocaleLowerCase();
        inputEle.name = "dev-lang";
        inputEle.value = value.toLocaleLowerCase();
        checkDefault == "checked" ? inputEle.setAttribute("checked", "") : "";
        labelEle.setAttribute("for", value.toLocaleLowerCase());

        labelEle.appendChild(labelText);
        divEle.appendChild(inputEle);
        divEle.appendChild(labelEle);

        inputEle.addEventListener("change", (event) => {
            this.resultArea.innerHTML = "Loading data...";
            this.getRepoByLanguage(event.target.value);
            this.btnRefresh.style.display = "block";
        });

        return divEle;
    }
    resetListActive(classListItem) {
        let listSelectItems = document.querySelectorAll(`.${classListItem}`);
        listSelectItems.forEach((item) => {
            item.classList.remove("active");
        });
    }

    async getRepoByLanguage({ language = null }) {
        let lang = language == null ? "javascript" : language;

        const options = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "User-Agent": "Github-Random-Reposiory",
                "X-GitHub-Api-Version": "2022-11-28",
                "Content-Type": "application/json",
            },
        };

        const url = `${this.APIURLs.searchRepo}language:${lang}&sort=stars&order=desc&per_page=20`;

        this.dataResult = await this.fetchData({ url: url, options: options });

        if (this.dataResult.isLoading) {
            this.resultArea.innerHTML = "Loading data...";
        }

        if (this.dataResult.isError) {
            this.resultArea.classList.add("random-repo__result--error");
            this.resultArea.innerHTML = "Error fetching respositories!";
        } else {
            this.renderResult();
        }
    }
    async getLanguagesInRepo(languageUrl) {
        let languages = await this.fetchData({ url: languageUrl });

        return Object.keys(languages.data);
    }
    async fetchData({ url, options = null }) {
        let results = {
            data: null,
            isLoading: true,
            isError: false,
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            results.data = data;
        } catch (error) {
            console.log(error);
            results.isError = true;
        } finally {
            results.isLoading = false;
        }

        return results;
    }
}

const randomRepoGH = new RandomRepoGH();
