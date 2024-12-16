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
        valueConvert: "valueConvert",
        btnExecute: "btnConvert",
    };
    static SIGN_DEGREE = "°";

    static DATA_CONVERT_COLLECTED = { fromUnit: "K", toUnit: "K", valueConvert: 0, freezePoint: 0, absZero: 0 };
    static RESULT = document.getElementById("valueConverted");

    constructor() {
        this.dataConvert = ConverterTemperature.DATA_CONVERT_COLLECTED;
        this.controls = ConverterTemperature.CONTROL_CLASSES;
        this.detailUnits = {
            from: this.getDetailUnits(this.dataConvert.fromUnit),
            to: this.getDetailUnits(this.dataConvert.toUnit),
        };
        this.resultEle = document.getElementById("result-js");

        this.initUnitSystem();
        this.prepareData();
        this.converterExecute();
    }

    prepareData() {
        // add event for select units
        const fromUnits = document.querySelectorAll("input[name=fromUnit]");
        const toUnits = document.querySelectorAll("input[name=toUnit]");
        fromUnits.forEach((item) => {
            item.addEventListener("change", (event) => {
                this.dataConvert.fromUnit = event.target.value; // set to collect data
                this.detailUnits.from = this.getDetailUnits(event.target.value);
            });
        });
        toUnits.forEach((item) => {
            item.addEventListener("change", (event) => {
                this.dataConvert.toUnit = event.target.value; // set to collect data
                this.detailUnits.to = this.getDetailUnits(event.target.value);
            });
        });

        const msgError = document.getElementById("invalidValueConvert");
        const inputConvert = document.getElementById(this.controls.valueConvert);
        inputConvert.addEventListener("change", (event) => {
            if (isNaN(inputConvert.value)) {
                msgError.classList.add("form__error-msg--show");
                inputConvert.classList.add("form__error");
                msgError.innerHTML = "Invalid value convert! Must be a number!";
            } else {
                msgError.classList.remove("form__error-msg--show");
                inputConvert.classList.remove("form__error");
                this.dataConvert.valueConvert = inputConvert.value;
            }
        });
    }

    converterExecute() {
        const execute = document.getElementById(this.controls.btnExecute);
        execute.addEventListener("click", (event) => {
            let objConvertData = {
                toUnit: this.dataConvert.toUnit,
                valueConvert: Number(this.dataConvert.valueConvert),
                fromFreezePoint: this.detailUnits.from.freezePoint,
                toFreezePoint: this.detailUnits.to.freezePoint,
            };

            let result = 0;

            if (this.dataConvert.fromUnit == "C") {
                result = this.celsiusConverter(objConvertData);
            } else if (this.dataConvert.fromUnit == "K") {
                result = this.kelvinConverter(objConvertData);
            } else {
                result = this.fahrenheitConverter(objConvertData);
            }

            this.resultEle.innerHTML = "";
            if (result === result && result % 1 !== 0) {
                this.resultEle.innerHTML = Number(result.toFixed(6));
            } else {
                this.resultEle.innerHTML = result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        });
    }

    getDetailUnits(unit) {
        let dataTemp = ConverterTemperature.TEMPERATURE_SYSTEM;

        for (let i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i]["symbol"] === unit) {
                let detailUnit = {
                    absZero: dataTemp[i]["absZero"],
                    freezePoint: dataTemp[i]["freezePoint"],
                };
                return detailUnit;
            }
        }
        return -1;
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

        label.addEventListener("click", (event) => {
            this.resetListActive(`${target}_select-js`);
            event.target.classList.add("active");
        });

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
        input.name = `${target}Unit`;
        checkedDefault == "checked" ? input.setAttribute("checked", "") : "";

        // setup label
        label.setAttribute("for", `${target}-${symbol}`);

        label.appendChild(text);
        div.appendChild(input);
        div.appendChild(label);

        return div;
    }

    initUnitSystem() {
        const classesListControl = ConverterTemperature.CONTROL_CLASSES;
        const selectList = document.querySelectorAll(classesListControl.selectList);
        const selectInput = document.querySelectorAll(classesListControl.selectListInput);
        const selectLabel = document.querySelectorAll(classesListControl.selectListLabel);

        selectList.forEach((select, indexItem) => {
            let targetData = select.getAttribute("target-data");
            selectInput[indexItem].innerHTML = "";
            selectLabel[indexItem].innerHTML = "";

            ConverterTemperature.TEMPERATURE_SYSTEM.forEach((unit, indexUnit) => {
                let nodeList = this.createListNode(unit.name, unit.symbol, targetData);
                let nodeInput = this.createInputListNode(unit.symbol, targetData, indexUnit == 0 ? "checked" : "");

                selectLabel[indexItem].appendChild(nodeList);
                selectInput[indexItem].appendChild(nodeInput);
            });
        });
    }

    resetListActive(classListItem) {
        let listSelectItems = document.querySelectorAll(`.${classListItem}`);
        listSelectItems.forEach((item) => {
            item.classList.remove("active");
        });
    }

    // functions converter
    celsiusConverter({ toUnit, valueConvert, fromFreezePoint, toFreezePoint }) {
        switch (toUnit) {
            case "K":
                return valueConvert + toFreezePoint;
            case "F":
                return valueConvert * 1.8 + toFreezePoint;
            default:
                return valueConvert;
        }
    }
    kelvinConverter({ toUnit, valueConvert, fromFreezePoint, toFreezePoint }) {
        switch (toUnit) {
            case "C":
                return valueConvert - fromFreezePoint;
            case "F":
                return (valueConvert - fromFreezePoint) * 1.8 + toFreezePoint;
            default:
                return valueConvert;
        }
    }
    fahrenheitConverter({ toUnit, valueConvert, fromFreezePoint, toFreezePoint }) {
        switch (toUnit) {
            case "C":
                return (valueConvert - fromFreezePoint) / 1.8;
            case "K":
                return (valueConvert - fromFreezePoint) / 1.8 + toFreezePoint;
            default:
                return valueConvert;
        }
    }
}

const selectBox = new ConverterTemperature();
