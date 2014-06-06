var globalEval = eval;

window.Dict = function () {};
window.Dict.prototype.set = function() { return "asd"; };
window.Dict.prototype.get = function() { return 123; };

module.exports = function (element) {
    evalSample(element);
    addInput(element);
};

function evalSample(element) {
    var statementEls = element.querySelectorAll(".repl-input");

    for (var i = 0; i < statementEls.length; i++) {
        var statementEl = statementEls[i];
        var output = createOutputElement(evaluate(statementEl.textContent));

        if (output) {
            if (statementEl.nextElementSibling) {
                element.insertBefore(output, statementEl.nextElementSibling);
            } else {
                element.appendChild(output);
            }
        }
    }
}

function evaluate(source) {
    var result;
    try {
        result = JSON.stringify(globalEval(source));
    } catch (error) {
        result = error.name + ": " + error.message;
    }
    return result;
}

function createInputElement(source) {
    var input = document.createElement("span");
    input.classList.add("repl-input");
    input.textContent = source + "\n";

    return input;
}

function createOutputElement(result) {
    if (typeof result !== "undefined") {
        var output = document.createElement("span");
        output.classList.add("repl-output");
        output.textContent = result + "\n";

        return output;
    }
}

function addInput(element) {
    var container = document.createElement("div");
    container.classList.add("repl-command");

    var input = document.createElement("input");
    input.placeholder = "\u276F";

    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            var input = createInputElement(this.value);
            element.insertBefore(input, container);
            var output = createOutputElement(evaluate(this.value));
            element.insertBefore(output, container);
            this.value = "";
        }
    });
    container.appendChild(input);

    element.appendChild(container);
}
