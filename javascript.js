// Data structures

const Player = (mark, id) => {
  let wins = 0;
  
  const getMark = () => mark;
  const getId = () => id;

  const addWin = () => {
    wins += 1;
  }

  const getWins = () => wins;

  return {
    getMark,
    getId,
    addWin,
    getWins
  };
}

const gameboard = (() => {
  const rows = 3;
  const cols = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(null);
    }
  }

  const getBoard = () => board;

  const addMark = (row, col, mark) => {
    if (board[row][col] === null) board[row][col] = mark;
  }

  const getMark = (row, col) => {
    return board[row][col];
  }

  const reset = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(null);
      }
    }
  }

  const printIndexes = () => {
    board.forEach((row, indexrow) => {
      row.forEach((cell, indexcol) => {
        console.log(indexrow, indexcol, cell);
      })
    })
  }

  return {
    board,
    getBoard,
    addMark,
    getMark,
    reset,
    printIndexes
  }

})();

const gameController = (() => {

  const player1 = Player('X', 1);
  const player2 = Player('O', 2);
  let currentPlayer = player1;
  let round = 1;

  const resetGame = () => {
    displayController.updatePlayerStats(player1.getWins, player2.getWins);
  }

  const handleSelection = (position) => {
    gameboard.addMark(position[0], position[1], currentPlayer.getMark());
    switchPlayer();
    displayController.updateBoard();
  }

  const switchPlayer = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    displayController.updatePlayerSelection(currentPlayer.getId());
  }

  const checkWinner = () => {

  }

  return {
    handleSelection,
    switchPlayer,
    checkWinner,
    resetGame
  }

})();

const displayController = (() => {

  const buttons = document.querySelectorAll('.boardContainer>button');
  const playerdivs= document.querySelectorAll('.player');
  
  buttons.forEach((button) => {
    button.position = button.dataset.index.split(',');
    button.addEventListener('click', (e) => {
      gameController.handleSelection(e.target.position);
    });
  });

  const updateBoard = () => {
    console.log('fsdsd');
    buttons.forEach((button) => {
      button.innerHTML = gameboard.getMark(button.dataset.index.split(',')[0], button.dataset.index.split(',')[1]);
    });
  };

  const updatePlayerSelection = (id) => {
    playerdivs.forEach((playerdiv) => {

    });
  }

  const updatePlayerStats = (player1Wins, player2Wins) => {
    document.querySelector('div#player1 .score').innerText = `Score: ${player1Wins}`;
    document.querySelector('div#player2 .score').innerText = `Score: ${player2Wins}`;
  }

  return {
    updatePlayerStats,
    updateBoard,
    updatePlayerSelection
  }
})();





