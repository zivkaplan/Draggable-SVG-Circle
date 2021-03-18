var dragItem = document.querySelector("#item");
var container = document.querySelector("#container");
var outerContainer = document.querySelector("#outerContainer");

// getting the window dimensions  
const vw = Math.max(document.documentElement.clientWidth)
const vh = Math.max(document.documentElement.clientHeight)

// rounding the dimensions
const vwRounded = roundNum(vw, 100)
const vhRounded = roundNum(vh, 100)

//setting the grid port to the rounded dimensions
container.setAttribute("width", vwRounded)
container.setAttribute("height", vhRounded)

//setting the draggable item at the center algined to the 50's multp.
dragItem.setAttribute('cx', vwRounded / 2)
dragItem.setAttribute('cy', vhRounded / 2)

//global variables
var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

// func that "moves" the draggabe element
function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}
// function to round number. default is 50.
function roundNum(x, roundTo = 50) {
    return Math.round(x / roundTo) * roundTo;
}
function gridMaker() {
    console.log(vwRounded)
    let YlineCount = 0
    let XlineCount = 0;
    // vertical lines
    for (let i = vwRounded; i >= 0; i = i - 50) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.classList.add('gridLines')
        line.setAttribute('x1', i)
        line.setAttribute('x2', i)
        line.setAttribute('y1', "0")
        line.setAttribute('y2', vh)
        container.insertBefore(line, dragItem);
        YlineCount++
        // console.log(`vertical at ${i} `)
    }
    console.log(YlineCount)
    // horizontal lines
    for (let i = vhRounded; i >= 0; i -= 50) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.classList.add('gridLines')
        line.setAttribute('x1', "0")
        line.setAttribute('x2', vw)
        line.setAttribute('y1', i)
        line.setAttribute('y2', i)
        container.insertBefore(line, dragItem);
        XlineCount++
        // console.log(`horizontal at ${i} `)
    }
    console.log(XlineCount)
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
    if (currentX % 50 !== 0) {
        currentX = roundNum(currentX)
    }
    if (currentY % 50 !== 0) {
        currentY = roundNum(currentY)
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
    if (active) {
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

window.addEventListener('resize', () => {
    newWindowX = Math.max(document.documentElement.clientWidth || 0, window.innerWidth)
    newWindowY = Math.max(document.documentElement.clientHeight || 0, window.innerHeight)
    if (newWindowX !== vw || newWindowY !== vh) {
        location.reload()
    }
});