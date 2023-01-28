let gridOfCells;
const width = 400;
const height = 400;
const resolution = 5;
let colCount = width / resolution;
let rowCount = height / resolution;

setup = () => {
  createCanvas(width, height);
  // Initialize gridOfCells with 0s
  gridOfCells = makeGrid(colCount, rowCount);
  // Randomize gridOfCells with 1s and 0s
  gridOfCells = getRandomizedGrid(gridOfCells);
};

draw = () => {
  background(0);
  renderGridCells();
  nextGeneration();
}

const renderGridCells = () => {
  // TODO: It might be worth it to use a for loop here instead of forEach for performance
  gridOfCells.forEach((cell, index) => {
    let { row, col } = getCellRowCol(index);
    let x = col * resolution;
    let y = row * resolution;
    if (getCell(row, col, gridOfCells) === 1) {
      drawAliveCell(x, y);
    }
  });
}

const drawAliveCell = (x, y) => {
  fill(255);
  stroke(0)
  rect(x, y, resolution - 1, resolution - 1);
}

const nextGeneration = () => {
  let nextGridOfCells = makeGrid(colCount, rowCount);
  // Compute next based on gridOfCells
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      let state = getCell(row, col, gridOfCells);
      // Count live neighbors!
      gridRules(row, col, state, nextGridOfCells);
    }
  }
  gridOfCells = nextGridOfCells;
}

const gridRules = (row, col, state, nextGeneration) => {
  let neighbors = countNeighbors(gridOfCells, row, col);
  if (state === 0 && neighbors === 3) {
    setCell(row, col, 1, nextGeneration);
  } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
    setCell(row, col, 0, nextGeneration);
  } else {
    setCell(row, col, state, nextGeneration);
  }
}

const getRandomizedGrid = (grid) => {
  return grid
    .map(() => Math.floor(Math.random() * 2));
}

const countNeighbors = (grid, row, col) => {
  let neighbors = 0;
  // Loop through the 3x3 area around the cell
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      // This allows the grid to wrap around the edges
      let x_cell = (col + i + colCount) % colCount;
      let y_cell = (row + j + rowCount) % rowCount;
      neighbors += getCell(y_cell, x_cell, grid);
    }
  }
  // Subtract the current cell from the count
  neighbors -= getCell(row, col, grid);
  return neighbors;
}

const makeGrid = (rows, cols) => {
  const numberOfCells = rows * cols;
  return new Array(numberOfCells).fill(0);
}

const getCellIndex = (row, col) => {
  return row * colCount + col;
}

const getCellRowCol = (index) => {
  return {
    row: Math.floor(index / colCount),
    col: index % colCount
  }
}

const getCell = (row, col, grid) => {
  return grid[getCellIndex(row, col)];
}

const setCell = (row, col, value, grid) => {
  grid[getCellIndex(row, col)] = value;
}


