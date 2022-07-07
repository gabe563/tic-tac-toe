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
    }
    return {setNames, getName}
}
    
const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];
    const X_Mark = 'X';
    const O_Mark = 'O';
    // let canPlay = false;
    let circTurn;
    const cells = document.querySelectorAll('[data-cell]');
    const restartBtn = document.getElementById('restartBtn');

    playBefore()

    function playBefore() {
        board = ['', '', '', '', '', '', '', '', ''];
        console.log(board)
        circTurn = false;
        cells.forEach((cell, i) => {
            cell.textContent = '';
            cell.addEventListener('click', (e) => {
                console.log(circTurn)
                const cellIndex = i;
                console.log(cellIndex)
                const currCell = e.target;
                const currPlay = circTurn ? O_Mark : X_Mark;
                if(board[cellIndex] === "") {
                    placeMarks(currCell, currPlay, cellIndex);
                    swapTurn();
                    currentTurn();
                }
            });
        }) 
        currentTurn();
    }

    function placeMarks(cell, play, index) {
        board[index] = play;
        console.log(board)
        cell.textContent = play;
        console.log(cell.textContent)
    }

    function swapTurn() {
        circTurn = !circTurn;
    }
    
    function currentTurn() {
        const player1Name = document.querySelector('.player1Name');
        const player2Name = document.querySelector('.player2Name');
       
        if(circTurn) {
            player2Name.classList.add('current');
            player1Name.classList.remove('current');
        } else {
            player1Name.classList.add('current');
            player2Name.classList.remove('current');
        }
    }
    return { playBefore }
})();

const checkForWin = (() => {
    const checkWinCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
})();


const changeBetweenPages = (() => {
    const optionsCont = document.querySelector('.options-cont');
    const mainBoard = document.querySelector('.main-board');

    const player1Input = document.querySelector('input[placeholder="Player 1"]');
    const player2Input = document.querySelector('input[placeholder="Player 2"]');

    const startBtn = document.getElementById('startBtn');
    const gobackBtn = document.getElementById('gobackBtn');

    startBtn.addEventListener('click', changePageForward);
    gobackBtn.addEventListener('click', changePageBackwards);

    function changePageForward() {
        if (!optionsCont.classList.contains('hidden')) {
            getPlayerInput()
            player1Input.value = '';
            player2Input.value = '';
            optionsCont.classList.add('fade');
            optionsCont.addEventListener('animationend', () => {
                optionsCont.classList.add('hidden');
                mainBoard.classList.remove('hidden');
                optionsCont.classList.remove('fade')
            })
        }
    }

    const {playBefore} = gameBoard;

    function changePageBackwards() {
        if (!mainBoard.classList.contains('hidden')) {
            mainBoard.classList.add('fade');
            mainBoard.addEventListener('animationend', () => {
                playBefore()
                optionsCont.classList.remove('hidden');
                mainBoard.classList.add('hidden');
                mainBoard.classList.remove('fade');
            })
        }
    }

    function getPlayerInput() {
        const player1 = Players(player1Input.value);
        const player2 = Players(player2Input.value);
        player1.setNames(player2);
    }
})();







