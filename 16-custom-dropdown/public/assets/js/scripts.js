class SelectBoxDynamic {
    constructor() {
        this.listSelectItems = document.querySelectorAll(".selectItem-js");

        this.setSelectedItem();
    }

    setSelectedItem() {
        this.listSelectItems.forEach((item) => {
            item.classList.remove("active");
            item.addEventListener("click", (event) => {
                let radioInput = document.getElementById(event.target.getAttribute("for"));
                radioInput.setAttribute("checked", true);
                this.resetListActive();
                event.target.classList.add("active");
            });
        });
    }
    resetListActive() {
        this.listSelectItems.forEach((item) => {
            item.classList.remove("active");
        });
    }
}

const selectBox = new SelectBoxDynamic();
