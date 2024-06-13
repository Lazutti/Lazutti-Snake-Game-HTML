// Coded by Lazutti

// Game constants
const GRID_SIZE = 30;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const FPS = 10;

// Game variables
let snake = [{ x: 10, y: 7 }];
let apple = { x: 5, y: 5 };
let direction = 'right';
let score = 0;

// Game board element - Oyun tahtası
const gameBoard = document.getElementById('gameBoard');

// Sound effects - Ses efektleri
const moveSound = new Audio('Sounds/move_sound.mp3');
const eatSound = new Audio('Sounds/eat_sound.mp3');
const gameOverSound = new Audio('Sounds/game_over_sound.mp3');


// Update game state - Oyunun durumunu güncelle
function update() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    if (checkAppleCollision()) {
        eatApple();
    }
    draw();
}

// Draw game board and elements
function draw() {
    // Clear previous board
    gameBoard.innerHTML = '';

    // Draw snake
    snake.forEach((segment, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snake');
        snakeElement.textContent = 'L A Z U T T I'.charAt(index % 9); // Wrap around L A Z U T T I
        gameBoard.appendChild(snakeElement);
    });

    // Draw apple
    const appleElement = document.createElement('div');
    appleElement.style.gridRowStart = apple.y;
    appleElement.style.gridColumnStart = apple.x;
    appleElement.classList.add('apple');
    gameBoard.appendChild(appleElement);

    // Update score
    document.getElementById('score').textContent = score;
}

// Move snake based on direction
function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    // Update direction
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // Play move sound
    moveSound.play();

    // Add new head
    snake.unshift(head);

    // Remove tail if not eating apple
    if (!checkAppleCollision()) {
        snake.pop();
    }
}

// Check for collisions with walls or self
function checkCollision() {
    const head = snake[0];
    if (head.x < 1 || head.x > GRID_WIDTH || head.y < 1 || head.y > GRID_HEIGHT) {
        return true; // Out of bounds
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Snake collided with itself
        }
    }
    return false;
}

// Check if snake eats apple
function checkAppleCollision() {
    const head = snake[0];
    return head.x === apple.x && head.y === apple.y;
}

// Handle eating apple
function eatApple() {
    score++;
    eatSound.play();
    spawnApple();
    snake.push(snake[snake.length - 1]); // Grow snake
}

// Spawn a new apple in a random location
function spawnApple() {
    apple.x = Math.floor(Math.random() * GRID_WIDTH) + 1;
    apple.y = Math.floor(Math.random() * GRID_HEIGHT) + 1;
    // Ensure apple does not spawn on snake
    for (let i = 0; i < snake.length; i++) {
        if (apple.x === snake[i].x && apple.y === snake[i].y) {
            spawnApple();
            break;
        }
    }
}

// Game over
function gameOver() {
    gameOverSound.play();
    alert(`Game Over! Your score: ${score}`);
    snake = [{ x: 10, y: 7 }];
    apple = { x: 5, y: 5 };
    direction = 'right';
    score = 0;
}

// Event listeners for arrow key controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Game loop
setInterval(update, 1000 / FPS);
