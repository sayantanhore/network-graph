'use strict';
const input = inputNS();
const inputMatrix = matrixNS();
const arc = arcNS();

let container, inputMatrixContainer, arcDiagramContainer, inputMatrixDimension,
buttonCreateMatrix, matrix, table, canvas, nodes, arcs;

const initDimension = 10;

function init() {
  // Create placeholders for matrix and arc diagram
  container = document.getElementById('container');

  // Create container for input matrix
  inputMatrixContainer = document.createElement('div');
  inputMatrixContainer.setAttribute('id', 'inputMatrix');
  inputMatrixContainer.classList.add('input-matrix');

  const inputMatrixLabel = document.createElement('span');
  inputMatrixLabel.innerText = 'Input matrix';
  inputMatrixLabel.classList.add('label');
  inputMatrixContainer.appendChild(inputMatrixLabel);
  container.appendChild(inputMatrixContainer);

  // Create container for arc diagram
  arcDiagramContainer = document.createElement('div');
  arcDiagramContainer.setAttribute('id', 'outputArcDiagram');
  arcDiagramContainer.classList.add('output-arc-diagram');

  const arcDiagramLabel = document.createElement('span');
  arcDiagramLabel.innerText = 'Arc diagram';
  arcDiagramLabel.classList.add('label');
  arcDiagramContainer.appendChild(arcDiagramLabel);
  container.appendChild(arcDiagramContainer);

  // Create input field to enter input matrix dimension
  inputMatrixDimension = input.createInput(initDimension);
  inputMatrixContainer.appendChild(inputMatrixDimension);

  // Create a button to refresh input matrix
  buttonCreateMatrix = input.createButton();
  inputMatrixContainer.appendChild(buttonCreateMatrix);

  // Enable refreshing mateix on enter input field
  input.inputOnEnter(inputMatrixDimension, function(dimension) {
    createMatrix(dimension);
    createArcDiagram();
  });
  
  // Enable refreshing matrix on click button
  input.buttonOnClick(buttonCreateMatrix, inputMatrixDimension, function(dimension) {
    createMatrix(dimension);
    createArcDiagram();
  });
  
  // Create the input matrix
  createMatrix(initDimension);

  // Arc diagram
  createArcDiagram();
}

// Creates input matrix and corresponding table to display the input matrix
function createMatrix(dimension) {
  // Remove any already existing matrix and it's table view
  if (inputMatrixContainer.contains(table)) {
    inputMatrixContainer.removeChild(table);
    table = null;
    matrix = null;
  }
  // Create the matrix
  matrix = inputMatrix.generateMatrix(dimension);
  table = inputMatrix.getMatrixView(dimension, function callBackOnTableCellUpdate() {
    createArcDiagram();
  });
  inputMatrixContainer.appendChild(table);
  inputMatrix.fillMatrixRandom(matrix);
  inputMatrix.fillTableView(table);
}

// Creates the arc diagram to show input matrix's diagonal values as nodes and connection between any pair of nodes as arcs
function createArcDiagram() {
  // Remove any already esisting arc diagram
  if (arcDiagramContainer.contains(canvas)) {
    arcDiagramContainer.removeChild(canvas);
    canvas = null;
    nodes = null;
    arcs = null;
  }
  // Create the arc diagram
  // Create canvas
  canvas = arc.createCanvas(arcDiagramContainer.offsetWidth, arcDiagramContainer.offsetHeight - 140);
  arcDiagramContainer.appendChild(canvas);

  // Get nodes created after diagonal vector of input matrix
  nodes = arc.createNodes(inputMatrix.getNodeWeights(matrix), canvas.getAttribute('width'), canvas.getAttribute('height'));
  
  // Attach the nodes to DOM
  nodes.map(node => canvas.appendChild(node));

  // Get an object holding a key value pair of node index to all arcs connected to the node
  arcs = arc.connectNodes(nodes, matrix);

  // Attach the arcs to DOM
  Object.keys(arcs).forEach(key => {
    const arcsWithCurrentNode = arcs[key];
    arcsWithCurrentNode.forEach(arc => canvas.appendChild(arc));
  });
}

// Start building elements
window.onload = init;
