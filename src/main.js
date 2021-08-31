import p5 from "p5";

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let players = {
  player1: "X",
  player2: "O",
};

let endValues = {
  tie: 0,
  X: -1,
  O: 1,
};

let currentPlayer;

const cropValueCross = 20;

const circleDiameter = 90;

const sketch = (s) => {
  s.setup = () => {
    let canvas = s.createCanvas(400, 400);
    canvas.mouseClicked(humanMove);
    currentPlayer = players.player1;
  };

  s.draw = () => {
    let w = s.width / 3;
    let h = s.height / 3;

    s.strokeWeight(4);
    s.fill(220);
    s.background(220);
    s.line(0, h, s.width, h);
    s.line(0, h * 2, s.width, h * 2);
    s.line(w, 0, w, s.height);
    s.line(w * 2, 0, w * 2, s.height);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == players.player1) {
          s.line(
            w * j + cropValueCross,
            h * i + cropValueCross,
            w * (j + 1) - cropValueCross,
            h * (i + 1) - cropValueCross
          );
          s.line(
            w * (j + 1) - cropValueCross,
            h * i + cropValueCross,
            w * j + cropValueCross,
            h * (i + 1) - cropValueCross
          );
        } else if (board[i][j] == players.player2) {
          s.ellipse(
            w * j + w / 2,
            h * i + h / 2,
            circleDiameter,
            circleDiameter
          );
        }
      }
    }
    let res = checkWinner();
    if (res != null) {
      s.noLoop();
      s.createP(res);
    }
    if (res == null && currentPlayer == players.player2) {
      AIMove();
    }
  };

  const equals3 = (a, b, c) => {
    return a == b && b == c && a != "";
  };

  const checkFullBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") return false;
      }
    }
    return true;
  };

  const checkWinner = () => {
    let winner = null;

    //horizontal
    for (let i = 0; i < 3; i++) {
      if (equals3(board[i][0], board[i][1], board[i][2])) {
        winner = board[i][0];
      }
    }

    //vertical
    for (let i = 0; i < 3; i++) {
      if (equals3(board[0][i], board[1][i], board[2][i])) {
        winner = board[0][i];
      }
    }

    //diagonal
    if (
      equals3(board[0][0], board[1][1], board[2][2]) ||
      equals3(board[0][2], board[1][1], board[2][0])
    ) {
      winner = board[1][1];
    }

    if (winner == null && checkFullBoard()) {
      return "tie";
    } else {
      return winner;
    }
  };

  const humanMove = () => {
    let x = Math.floor(s.mouseX / (s.width / 3));
    let y = Math.floor(s.mouseY / (s.height / 3));
    if (board[y][x] == "") {
      board[y][x] = currentPlayer;
      currentPlayer =
        currentPlayer == players.player1 ? players.player2 : players.player1;
    }
  };

  const AIMove = () => {
    let bestScore = -Infinity;
    let move;
    const boardCopy = [...board];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardCopy[i][j] == "") {
          boardCopy[i][j] = players.player2;
          let score = minimax(boardCopy, -Infinity, Infinity, false);
          boardCopy[i][j] = "";
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    board[move.i][move.j] = currentPlayer;
    currentPlayer =
      currentPlayer == players.player1 ? players.player2 : players.player1;
  };

  const minimax = (boardToPass, alpha, beta, isMaximizingPlayer) => {
    let res = checkWinner();
    if (res !== null) {
      return endValues[res];
    }
    if (isMaximizingPlayer) {
      let value = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (boardToPass[i][j] == "") {
            boardToPass[i][j] = players.player2;
            value = Math.max(value, minimax(boardToPass, alpha, beta, false));
            boardToPass[i][j] = "";
            alpha = Math.max(alpha, value);
            if (beta <= value) return value;
          }
        }
      }
      return value;
    } else {
      let value = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (boardToPass[i][j] == "") {
            boardToPass[i][j] = players.player1;
            value = Math.min(value, minimax(boardToPass, alpha, beta, true));
            boardToPass[i][j] = "";
            beta = Math.min(beta, value);
            if (alpha >= value) return value;
          }
        }
      }
      return value;
    }
  };
};

const sketchInstance = new p5(sketch);
