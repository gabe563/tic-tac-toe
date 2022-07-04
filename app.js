
const gameBoard = 
    ['','','']

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

const changeBetweenPages = (() => {
    const optionsCont = document.querySelector('.options-cont');
    const mainBoard = document.querySelector('.main-board');

    const player1Input = document.querySelector('input[placeholder="Player 1"]');
    const player2Input = document.querySelector('input[placeholder="Player 2"]');

    const startBtn = document.getElementById('startBtn');
    const gobackBtn = document.getElementById('gobackBtn');

    startBtn.addEventListener('click', changePage);
    gobackBtn.addEventListener('click', changePage);

    function changePage() {
        if (mainBoard.classList.contains('hidden')) {
            getPlayerInput()
            player1Input.value = '';
            player2Input.value = '';
            optionsCont.style.animation = "fade-out 0.5s forwards";
            mainBoard.style.animation = "";
            optionsCont.addEventListener('animationend', () => {
                    optionsCont.classList.add('hidden');
                    mainBoard.classList.remove('hidden');
            })
        } 
        if (optionsCont.classList.contains('hidden')) {
            mainBoard.style.animation = "fade-out 0.4s forwards";
            optionsCont.style.animation = "";
            mainBoard.addEventListener('animationend', () => {
                optionsCont.classList.remove('hidden');
                mainBoard.classList.add('hidden');
            })
        }
    }

    function getPlayerInput() {
        const player1 = Players(player1Input.value);
        const player2 = Players(player2Input.value);
        player1.setNames(player2);
    }
})();










