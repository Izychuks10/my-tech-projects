class ConverterTemperature {
    static TEMPERATURE_SYSTEM = [
        { name: "Kelvin", type: "temperature", symbol: "K", absZero: 0, freezePoint: 273.15 },
        { name: "Celsius", type: "temperature", symbol: "C", absZero: -273.15, freezePoint: 0 },
        { name: "Fahrenheit", type: "temperature", symbol: "F", absZero: -459.67, freezePoint: 32 },
    ];

    static STYLE_CLASSES = { classDiv: "select__value", classInput: "select__input", classLabel: "select__input-text" };
    static CONTROL_CLASSES = {
        selectList: ".select-js",
        selectListLabel: ".select__list-js",
        selectListInput: ".select__current-js",
    };
    static SIGN_DEGREE = "°";
    static RESULT = document.getElementById("valueConverted");

    constructor() {
        this.initUnitSystem();
    }

    // setup create list node - use for all dynamic load list select
    createListNode(name, symbol, target) {
        let textSymbol = `(${symbol == "C" || symbol == "F" ? ConverterTemperature.SIGN_DEGREE + symbol : symbol})`;
        let textLabel = name + textSymbol;
        let li = document.createElement("li");
        let label = document.createElement("label");
        let text = document.createTextNode(textLabel);
        label.setAttribute("for", `${target}-${symbol}`);
        label.classList.add(`${target}_select-js`);
        li.appendChild(label);
        label.appendChild(text);
        return li;
    }
    // setup create input radio node
    createInputListNode(symbol, target, checkedDefault) {
        let textSymbol = symbol == "C" || symbol == "F" ? ConverterTemperature.SIGN_DEGREE + symbol : symbol;
        let textLabel = textSymbol;
        let div = document.createElement("div");
        let input = document.createElement("input");
        let label = document.createElement("label");
        let text = document.createTextNode(textLabel);
        // add classes
        div.className = ConverterTemperature.STYLE_CLASSES.classDiv;
        input.className = ConverterTemperature.STYLE_CLASSES.classInput;
        label.className = ConverterTemperature.STYLE_CLASSES.classLabel;
        // setup input
        input.type = "radio";
        input.id = `${target}-${symbol}`;
        input.value = symbol;
        input.name = `unit-${target}`;
        checkedDefault == "checked" ? (input.checked = "checked") : false;
        // setup label
        label.appendChild(text);
        div.appendChild(input);
        div.appendChild(label);

        return div;
    }

    initUnitSystem() {
        let classesListControl = ConverterTemperature.CONTROL_CLASSES;
        const selectList = document.querySelectorAll(classesListControl.selectList);
        const selectInput = document.querySelectorAll(classesListControl.selectListInput);
        const selectLabel = document.querySelectorAll(classesListControl.selectListLabel);

        selectList.forEach((select, indexItem) => {
            let targetData = select.getAttribute("target-data");
            selectInput[indexItem].innerHTML = "";
            selectLabel[indexItem].innerHTML = "";

            ConverterTemperature.TEMPERATURE_SYSTEM.forEach((unit, indexUnit) => {
                let nodeLabel = this.createListNode(unit.name, unit.symbol, targetData);
                let nodeInput = this.createInputListNode(unit.symbol, targetData, indexUnit == 0 ? "checked" : "");

                nodeLabel.addEventListener("click", (event) => {
                    this.resetListActive(`${targetData}_select-js`);
                    event.target.classList.add("active");
                });

                selectInput[indexItem].appendChild(nodeInput);
                selectLabel[indexItem].appendChild(nodeLabel);
            });
        });
    }

    resetListActive(classListItem) {
        let listSelectItems = document.querySelectorAll(`.${classListItem}`);
        listSelectItems.forEach((item) => {
            item.classList.remove("active");
        });
    }
}

const selectBox = new ConverterTemperature();
