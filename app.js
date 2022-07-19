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
            console.log(playerScores)
            player1Score.textContent = playerScores[0].score;
        } else if(playerScore) {
            ++playerScores[1].score;
            console.log(playerScores)
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
    
const changeBetweenPages = (() => {
    const optionsCont = document.querySelector('.options-cont');
    const mainBoard = document.querySelector('.main-board');

    const animation1 = document.querySelector('.foranimation-1')

    const animation2 =  document.querySelector('.foranimation-2');

    const player1Input = document.querySelector('input[placeholder="Player 1"]');
    const player2Input = document.querySelector('input[placeholder="Player 2"]');

    const startBtn = document.getElementById('startBtn');
    const gobackBtn = document.getElementById('gobackBtn');

    const computerBtn = document.querySelector('.cpu');

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
    
    function getPlayerInput() {
        const player1 = Players(player1Input.value);
        const player2 = Players(player2Input.value);
        player1.setNames(player2);
    };

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

const computer = (() => {
    const computerBtn = document.querySelector('.cpu');
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
            })
        } 
        else {
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
        for(let i = 0; i < gameBoard.length; i++)
        {
            if(gameBoard[i] === "")
            {
                possibleMoves.push(i);
            }
        }
        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[randomIndex];
    }

    return { getRobotMoveIndex }
})();


const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];
    const X_Mark = 'X';
    const O_Mark = 'O';
    let circTurn;
    let canPlay = false;

    const cells = document.querySelectorAll('.cell p');
    const animCells = document.querySelectorAll('.anim');

    const drawCont = document.querySelector('.draw-txt');
    const drawTxt = document.querySelector('.draw-p');

    const computerBtn = document.querySelector('.cpu');
    computerBtn.addEventListener('click', clearIfClicked);

    playBefore();

    const { getGameMode } = changeBetweenPages;

    function playBefore() {
        board = ['', '', '', '', '', '', '', '', ''];
        circTurn = false;
        canPlay = true;
        cells.forEach((cell, i) => {
            cell.textContent = '';
            cell.addEventListener('click', cellClick);
            function cellClick() {
                const cellIndex = i;
                let currPlay = circTurn ? O_Mark : X_Mark;
                if(board[cellIndex] === "" && canPlay) {
                    placeMarks(currPlay, cellIndex);
                    if(checkForWin(currPlay)) {
                        canPlay = false;
                        finishGame(false);
                    } else if(isDraw()) {
                        canPlay = false;
                        finishGame(true);
                    } else {
                        changeTurns();
                        currentTurn();
                        if(getGameMode() === 'vsComputer') {
                            currPlay = circTurn ? O_Mark : X_Mark;
                            canPlay = false;
                            setTimeout(() => {
                                placeMarks(currPlay,  computer.getRobotMoveIndex(board));
                                if(checkForWin(currPlay)) {
                                    finishGame(false);
                                }
                                else if(isDraw()) {
                                    finishGame(true);
                                } else {
                                    canPlay = true;
                                    changeTurns();
                                    currentTurn();
                                }
                            }, 1000);
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

    const checkForWin = (play) => {
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

        return checkWinCombinations.some(combination => {
            return combination.every(i => {
                return board[i].includes(play);
            });
        });
    };

    function isDraw() {
        return board.every(item => {
            return item.includes(X_Mark) || item.includes(O_Mark)
        });
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
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.classList.add('fade');
            cell.addEventListener('animationend', (e) => {
                e.stopPropagation();
                cell.textContent = '';
                canPlay = true;
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
        gameScore.restartRounds();
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
        });
        animCells.forEach(animCell => {
            animCell.classList.remove('appear');
        });
    };
    
})();








