// Select the calculator container, display element, and the div containing all calculator buttons
const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const calculatorButtonsDiv = calculator.querySelector('.calculator__keys')

// Add a click event listener to the calculator buttons container to handle button clicks
calculatorButtonsDiv.addEventListener('click', event => {
    const button = event.target
    const { previousButtonType } = calculator.dataset
    const { buttonType, key } = button.dataset
    const result = display.textContent

    //Release operator pressed state
    const operatorKeys = [...calculatorButtonsDiv.children].filter(
        button => button.dataset.buttonType === 'operator',
    )
    operatorKeys.forEach(button => button.classList.remove('is-pressed'))

    //Handle number button clicks
    if (buttonType === 'number') {
        if (result === '0') {
            display.textContent = key
        } else {
            display.textContent = result + key
        }
    }

    //Handle input right after operator
    if (previousButtonType === 'operator') {
        display.textContent = key
    }

    //Handle decimal button clicks
    if (buttonType === 'decimal') {
        display.textContent = result + "."
    }

    //Handle operator button clicks
    if (buttonType === 'operator') {
        button.classList.add('is-pressed')
        calculator.dataset.firstValue = result //save the first value
        calculator.dataset.operator = button.dataset.key //save the operator key
    }

    //Handle equal button click
    if (buttonType === 'equal') {
        const firstValue = parseFloat(calculator.dataset.firstValue)
        const operator = calculator.dataset.operator
        const secondValue = parseFloat(result)

        let newResult
        if (operator === 'plus') newResult = firstValue + secondValue
        if (operator === 'minus') newResult = firstValue - secondValue
        if (operator === 'times') newResult = firstValue * secondValue
        if (operator === 'divide') newResult = firstValue / secondValue
    
        display.textContent = newResult
    }
    
    //Handle clear button click
    if (buttonType === 'clear') {
        if (button.textContent === 'AC') {
            delete calculator.dataset.firstValue
            delete calculator.dataset.operator
        }

        display.textContent = '0'
        button.textContent = 'AC'
    }

    //Change clear button text based on last action
    if (buttonType !=='clear') {
        const clearButton = calculator.querySelector('[data-button-type=clear]')
        clearButton.textContent = 'CE'
    }

    //store the current button's type as previousButtonType in dataset for next click reference
    calculator.dataset.previousButtonType = buttonType
})