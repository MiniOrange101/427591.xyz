//Event Controller
var events = [];
function openDialog() {
  $('#eventCode').val('');
  $('#eventName').val('');
  $('#eventDialog').dialog({
    title: '添加事件和代码',
    modal: true,
    buttons: [{
      text: '保存',
      handler: function () { saveEvent(); }
    }, {
      text: '取消',
      handler: function () {
        $('#eventDialog').dialog('close');
      }
    }]
  });
}
function saveEvent() {
  var eventName = $('#eventName').val();
  var eventCode = $('#eventCode').val();
  events.push({ name: eventName, code: eventCode });
  renderEvents();
  $('#eventDialog').dialog('close');
  $('#eventName').val('');
  $('#eventCode').val('');
}
function renderEvents() {
  $('#events').empty();
  events.forEach(function (event, index) {
    var listItem = $('<li>').text(event.name);
    var editButton = $('<button>').text('编辑').click(function () {
      editEvent(index);
    });
    var deleteButton = $('<button>').text('删除').click(function () {
      deleteEvent(index);
    });
    listItem.append(editButton, deleteButton);
    $('#events').append(listItem);
  });
}
function editEvent(index) {
  var event = events[index];
  $('#eventName').val(event.name);
  $('#eventCode').val(event.code);
  $('#eventDialog').dialog({
    title: '编辑事件和代码',
    modal: true,
    buttons: [{
      text: '取消',
      handler: function () {
        $('#eventDialog').dialog('close');
      }
    }, {
      text: '保存',
      handler: function () {
        event.name = $('#eventName').val();
        event.code = $('#eventCode').val();
        renderEvents();
        $('#eventDialog').dialog('close');
      }
    }]
  });
}
function deleteEvent(index) {
  events.splice(index, 1);
  renderEvents();
}



var MODE = '';
var EXP = [];
var NUM = '';

function appendToDisplay(value) {
  $('#display').append(value);
}

function clearDisplay() {
  $('#display').text("");
}

function backspace() {
  var display = $('#display').text();
  $('#display').text(display.slice(0, -1));
  if (NUM == '') {
    EXP.pop();
  } else {
    NUM = NUM.slice(0, -1);
  }
}

function calculate() {
  if (NUM != '') {
    EXP.push(Number(NUM));
  }
  //try {
  var result = evalExpression(EXP);
  events.forEach(function (way) {
    if (String(result) == way.name) {
      eval(way.code);
    }
  });
  $('#display').text(result);
  MODE = 'result';
  EXP = [];
  NUM = '';
  //} catch (e) {
  //  error();
  //}
}

function error() {
  MODE = 'error';
  EXP = [];
  NUM = '';
  clearDisplay();
  appendToDisplay('Error');
}

function evalExpression(expression) {
  var x = '';
  if (expression[0] == '-') {
    expression.splice(0, 2, 0 - expression[1]);
  }
  if (expression.filter(item => item == '(').length - expression.filter(item => item == ')').length != 0) {
    error();
    return None;
  }
  if (expression.includes('(')) {
    x = evalExpression(expression.slice(expression.indexOf('(') + 1, expression.lastIndexOf(')')));
    expression.splice(expression.indexOf('('), expression.indexOf(')') - expression.indexOf('(') + 1, x);
  }
  if (expression.includes('^')) {
    expression.forEach(function (item, index) {
      if (item == '^') {
        x = Math.pow(expression[index - 1], expression[index + 1]);
        expression.splice(index - 1, 3, x);
      }
    });
  }
  if (expression.includes('*') || expression.includes('/')) {
    expression.forEach(function (item, index) {
      if (item == '*') {
        x = expression[index - 1] * expression[index + 1];
        expression.splice(index - 1, 3, x);
      }
      else if (item == '/') {
        x = expression[index - 1] / expression[index + 1];
        expression.splice(index - 1, 3, x);
      }
    });
  }
  if (expression.includes('+') || expression.includes('-')) {
    expression.forEach(function (item, index) {
      if (item == '+') {
        x = expression[index - 1] + expression[index + 1];
        expression.splice(index - 1, 3, x);
      }
      else if (item == '-') {
        x = expression[index - 1] - expression[index + 1];
        expression.splice(index - 1, 3, x);
      }
    });
  }
  return expression[0];
}

// Define precedence for operators
function precedence(operator) {
  if (operator === '+' || operator === '-') {
    return 1;
  } else if (operator === '*' || operator === '/') {
    return 2;
  } else if (operator === '^') {
    return 3;
  } else {
    return 0; // Default precedence
  }
}

// Apply operator to operands
function applyOperator(operator, b, a) {
  switch (operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;
    case '^': return Math.pow(a, b);
  }
}

function addNum(num) {
  if (MODE == 'number') {
    appendToDisplay(num);
  } else if (MODE == 'error' || MODE == 'result') {
    clearDisplay();
    appendToDisplay(num);
    MODE = 'number';
  }
  NUM = NUM + num;
}

function operate(way) {
  if (MODE == 'result') {
    clearDisplay();
  }
  if (way == '-' && EXP.length == 0) {
    EXP.push('-');
    appendToDisplay('-');
  } else if (MODE == 'number') {
    if (NUM != '') {
      EXP.push(Number(NUM));
    }
    EXP.push(way);
    NUM = '';
    appendToDisplay(way);
  }
}

function reset() {
  clearDisplay();
  NUM = '';
  EXP = [];
  MODE = 'number'
}

function paren() {
  if (MODE == 'result') {
    clearDisplay();
  }
  if (EXP.filter(item => item == '(').length - EXP.filter(item => item == ')').length == 0) {
    operate('(');
  } else {
    operate(')');
  }
}

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "1": appendToDisplay('1');
    case "2": appendToDisplay('2');
    case "3": appendToDisplay('3');
    case "4": appendToDisplay('4');
    case "5": appendToDisplay('5');
    case "6": appendToDisplay('6');
    case "7": appendToDisplay('7');
    case "8": appendToDisplay('8');
    case "9": appendToDisplay('9');
    case "0": appendToDisplay('0');
    case ".": appendToDisplay('.');
    case "+": appendToDisplay('+');
    case "-": appendToDisplay('-');
    case "*": appendToDisplay('*');
    case "/": appendToDisplay('/');
    case "Enter": calculate();
    case "=": calculate();
    case "Backspace": clearLastCharacter();
  }
});

$(document).ready(function () {
  MODE = 'number';
  clearDisplay();
  //while (1) {
  //$("#debugger").text(EXP.toString());
  //}
});