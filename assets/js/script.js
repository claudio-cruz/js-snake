const canvas = document.getElementById('game-field');
const ctx = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Defoult snake speed.
let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

// Snake starting position.
let headX = 10;
let headY = 10;

const snakeParts = [];
let tailLength = 2;

// Apple's initial position.
let appleX = 17;
let appleY = 4;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

// Game sound effects.
const appleSound = new Audio('assets/sound/apple-sound.mp3')
const gameOverSound = new Audio('assets/sound/game-over-sound.wav')

/** 
 * Game loop.
 */
function drawGame() {

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

    // Speed difficulty increase.
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

    // Set the snake speed:
    setTimeout(drawGame, 1000 / speed);
}

/**
*The game stops if the snake touches the walls or its own body.
*/
function isGameOver() {
    let gameOver = false;

    // Stop the game to return game over condition in the biginning of the game, since the head of the snake starts the game touching its body.
    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // Returns game over if the head of the snake touches the walls.
    if (headX < 0) {
        gameOver = true;
    } else if (headX === tileCount) {
        gameOver = true;
    } else if (headY < 0) {
        gameOver = true;
    } else if (headY === tileCount) {
        gameOver = true;
    }

    // Returns game over if the head of the snake touches its body.
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    // If game over, show the modal window with the message "Game Over!", the score and a restart the game option.
    if (gameOver) {

        var modal = document.getElementById("gameOverModal");
        
        document.getElementById('modal-txt').innerHTML = 'Your score is  ' + score;
        modal.style.display = "block";
        
        gameOverSound.play();
    }

    return gameOver;
}

/** Draw the score counter under the game field. */
function drawScore() {
    
    document.getElementById('score-counter').innerHTML = 'Score:  ' + score;
}

/** Draw the game field and update it every time the snake moves. */
function clearScreen() {
    
    ctx.fillStyle = "#c4c3d0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/** Draw the snake head and snake parts. */
function drawSnake() {

    // Draw the snake parts and add color to it.
    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    // Push a new snake part to where the snake head was and remove the snake's furthest part.
    snakeParts.push(new SnakePart(headX, headY));
    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    // Draw the head of the snake and add color to it.
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

/** Change snake directions. */
function changeSnakePosition() {

    headX += xVelocity;
    headY += yVelocity;
}

/** Draw a apple on the canvas. */
function drawApple() {

    let appleImage = document.getElementById('apple-img');
    ctx.drawImage(appleImage, appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

/** Check if the head of the snake collides with the apple,
 *  if it does, add snake tailLenght by one and draw a new apple randomly on the canvas.
 */
function checkAppleCollision() {

    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        appleSound.play();
    }
}

document.body.addEventListener('keydown', keyDown);

/** Key controles. */
function keyDown(event) {

    // Up
    if(event.keyCode == 38){
        if (yVelocity  == 1) return;
        yVelocity  = -1;
        xVelocity  = 0;
    }

    // Down
    if(event.keyCode == 40){
        if (yVelocity  == -1) return;
        yVelocity  = 1;
        xVelocity  = 0;
    }

    // Left
    if(event.keyCode == 37){
        if (xVelocity == 1) return;
        yVelocity = 0;
        xVelocity = -1;
    }

    // Right
    if(event.keyCode == 39){
        if (xVelocity == -1) return;
        yVelocity = 0;
        xVelocity = 1;
    }
}

/** Touch screen move up */
function moveUp() {
    if (yVelocity  == 1) return;
    yVelocity  = -1;
    xVelocity  = 0; 
}

/** Touch screen move down */
function moveDown() {
    if (yVelocity  == -1) return;
    yVelocity  = 1;
    xVelocity  = 0; 
}

/** Touch screen move left */
function moveLeft() {
    if (xVelocity == 1) return;
    yVelocity = 0;
    xVelocity = -1;
}

/** Touch screen move right */
function moveRight() {
    if (xVelocity == -1) return;
    yVelocity = 0;
    xVelocity = 1; 
}

drawGame();