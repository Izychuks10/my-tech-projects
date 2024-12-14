class AccordionDynamic {
    static ACCTIVE_CLASS = "accordion__item--active";
    static CONTROLS = {
        targetID: "target-id",
        title: ".accordion__title-js",
        content: ".accordion__content-js",
        accordion: "accordion-js",
    };

    constructor() {
        this.accordion = document.getElementById(AccordionDynamic.CONTROLS.accordion);
        this.titles = document.querySelectorAll(AccordionDynamic.CONTROLS.title);
        this.contents = document.querySelectorAll(AccordionDynamic.CONTROLS.content);

        this.contentTarget = null;
        this.collapse = this.accordion.getAttribute("data-collapse");

        this.initAccordions();
    }

    initAccordions() {
        this.titles.forEach((title) => {
            title.addEventListener("click", (event) => {
                // get new target id
                const newTargetID = event.target.getAttribute(AccordionDynamic.CONTROLS.targetID);

                // check new target id equal to current target id => set new target
                this.contentTarget = newTargetID === this.contentTarget ? null : newTargetID;
                // update content active
                this.setContentActive();
            });
        });
    }

    setContentActive() {
        this.contents.forEach((content) => {
            // get data id content
            const contentID = content.getAttribute("id");

            // if collapse true => just open current accorion
            if (this.collapse == "true") {
                // check if content id equal with current content target => call the parrent DOM and set class active
                contentID === this.contentTarget
                    ? content.parentElement.classList.add(AccordionDynamic.ACCTIVE_CLASS)
                    : content.parentElement.classList.remove(AccordionDynamic.ACCTIVE_CLASS);
            } else {
                // only close accordion when click it again
                if (contentID === this.contentTarget) {
                    !content.parentElement.classList.contains(AccordionDynamic.ACCTIVE_CLASS)
                        ? content.parentElement.classList.add(AccordionDynamic.ACCTIVE_CLASS)
                        : content.parentElement.classList.remove(AccordionDynamic.ACCTIVE_CLASS);
                }
            }
        });
    }
}

const accordionDynamic = new AccordionDynamic();
