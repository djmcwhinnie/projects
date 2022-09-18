const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

let scotle;
let scotleDesc;

const getScotle = () => {
    fetch('word-list.json')
        .then((response) => response.json())
        .then((data) => {
            randNumber = Math.floor(Math.random() * data.words.length);
            randWord = data.words[randNumber].word;
            randWordDesc = data.words[randNumber].description;
            scotle = randWord;
            scotleDesc = randWordDesc;
        })
        .catch((err) => console.log(err));
};
getScotle();

const keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del'];

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div');
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        tileElement.classList.add('tile');
        rowElement.append(tileElement);
    });
    tileDisplay.append(rowElement);
});

keys.forEach((key) => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = key;
    buttonElement.setAttribute('id', key);
    buttonElement.addEventListener('click', () => handleClick(key));
    keyboard.append(buttonElement);
});

const handleClick = (letter) => {
    if (!isGameOver) {
        if (letter === 'del') {
            deleteLetter();
            return;
        }
        if (letter === 'enter') {
            checkRow();
            return;
        }
        addLetter(letter);
    }
};

const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute('data', letter);
        currentTile++;
    }
};

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = '';
        guessRows[currentRow][currentTile] = '';
        tile.setAttribute('data', '');
    }
};

const checkRow = () => {
    const guess = guessRows[currentRow].join('');

    if (currentTile > 4) {
        flipTile();
        if (scotle == guess) {
            setTimeout(showMessage, 3000, 'Gawn yersel!');
            isGameOver = true;
            return;
        } else {
            if (currentRow >= 5) {
                isGameOver = true;
                setTimeout(showMessage, 3000, 'Dinna fash yersel!');
                return;
            }
            if (currentRow < 5) {
                currentRow++;
                currentTile = 0;
            }
        }
    }
};

const showMessage = (message) => {
    const messageContainer = document.querySelector('.message-container');
    messageContainer.classList.remove('hidden');

    const messageElement = document.createElement('div');
    messageElement.classList.add('message-container__inner');
    messageElement.innerHTML = `
        <p class="message-slogan">${message}</p>
        <span class="message-scotle">${scotle}</span>
        <p class="message-desc">${scotleDesc}</p>
        <button class="message-refresh">Play Again?</button>
        `;
    messageDisplay.append(messageElement);

    const newGame = document.querySelector('.message-refresh');
    newGame.addEventListener('click', function () {
        window.location.reload();
    });
};

const colourKey = (keyLetter, colour) => {
    const key = document.getElementById(keyLetter);
    key.classList.add(colour);
};

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    let checkScotle = scotle;
    const guess = [];

    rowTiles.forEach((tile) => {
        guess.push({
            letter: tile.getAttribute('data'),
            colour: 'grey-overlay',
        });
    });

    guess.forEach((guess, index) => {
        if (guess.letter == scotle[index]) {
            guess.colour = 'green-overlay';
            checkScotle = checkScotle.replace(guess.letter, '');
        }
    });

    guess.forEach((guess) => {
        if (checkScotle.includes(guess.letter)) {
            guess.colour = 'yellow-overlay';
            checkScotle = checkScotle.replace(guess.letter, '');
        }
    });

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].colour);
            colourKey(guess[index].letter, guess[index].colour);
        }, 500 * index);
    });
};

// Colour Mode
const colourModeBtn = document.getElementById('colour-mode');

colourModeBtn.addEventListener('click', function () {
    if (colourModeBtn.checked == true) {
        document.body.classList.add('light-theme');
    } else if (colourModeBtn.checked == false) {
        document.body.classList.remove('light-theme');
    }
});

// Information Modal
const modal = document.getElementById('info-modal');

// Get button that opens the modal
const btn = document.getElementById('game-info');

// Get button that closes the modal
const closeBtn = document.getElementById('modal-close');

// When the user clicks on the button, open the modal
btn.addEventListener('click', function () {
    modal.classList.remove('hidden');
});

// When the user clicks on close button, close the modal
closeBtn.addEventListener('click', function () {
    modal.classList.add('hidden');
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.classList.add('hidden');
    }
});

// Footer Date
var footerDate = new Date();
document.getElementById('footer-date').innerHTML = footerDate.getFullYear();
