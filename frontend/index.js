import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentValue = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.classList.contains('number') || button.classList.contains('decimal')) {
            if (waitingForSecondOperand) {
                display.value = value;
                waitingForSecondOperand = false;
            } else {
                display.value += value;
            }
            currentValue = display.value;
        } else if (button.classList.contains('operator')) {
            if (firstOperand === null) {
                firstOperand = parseFloat(currentValue);
            } else if (operator) {
                const result = operate(firstOperand, parseFloat(currentValue), operator);
                display.value = result;
                firstOperand = result;
            }
            waitingForSecondOperand = true;
            operator = value;
        } else if (button.classList.contains('equals')) {
            if (operator && firstOperand !== null) {
                const secondOperand = parseFloat(currentValue);
                const result = operate(firstOperand, secondOperand, operator);
                display.value = result;
                firstOperand = result;
                operator = null;
                waitingForSecondOperand = true;
            }
        } else if (button.classList.contains('clear')) {
            clear();
        }
    });
});

async function operate(a, b, op) {
    switch (op) {
        case '+':
            return await backend.add(a, b);
        case '-':
            return await backend.subtract(a, b);
        case '*':
            return await backend.multiply(a, b);
        case '/':
            const result = await backend.divide(a, b);
            return result !== null ? result : 'Error';
        default:
            return 'Error';
    }
}

function clear() {
    display.value = '';
    currentValue = '';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}
