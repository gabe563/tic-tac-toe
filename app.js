// Get and store each value of the players inputs
const Players = (name) => {
    const player1Name = document.querySelector('.player1Name');
    const player2Name = document.querySelector('.player2Name');

    const getName = () => name;
    
    const setNames = player2 => {
        if(name === '') {
            player1Name.textContent = 'X';
            player1Name.classList.add('empty');
        } else {
            player1Name.textContent = name;
            player1Name.classList.remove('empty');
        } 
        
        if(player2.getName() === '') {
            player2Name.textContent = 'O';
            player2Name.classList.add('empty');
        } else {
            player2Name.textContent = player2.getName();
            player2Name.classList.remove('empty');
        }
    };

    return { setNames, getName }
}

// Add, reset and store scores values
const gameScore = (() => {
    let playerScores = [
        {
            'name' : 'player1',
            'score' : 0
        },
        {
            'name' : 'player2',
            'score' : 0
        }
    ];

    const player1Score = document.querySelector('#player1Score p');
    const player2Score = document.querySelector('#player2Score p');

    const restartRoundsBtn = document.getElementById('restartBtn');
    
    function addUpScore(playerScore) {
        if(!playerScore) {
            ++playerScores[0].score;
            player1Score.textContent = playerScores[0].score;
        } else if(playerScore) {
            ++playerScores[1].score;
            player2Score.textContent = playerScores[1].score;
        }
    };

    restartRoundsBtn.addEventListener('click', restartRounds);

    function restartRounds() {
        playerScores[0].score = 0;
        playerScores[1].score = 0;
        player1Score.textContent = playerScores[0].score;
        player2Score.textContent = playerScores[1].score;
    };


    return { addUpScore, restartRounds }
})();
    
// Handle animations between pages
const changeBetweenPages = (() => {
    const optionsCont = document.querySelector('.options-cont');
    const mainBoard = document.querySelector('.main-board');

    const animation1 = document.querySelector('.foranimation-1')

    const animation2 =  document.querySelector('.foranimation-2');

    const player1Input = document.querySelector('input[placeholder="Player 1"]');
    const player2Input = document.querySelector('input[placeholder="Player 2"]');

    const startBtn = document.getElementById('startBtn');
    const gobackBtn = document.getElementById('gobackBtn');

    const computerBtn = document.querySelector('.cpu button');

    let gameMode = null;

    startBtn.addEventListener('click', () => {
        checkIfCpu();
        getPlayerInput();
        player1Input.value = '';
        player2Input.value = '';
        addFade(optionsCont);
        optionsCont.addEventListener('animationend', () => {
            optionsCont.classList.add('hidden');
            mainBoard.classList.remove('hidden');
            removeFade(optionsCont);
            animation2.classList.add('fadeIndisp');
            animation2.addEventListener('animationend', (e) => {
                e.stopPropagation();
                animation2.classList.remove('fadeIndisp');
            });
        });
    });

    gobackBtn.addEventListener('click', () => { 
        addFade(mainBoard);
        mainBoard.addEventListener('animationend', () => {
            optionsCont.classList.remove('hidden');
            mainBoard.classList.add('hidden');
            removeFade(mainBoard);
            animation1.classList.add('fadeIndisp');
            animation1.addEventListener('animationend', (e) => {
                e.stopPropagation();
                animation1.classList.remove('fadeIndisp');
            });
        });
    });

    function addFade(el) {
        el.classList.add('fade');
    };

    function removeFade(el) {
        el.classList.remove('fade');
    };
    
    // Get players input values
    function getPlayerInput() {
        const player1 = Players(player1Input.value);
        const player2 = Players(player2Input.value);
        player1.setNames(player2);
    };

    // Check current game mode selected
    function checkIfCpu() {
        if(computerBtn.classList.contains('selected')) {
            gameMode = 'vsComputer';
        } else {
            gameMode = 'vsPlayer';
        }
    };

    const getGameMode = () => { return gameMode }

    return { getGameMode }
})();

