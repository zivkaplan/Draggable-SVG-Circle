const dragItem = document.querySelector("#draggable");
const container = document.querySelector("#container");

// change the value to define the grid lines gap size. this affects the snapping effect accordingly;
const gridCubeSize =100;

// getting the screen dimensions and drawing a full screen grid
const screenVw = window.screen.width;
const screenVh = window.screen.height;

// rounding the dimensions to make sure it produces an aligning grid
const screenVwRounded = roundNum(screenVw, gridCubeSize)
const screenVhRounded = roundNum(screenVh, gridCubeSize)

function gridMaker() {
    // vertical lines
    for (let i = screenVwRounded; i >= 0; i -= (gridCubeSize / 2)) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.classList.add('gridLines')
        line.setAttribute('x1', i)
        line.setAttribute('x2', i)
        line.setAttribute('y1', "0")
        line.setAttribute('y2', screenVh)
        container.insertBefore(line, dragItem);
    }
    // horizontal lines
    for (let i = screenVhRounded; i >= 0; i -= (gridCubeSize / 2)) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.classList.add('gridLines')
        line.setAttribute('x1', "0")
        line.setAttribute('x2', screenVw)
        line.setAttribute('y1', i)
        line.setAttribute('y2', i)
        container.insertBefore(line, dragItem);
    }
}


// getting the window dimenensions in order to position the draggable item in the middle
const windowVw = Math.max(document.documentElement.clientWidth)
const windowVh = Math.max(document.documentElement.clientHeight)

// setting the draggable item at the center of the dimensions that had been rounded to make sure they fit the grid.
dragItem.setAttribute('cx', roundNum(windowVw, gridCubeSize) / 2)
dragItem.setAttribute('cy', roundNum(windowVh, gridCubeSize) / 2)

//global variables
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// func that "moves" the draggabe element
function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}
// function to round number. default is 50.
function roundNum(num, roundTo) {
    return Math.round(num / roundTo) * roundTo;
}

//func for mousedown
function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    if (e.target === dragItem) {
        active = true;
    }
}
// func for mouseup
function dragEnd(e) {
    if (currentX % (gridCubeSize / 2) !== 0) {
        currentX = roundNum(currentX, gridCubeSize / 2)
    }
    if (currentY % (gridCubeSize / 2) !== 0) {
        currentY = roundNum(currentY, gridCubeSize / 2)
    }
    setTranslate(currentX, currentY, dragItem);

    initialX = currentX;
    initialY = currentY;
    xOffset = currentX;
    yOffset = currentY;

    active = false;
}

// func for mousemove
function drag(e) {

    if (active){
    
        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem);
    }
}


// main
gridMaker();
container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);
