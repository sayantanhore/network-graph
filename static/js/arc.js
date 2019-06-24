'use strict';

function arcNS() {
  const connections = {};

  const svgNS = 'http://www.w3.org/2000/svg';

  // Creates SVG camvas according to given width and height
  function createCanvas(containerWidth, containerHeight) {
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', containerWidth);
    svg.setAttribute('height', containerHeight);
    return svg;
  }

  // Create a node (SVG circle) based on given weight
  function createNode(weight, horizontalPosition, verticalPosition) {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', `${horizontalPosition}`);
    circle.setAttribute('cy', `${verticalPosition}`);
    circle.setAttribute('r', weight);
    circle.setAttribute('fill', 'red');
    return circle;
  }

  // Creates nodes from weights provided
  function createNodes(weights, containerWidth, containerHeight) {
    const unitWidthMultiplier = weights.length + 1;
    return weights.map((weight, index) => {
      const widthToSet = containerWidth * (index + 1) / unitWidthMultiplier;
      const heightToSet = containerHeight - 100;
      return createNode(weight / 10, widthToSet, heightToSet);
    });
  }

  // Connect nodes by arcs
  function connectNodes(nodes, dataStreamingRateMatrix) {
    const arcs = {};
    for (let i = 0; i < nodes.length - 1; i ++) {
      for (let j = i + 1; j < nodes.length; j ++) {
        const nodePrevious = nodes[i];
        const nodeNext = nodes[j];
        const startX = nodePrevious.getAttribute('cx');
        const startY = nodePrevious.getAttribute('cy') - nodePrevious.getAttribute('r') - 2;
        const endX = nodeNext.getAttribute('cx');
        const endY = nodeNext.getAttribute('cy') - nodeNext.getAttribute('r') - 10;
        let weight = dataStreamingRateMatrix[i][j] / 20;
        if (weight > 1) {
          weight = Math.floor(weight);
        }
        if (!arcs[i]) {
          arcs[i] = [];
        }
        const arc = createArc(startX, startY, endX, endY, weight)
        arcs[i].push(arc);

        // Add event listeners to node and connected arcs
        if (!connections[i]) { connections[i] = []; }
        connections[i].push(arc);
        if (!connections[j]) { connections[j] = []; }
        connections[j].push(arc);
      }
    }
    // Attach event listeners
    nodes.forEach((node, index) => {
      node.addEventListener('mouseover', function() {
        highlightArcsConnectedToANode(connections[index])
      });
      node.addEventListener('mouseout', function() {
        removeHighlightArcsConnectedToANode(connections[index]);
      });
    });
    return arcs;
  }

  // Highlights arcs connected to a node on mouse over node
  function highlightArcsConnectedToANode(arcs) {
    arcs.forEach(arc => arc.setAttribute('stroke', '#F00'));
  }

  // Remove highlight arcs connected to a node o mouse out node
  function removeHighlightArcsConnectedToANode(arcs) {
    arcs.forEach(arc => arc.setAttribute('stroke', '#999999'));
  }

  // SVG utility functions
  function createArc(startX, startY, endX, endY, weight) {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', `M ${startX} ${startY} A 10 10 0 0 1 ${endX} ${endY}`);
    path.setAttribute('fill', 'transparent');
    path.setAttribute('stroke', '#999999');
    path.setAttribute('stroke-width', `${weight}`);
    return path;
  }

  return {
    createCanvas,
    createNodes,
    connectNodes
  }
}

