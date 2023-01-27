/*----- constants -----*/
//word categories
const MOVIE_WORDS = ['BILL MURRAY', 'BUGS BUNNY', 'DAFFY DUCK', 'SPACE JAM'];
const SPACE_WORDS = ['JUPITER', 'NEPTUNE', 'MERCURY', 'GALAXY', 'ROCKETSHIP', 'STARS'];
const BBALL_WORDS = ['MICHAEL JORDAN', 'MONSTARS', 'TUNE SQUAD', 'LEBRON JAMES', 'DUNK'];
const MAX_WRONG = 6;
const IMGS = [
    "imgs/spaceman.png/spacejam-0.png",
    "imgs/spaceman.png/spacejam-1.png",
    "imgs/spaceman.png/spacejam-2.png",
    "imgs/spaceman.png/spacejam-3.png",
    "imgs/spaceman.png/spacejam-4.png",
    "imgs/spaceman.png/spacejam-5.png",
    "imgs/spaceman.png/spacejam-6.png",
    "imgs/spaceman.png/spacejamlogo.png",
    "imgs/spaceman.png/spacejamwin.png",
    "imgs/spaceman.png/mjcry.png",
];

/*----- app's state (variables) -----*/
let secretWord;
let wrongGuesses;
let wordStatus;
let winLoss;
let hintWord;
let hintLtr;
let hintsLeft;
let hintsRevealed;
let category;
let clkSound;
let audio;

/*----- cached element references -----*/
const message = document.getElementById('message');
const guess = document.getElementById('word-status');
//create array of all the letters in the div,
//...instead of creating a different id for each one
const letterBtns = [...document.querySelectorAll('div > button')];
const resetBtn = document.getElementById('reset');
const spaceman = document.querySelector('div > img');
const clickedLtr = document.querySelector('section');
const hintBtn = document.getElementById('hint');
const hintText = document.getElementById('hints-remain');
const categoriesBtn = document.getElementById('categories');
const catNav = document.querySelector('nav');
const spaceCat = document.getElementById('space');
const moviesCat = document.getElementById('movies');
const bballCat = document.getElementById('basketball');
const clickSound = document.querySelector('main');


/*----- event listeners -----*/
clickedLtr.addEventListener('click', handleClick);
resetBtn.addEventListener('click', chooseMovies);
hintBtn.addEventListener('click', handleHint);
categoriesBtn.addEventListener('click', chooseCategory);
spaceCat.addEventListener('click', chooseSpace);
moviesCat.addEventListener('click', chooseMovies);
bballCat.addEventListener('click', chooseBball);
clickSound.addEventListener('click', handleClickSound);


/*----- functions -----*/
init();

//start game with movie category, otherwise initialize game with chosen category
function init(cat) {
    if (cat === undefined) {
        secretWord = MOVIE_WORDS[Math.floor(Math.random() *  MOVIE_WORDS.length)].split('');
    }else{
        secretWord = cat[Math.floor(Math.random() *  cat.length)].split('');
    }
    renderWord();
    wrongGuesses = [];
    winLoss = null;
    message.innerText = 'GUESS THE WORD';
    hintWord = [];
    hintsLeft = 3;
    hintText.innerText = `${hintsLeft} hints left!`;
    hintsRevealed = [];
    displayHints();
    render();
}

//show secret word unrevealed
//if theres a space, return a space instead of and underscore
function renderWord() {
    wordStatus = secretWord.map(function(ltr) {
        if(ltr === ' ') return ' '
        else return ' _ ';
    });
}

//check if secret word includes letter clicked (guessed)
//if it does, reveal it; if not, put it into wrongGuesses array
function handleClick(evt) {
    const letter = evt.target.textContent;
    if (winLoss || evt.target.tagName !== 'BUTTON' || wrongGuesses.includes(letter) || wordStatus.includes(letter)) return;
    if (secretWord.includes(letter)) {
        secretWord.forEach(function(char, idx) {
            if(char === letter) wordStatus[idx] = letter;
        })
    } else {
        wrongGuesses.push(letter);
    }
    winLoss = checkForWinLoss();
    render();
}

