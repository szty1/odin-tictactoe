// Data structures

const Player = (mark, name, id) => {
  let wins = 0;
  
  const getMark = () => mark;
  const getName = () => name;
  const getId = () => id;

  const addWin = () => {
    wins += 1;
  }

  const getWins = () => wins;

  return {
    getMark,
    getName,
    getId,
    addWin,
    getWins
  };
}

const gameboard = (() => {
  const rows = 3;
  const cols = 3;
  const board = [];
  const LINES = [
    [0,0, 0,1, 0,2],
    [1,0, 1,1, 1,2],
    [2,0, 2,1, 2,2],
    [0,0, 1,0, 2,0],
    [0,1, 1,1, 2,1],
    [0,2, 1,2, 2,2],
    [0,0, 1,1, 2,2],
    [2,0, 1,1, 0,2]
  ];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(null);
    }
  }

  const getBoard = () => board;

  const fillCell = (row, col, player) => {
    if (board[row][col] === null) board[row][col] = player;
  }

  const getCell = (row, col) => {
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

  const checkWinner = () => {
    let match = null
    LINES.forEach((line) => {
      if (getCell(line[0], line[1]) === getCell(line[2], line[3]) && getCell(line[0], line[1]) === getCell(line[4], line[5]) && getCell(line[0], line[1]) != null) {
        match = getCell(line[0], line[1]);
      }
    });
    return match;
  }

  return {
    board,
    getBoard,
    fillCell,
    getCell,
    reset,
    checkWinner
  }

})();

const gameController = (() => {

  const player1 = Player('X', 'Player1', 0);
  const player2 = Player('O', 'Player2', 1);
  let currentPlayer;
  let round;

  const initGame = () => {
    currentPlayer = player1;
    round = 0;
    gameboard.reset();
    displayController.updatePlayerStats(player1, player2);
    displayController.updateBoard();
    displayController.updatePlayerSelection(currentPlayer.getId());
  }

  const handleSelection = (position) => {
    gameboard.fillCell(position[0], position[1], currentPlayer);
    round++;
    switchPlayer();
    displayController.updateBoard();
    checkWinner();
  }

  const switchPlayer = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    displayController.updatePlayerSelection(currentPlayer.getId());
  }

  const checkWinner = () => {
    let winner = gameboard.checkWinner();
    if (winner) {
      displayController.displayResult(`The winner is ${winner.getName()}`);
      winner.addWin();
      displayController.updatePlayerStats(player1, player2);
    }
    if (round == 9) {
      displayController.displayResult(`It's a draw!`);
      displayController.updatePlayerStats(player1, player2);
    }
  }

  return {
    handleSelection,
    switchPlayer,
    checkWinner,
    initGame
  }

})();

const displayController = (() => {

  const buttons = document.querySelectorAll('.boardContainer>button');
  const playerdivs = document.querySelectorAll('.player');
  const resultdiv = document.querySelector('.result');
  const resultcaption = document.querySelector('.result p');
  const newGameButton = document.querySelector('.result button');
  
  buttons.forEach((button) => {
    button.position = button.dataset.index.split(',');
    button.addEventListener('click', (e) => {
      gameController.handleSelection(e.target.position);
    });
  });

  newGameButton.addEventListener('click', (e) => {
    resultdiv.classList.remove('visible');
    gameController.initGame();
  });

  const updateBoard = () => {
    buttons.forEach((button) => {
      let player = gameboard.getCell(button.dataset.index.split(',')[0], button.dataset.index.split(',')[1]);
      button.innerHTML = (player) ? player.getMark() : '';
    });
  };

  const updatePlayerSelection = (index) => {
    playerdivs.forEach((playerdiv) => {
      playerdiv.classList.remove('currentplayer');
    });
    playerdivs[index].classList.add('currentplayer');
  }

  const updatePlayerStats = (player1, player2) => {
    document.querySelector('div#player1 .mark').innerText = `${player1.getMark()}`;
    document.querySelector('div#player2 .mark').innerText = `${player2.getMark()}`;
    document.querySelector('div#player1 .name').innerText = `${player1.getName()}`;
    document.querySelector('div#player2 .name').innerText = `${player2.getName()}`;
    document.querySelector('div#player1 .score').innerText = `Score: ${player1.getWins()}`;
    document.querySelector('div#player2 .score').innerText = `Score: ${player2.getWins()}`;
  }

  const displayResult = (resultstring) => {
    resultcaption.innerText = resultstring;
    resultdiv.classList.add('visible');
    playerdivs.forEach((playerdiv) => {
      playerdiv.classList.remove('currentplayer');
    });
  }

  return {
    updatePlayerStats,
    updateBoard,
    updatePlayerSelection,
    displayResult
  }
})();

gameController.initGame();





