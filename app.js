const container = document.querySelector("#container");

// getting the window dimensions
const windowSize = {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
}

//global variables
const gridSize = 100; // change to control the gap between the grid's lines.
let isDragItemClicked = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;


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
    dragItem.id = 'draggable';
    dragItem.setAttribute('r', circleSize);
    dragItem.setAttribute('cx', (windowSize.width / 2));
    dragItem.setAttribute('cy', (windowSize.height / 2));
    container.append(dragItem);
    return dragItem;
}

function setTranslate(xPos, yPos, el) {
    // function that "moves" the draggabe element
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}
function roundNum(num, roundTo) {
    // function to round number. used for the snapping effect to the grid.
    return Math.round(num / roundTo) * roundTo;
}

function dragStart(e) {
    if (e.target === dragItem) {
        isDragItemClicked = true;
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
    }
}

function drag(e) {
    if (isDragItemClicked) {

        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        setTranslate(currentX, currentY, dragItem);
    }
}

function dragEnd(e) {
    currentX = roundNum(currentX, gridSize)
    currentY = roundNum(currentY, gridSize)
    setTranslate(currentX, currentY, dragItem);

    initialX = currentX;
    initialY = currentY;
    xOffset = currentX;
    yOffset = currentY;

    isDragItemClicked = false;
}

// Main
gridMaker();
const dragItem = createDraggableCircle();

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);