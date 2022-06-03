const canvas = document.getElementById('game-field');
const ctx = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 17;
let appleY = 4;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

//game loop
function drawGame() {
    xVelocity = inputsXVelocity;
    yVelocity = inputsYVelocity;

    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        return;
    }

    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();

    // Speed difficulty increase
    if (score > 6) {
        speed = 10;
    }

    if (score > 12) {
        speed = 13;
    }

    if (score > 16) {
        speed = 16;
    }

    if (score > 26) {
        speed = 18;
    }

    setTimeout(drawGame, 1000 / speed);
}

/*
 Game stops if the snake hits the walls
 or it's own body.
*/
function isGameOver() {
    let gameOver = false;

    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // Walls game over condition
    if (headX < 0) {
        gameOver = true;
    } else if (headX === tileCount) {
        gameOver = true;
    } else if (headY < 0) {
        gameOver = true;
    } else if (headY === tileCount) {
        gameOver = true;
    }

    // Snake body game over condition
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }
    // Game over alert and restart the game
    if (gameOver) {
        alert(`Game Over! \nYour score is ${score}`)
        window.location.reload();
    }

    return gameOver;
}

// Score counter
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "10px Verdana";
    document.getElementById('score-counter').innerHTML = 'Score:  ' + score;
}

function clearScreen() {
    ctx.fillStyle = "#f0ead6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    
    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new SnakePart(headX, headY));
    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
    }
}

document.body.addEventListener('keydown', keyDown);

// key controlers
function keyDown(event) {
    //up
    if(event.keyCode == 38){
        if (inputsYVelocity  == 1) return;
        inputsYVelocity  = -1;
        inputsXVelocity  = 0;
    }

    //down
    if(event.keyCode == 40){
        if (inputsYVelocity  == -1) return;
        inputsYVelocity  = 1;
        inputsXVelocity  = 0;
    }

    //left
    if(event.keyCode == 37){
        if (inputsXVelocity == 1) return;
        inputsYVelocity = 0;
        inputsXVelocity = -1;
    }

    //right
    if(event.keyCode == 39){
        if (inputsXVelocity == -1) return;
        inputsYVelocity = 0;
        inputsXVelocity = 1;
    }
}

drawGame();