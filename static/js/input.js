'use strict';

function inputNS() {
  // Creates an input element with max length 2
  function createInput(dimension) {
    const maxLength = 2;
    const input = document.createElement('input');
    input.setAttribute('id', 'input-dim');
    input.setAttribute('maxlength', maxLength);
    input.value = new String(dimension);
    return input;
  }

  // Create a button
  function createButton() {
    const button = document.createElement('button');
    button.innerHTML = 'load';
    return button;
  }

  // Handlers
  // Fire callback on button click
  function buttonOnClick(button, input, callback) {
    button.addEventListener('click', function() {
      const inputValue = parseInt(input.value);
      if (checkForNumericLesserThanTen(inputValue)) {
        callback(inputValue);
      }
    });
  }

  // Fire callback on input enter
  function inputOnEnter(input, callback) {
    input.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && allowOnlyNumeric(event)) {
        const inputValue = parseInt(input.value);
        if (checkForNumericLesserThanTen(inputValue)) {
          callback(inputValue);
        }
      }
    });
  }

  // Check if input is a lesser than 10 number
  function checkForNumericLesserThanTen(inputValue) {
    if (isNaN(inputValue) || inputValue > 10) {
      alert('Please check input, it should a valid numeric value less than 10');
      return false;
    }
    return true;
  }

  // Allow only numeric input
  function allowOnlyNumeric(event) {
    const key = event.key;
    const keyCode = event.keyCode;

    switch (key) {
      case 'Backspace':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        return true;
      case 'Enter':
        //event.preventDefault();
    }

    if (keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  return {
    createInput,
    createButton,
    buttonOnClick,
    inputOnEnter
  }
}

