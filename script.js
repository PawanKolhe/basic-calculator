let calc = {
  num1: '0',
  num2: '0',
  num2Active: false,
  operator: '+',
  expression: '',
  result: '',
  numbers: {
    nine: document.querySelector('.calc-button[data-name="nine"]'),
    eight: document.querySelector('.calc-button[data-name="eight"]'),
    seven: document.querySelector('.calc-button[data-name="seven"]'),
    six: document.querySelector('.calc-button[data-name="six"]'),
    five: document.querySelector('.calc-button[data-name="five"]'),
    four: document.querySelector('.calc-button[data-name="four"]'),
    three: document.querySelector('.calc-button[data-name="three"]'),
    two: document.querySelector('.calc-button[data-name="two"]'),
    one: document.querySelector('.calc-button[data-name="one"]'),
    zero: document.querySelector('.calc-button[data-name="zero"]')
  },
  action: {
    active: true,
    operators: {
      div: document.querySelector('.calc-button[data-name="div"]'),
      mul: document.querySelector('.calc-button[data-name="mul"]'),
      sub: document.querySelector('.calc-button[data-name="sub"]'),
      add: document.querySelector('.calc-button[data-name="add"]'),
      root: document.querySelector('.calc-button[data-name="root"]'),
      exp: document.querySelector('.calc-button[data-name="exp"]')
    }
  },
  equal: document.querySelector('.calc-button[data-name="equal"]'),
  equalLast: false,
  dot: document.querySelector('.calc-button[data-name="dot"]'),
  displayExpression: document.querySelector('#displayExpression'),
  displayMain: document.querySelector('#displayMain'),
  clear: document.querySelector('.calc-button[data-name="clear"]')
}

// Remove leading zeros
const removeZeros = (s) => s.split(' ').map((item) => item.replace(/^0+|\.+$/, '')).join(' ');
// Change expression symbols from unicode to normal
const changeSymbolsToNormal = (s) => s.replace('÷', '/').replace('×', '*').replace('−', '-').replace('+', '+');
// Change expression symbols from normal to unicode
const changeSymbolsToUnicode = (s) => s.replace('/', '÷').replace('*', '×').replace('-', '−').replace('+', '+');

// Update functions
const updateDisplayExpression = () => {
  if(calc.equalLast === true){
    calc.displayExpression.innerText = calc.expression + ' =';
  } else {
    calc.displayExpression.innerText = calc.expression;
  }
}
const updateDisplayMain = () => {
  if(!calc.num2Active) {
    calc.displayMain.innerText = calc.num1;
  } else {
    calc.displayMain.innerText = calc.num2;
  }
}

// Clear all displays
const clearDisplay = () => {
  calc.num1 = '0';
  calc.num2 = '0';
  calc.num2Active = false;
  calc.operator = '+';
  calc.expression = '';
  calc.result = '';
  calc.action.active = true;
  updateDisplayExpression();
  updateDisplayMain();
}

const calculate = (operator) => {
  switch(operator) {
    case '+':
      calc.result = parseFloat(calc.num1) + parseFloat(calc.num2);
      break;
    case '-':
      calc.result = parseFloat(calc.num1) - parseFloat(calc.num2);
      break;
    case '*':
      calc.result = parseFloat(calc.num1) * parseFloat(calc.num2);
      calc.result = calc.result.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8
      });
      break;
    case '/':
      calc.result = parseFloat(calc.num1) / parseFloat(calc.num2);
      calc.result = calc.result.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8
      });
      break;
    case '^':
      calc.result = parseFloat(calc.num1) ** parseFloat(calc.num2);
      calc.result = calc.result.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8
      });
      break;
  }

  return calc.result;
}

// Loop through number buttons, add click listener, and update Main Display
Object.entries(calc.numbers).forEach(([key, value]) => {
  calc.numbers[key].addEventListener('click', () => {
    calc.action.active = false;
    if(!calc.num2Active) {
      if(calc.num1 == '0') {
        calc.num1 = '';
      }
      calc.num1 += value.value;
    } 
    else {
      if(calc.num2 == '0') {
        calc.num2 = '';
      }
      calc.num2 += value.value;
    }
    updateDisplayMain()
  });
});

// Dot button listener
calc.dot.addEventListener('click', () => {
  calc.action.active = false;
  if(!calc.num2Active) {
    if(!calc.num1.includes('.')) {
      calc.num1 += '.';
    }
  } else {
    if(!calc.num2.includes('.')) {
      calc.num2 += '.';
    }
  }
  updateDisplayMain()
});

// Loop through operator buttons, add click listener, and update Operator Display
Object.entries(calc.action.operators).forEach(([key, value]) => {
  calc.action.operators[key].addEventListener('click', () => {
    if(!calc.num2Active) {
      calc.num1 = calc.num1.replace(/\.+$/, '');
    } else {
      calc.num2 = calc.num2.replace(/\.+$/, '');
    }

    if(calc.action.active === true) {
      let temp_str;
      if(calc.expression == "") {
        temp_str = '0';
      }
      else {
        temp_str = calc.expression.trim().split(' ');
        temp_str.pop();
        temp_str = temp_str.join(' ');
      }
      
      if(calc.equalLast === true) {
        calc.expression = `${calc.result} ${value.value} `;
        calc.equalLast = false;
        calc.num2 = '0';
      } else {
        calc.expression = `${temp_str} ${value.value} `;
      }
      
      updateDisplayExpression();
    } 
    else {
      calc.expression += `${calc.num2Active ? calc.num2 : calc.num1} ${value.value} `;
      updateDisplayExpression();

      try {
        calc.result = calculate(changeSymbolsToNormal(calc.operator));

        calc.displayMain.innerText = String(calc.result);
        calc.num1 = String(calc.result);
        
        calc.num2 = '0';
      }
      catch(err) {
        console.log(err.message);
        console.log(calc);
      }
    }

    calc.action.active = true;
    calc.num2Active = true;
    calc.operator = value.value;
    
  });
});

calc.equal.addEventListener('click', () => {
  calc.equalLast = true;

  calc.expression = `${calc.result} ${calc.operator} ${calc.num2}`;
  updateDisplayExpression();

  calc.result = calculate(changeSymbolsToNormal(calc.operator));
  calc.displayMain.innerText = String(calc.result);
  calc.num1 = String(calc.result);

  calc.action.active = true;
  calc.num2Active = true;
});

calc.clear.addEventListener('click', () => {
  clearDisplay();
});
