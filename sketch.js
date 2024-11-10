// CONFIGURACIÓ
// DEATH BY OVERPOPULATION IF NEIGHBORS >
let overpopulation = 3;
// DEATH BY SOLITUDE IF NEIGHBORS < 
let solitude = 2;
// REBIRTH BY REPRODUCTION IF NEIGHBORS ==
let reporduction = 3;


let grid;
let cols;
let rows;
let resolution = 10;

class Cell {
    constructor(x, y, state, gen) {
        this.x = x;
        this.y = y;
        this.state = state;
        this.gen = gen;
    }

    meteor() {
        for (let i = -3; i < 4; i++) {
            for (let j = -3; j < 4; j++) {
                let col = (this.x + i + cols) % cols;
                let row = (this.y + j + rows) % rows;
                if (grid[row][col].state == 0) {
                    grid[row][col].state = floor(random(2));
                }
            }
        }
    }
}

function make2DArray(cols, rows) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    cols = int(window.innerWidth / resolution);
    rows = int(window.innerHeight / resolution);

    grid = make2DArray(cols, rows);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(j, i, floor(random(2)), 0);
        }
    }
}

function draw() {
    background(0);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = j * resolution;
            let y = i * resolution;
            if (grid[i][j].state == 1) {
                fill(grid[i][j].gen, 255 - grid[i][j].gen, 0);
                stroke(0);
                rect(x, y, resolution - 1, resolution - 1);
            }
        }
    }

    let next = make2DArray(cols, rows);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let state = grid[i][j].state;
            let neighbors = countNeighbors(grid, j, i);

            if (grid[i][j].gen == 255) {
                next[i][j] = new Cell(j, i, 0, 0);
            } else if (state == 0 && neighbors == reporduction) {
                next[i][j] = new Cell(j, i, 1, 1);
            } else if (state == 1 && (neighbors < solitude || neighbors > overpopulation)) {
                next[i][j] = new Cell(j, i, 0, 0);
            } else {
                if (state) {
                    next[i][j] = new Cell(j, i, 1, grid[i][j].gen + 1);
                } else {
                    next[i][j] = new Cell(j, i, 0, 0);
                }
            }
        }
    }

    grid = next;

}


function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[row][col].state;
        }
    }
    sum -= grid[y][x].state;
    return sum;
}

function mousePressed(event) {
    let col = floor(mouseX / resolution) % cols;
    let row = floor(mouseY / resolution) % rows;
    grid[row][col].meteor();
}