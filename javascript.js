// Data structures

const Player = (mark, name, id) => {
  let wins = 0;
  
  const getMark = () => mark;
  const getName = () => name;
  const getId = () => id;

  const setName = (newname) => {
    name = newname;
  }

  const addWin = () => {
    wins += 1;
  }

  const getWins = () => wins;

  return {
    getMark,
    getName,
    getId,
    setName,
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

  const checkRow = (row) => {
    return (board[row][0] === board[row][1] && board[row][0] === board[row][2] && board[row][0] != null)
  }

  const checkColumn = (col) => {
    return (board[0][col] === board[1][col] && board[0][col] === board[2][col] && board[0][col] != null)
  }

  const checkDiagonals = () => {
    if (board[1][1] === null) return false;
    return ((board[0][0] === board[1][1] && board[0][0] === board[2][2]) || (board[0][2] === board[1][1] && board[0][2] === board[2][0]))
  }

  return {
    board,
    getBoard,
    fillCell,
    getCell,
    reset,
    checkRow,
    checkColumn,
    checkDiagonals
  }

})();

const gameController = (() => {

  const player1 = Player('X', 'Player1', 0);
  const player2 = Player('O', 'Player2', 1);
  let currentPlayer;
  let round;
  let gameOver;

  const initGame = () => {
    gameOver = false;
    currentPlayer = player1;
    round = 0;
    gameboard.reset();
    displayController.updatePlayerStats(player1, player2);
    displayController.updateBoard();
    displayController.updatePlayerSelection(currentPlayer.getId());
  }

  const handleSelection = (position) => {
    if (gameOver) return;
    if (!gameboard.getCell(position[0], position[1])) {
      gameboard.fillCell(position[0], position[1], currentPlayer);
      displayController.updateBoard();
      if (checkWinner(position)) {
        displayController.displayResult(`The winner is ${currentPlayer.getName()}`);
        currentPlayer.addWin();
        displayController.updatePlayerStats(player1, player2);
        gameOver = true;
      } else if (round == 8) {
        displayController.displayResult(`It's a draw!`);
        displayController.updatePlayerStats(player1, player2);
        gameOver = true;
      } else {
        round++;
        switchPlayer();
        checkWinner(position);
      }   
    }
  }

  const switchPlayer = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    displayController.updatePlayerSelection(currentPlayer.getId());
  }

  const checkWinner = (position) => {
    return (gameboard.checkRow(position[0]) || gameboard.checkColumn(position[1]) || gameboard.checkDiagonals());
  }

  const setPlayerName = (player, newname) => {
    player.setName(newname);
  }

  return {
    handleSelection,
    initGame,
    setPlayerName
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





