'use strict';

function matrixNS() {
  let matrix;
  let table;

  function generateMatrix(dimension) {
    matrix = new Array(dimension);
    for(let i = 0; i < dimension; i ++) {
      matrix[i] = new Array(dimension);
    }
    return matrix;
  }

  function getMatrixView(dimension, callBackOnTableCellUpdate) {
    table = document.createElement('table');
    table.classList.add('matrix');
    for (let i = 0; i <= dimension; i++) {
      const tr = document.createElement('tr');
      table.appendChild(tr);
      for (let j = 0; j <= dimension; j++) {
        const td = document.createElement('td');
        td.setAttribute('contentEditable', true);
        if (i === 0 && j > 0) {
          td.innerText = getLabel(j - 1);
          td.setAttribute('contentEditable', false);
        }
        if (i > 0 && j === 0) {
          td.innerText = getLabel(i - 1);
          td.setAttribute('contentEditable', false);
        }
        td.addEventListener('keydown', cellOnEntry);
        td.addEventListener('blur', cellOnUpdate.bind(null, callBackOnTableCellUpdate));
        tr.appendChild(td);
      }
    }
    return table;
  }

  // Fill the matrix with random numbers, only half of the triangle has to be filled
  function fillMatrixRandom(matrix) {
    for (let i = 0; i < matrix.length; i ++) {
      for (let j = i; j < matrix[i].length; j ++) {
        let cellValue = Math.floor(Math.random() * 100);
        if (j === i) {
          while (cellValue <= 10) {
            cellValue = Math.floor(Math.random() * 100);
          }
          matrix[i][j] = cellValue;
        }
        else if (j > i) {
          matrix[j][i] = matrix[i][j] = cellValue;
        }
      }
    }
  }

  // Fill table view with numbers from matrix
  function fillTableView(table) {
    const rows = Array.from(table.rows);
    for (let i = 1; i < rows.length; i ++) {
      const cells = Array.from(rows[i].cells);
      for (let j = 1; j < cells.length; j ++) {
        cells[j].innerText = matrix[i - 1][j - 1];
      }
    }
  }

  // Get label of rows and columns from A - Z
  function getLabel(numericlabel) {
    const base = 65;
    return String.fromCharCode(base + numericlabel);
  }

  // Restricts keystrokes to digits only, Backspace, Arrows - Left, Right. Up and Down are allowed
  function validateKey(key, keyCode, textLength) {
    switch (key) {
      case 'Backspace':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        return true;
      case 'Enter':
        event.preventDefault();
        return true;
    }
    if (keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
      event.preventDefault();
      return false;
    }
    if (textLength > 1) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Updates matrix cell vlaue
  function updateMatrix(row, col, val) {
    matrix[row][col] = matrix[col][row] = parseInt(val);
  }

  // Updates table cell value
  function updateTable(rowIndex, colIndex, val) {
    const row = Array.from(table.rows)[rowIndex];
    const cell = Array.from(row.cells)[colIndex];
    cell.innerText = val;
  }

  // Handlers
  // Checks if cell entry is a valid numbeer from 0 - 100
  function cellOnEntry(event) {
    const isEntryValid = validateKey(event.key, event.keyCode, event.target.innerText.length);
    if (isEntryValid) {
      console.log('Entry OK');
      if (event.key === 'Enter') {
        event.target.blur();
      }
    }
    else {
      alert('Invalid entry');
    }
  }

  // Get the position of a cell from a 2D matrix
  function getCellPosition(event) {
    const rowIndex = Array.from(table.rows).findIndex(row => Array.from(row.cells).includes(event.target));
    const colIndex = Array.from(Array.from(table.rows)[rowIndex].cells).findIndex(cell => cell === event.target);
    return { rowIndex, colIndex };
  }

  // Updates matrix and table with newly entered value
  function cellOnUpdate(callback, event) {
    const updatedCellPosition = getCellPosition(event);
    const updatedCellValue = event.target.innerText;
    updateMatrix(updatedCellPosition.colIndex - 1, updatedCellPosition.rowIndex - 1, updatedCellValue);
    updateTable(updatedCellPosition.colIndex, updatedCellPosition.rowIndex, updatedCellValue);
    callback();
  }

  // Get the diagonal of a given matrix
  function getNodeWeights(matrix) {
    const weights = new Array(matrix.length);
    for (let i = 0; i < matrix.length; i++) {
      weights[i] = matrix[i][i];
    }
    return weights;
  }
  return {
    generateMatrix,
    getMatrixView,
    fillMatrixRandom,
    fillTableView,
    getNodeWeights
  }
}

