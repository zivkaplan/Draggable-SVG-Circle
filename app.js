const container = document.querySelector("#container");

// getting the window dimensions
const windowSize = {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
}

//global variables
const gridSize = 100; // change to control the gap between the grid's lines.
// let isDragItemClicked = false;


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

function createDraggableCircle(quantity = 1, circleSize = 25) {
    //function that generate SVG circle and position it in the center of the window.
    //the function takes one parameter (number) that defines the circle's radius size. default is 25.
    for (let i = 0; i < quantity; i++) {
        const dragItem = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dragItem.classList.add('draggable');
        dragItem.dataset.active = false;
        dragItem.dataset.currentX = 0;
        dragItem.dataset.currentY = 0;
        dragItem.dataset.offsetX = 0;
        dragItem.dataset.offsetY = 0;
        dragItem.setAttribute('r', circleSize);
        dragItem.setAttribute('cx', (windowSize.width / 2));
        dragItem.setAttribute('cy', (windowSize.height / 2));
        container.append(dragItem);
    }
}

function setTranslate(xPos, yPos, el) {
    // function that "moves" the draggabe element
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

function roundNum(num, roundTo) {
    // function to round number. used for the snapping effect to the grid.
    return Math.round(num / roundTo) * roundTo;
}

function getPositions(item) {
    currentX = parseInt(item.dataset.currentX);
    currentY = parseInt(item.dataset.currentY);

    offsetX = parseInt(item.dataset.offsetX);
    offsetY = parseInt(item.dataset.offsetY);

    return { currentX, currentY, offsetX, offsetY }
}

function dragStart(e) {
    if (!e.target.closest('.draggable')) return;

    //marking the active circle
    e.target.dataset.active = true;

    // get item's ID and positions
    const item = document.querySelector("[data-active='true']")

    currentX = parseInt(item.dataset.currentX);
    currentY = parseInt(item.dataset.currentY);

    //saving the offset data on itself
    item.dataset.offsetX = e.clientX - currentX;
    item.dataset.offsetY = e.clientY - currentY;
}

function drag(e) {
    if (!document.querySelector("[data-active='true']")) return;

    // get item's ID and positions
    const item = document.querySelector("[data-active='true']")
    let { currentX, currentY, offsetX, offsetY } = getPositions(item);

    currentX = e.clientX - offsetX;
    currentY = e.clientY - offsetY;

    // setTranslate(currentX, currentY, item);
    setTranslate(currentX, currentY, item);

    //saving the offset data on itself
    item.dataset.currentX = currentX;
    item.dataset.currentY = currentY;
}


function dragEnd(e) {
    if (!e.target.closest("[data-active='true']")) return;

    // get item's ID and positions
    const item = document.querySelector("[data-active='true']")
    let { currentX, currentY } = getPositions(item);

    currentX = roundNum(currentX, gridSize)
    currentY = roundNum(currentY, gridSize)
    setTranslate(currentX, currentY, item);

    //unmarking the dragged circle
    item.dataset.active = false;

    //saving the offset data on itself
    item.dataset.currentX = currentX;
    item.dataset.currentY = currentY;
}

// Main
gridMaker();
createDraggableCircle(10);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);