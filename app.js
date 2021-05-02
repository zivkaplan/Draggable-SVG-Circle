const container = document.querySelector("#container");

// getting the window dimensions
const windowSize = {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
}

//global variables

//vriable to save the current dragged item properties
const currentDragItem = {
    item: null,
    currentX: null,
    currentY: null,
    offsetX: null,
    offsetY: null,

    setItem: function (element) {
        this.item = element;
    },

    getPositions: function () {
        this.currentX = parseInt(this.item.dataset.currentX);
        this.currentY = parseInt(this.item.dataset.currentY);
    },

    savePositions: function () {
        this.item.dataset.currentX = this.currentX;
        this.item.dataset.currentY = this.currentY;
    }
}


// set gridSize
const gridSize = 100; // change to control the gap between the grid's lines.


function gridMaker() {
    // The lines are calculate from the remainder of half of the window divided by the grid size.
    // that ensures a grid will pass exactly in the center of the window.

    // vertical lines loop.
    for (let i = (windowSize.width / 2) % gridSize; i < window.screen.width; i += gridSize) {
        addGridLine(i, i, 0, window.screen.height);
    }
    // horizontal lines loop
    for (let i = (windowSize.height / 2) % gridSize; i < window.screen.height; i += gridSize) {
        addGridLine(0, window.screen.width, i, i);
    }
}

function addGridLine(xStart, xEnd, yStart, yEnd) {
    //function that generate SVG line and append it to the #container element;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.classList.add('gridLines');
    line.setAttribute('x1', xStart);
    line.setAttribute('x2', xEnd);
    line.setAttribute('y1', yStart);
    line.setAttribute('y2', yEnd);
    container.append(line);
}

function createDraggableCircle(circleSize = 25) {
    //function that generate SVG circle and position it in the center of the window.
    //the function takes one parameter (number) that defines the circle's radius size. default is 25.
    const dragItem = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dragItem.classList.add('draggable');
    dragItem.dataset.currentX = 0;
    dragItem.dataset.currentY = 0;
    dragItem.setAttribute('r', circleSize);
    dragItem.setAttribute('cx', (windowSize.width / 2));
    dragItem.setAttribute('cy', (windowSize.height / 2));
    container.append(dragItem);
}

function setTranslate(xPos, yPos, el) {
    // function that "moves" the draggabe element
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

function roundNum(num, roundTo) {
    // function to round number. used for the snapping effect to the grid.
    return Math.round(num / roundTo) * roundTo;
}


function dragStart(e) {
    if (!e.target.closest('.draggable')) return;

    //set the active circle and get it's position
    currentDragItem.setItem(e.target);
    currentDragItem.getPositions();

    currentDragItem.offsetX = e.clientX - currentDragItem.currentX;
    currentDragItem.offsetY = e.clientY - currentDragItem.currentY;
}

function drag(e) {
    if (!currentDragItem.item) return;

    currentDragItem.currentX = e.clientX - currentDragItem.offsetX;
    currentDragItem.currentY = e.clientY - currentDragItem.offsetY;

    setTranslate(currentDragItem.currentX, currentDragItem.currentY, currentDragItem.item);
}


function dragEnd(e) {
    if (!currentDragItem.item) return;

    currentDragItem.currentX = roundNum(currentDragItem.currentX, gridSize)
    currentDragItem.currentY = roundNum(currentDragItem.currentY, gridSize)
    setTranslate(currentDragItem.currentX, currentDragItem.currentY, currentDragItem.item);

    //saving the current positions data on itself and release item
    currentDragItem.savePositions();
    currentDragItem.item = null;
}

// Main
gridMaker();
for (let i = 0; i < 10; i++) {
    createDraggableCircle();
}

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mousemove", drag, false);
container.addEventListener("mouseup", dragEnd, false);
