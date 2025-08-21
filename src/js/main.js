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

        // console.log('Set firstValue:', calculator.dataset.firstValue)
        // console.log('Set operator:', calculator.dataset.operator)
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

//Testing
//=======
// Functions
/**
 * Gets displayed value
 * 
 */
function getDisplayValue() {
    return calculator.querySelector('.calculator__display').textContent
}

/**
 * Presses calulator key 
 * @param {string} key
 */

function pressKey(key) {
    calculator.querySelector(`[data-key="${key}"]`).click()
}

/**
 * Presses calculator keys in sequence
 * @param {...any} keys
 */
function pressKeys(...keys) {
    keys.forEach(key => pressKey(key))
}

/**
 * Resets calculator
 */
function resetCalculator() {
    pressKey('clear')
    pressKey('clear')

    console.assert(getDisplayValue() === '0', 'Calculator cleared')
    console.assert(!calculator.dataset.firstValue, 'No first value')
    console.assert(!calculator.dataset.operator, 'No operator value')
}

/**
 * Runs a test
 * @param {Object} test
 */
function runTest(test) {
    pressKeys(...test.keys)
    // console.log('Before assertion, result is:', getDisplayValue()); //
    console.assert(getDisplayValue() === test.result, test.message)
    resetCalculator()
}

/**
 * Tests the clear key
 */
function testClearKey() {
    // console.log('--- Test: Clear key (before calculation) ---');
    //Before calculation
    pressKeys('5', 'clear')
    // console.log('Display value:', getDisplayValue());
    console.assert(getDisplayValue() === '0', 'Clear before calculation')
    // console.log('Clear button text:', calculator.querySelector('[data-key="clear"]').textContent);
    console.assert(calculator.querySelector('[data-key="clear"]').textContent === 'AC', 'Clear once, should show AC')
    resetCalculator()

    // console.log('--- Test: Clear key (after calculation) ---');
    //After calculation
    pressKeys('5', 'times', '9', 'equal', 'clear')
    const { firstValue, operator } = calculator.dataset
    // console.log('After clear, firstValue:', firstValue, 'operator:', operator);
    console.assert(firstValue, 'Clear once; should have first value')
    console.assert(operator, 'Clear once; should have operator value')
    resetCalculator()
}

// Test suites
//=======
const tests = [
    {
        message: 'Number key',
        keys: ['2'],
        result: '2'
    },
    {
        message: 'Number Number',
        keys: ['3', '5'],
        result: '35'
    },
    {
        message: 'Number Decimal',
        keys: ['4', 'decimal'],
        result: '4.'
    },
    {
        message: 'Number Decimal Number',
        keys: ['4', 'decimal', '5'],
        result: '4.5'
    },
    //Calculations
    {
        message: 'Addition',
        keys: ['2', 'plus', '5', 'equal'],
        result: '7'
    },
    {
        message: 'Subtraction',
        keys: ['5', 'minus', '9', 'equal'],
        result: '-4'
    },
    {
        message: 'Multiplication',
        keys: ['4', 'times', '8', 'equal'],
        result: '32'
    },
    {
        message: 'Division',
        keys: ['5', 'divide', '1', '0', 'equal'],
        result: '0.5'
    },
]

//Runs test
testClearKey()
tests.forEach(runTest)
