const calculator = document.querySelector(".calculator");

const displayElement = document.querySelector(".current-value");

const historyElement = document.querySelector(".history");

const keysContainer = document.querySelector(".keys");

keysContainer.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const { type, value } = button.dataset;
  // key-types: number, operator, calculate, clear, decimal
  if (type === "number") {
    inputNumber(value);
    return;
  }
  if (type === "operator") {
    inputOperator(value);
    return;
  }
  if (type === "calculate") {
    calculateResult();
    return;
  }
  if (type === "decimal") {
    inputDecimal();
    return;
  }
  if (type === "clear") {
    clearCalculator();
    return;
  }
  if (type === "sign") {
    toggleSign();
    return;
  }
  if (type === "percent") {
    percentage();
    return;
  }
});
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) {
    inputNumber(key);
    return;
  }
  switch (key) {
    case "+":
      inputOperator("add");
      break;
    case "-":
      inputOperator("subtract");
      break;
    case "*":
      inputOperator("multiply");
      break;
    case "/":
      e.preventDefault();
      inputOperator("divide");
      break;
    case "=":
    case "Enter":
      calculateResult();
      break;
    case ".":
      inputDecimal();
      break;
    case "Escape":
      clearCalculator();
      break;
    case "Backspace":
      backspace();
      break;
    case "%":
      percentage();
      break;
  }
});
const INITIAL_STATE = {
  displayValue: "0",
  firstValue: null,
  operator: null,
  waitingForSecondValue: false,
};
const calculatorState = {
  ...INITIAL_STATE,
};

function updateDisplay() {
  displayElement.textContent = calculatorState.displayValue;
}

updateDisplay();

function inputNumber(number) {
  if (calculatorState.waitingForSecondValue) {
    calculatorState.displayValue = number;
    calculatorState.waitingForSecondValue = false;
  } else {
    calculatorState.displayValue =
      calculatorState.displayValue === "0"
        ? number
        : calculatorState.displayValue + number;
    // if(calculatorState.displayValue === '0') {
    //     calculatorState.displayValue = number
    // } else {
    //     calculatorState.displayValue += number
    // }
  }
  updateDisplay();
}

function inputOperator(nextOperator) {
  const { firstValue, operator, displayValue } = calculatorState;

  if (firstValue === null) calculatorState.firstValue = displayValue;
  else if (operator) {
    const result = calculate(firstValue, displayValue, operator);

    calculatorState.displayValue = String(result);
    calculatorState.firstValue = String(result);

    updateDisplay();
  }
  calculatorState.waitingForSecondValue = true;
  calculatorState.operator = nextOperator;
}
// function inputOperator(operator) {
//     calculatorState.firstValue = calculatorState.displayValue;
//     calculatorState.operator = operator;
//     calculatorState.waitingForSecondValue = true;
//     console.log(calculatorState);
// }

function inputDecimal() {
  if (calculatorState.waitingForSecondValue) {
    calculatorState.displayValue = "0.";
    calculatorState.waitingForSecondValue = false;
    updateDisplay();
    return;
  }
  if (calculatorState.displayValue.includes(".")) return;
  calculatorState.displayValue += ".";

  updateDisplay();
}

function calculateResult() {
  if (calculatorState.firstValue === null || calculatorState.operator === null)
    return;

  const result = calculate(
    calculatorState.firstValue,
    calculatorState.displayValue,
    calculatorState.operator,
  );

  calculatorState.displayValue = String(result);
  calculatorState.firstValue = null;
  calculatorState.operator = null;
  calculatorState.waitingForSecondValue = false;

  updateDisplay();
}

function calculate(firstValue, secondValue, operator) {
  const first = Number(firstValue);
  const second = Number(secondValue);

  // switch(operator) {
  //     case 'add':
  //        return first + second;
  //     case 'subtract':
  //        return first - second;
  //     case 'multiply':
  //        return first * second;
  //     case 'divide':
  //        return second === 0 ? "Error" : first / second;
  // }

  return operations[operator](first, second);
}

const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => (b === "0" ? "Error" : (a / b).toFixed(2)),
};

function clearCalculator() {
  Object.assign(calculatorState, INITIAL_STATE);

  updateDisplay();
}

function backspace() {
  if (calculatorState.waitingForSecondValue) return;

  if (calculatorState.displayValue.length === 1)
    calculatorState.displayValue = "0";
  else calculatorState.displayValue = calculatorState.displayValue.slice(0, -1);

  updateDisplay();
}

function toggleSign() {
  if (calculatorState.displayValue === "0") return;

  calculatorState.displayValue = String(
    Number(calculatorState.displayValue) * -1,
  );

  updateDisplay();
}

function percentage() {
  calculatorState.displayValue = String(
    Number(calculatorState.displayValue) / 100
  );
  updateDisplay();
}

