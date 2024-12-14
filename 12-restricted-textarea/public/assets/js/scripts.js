class TextareaCounter {
    constructor() {
        this.txtArea = document.getElementById("txtarea-js");
        this.txtAreaInput = document.getElementById("txtarea__input-js");
        this.counter = document.getElementById("txtarea__counter-js");
        this.maxlength =
            this.txtAreaInput.getAttribute("maxlength") !== null ? this.txtAreaInput.getAttribute("maxlength") : 255;

        this.setCounter();
        this.checkCounter();
    }

    checkCounter() {
        this.txtAreaInput.addEventListener("keypress", (event) => {
            let count = this.maxlength - event.target.value.length;
            this.setCounter(count);
            if (count === 0) {
                this.txtArea.classList.add("txtarea--maximum");
            }
        });
    }
    setCounter(count = 0) {
        this.counter.innerHTML = `${count}/${this.maxlength}`;
    }
}
const txtAreaCounter = new TextareaCounter();
