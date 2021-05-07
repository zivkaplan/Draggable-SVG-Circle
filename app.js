const cacheDOM = (function () {
    const outerContainer = document.querySelector('#outerContainer');
    const svgContainer = document.querySelector('#svgContainer');
    const colorMenu = document.querySelector('.menu');

    const colorButtons = {
        red: colorMenu.querySelector('.red'),
        green: colorMenu.querySelector('.green'),
        blue: colorMenu.querySelector('.blue'),
    };

    return { outerContainer, svgContainer, colorMenu, colorButtons };
})();

//global variables
const colorMenuObj = {
    active: false,
    item: null,

    showColorMenu: function (e) {
        if (e.detail <= 2 || !e.target.closest('.draggable')) return;
        cacheDOM.colorMenu.style.display = 'block';
        cacheDOM.colorMenu.style.top = e.clientY - 30 + 'px';
        cacheDOM.colorMenu.style.left = e.clientX + 'px';
        colorMenuObj.item = e.target;
    },

    hideColorMenu: function (e) {
        if (colorMenuObj.item) {
            cacheDOM.colorMenu.style.display = 'none';
            colorMenuObj.active = false;
            colorMenuObj.item = null;
        }
    },
    changeColor: function (e) {
        if (!e.target.closest('.btn_color') || !colorMenuObj.item) return;
        colorMenuObj.item.style.fill = e.target.value;
    },
};

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
    },

    dragStart: function (e) {
        if (!e.target.closest('.draggable') || e.detail > 2) return;

        //set the active circle and get it's position
        currentDragItem.setItem(e.target);
        currentDragItem.getPositions();

        currentDragItem.offsetX = e.clientX - currentDragItem.currentX;
        currentDragItem.offsetY = e.clientY - currentDragItem.currentY;
    },

    drag: function (e) {
        if (!currentDragItem.item) return;

        currentDragItem.currentX = e.clientX - currentDragItem.offsetX;
        currentDragItem.currentY = e.clientY - currentDragItem.offsetY;

        currentDragItem.setTranslate(
            currentDragItem.currentX,
            currentDragItem.currentY,
            currentDragItem.item
        );
    },

    dragEnd: function (e) {
        if (!currentDragItem.item) return;

        currentDragItem.currentX = currentDragItem.roundNum(
            currentDragItem.currentX,
            setScreen.gridSize
        );
        currentDragItem.currentY = currentDragItem.roundNum(
            currentDragItem.currentY,
            setScreen.gridSize
        );
        currentDragItem.setTranslate(
            currentDragItem.currentX,
            currentDragItem.currentY,
            currentDragItem.item
        );

        //saving the current positions data on itself and release item
        currentDragItem.savePositions();
        currentDragItem.item = null;
    },

    setTranslate: function (xPos, yPos, el) {
        // function that "moves" the draggabe element
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    },

    roundNum: function (num, roundTo) {
        // function to round number. used for the snapping effect to the grid.
        return Math.round(num / roundTo) * roundTo;
    },
};

const setScreen = {
    gridSize: 100, // change to control the gap between the grid's lines.

    // getting the window dimensions
    windowSize: {
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth,
    },
    // set gridSize
    createGrid: function () {
        // The lines are calculate from the remainder of half of the window divided by the grid size.
        // that ensures a grid will pass exactly in the center of the window.

        // vertical lines loop.
        for (
            let i = (this.windowSize.width / 2) % this.gridSize;
            i < window.screen.width;
            i += this.gridSize
        ) {
            this.addGridLine(i, i, 0, window.screen.height);
        }
        // horizontal lines loop
        for (
            let i = (this.windowSize.height / 2) % this.gridSize;
            i < window.screen.height;
            i += this.gridSize
        ) {
            this.addGridLine(0, window.screen.width, i, i);
        }
    },

    addGridLine: function (xStart, xEnd, yStart, yEnd) {
        //function that generate SVG line and append it to the #svgContainer element;
        const line = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'line'
        );
        line.classList.add('gridLines');
        line.setAttribute('x1', xStart);
        line.setAttribute('x2', xEnd);
        line.setAttribute('y1', yStart);
        line.setAttribute('y2', yEnd);
        cacheDOM.svgContainer.append(line);
    },

    createDraggableCircle: function (circleSize = 25) {
        //function that generate SVG circle and position it in the center of the window.
        //the function takes one parameter (number) that defines the circle's radius size. default is 25.
        const dragItem = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'circle'
        );
        dragItem.classList.add('draggable', 'default_color');
        dragItem.dataset.currentX = 0;
        dragItem.dataset.currentY = 0;
        dragItem.setAttribute('r', circleSize);
        dragItem.setAttribute('cx', this.windowSize.width / 2);
        dragItem.setAttribute('cy', this.windowSize.height / 2);
        cacheDOM.svgContainer.append(dragItem);
    },
};

// Main

//set screen content
setScreen.createGrid();
for (let i = 0; i < 10; i++) {
    setScreen.createDraggableCircle();
}

//event listeners

//for drag
cacheDOM.svgContainer.addEventListener('mousedown', currentDragItem.dragStart);
cacheDOM.svgContainer.addEventListener('mousemove', currentDragItem.drag);
cacheDOM.svgContainer.addEventListener('mouseup', currentDragItem.dragEnd);

// for doubleClick + hold color menu
window.addEventListener('mouseup', colorMenuObj.hideColorMenu);
cacheDOM.svgContainer.addEventListener('mousedown', colorMenuObj.showColorMenu);
cacheDOM.outerContainer.addEventListener('mouseup', colorMenuObj.changeColor);
