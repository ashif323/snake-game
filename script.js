const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')
const restartButton = document.querySelector('.btn-restart');
const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.innerText = highScore;
let score = 0
let time = `00:00`

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timeIntervalId = null;

let food = {row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * cols)};

const blocks = [];

let snake = [
    {row: 2, col: 2}
];

let direction = 'down';

for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block)
        blocks[`${row},${col}`] = block
    }
}

function drawSnake(){

    let head = null;

    blocks[`${food.row},${food.col}`].classList.add("food")

    // Determine new head position
    if (direction === 'left'){

        head = {row: snake[0].row, col: snake[0].col -1}
    }else if (direction === 'right'){

        head = {row: snake[0].row, col: snake[0].col + 1}
    }else if (direction === 'up'){
        head = {row: snake[0].row - 1, col: snake[0].col}
    }else if (direction === 'down'){
        head = {row: snake[0].row + 1, col: snake[0].col}
    }

    // Wall collision
    if (head.row < 0 || head.row >= rows || head.col < 0 || head.col >=cols){
        clearInterval(intervalId)
        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        gameOverModal.style.display = 'flex';
        return;
    }

    // Food consumption
    if (head.row === food.row && head.col === food.col){
        blocks[`${food.row},${food.col}`].classList.remove("food")
        food = {row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * cols)}
        blocks[`${food.row},${food.col}`].classList.add("food")

        snake.unshift(head);
        score += 10;
        scoreElement.innerText = score;
        
        if (score > highScore){
            highScore = score;
            localStorage.setItem('highScore', highScore.toString());
        }
    }
    

    snake.forEach(segment => {
        blocks[`${segment.row},${segment.col}`].classList.remove("fill")
    })

    snake.unshift(head);
    snake.pop();

    snake.forEach(segment => {
        blocks[`${segment.row},${segment.col}`].classList.add("fill")
    })
}

// intervalId = setInterval(() =>{

//     drawSnake()
// }, 400)

startButton.addEventListener('click', () =>{
    modal.style.display = 'none';
    intervalId = setInterval(() =>{
        drawSnake()
    }, 400)

    timeIntervalId = setInterval(() =>{
        let [mins, secs] = time.split(':').map(Number);
        if (secs === 59){
            mins += 1;
            secs = 0;
        } else {
            secs +=1;
        }
        time = `${mins}:${secs}`
        timeElement.innerText = time;
    }, 1000)
    
})


restartButton.addEventListener('click', restartGame)


function restartGame(){

    blocks[`${food.row},${food.col}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.row},${segment.col}`].classList.remove("fill")
    })

    score = 0;
    time = `00:00`

    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;

    direction = 'down';
    modal.style.display = 'none';
    snake = [
        {row: 2, col: 2}
    ];
    food = {row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * cols)};
    intervalId = setInterval(() =>{
        drawSnake()
    }, 400)
}


addEventListener('keydown', (event) =>{
    if (event.key === 'ArrowLeft'){
        direction = 'left'
    } else if (event.key === 'ArrowRight'){
        direction = 'right'
    } else if (event.key === 'ArrowUp'){
        direction = 'up'
    } else if (event.key === 'ArrowDown'){
        direction = 'down'
    }
})