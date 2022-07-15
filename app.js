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
    const player1Score = document.querySelector('#player1Score p');
    const player2Score = document.querySelector('#player2Score p');

    const restartRoundsBtn = document.getElementById('restartBtn');
    
    function addUpScore(playerScore) {
        if(playerScore.name === 'player1') {
            ++playerScore.score;
            player1Score.textContent = playerScore.score;
        } else if(playerScore.name === 'player2') {
            ++playerScore.score;
            player2Score.textContent = playerScore.score;
        }

        restartRoundsBtn.addEventListener('click', restartRounds);

        function restartRounds() {
            console.log(playerScore)
            playerScore.score = 0;
            player1Score.textContent = playerScore.score;
            player2Score.textContent = playerScore.score;
            console.log(playerScore)
        };
    };

    return { addUpScore }
})();
    
const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];
    const X_Mark = 'X';
    const O_Mark = 'O';
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
    let circTurn;
    const cells = document.querySelectorAll('[data-cell]');

    const drawCont = document.querySelector('.draw-txt');
    const drawTxt = document.querySelector('.draw-p');

    playBefore();

    function playBefore() {
        board = ['', '', '', '', '', '', '', '', ''];
        circTurn = false;
        cells.forEach((cell, i) => {
            cell.textContent = '';
            cell.addEventListener('click', cellClick)
            function cellClick(e) {
                const cellIndex = i;
                const currCell = e.target;
                const currPlay = circTurn ? O_Mark : X_Mark;
                if(board[cellIndex] === "") {
                    placeMarks(currCell, currPlay, cellIndex);
                }
            };
        }) 
        currentTurn();
    };

    function placeMarks(cell, play, index) {
        board[index] = play;
        cell.textContent = play;
        if(checkForWin(play)) {
            finishGame(false);
        } else if(isDraw()) {
            finishGame(true);
        } else {
            changeTurns();
            currentTurn();
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
            })
        })
    };

    function isDraw() {
        return board.every(item => {
            return item.includes(X_Mark) || item.includes(O_Mark)
        })
    };

    const { addUpScore } = gameScore;

    const finishGame = (Draw) => {
        if(Draw) {
            drawAnimation();
            cellClear();
        } else {    
            if(circTurn)  {
                cellClear();
                addUpScore(playerScores[1]);
            }
            else {
                cellClear();
                addUpScore(playerScores[0]);
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
            })
        })
    }

    function cellClear() {
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.add('fade');
            cell.addEventListener('animationend', (e) => {
                e.stopPropagation();
                cell.classList.remove('fade');
                cell.classList.add('fadein');
                cell.addEventListener('animationend', () => {
                    cell.classList.remove('fadein');
                })
            })
        })
    };

    function addGlow(el) {
        el.classList.add('glow');
    }

    function removeGlow(el) {
        el.classList.remove('glow');
    }

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

    startBtn.addEventListener('click', () => {
        getPlayerInput();
        player1Input.value = '';
        player2Input.value = '';
        addFade(optionsCont);
        optionsCont.addEventListener('animationend', (e) => {
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
        mainBoard.addEventListener('animationend', (e) => {
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

})();







