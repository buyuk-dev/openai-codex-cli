// --- JavaScript ---
window.onload = function() {

// Create a canvas covering the full size of the page.
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

// Setup double buffering buffer.
var buffer = document.createElement('canvas');
buffer.width = canvas.width;
buffer.height = canvas.height;

// Create a Sprite class with 2d position, radial direction and velocity.
function Sprite(x, y, radius, dir, speed) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.dir = dir;
  this.speed = speed;
}


// Add rotate(x,y) method to the Sprite class which will change the sprite's direction to face towards the given coordinates.
Sprite.prototype.rotate = function(x, y) {
  var dx = x - this.x;
  var dy = y - this.y;
  var angle = Math.atan2(dy, dx);
  this.dir = angle;
};


// Add move(distance) method to the Sprite class which will move the Sprite in its direction by a specified distance times its velocity.
Sprite.prototype.move = function(distance) {
  this.x += Math.cos(this.dir) * this.speed * distance;
  this.y += Math.sin(this.dir) * this.speed * distance;
};


// Create a ColorSprite class which extends the Sprite class adding color property that defaults to black.
function ColorSprite(x, y, radius, dir, speed, color) {
  Sprite.call(this, x, y, radius, dir, speed);
  this.color = color || 'black';
}
ColorSprite.prototype = Object.create(Sprite.prototype);


// Create Player class extending ColorSprite, which sets the color property to red.
function Player(x, y, radius, dir, speed) {
  ColorSprite.call(this, x, y, radius, dir, speed, 'red');
  this.score = 0;
}
Player.prototype = Object.create(ColorSprite.prototype);

// Create Enemy class extending ColorSprite which sets the color property to blue.
function Enemy(x, y, radius, dir, speed) {
  ColorSprite.call(this, x, y, radius, dir, speed, 'blue');
}
Enemy.prototype = Object.create(ColorSprite.prototype);


// Create Bullet class extending ColorSprite which sets the color property to black.
function Bullet(x, y, radius, dir, speed) {
  ColorSprite.call(this, x, y, radius, dir, speed, 'black');
}
Bullet.prototype = Object.create(ColorSprite.prototype);



// Create empty lists of bullets and enemies, and a player instance in the center of the board.
var bullets = [];
var enemies = [];
var player = new Player(canvas.width / 2, canvas.height / 2, 25, Math.PI, 15);


// Add draw method to the ColorSprite class, which draws a circle centered around the sprite's position with the 25px radius using the sprite's color.
ColorSprite.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
};


// Add draw() method to the Bullet class which draws an arrow from the bullet's position facing its direction with length of 5px.
Bullet.prototype.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.x + Math.cos(this.dir) * 5, this.y + Math.sin(this.dir) * 5);
  ctx.strokeStyle = this.color;
  ctx.stroke();
};

Bullet.prototype.update = function() {
    this.move(1);
}

// Add update() method to the Enemy class, which rotates it toward the player's position and moves it by one unit.
Enemy.prototype.update = function() {
  this.rotate(player.x, player.y);
  this.move(1);
};

// Add move and rotate methods to the player class that call parent class methods of the same name.
Player.prototype.move = function(distance) {
  ColorSprite.prototype.move.call(this, distance);
};

Player.prototype.rotate = function(x, y) {
  ColorSprite.prototype.rotate.call(this, x, y);
};

// Add rotate and move methods to the ColorSprite class which delegate their function to the parent class.
ColorSprite.prototype.rotate = function(x, y) {
  Sprite.prototype.rotate.call(this, x, y);
};

ColorSprite.prototype.move = function(distance) {
  Sprite.prototype.move.call(this, distance);
};

// Add draw method to a Player class that calls its parent draw method, than adds a short line from the player's position that indicates a direction.
Player.prototype.draw = function() {
  ColorSprite.prototype.draw.call(this);
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.x + Math.cos(this.dir) * 25, this.y + Math.sin(this.dir) * 25);
  ctx.strokeStyle = 'white';
  ctx.stroke();
};



// Add draw method to a Player class that calls its parent draw method.
//Player.prototype.draw = function() {
//  ColorSprite.prototype.draw.call(this);
//};


// Add function to check for bullet vs enemy collisions and increment player's score count for every killed enemy.
function checkCollisions() {
  for (var i = 0; i < bullets.length; i++) {
    for (var j = 0; j < enemies.length; j++) {
      if (bullets[i].x < enemies[j].x + enemies[j].radius &&
        bullets[i].x > enemies[j].x - enemies[j].radius &&
        bullets[i].y < enemies[j].y + enemies[j].radius &&
        bullets[i].y > enemies[j].y - enemies[j].radius) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        player.score++;
      }
    }
  }
}


// When mouse is moving over the canvas, rotate player in the direction of the cursor.
canvas.addEventListener('mousemove', function(e) {
  player.rotate(e.offsetX, e.offsetY);
});


// When space bar is pressed, create a new bullet in the player's location and direction with the speed of 10.
document.addEventListener('keydown', function(e) {
  if (e.keyCode === 32) {
    var bullet = new Bullet(player.x, player.y, 25, player.dir, 10);
    bullets.push(bullet);
  }
});

// Create a function to spawn a new enemy in random position at the edge of the canvas.
function spawnEnemy() {
  var x = Math.random() * (canvas.width - 50) + 25;
  var y = Math.random() * (canvas.height - 50) + 25;
  var dir = Math.random() * Math.PI * 2;
  var speed = Math.random() * 5 + 5;
  var enemy = new Enemy(x, y, 25, dir, speed);
  enemies.push(enemy);
}


// Create a function to compute the number of enemies to spawn, that increases the count every 10 points earned by the player.
function spawnEnemyCounter() {
  var count = Math.floor(player.score / 10) + 1;
  for (var i = 0; i < count; i++) {
    spawnEnemy();
  }
}

// Every 10 seconds spawn new enemies based on player's score.
setInterval(spawnEnemyCounter, 10000);


// Create a function to draw player score in the top left corner of the canvas.
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + player.score, 20, 20);
}


// Every 50 milliseconds update all bullets and enemies, than redraw everything.
setInterval(function() {
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].update();
  }
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].update();
  }

  checkCollisions();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].draw();
  }
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();
  }
  player.draw();
  drawScore();
}, 50);



// Add move(x, y) method to the Player class, which moves the player in the specified direction by its velocity.
Player.prototype.move = function(x, y) {
  this.x += x * this.speed;
  this.y += y * this.speed;
};


// If arrow key was pressed, move the player towards its direction.
document.addEventListener('keydown', function(e) {
  if (e.keyCode === 37) {
    player.move(-1, 0);
  } else if (e.keyCode === 38) {
    player.move(0, -1);
  } else if (e.keyCode === 39) {
    player.move(1, 0);
  } else if (e.keyCode === 40) {
    player.move(0, 1);
  }
});


// Disable scrollbars for canvas.
document.body.style.overflow = 'hidden';

};