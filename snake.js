var canvas = document.querySelector(".canvas");
var ctx = canvas.getContext("2d");
var currentScoreDisplay = document.querySelector("#currentScore");
var highScoreDisplay = document.querySelector("#highScore");
var restartButton = document.querySelector("#restartButton");
var checkbox = document.querySelector("#wallsbutton");
var scale = 10;
var columns = canvas.width / scale;
var rows = canvas.height / scale;
var snake = new Snake();
var food = new Food();
var speed = 150;
var currentScore = 1;
var highScore = 0;
var walls = false;

(function setup() {
  snake.draw();
  food.pickLocation();
  IsChecked();

  window.setInterval(() => {
    update();
  }, speed);
}());

function update() {
  if (walls == false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.foodEat(food.x, food.y);
    food.draw();
    snake.update();
    snake.turn = false;
    snakeMovementAdded();
    snake.draw();
    snake.deathChetch();
    snake.wallWithout();
    scoreCount();
    displayUpdate();
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.foodEat(food.x, food.y);
    food.draw();
    snake.update();
    snake.turn = false;
    snakeMovementAdded();
    snake.draw();
    snake.deathChetch();
    snake.wallWith();
    scoreCount();
    displayUpdate();
  }
}

function IsChecked() {
  var checked = checkbox.checked;
  if (checked == true) {
    walls = true;
  } else {
    walls = false;
  }
}


function Snake() {
  this.x = 50;
  this.y = 50;
  this.xdir = 1;
  this.ydir = 0;
  this.tail = [];
  this.total = 0;
  this.turn = false;
  this.postpone = "";

  this.draw = function () {
    ctx.fillStyle = "#00b37d";
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
    ctx.fillRect(this.x, this.y, scale, scale);
  }

  this.update = function () {
    for (var i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    this.tail[this.total - 1] = {
      x: this.x,
      y: this.y
    };
    this.x += this.xdir * scale;
    this.y += this.ydir * scale;
  }

  this.changeDir = function (x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  this.foodEat = function (foodX, foodY) {
    if (this.x === foodX && this.y === foodY) {
      food.pickLocation();
      this.total++;
      speed *= 0.95;
      currentScore++;
    }
  }

  this.deathChetch = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      if (this.x == this.tail[i].x && this.y == this.tail[i].y) {
        reset();
      }
    }
  }

  function reset() {
    redScreen();
    snake.tail = [];
    snake.total = 0;
    snake.xdir = 0;
    snake.ydir = 0;
    snake.x = 50;
    snake.y = 50;
    speed = 150;
    scoreCount();
    currentScore = 1;
    IsChecked();
  }

  this.wallWith = function () {
    if (this.x >= canvas.width || this.x < 0 || this.y < 0 || this.y >= canvas.height) {
      reset();
    }
  }
  this.wallWithout = function () {
    if (this.x >= canvas.width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = canvas.width;
    } else if (this.y >= canvas.height) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = canvas.height;
    }
  }
}

restartButton.addEventListener("click", function (event) {
  redScreen();
  snake.tail = [];
  snake.total = 0;
  snake.xdir = 0;
  snake.ydir = 0;
  snake.x = 50;
  snake.y = 50;
  speed = 150;
  scoreCount();
  currentScore = 1;
  IsChecked();
});

document.addEventListener("keydown", function (event) {
  if ((event.key === "a" || event.key === "ArrowLeft") && snake.xdir !== 1) {
    postponeMove(-1, 0, "left");
  } else if ((event.key === "s" || event.key === "ArrowDown") && snake.ydir !== -1) {
    postponeMove(0, 1, "down");
  } else if ((event.key === "d" || event.key === "ArrowRight") && snake.xdir !== -1) {
    postponeMove(1, 0, "right");
  } else if ((event.key === "w" || event.key === "ArrowUp") && snake.ydir !== 1) {
    postponeMove(0, -1, "up");
  }
});

function snakeMovementAdded() {
  if (snake.postpone == "left" && snake.turn == false) {
    snake.changeDir(-1, 0);
    snake.postpone = "";
  } else if (snake.postpone == "right" && snake.turn == false) {
    snake.changeDir(1, 0);
    snake.postpone = "";
  } else if (snake.postpone == "down" && snake.turn == false) {
    snake.changeDir(0, 1);
    snake.postpone = "";
  } else if (snake.postpone == "up" && snake.turn == false) {
    snake.changeDir(0, -1);
    snake.postpone = "";
  }
}

function postponeMove(x, y, dir) {
  if (snake.turn == false) {
    snake.changeDir(x, y);
    snake.turn = true;
  } else {
    if (dir == "left") {
      snake.postpone = "left";
    } else if (dir == "right") {
      snake.postpone = "right";
    } else if (dir == "up") {
      snake.postpone = "up";
    } else if (dir == "down") {
      snake.postpone = "down";
    }
  }

}

function Food() {
  this.x;
  this.y;

  this.draw = function () {
    ctx.fillStyle = "#ff5757";
    ctx.fillRect(this.x, this.y, scale, scale);
  }

  this.pickLocation = function () {
    this.x = Math.floor(Math.random() * columns) * scale;
    this.y = Math.floor(Math.random() * rows) * scale;
    for (let i = 0; i < snake.tail.length; i++) {
      if (snake.tail[i].x == this.x && snake.tail[i].y == this.y)
        this.pickLocation();
    }
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key == "L") {
    snake.total++;
  }
});

function redScreen() {
  canvas.style.backgroundColor = "red";
  window.setTimeout(() => {
    canvas.style.backgroundColor = "#3e3e3e";
  }, 50);
}

function scoreCount() {
  if (currentScore > highScore) {
    highScore = currentScore;
  }
}

function displayUpdate() {
  currentScoreDisplay.innerHTML = currentScore;
  highScoreDisplay.innerHTML = highScore;
}