//if hint is clicked, show hints left message
//first time hint is clicked, play audio
//if theres already a win, or no hints left, dont respond
//get hint by filtering through the secret word and only choosing letters 
//...that havent already been chosen (ignore spaces)
//put the hint letter where it belongs in the secret word
//check for a win:  if hint caused win we want the game to end
function handleHint(evt) {
    if (hintsLeft === 0 && catNav.style.display === 'flex') {
        displayHints();
        hintText.innerText = 'Out of hints';
    }
    if(hintsLeft === 3) {
        if(winLoss) return;
        audio = new Audio('hint-audio.wav');
        audio.play();
    }
    if (winLoss || hintsLeft === 0) return;
    displayHints();
    hintWord = secretWord.filter((ltr) => (!wordStatus.includes(ltr) && ltr !== ' '));
    hintLtr = hintWord[Math.floor(Math.random() *  hintWord.length)];
    secretWord.forEach(function(char, idx) {
        if(char === hintLtr) wordStatus[idx] = hintLtr;
        hintsRevealed.push(hintLtr);
    })
    
    hintsLeft --;
    if (hintsLeft > 0) hintText.innerText = `${hintsLeft} hints left!`;
    if (hintsLeft === 1) hintText.innerText = `${hintsLeft} hint left!`;
    if (hintsLeft === 0) hintText.innerText = 'Out of hints';

    winLoss = checkForWinLoss();
    render();
}

//checking for win or loss and displaying msg
//render will render win or loss image
function checkForWinLoss() {
    if (wordStatus.join('') === secretWord.join('')) {
        message.innerText = 'You win!';
        return true;
    }
    if (MAX_WRONG === wrongGuesses.length) {
        message.innerText = 'You lose!';
        return true;
    }
    render();
}

//change the keyboard letter color depending on if it was a
//...correct or wrong guess, or hint
//else, keep it the normal color
function renderBtnStyle () {
    letterBtns.forEach(function(btn) {
        const ltr = btn.textContent;
        if(wrongGuesses.includes(ltr)) {
            btn.className = 'bad-guesses';
        }else if(wordStatus.includes(ltr) && !hintsRevealed.includes(ltr)) {
            btn.className = 'correct-guesses';
        }else if(hintsRevealed.includes(ltr)) {
            btn.className = 'hints-revealed';
        }else {
            btn.className = '';
        }
    })
}

//render images, msg, and audio for win and loss
function renderImage() {
    if (wordStatus.join('') === secretWord.join('')) {
        spaceman.className = 'winloss-img';
        spaceman.src = 'imgs/spacejamwin.png';
        hintText.innerText = 'THE WORD WAS:';
        audio = new Audio('win-audio.mp3');
        setTimeout(function (){
            audio.play();
        }, 100)
    } else spaceman.src = `imgs/spacejam-${wrongGuesses.length}.png`;
    if (MAX_WRONG === wrongGuesses.length) {
        audio = new Audio('loss-audio.wav');
        audio.play();
        spaceman.className = 'winloss-img'
        guess.textContent = secretWord.join('');
        hintText.innerText = 'THE WORD WAS:';
        setTimeout(function (){
            spaceman.src = 'imgs/mjcry.png';
        }, 3250)
    }
}

//if categories is clicked, hide the hints and show categories
function chooseCategory (){
    hintText.style.display = 'none';
    catNav.style.display = 'flex';
}

//choosing category by passing words into init
function chooseSpace(){
    init(SPACE_WORDS);
}

function chooseMovies(){
    init(MOVIE_WORDS);
}

function chooseBball(){
    init(BBALL_WORDS);
}

//if hints is clicked, hide the categories and show hints
function displayHints() {
    hintText.style.display = 'flex';
    catNav.style.display = 'none';
}

//creates button click sound
function handleClickSound(evt) {
    if(evt.target.tagName === 'BUTTON') clickAudio();
}

function clickAudio() {
    sound = new Audio('click-audio.wav');
    sound.play();
}

//transfer info to DOM
function render() {
    guess.textContent = wordStatus.join('');
    renderImage();
    renderBtnStyle();
}