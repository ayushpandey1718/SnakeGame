const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Constants
const box = 20; // Size of each cell
const rows = canvas.height / box;
const cols = canvas.width / box;

// Game Variables
let snake = [{ x: 5 * box, y: 5 * box }];
let food = getRandomPosition();
let powerUp = null;
let direction = "RIGHT";
let score = 0;
let highScore = 0;
let speed = 150;
let themeIndex = 0;
let invincible = false; // Invincibility state

// Themes with gradient backgrounds
const themes = [
  { 
    gradient: ["#1a1a1d", "#4CAF50"], 
    snake: "#4CAF50", 
    food: "#FF5722", 
    powerUp: "#FFC107" 
  },
  { 
    gradient: ["#2c3e50", "#8e44ad"], 
    snake: "#8e44ad", 
    food: "#e74c3c", 
    powerUp: "#f39c12" 
  },
  { 
    gradient: ["#34495e", "#16a085"], 
    snake: "#16a085", 
    food: "#c0392b", 
    powerUp: "#d35400" 
  },
];

// Event Listeners
document.addEventListener("keydown", changeDirection);
document.getElementById("themeBtn").addEventListener("click", changeTheme);

function changeTheme() {
  themeIndex = (themeIndex + 1) % themes.length;
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
  };
}

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== "RIGHT") direction = "LEFT";
  if (key === 38 && direction !== "DOWN") direction = "UP";
  if (key === 39 && direction !== "LEFT") direction = "RIGHT";
  if (key === 40 && direction !== "UP") direction = "DOWN";
}

function activatePowerUp() {
  const powerType = Math.random();
  if (powerType < 0.4) {
    speed = Math.max(30, speed - 30); // Speed boost
    setTimeout(() => (speed += 30), 5000);
  } else if (powerType < 0.8) {
    score += 5; // Bonus score
  } else {
    invincible = true; // Invincibility
    setTimeout(() => (invincible = false), 5000);
  }
}

function update() {
  const head = { ...snake[0] };

  // Move snake
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Check collisions
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    (!invincible && snake.some((segment) => segment.x === head.x && segment.y === head.y))
  ) {
    resetGame();
    return;
  }

  snake.unshift(head);

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = getRandomPosition();
    if (Math.random() < 0.3) powerUp = getRandomPosition(); // 30% chance for power-up
  } else {
    snake.pop();
  }

  // Check if snake eats power-up
  if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
    activatePowerUp();
    powerUp = null;
  }

  // Update high score
  if (score > highScore) highScore = score;
  document.getElementById("highScore").innerText = highScore;
}

function resetGame() {
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = "RIGHT";
  score = 0;
  speed = 150;
  powerUp = null;
}

function drawGame() {
  // Draw gradient background
  const theme = themes[themeIndex];
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, theme.gradient[0]);
  gradient.addColorStop(1, theme.gradient[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    const segmentGradient = ctx.createLinearGradient(segment.x, segment.y, segment.x + box, segment.y + box);
    segmentGradient.addColorStop(0, index === 0 ? "#ffffff" : theme.snake); // Head has a reflection
    segmentGradient.addColorStop(1, "#555");
    ctx.fillStyle = segmentGradient;
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  // Draw food
  const foodGradient = ctx.createRadialGradient(food.x + box / 2, food.y + box / 2, 5, food.x + box / 2, food.y + box / 2, box / 2);
  foodGradient.addColorStop(0, theme.food);
  foodGradient.addColorStop(1, "#000");
  ctx.fillStyle = foodGradient;
  ctx.fillRect(food.x, food.y, box, box);

  // Draw power-up
  if (powerUp) {
    const powerUpGradient = ctx.createRadialGradient(powerUp.x + box / 2, powerUp.y + box / 2, 5, powerUp.x + box / 2, powerUp.y + box / 2, box / 2);
    powerUpGradient.addColorStop(0, theme.powerUp);
    powerUpGradient.addColorStop(1, "#444");
    ctx.fillStyle = powerUpGradient;
    ctx.fillRect(powerUp.x, powerUp.y, box, box);
  }

  document.getElementById("score").innerText = score;
}

function gameLoop() {
  setTimeout(() => {
    update();
    drawGame();
    requestAnimationFrame(gameLoop);
  }, speed);
}

// Start the game
gameLoop();
