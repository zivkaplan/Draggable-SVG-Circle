// const dragItem = document.querySelector("#item");
// const container = document.querySelector("#container");


// let active = false;
// let currentX;
// let currentY;
// let initialX;
// let initialY;
// let xOffset = 0;
// let yOffset = 0;

// container.addEventListener("touchstart", dragStart, false);
// container.addEventListener("touchend", dragEnd, false);
// container.addEventListener("touchmove", drag, false);

// container.addEventListener("mousedown", dragStart, false);
// container.addEventListener("mouseup", dragEnd, false);
// container.addEventListener("mousemove", drag, false);

// function dragStart(e) {
//     console.log(`mouseup on X: ${e.x}, Y: ${e.y}`)
//     if (e.type === "touchstart") {
//         initialX = e.touches[0].clientX - xOffset;
//         initialY = e.touches[0].clientY - yOffset;
//     } else {
//         initialX = e.clientX - xOffset;
//         initialY = e.clientY - yOffset;
//     }

//     if (e.target === dragItem) {
//         active = true;
//     }
// }

// function dragEnd(e) {

//     if (currentX % 50 !== 0) {
//         roundedX = roundTo(currentX)
//     }
//     if (currentY % 50 !== 0) {
//         roundedY = roundTo(currentY)
//     }
//     setTranslate(roundedX, roundedY, dragItem);

//     console.log(`mouseup on X: ${currentX}, Y: ${currentY}.\nsnapped to X: ${roundedX}, Y: ${roundedY}.`)
//     // from original code:
//     // initialX = currentX;
//     // initialY = currentY;

//     initialX = roundedX;
//     initialY = roundedY;
//     active = false;
// }

// function drag(e) {
//     if (active) {

//         e.preventDefault();

//         if (e.type === "touchmove") {
//             currentX = e.touches[0].clientX - initialX;
//             currentY = e.touches[0].clientY - initialY;
//         } else {
//             currentX = e.clientX - initialX;
//             currentY = e.clientY - initialY;
//         }

//         xOffset = currentX;
//         yOffset = currentY;

//         setTranslate(currentX, currentY, dragItem);
//     }
// }

// function setTranslate(xPos, yPos, el) {

//     el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
// }

// function roundTo(x) {
//     return Math.round(x / 50) * 50;
// }

var dragItem = document.querySelector("#item");
var container = document.querySelector("#container");

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

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

function dragEnd(e) {
    if (currentX % 50 !== 0) {
        currentX = roundTo(currentX)
    }
    if (currentY % 50 !== 0) {
        currentY = roundTo(currentY)
    }
    setTranslate(currentX, currentY, dragItem);

    initialX = currentX;
    initialY = currentY;
    xOffset = currentX;
    yOffset = currentY;

    active = false;
}

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

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function roundTo(x) {
    return Math.round(x / 50) * 50;
}