window.onload = function () {

// --- JavaScript ---

// Create a canvas covering the full size of the page.
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

// Create a function to draw a line with given length, origin, and angle in radians.
function drawLine(length, origin, angle) {
    var x = origin.x;
    var y = origin.y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length * Math.cos(angle), y + length * Math.sin(angle));
    ctx.stroke();
}

// A cross is made of four lines with the same origin, each one rotated 90 degrees from the next one. Create a function that draws a cross.
function drawCross(origin) {
    drawLine(100, origin, 0);
    drawLine(100, origin, Math.PI / 2);
    drawLine(100, origin, Math.PI);
    drawLine(100, origin, 3 * Math.PI / 2);
}


// A star is made of 8 lines with the same origin, each one rotated 45 degrees from the next one. Create a function that draws a star.
function drawStar(origin) {
    drawLine(100, origin, 0);
    drawLine(100, origin, Math.PI / 4);
    drawLine(100, origin, Math.PI / 2);
    drawLine(100, origin, 3 * Math.PI / 4);
    drawLine(100, origin, Math.PI);
    drawLine(100, origin, 5 * Math.PI / 4);
    drawLine(100, origin, 3 * Math.PI / 2);
    drawLine(100, origin, 7 * Math.PI / 4);
}



// Create a second version of the drawStar function that draws a star with the specific radius.
function drawStar2(origin, radius) {
    drawLine(radius, origin, 0);
    drawLine(radius, origin, Math.PI / 4);
    drawLine(radius, origin, Math.PI / 2);
    drawLine(radius, origin, 3 * Math.PI / 4);
    drawLine(radius, origin, Math.PI);
    drawLine(radius, origin, 5 * Math.PI / 4);
    drawLine(radius, origin, 3 * Math.PI / 2);
    drawLine(radius, origin, 7 * Math.PI / 4);
}


// Create a version of drawLine function that can customize the color of the line.
function drawLine3(length, origin, angle, color) {
    var x = origin.x;
    var y = origin.y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length * Math.cos(angle), y + length * Math.sin(angle));
    ctx.strokeStyle = color;
    ctx.stroke();
}


// Create a version of drawStar2 that also accepts color argument.
function drawStar3(origin, radius, color) {
    drawLine3(radius, origin, 0, color);
    drawLine3(radius, origin, Math.PI / 4, color);
    drawLine3(radius, origin, Math.PI / 2, color);
    drawLine3(radius, origin, 3 * Math.PI / 4, color);
    drawLine3(radius, origin, Math.PI, color);
    drawLine3(radius, origin, 5 * Math.PI / 4, color);
    drawLine3(radius, origin, 3 * Math.PI / 2, color);
    drawLine3(radius, origin, 7 * Math.PI / 4, color);
}



// Draw a star with random color.
var randomColor = function () {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
}


// Create a function that draws N stars of a specified radius in random places on the canvas with random colors.
function drawRandomStars(n, radius) {
    for (var i = 0; i < n; i++) {
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        var color = randomColor();
        drawStar3({ x: x, y: y }, radius, color);
    }
}


// Create a class representing a star, with a position, radius, color, velocity and direction.
var Star = function (x, y, radius, color, velocity, direction) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.direction = direction;
}


// Add an update method to a Star class which moves a star in its direction by its velocity.
Star.prototype.update = function () {
    this.x += this.velocity * Math.cos(this.direction);
    this.y += this.velocity * Math.sin(this.direction);
}



// Add a draw method to the star class which draws a star.
Star.prototype.draw = function () {
    drawStar3(this, this.radius, this.color);
}



// Create an empty array of stars.
var stars = [];



// Add check method to the star class which checks if the star is out of canvas bounds.
Star.prototype.check = function () {
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        return true;
    }
    return false;
}




// Every second spawn 10 new random stars at the edge of the canvas with random parameters.
var spawnStars = function () {
    for (var i = 0; i < 10; i++) {
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        var radius = Math.floor(Math.random() * 100) + 1;
        var color = randomColor();
        var velocity = Math.floor(Math.random() * 10) + 1;
        var direction = Math.random() * Math.PI * 2;
        var star = new Star(x, y, radius, color, velocity, direction);
        stars.push(star);
    }
}


// create a function to clear the canvas.
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// every 50 milliseconds update all stars, and remove those that are out of bounds.
var updateStars = function () {
    clearCanvas();
    for (var i = 0; i < stars.length; i++) {
        stars[i].update2();
        stars[i].update();
        stars[i].draw();
        if (false && stars[i].check()) {
            stars.splice(i, 1);
        }
        
    }
}


// call spawnStars every second.
setInterval(spawnStars, 1000);


// call updateStars every 50 milliseconds.
setInterval(updateStars, 50);



// Add method to update star direction upon hitting the canvas border.
Star.prototype.update2 = function () {
    if (this.x < 0) {
        this.direction = Math.PI - this.direction;
    }
    if (this.x > canvas.width) {
        this.direction = Math.PI - this.direction;
    }
    if (this.y < 0) {
        this.direction = 2 * Math.PI - this.direction;
    }
    if (this.y > canvas.height) {
        this.direction = 2 * Math.PI - this.direction;
    }
}


};