// Manage all the functionality of the game
const gameBoard = (() => {
    let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const X_Mark = 'X';
    const O_Mark = 'O';
    let circTurn;
    let canPlay = false;
    let currPlay;
    const cells = document.querySelectorAll('.cell p');
    const animCells = document.querySelectorAll('.anim');

    const drawCont = document.querySelector('.draw-txt');
    const drawTxt = document.querySelector('.draw-p');

    const computerBtn = document.querySelector('.cpu button');
    computerBtn.addEventListener('click', clearIfClicked);

    playBefore();

    const { getGameMode } = changeBetweenPages;
    
    function playBefore() {
        board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        circTurn = false;
        canPlay = true;
        cells.forEach((cell, i) => {
            cell.textContent = '';
            cell.addEventListener('click', cellClick);
            function cellClick() {
                const cellIndex = i;
                currPlay = circTurn ? O_Mark : X_Mark;
                if(typeof board[cellIndex] == 'number' && canPlay) {
                    if(getGameMode() === 'vsPlayer') {
                        placeMarks(currPlay, cellIndex);
                    }
                    if(getGameMode() === 'vsComputer') {
                        placeMarks(currPlay, cellIndex);
                        currPlay = circTurn ? O_Mark : X_Mark;
                        canPlay = false;
                        if(canPlay === false && circTurn) {
                            setTimeout(() => {
                                placeMarks(currPlay, computer.getBestSpot(board));
                            }, 300);
                        }
                    } 
                }
            };
        }); 
        currentTurn();
    };

    function placeMarks(play, index) {
        board[index] = play;
        animCells.forEach((animCell, i) => {
            if(index === i) {
                animCell.classList.add('appear');
            }
        });
        cells[index].textContent = play;
        if(getGameMode() === 'vsPlayer') {
            if(checkForWin(board, currPlay)) {
                canPlay = false;
                finishGame(false);
            } else if(isDraw()) {
                canPlay = false;
                finishGame(true);
            } else {
                changeTurns();
                currentTurn();
            }
        } else if(getGameMode() === 'vsComputer'){
            if(checkForWin(board, currPlay)) {
                if(!circTurn) {
                    canPlay = false
                }
                finishGame(false);
            } else if(isDraw()) {
                if(!circTurn) {
                    canPlay = false
                }
                finishGame(true);
            } else {
                if(circTurn) {
                    canPlay = true;
                }
                changeTurns();
                currentTurn();
            }
        }
    };

    function changeTurns() {
        circTurn = !circTurn;
    };
    
    function currentTurn() {
        const player1Name = document.querySelector('.player1Name');
        const player2Name = document.querySelector('.player2Name');
       
        if(circTurn) {
            addGlow(player2Name);
            removeGlow(player1Name);
        } else {
            addGlow(player1Name);
            removeGlow(player2Name);
        }
    };

    function emptyIndex(){
	    return board.filter(s => typeof s == 'number');
    };

    const checkForWin = (newBoard, play) => {
        const checkWinCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let plays = newBoard.reduce((a, e, i) =>
		(e === play) ? a.concat(i) : a, []);
    
	    for (let [index, combination] of checkWinCombinations.entries()) {
            if (combination.every(elem => plays.indexOf(elem) > -1)) {
                return true;
            }
	    }
    };
   
    function isDraw() {
        return emptyIndex().length === 0;
    };

    const { addUpScore } = gameScore;

    const finishGame = (Draw) => {
        if(Draw) {
            drawAnimation();
            cellClear();
        } else {    
            if(circTurn)  {
                cellClear();
                addUpScore(circTurn);
                if(getGameMode() === 'vsComputer') {
                    changeTurns();
                    currentTurn();
                }
            } 
            else {
                cellClear();
                addUpScore(circTurn);
            }
        }
    };

    function drawAnimation() {
        drawCont.classList.add('longfadein');
        drawTxt.textContent = "It's a draw!";
        drawCont.addEventListener('animationend', (e) => {
            e.stopPropagation();
            drawCont.classList.remove('longfadein');
            drawTxt.classList.add('longfade')
            drawTxt.addEventListener('animationend', (e) => {
                e.stopPropagation();
                drawTxt.classList.remove('longfade');
                drawTxt.textContent = '';
            });
        });
    };

    function cellClear() {
        board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        cells.forEach(cell => {
            cell.classList.add('fade');
            cell.addEventListener('animationend', (e) => {
                e.stopPropagation();
                cell.textContent = '';
                if(getGameMode() === 'vsComputer' && circTurn) {
                    canPlay = false;
                } else {
                    canPlay = true;
                }
                cell.classList.remove('fade');
                animCells.forEach(animCell => {
                    animCell.classList.remove('appear');
                });
            });
        });
    };

    function addGlow(el) {
        el.classList.add('glow');
    };

    function removeGlow(el) {
        el.classList.remove('glow');
    };

    function clearIfClicked() {
        circTurn = false;
        gameScore.restartRounds();
        board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        cells.forEach(cell => {
            cell.textContent = '';
        });
        animCells.forEach(animCell => {
            animCell.classList.remove('appear');
        });
        currentTurn();
    };

    return { checkForWin, emptyIndex }    
})();

