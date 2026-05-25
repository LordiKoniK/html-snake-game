// defining global variables/properties

let board;
let context;

let foodX;      // food coordinates (only need 1 set since there is only 1 food at a time)
let foodY;

let speedX = 0;     // directional speed variables to handle movement implementation
let speedY = 0;     

// GEOMETRY BASE

let blockSize = 25;     // 1 block = 25px

let total_row = 17;     // height of board  (odd numbers so we can have a center)
let total_col = 17;     // width 

let snakeX = blockSize * 8;     // snakeX and snakeY are the coordinates of the snake head itself, stored separately from body coords
let snakeY = blockSize * 8;     // initial spawn location in the middle of the board (8 cols across, 8 rows down)

let snakeBody = [];     // will store the expanding body of the snake 

let gameOver = false;   // game state variable
let score = 0;          // scoring


window.onload = function () {       // INITIALIZATION/SETUP
    board = document.getElementById("board");
    board.height = total_row * blockSize;       // GEOMETRY
    board.width = total_col * blockSize;
    context = board.getContext("2d");

    placeFood();    // put food on the board at the start of the game

    document.addEventListener("keydown", changeDirection);  // event listener for movement inputs
    setInterval(update, 1000 / 10);     // logic update frequency is every 100ms (try changing this value yourself things get quite silly)

    updateScore(); 
    hideGameOver();   // hide game over message at the start
}

// APPLICATION STAGE (i.e. actual game logic)

function update() {
    if (gameOver) {
        return;     // first check if dead, if so stop updating
    }

    // RASTERIZATION BEGINS (fillRect usage)

    // On every update:

    // 1. set game background colour (do this first so we can draw the others on top of it)
    context.fillStyle = "green";
    context.fillRect(0, 0, board.width, board.height);     // select entire board to fill

    // 2. draw food on the board in its current location
    context.fillStyle = "yellow";
    context.fillRect(foodX, foodY, blockSize, blockSize);   // select food block to fill (coordinate * 1 block)

    // 3. check for food consumption
    if (snakeX == foodX && snakeY == foodY) {       // if snake head is on a food
        snakeBody.push([foodX, foodY]);             // eat it (add to our body array)
        placeFood();                                // place new food on the board
        score++;
        updateScore();                              // update score
    }

    // 4. draw the snake itself

    // snake movement logic (move each body piece to the position of the preceeding one)

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // store previous part of snake as the current part
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {                 // if there are are body segments 
        snakeBody[0] = [snakeX, snakeY];    // put first body segment where the head used to be
    }

    // actual snake rasterization

    context.fillStyle = "blue";

    snakeX += speedX * blockSize;   // update snake head coordinates (next location = current location + speed[+/-] * block size)
    snakeY += speedY * blockSize;   // i.e. if at (x,y) and our speedX = 1, then we go to (x+1, y) and just do same thing in negative to go left
    
    context.fillRect(snakeX, snakeY, blockSize, blockSize);     // draw snake head at new coordinates

    for (let i = 0; i < snakeBody.length; i++) {                // draw additional body segments
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);   // each array value is a combination of x and y coords
    }

    // 5. check for death conditions (will be instantly triggered at start of next update)

    // check if out of bounds in all 4 directions

    if (snakeX < 0 
        || snakeX > total_col * blockSize 
        || snakeY < 0 
        || snakeY > total_row * blockSize) {    
        gameOver = true;
        showGameOver();
    }

    // check if snake head collides with any body segment
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {  // if head coords = coords of any body segment, gg
            gameOver = true;
            showGameOver();
        }
    }
}

// score updating function
function updateScore() {
    const scorediv = document.getElementById("score");
    if (scorediv) {
        scorediv.textContent = "Score: " + score;
    }
}

// game over ui toggle
function showGameOver() {
    const gameOverdiv = document.getElementById("gameOver");
    if (gameOverdiv) {
        gameOverdiv.style.display = "block";
    }
}

function hideGameOver() {
    const gameOverdiv = document.getElementById("gameOver");
    if (gameOverdiv) {
        gameOverdiv.style.display = "none";
    }
}

// reset all game variables to their initial state to start a new game
function restartGame() {
    snakeX = blockSize * 8;
    snakeY = blockSize * 8;
    snakeBody = [];
    speedX = 0;
    speedY = 0;
    score = 0;
    gameOver = false;
    placeFood();
    updateScore();
    hideGameOver();
}


// user controls
function changeDirection(e) {

    // i prefer WASD controls instead of arrow keys cause i game a lot

    if (e.code == "KeyW" && speedY != 1) { // && argument to prevent movements in the exact opposite direction which would kill you instantly
        speedX = 0;                        
        speedY = -1;    // canvas counts coordinates starting from the top left, so to go up you actually need to REDUCE the y value
    }
    else if (e.code == "KeyS" && speedY != -1) {
        speedX = 0;
        speedY = 1;     // increase Y to go down
    }
    else if (e.code == "KeyA" && speedX != 1) {
        speedX = -1;    // thankfully at least left and right are normal 
        speedY = 0;
    }
    else if (e.code == "KeyD" && speedX != -1) { 
        speedX = 1;
        speedY = 0;
    }
}

// randomly place food on the board
function placeFood() {

    // select random row/column combo to put food at
    foodX = Math.floor(Math.random() * total_col) * blockSize; 
    foodY = Math.floor(Math.random() * total_row) * blockSize; 
}
