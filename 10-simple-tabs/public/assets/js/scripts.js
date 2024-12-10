class DynamicTabs {
    static tabsNavName = "tab__nav-item-js";
    static tabsContentName = "tab__content-js";
    static listTabsNav = document.getElementsByClassName(this.tabsNavName);
    static listTabsContent = document.getElementsByClassName(this.tabsContentName);

    constructor() {
        this.initTabActive();
    }

    initTabActive() {
        let isActiveTab = document.querySelectorAll(`label[class="${DynamicTabs.tabsNavName} active"]`);

        for (let i = 0; i < DynamicTabs.listTabsNav.length; i++) {
            if (isActiveTab.length == 0) {
                let firstActiveEle = DynamicTabs.listTabsNav[0];
                firstActiveEle.classList.add("active");
                this.setTabContentActive(firstActiveEle.attributes.getNamedItem("for").value);
            }

            const element = DynamicTabs.listTabsNav[i];
            element.addEventListener("click", (event) => {
                this.resetActiveTab();

                element.classList.add("active");

                let activeTabID = element.attributes.getNamedItem("for").value;
                this.setTabContentActive(activeTabID);
            });
        }
    }

    setTabContentActive(idString) {
        let tabContentActive = document.getElementById(idString);
        tabContentActive.classList.add("active");
    }

    resetActiveTab() {
        for (let i = 0; i < DynamicTabs.listTabsNav.length; i++) {
            const element = DynamicTabs.listTabsNav[i];
            if (element.classList.contains("active")) {
                element.classList.remove("active");
            }
        }
        for (let i = 0; i < DynamicTabs.listTabsContent.length; i++) {
            const element = DynamicTabs.listTabsContent[i];
            if (element.classList.contains("active")) {
                element.classList.remove("active");
            }
        }
    }
}
const dynamicTabs = new DynamicTabs();
