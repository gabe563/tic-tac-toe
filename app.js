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
    const board = ['', '', '', '', '', '', '', '', ''];
    const cells = document.querySelectorAll('[data-cell]');
    board.forEach((item, index) => {
        cells.forEach((cell, i) => {
            if(index === i) {
                cell.textContent = item
            }
        });
    }); 
})();
    
const addMarks = (() => {
    const X_Mark = 'X';
    const O_Mark = 'O';
    let circTurn;
    const cells = document.querySelectorAll('[data-cell]');
    const restartBtn = document.getElementById('restartBtn');

    playBefore();

    function playBefore() {
        circTurn = false;
        cells.forEach((cell, i) => {
            cell.textContent = '';
            cell.addEventListener('click', cellClick, { once: true});
        }) 
        currentTurn();
    }

    function cellClick(e) {
        const currCell = e.target;
        const currPlay = circTurn ? O_Mark : X_Mark;
        placeMarks(currCell, currPlay);
        swapTurn();
        currentTurn();
    }

    function placeMarks (cell, play) {
        cell.textContent = play;
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
            optionsCont.classList.add('fade')
            optionsCont.addEventListener('animationend', () => {
                optionsCont.classList.add('hidden');
                mainBoard.classList.remove('hidden');
                optionsCont.classList.remove('fade')
            })
        }
    }

    const {playBefore} = addMarks;

    function changePageBackwards() {
        if (!mainBoard.classList.contains('hidden')) {
            mainBoard.classList.add('fade')
            mainBoard.addEventListener('animationend', () => {
                optionsCont.classList.remove('hidden');
                mainBoard.classList.add('hidden');
                mainBoard.classList.remove('fade');
                playBefore()
            })
        }
    }

    function getPlayerInput() {
        const player1 = Players(player1Input.value);
        const player2 = Players(player2Input.value);
        player1.setNames(player2);
    }
})();







