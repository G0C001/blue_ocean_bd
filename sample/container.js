const dividerLeft = document.getElementById('divider-left');
const dividerHorizontal = document.getElementById('divider-horizontal');
const dividerVertical = document.getElementById('divider-vertical');
const leftContainer = document.getElementById('left-container');
const topPanel = document.getElementById('top-panel');
const bottomPanel = document.getElementById('bottom-panel');
const middleContainer = document.getElementById('middle-container');
const rightContainer = document.getElementById('right-container');
const container = document.querySelector('.container');

let isDraggingLeft = false;
let isDraggingHorizontal = false;
let isDraggingVertical = false;

const MIN_LEFT_WIDTH = 150; // Minimum width for the left container
const MAX_LEFT_WIDTH = 200; // Maximum width for the left container

const MIN_RIGHT_WIDTH = 200; // Minimum width for the right container
const MAX_RIGHT_WIDTH = 400; // Maximum width for the right container

// Left Sidebar Resizing
dividerLeft.addEventListener('mousedown', (e) => {
  isDraggingLeft = true;
  document.body.style.cursor = 'col-resize';
});

document.addEventListener('mousemove', (e) => {
  if (isDraggingLeft) {
    const containerRect = container.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;

    // Limit left container width
    const leftWidth = Math.max(MIN_LEFT_WIDTH, Math.min(offsetX, MAX_LEFT_WIDTH));

    leftContainer.style.width = `${leftWidth}px`;
    dividerLeft.style.left = `${leftWidth}px`;
  }

  if (isDraggingHorizontal) {
    const containerRect = middleContainer.getBoundingClientRect();
    const offsetY = e.clientY - containerRect.top;

    // No limit for the top panel height, it can grow/shrink freely
    topPanel.style.height = `${offsetY}px`;
    bottomPanel.style.height = `${containerRect.height - offsetY - dividerHorizontal.offsetHeight}px`;
  }

  if (isDraggingVertical) {
    const containerRect = container.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;

    // Limit right container width
    const rightWidth = Math.max(MIN_RIGHT_WIDTH, Math.min(containerRect.width - offsetX - dividerVertical.offsetWidth, MAX_RIGHT_WIDTH));

    rightContainer.style.width = `${rightWidth}px`;
    dividerVertical.style.left = `${containerRect.width - rightWidth - dividerVertical.offsetWidth}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDraggingLeft = false;
  isDraggingHorizontal = false;
  isDraggingVertical = false;
  document.body.style.cursor = 'default';
});

// Horizontal Divider (Top/Bottom Resize)
dividerHorizontal.addEventListener('mousedown', (e) => {
  isDraggingHorizontal = true;
  document.body.style.cursor = 'row-resize';
});

// Vertical Divider (Right Resize)
dividerVertical.addEventListener('mousedown', (e) => {
  isDraggingVertical = true;
  document.body.style.cursor = 'col-resize';
});