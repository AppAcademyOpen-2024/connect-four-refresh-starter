const Screen = require("./screen");
const Cursor = require("./cursor");

const xWins = ['X', 'X', 'X', 'X'];
const oWins = ['O', 'O', 'O', 'O'];

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']]

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
    Screen.setGridlines(true);

    // Replace this with real commands
    Screen.addCommand('left', 'left command', this.cursor.left.bind(this.cursor));
    Screen.addCommand('right', 'right command', this.cursor.right.bind(this.cursor));
    Screen.addCommand('return', 'make mark command', this.makeMark.bind(this));

    this.cursor.setBackgroundColor();
    Screen.render();
  }

  getOpenRow(col) {
    const bottom = this.grid.length - 1;
    for (let i = bottom; i >= 0; i--) {
      if (this.grid[i][col] === ' ') {
        return i;
      }
    }
    return null;
  }

  makeMark() {
    const player = this.playerTurn;
    const { col } = this.cursor;
    const row = this.getOpenRow(col);

    if (row === null) {
      Screen.setMessage('Column Full, Try Again');
      Screen.render();
    } else {
      this.grid[row][col] = player;
      Screen.setGrid(row, col, player);

      const color = player === 'O' ? 'red' : 'blue';
      Screen.setBackgroundColor(row, col, color);

      if (ConnectFour.checkWin(this.grid)) {
        ConnectFour.endGame(player);
      } else {
        this.playerTurn = player === 'O' ? 'X' : 'O';
        Screen.render();
      }
    }
  }

  static checkRows(grid) {
    let winner = false;
    for (let i = 0; i < 6; i++) {
      const row = grid[i];
      if (this.hasWin(row, xWins)) {
        winner = 'X';
      }
      if (this.hasWin(row, oWins)) {
        winner = 'O';
      }
    }
    return winner;
  }

  static checkCols(grid) {
    let winner = false;
    for (let j = 0; j < 7; j++) {
      const col = [];
      for (let i = 0; i < 6; i++) {
        col.push(grid[i][j]);
      }
      if (this.hasWin(col, xWins)) {
        winner = 'X';
      }
      if (this.hasWin(col, oWins)) {
        winner = 'O';
      }
    }
    return winner;
  }

  static checkDiagsUp(grid) {
    let winner;

    for (let i = 3; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        const one = grid[i][j];
        if (one !== ' ') {
          const two = grid[i - 1][j + 1];
          const three = grid[i - 2][j + 2];
          const four = grid[i - 3][j + 3];

          if (
            one === two && one === three && one === four
          ) {
            winner = one;
          }
        }
      }
    }
    return winner;
  }

  static checkDiagsDown(grid) {
    let winner;

    for (let j = 0; j < 7; j++) {
      for (let i = 0; i < 3; i++) {
        const one = grid[i][j];
        if (one !== ' ') {
          const two = grid[i + 1][j + 1];
          const three = grid[i + 2][j + 2];
          const four = grid[i + 3][j + 3];

          if (
            one === two && one === three && one === four
          ) {
            winner = one;
          }

        }
      }
    }
    return winner;
  }

  static hasWin(arr, win) {
    return arr.join(',').includes(win.join(','));
  }

  static getEmpties(grid) {
    const empties = [];

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (grid[i][j] === ' ') {
          empties.push(grid[i][j]);
        }
      }
    }
    return empties;
  }

  static checkWin(grid) {
    let winner = false;

    if (
      this.checkRows(grid) === 'X'
      ||
      this.checkCols(grid) === 'X'
      ||
      this.checkDiagsUp(grid) === 'X'
      ||
      this.checkDiagsDown(grid) === 'X'
    ) {
      winner = 'X';
    }
    if (
      this.checkRows(grid) === 'O'
      ||
      this.checkCols(grid) === 'O'
      ||
      this.checkDiagsUp(grid) === 'O'
      ||
      this.checkDiagsDown(grid) === 'O'
    ) {
      winner = 'O';
    }

    const empties = this.getEmpties(grid);
    console.log('empties.length:', empties.length);
    if (empties.length === 0) winner = 'T';

    console.log('winner:', winner);

    return winner;
  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = ConnectFour;