const computer = (() => {
    const computerBtn = document.querySelector('.cpu button');
    const computerIcon = document.querySelector('.computer-cont');
    const computerImg = document.querySelector('.computer-cont img');

    const markIcon = document.querySelector('.player2-cont');
    const markTxt = document.querySelector('.player2-cont p');

    computerBtn.addEventListener('click', changeBtnColor);

    function changeBtnColor(e) {
        e.target.classList.toggle('selected');
        showComputerIcon();
    };

    function showComputerIcon() {
        if(computerBtn.classList.contains('selected')) {
            markIcon.classList.add('fade');
            markIcon.addEventListener('animationend', (e) => {
                e.stopPropagation();
                markIcon.classList.add('hidden');
                markIcon.classList.remove('fade');
                computerIcon.classList.remove('hidden');
                computerImg.classList.add('fadeIndisp');
                computerImg.addEventListener('animationend', (e) => {
                    e.stopPropagation();
                    computerImg.classList.remove('fadeIndisp');
                });
            });
        } else {
            computerIcon.classList.add('fade');
            computerIcon.addEventListener('animationend', (e) => {
                e.stopPropagation();
                computerIcon.classList.add('hidden');
                computerIcon.classList.remove('fade');
                markIcon.classList.remove('hidden');
                markTxt.classList.add('fadeIndisp');
                markTxt.addEventListener('animationend', (e) => {
                    e.stopPropagation();
                    markTxt.classList.remove('fadeIndisp');
                });
            });
        }
    };

    const getRobotMoveIndex = gameBoard => {
        let possibleMoves = []; 
        for(let i = 0; i < gameBoard.length; i++) {
            if(typeof gameBoard[i] == 'number') {
                possibleMoves.push(i);
            }
        }
        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[randomIndex];
    };

    const getBestSpot = (board) => {
        return MiniMax(board, 'O').index
    };

    const MiniMax = (newBoard, player) => {
        let availSpots = gameBoard.emptyIndex();

        let checkWin = gameBoard.checkForWin;

        if(checkWin(newBoard, 'X')) {
            return { score: -10 };   
        } else if(checkWin(newBoard, 'O')) {
            return { score: 10 };
        } else if(availSpots.length === 0) {
            return { score: 0 };
        }

        let moves = [];
        for(let i = 0; i < availSpots.length; i++) {
            let move = {};

            move.index = newBoard[availSpots[i]];

            newBoard[availSpots[i]] = player;
            
            if(player == 'O') {
                let result = MiniMax(newBoard, 'X');
                move.score = result.score;
            } else {
                let result = MiniMax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        }

        let bestMove;
        if(player === 'O') {
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    };

    return { getBestSpot, getRobotMoveIndex }
})();








