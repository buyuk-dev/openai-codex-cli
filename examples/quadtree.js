// Simple QuadTree implementation using javascript.


// Define a class for representing the 2D point.
function Point(x, y) {
    this.x = x;
    this.y = y;
}


// Create two points that define correspondignly top left and bottom right corners of the 2D space we will be working with. The space should be square the size of a 1000.0 units.
var topLeft = new Point(0, 0);
var bottomRight = new Point(1000.0, 1000.0);


// Create a TreeNode class which stores the lists of its children nodes.
function TreeNode(topLeft, bottomRight) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
    this.children = [];
    this.isLeaf = true;
}


// Create a function to check if the node is a leaf.
TreeNode.prototype.isLeaf = function() {
    return this.children.length == 0;
}


// Create a function that divides a node into quarters with shared vertex in the center of the parent node.
function divide(node) {
    var x = node.topLeft.x + (node.bottomRight.x - node.topLeft.x) / 2.0;
    var y = node.topLeft.y + (node.bottomRight.y - node.topLeft.y) / 2.0;

    var topLeft = new TreeNode(node.topLeft, new Point(x, y));
    var bottomLeft = new TreeNode(new Point(node.topLeft.x, y), new Point(x, node.bottomRight.y));

    var topRight = new TreeNode(new Point(x, node.topLeft.y), new Point(node.bottomRight.x, y));
    var bottomRight = new TreeNode(new Point(x, y), node.bottomRight);
    node.children = [topLeft, bottomLeft, topRight, bottomRight];

    // Leafs store points as children.
    node.isLeaf = false;
}


// Create a function which checks if the point is located inside of the area represented by a TreeNode.
function isInside(point, node) {
    return point.x >= node.topLeft.x &&
           point.x <= node.bottomRight.x &&
           point.y >= node.topLeft.y &&
           point.y <= node.bottomRight.y;
}


// Create a function that traverses the tree from a specified start node, and calls callback for each non-leaf node visited.
function traverse(node, callback) {
    callback(node);

    if (node.isLeaf) {
        return;
    }

    for (var i = 0; i < node.children.length; i++) {
        traverse(node.children[i], callback);
    }
}


// Create the root of our QuadTree representing the entire working space.
var root = new TreeNode(topLeft, bottomRight);

// Create an empty set of points.
var points = [];


// Create a function that finds a leaf node in the tree where the given point belongs.
function findLeaf(point, node) {
    console.log("find leaf");
    if (node.isLeaf) {
        return node;
    }

    for (var i = 0; i < node.children.length; i++) {
        if (isInside(point, node.children[i])) {
            return findLeaf(point, node.children[i]);
        }
    }
}


// Create a buildTree function that for each point, find its leaf node and insert point in its children's list.
function buildTree(root, points) {
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var leaf = findLeaf(point, root);
        leaf.children.push(point);

        if (leaf.children.length > 1) {
            var temp = leaf.children;
            leaf.children = [];
            divide(leaf);
            buildTree(leaf, temp);
        }
    }
}


window.onload = function() { 

// Create a canvas element the size of the root space.
var canvas = document.createElement("canvas");
canvas.width = root.bottomRight.x - root.topLeft.x;
canvas.height = root.bottomRight.y - root.topLeft.y;
var ctx = canvas.getContext("2d");

// Add canvas to the page.
document.body.appendChild(canvas);


// Create a function that draws a rectangle without filling representing a node.
function drawNode(node) {
    ctx.strokeRect(node.topLeft.x, node.topLeft.y, node.bottomRight.x - node.topLeft.x, node.bottomRight.y - node.topLeft.y);
}


// Create a render() function which clears the canvas and renders all existing points on it 3px circles.
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x - root.topLeft.x, points[i].y - root.topLeft.y, 3, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    // Traverse the tree from the root and draw a quad for every node that is not a leaf.
    buildTree(root, [points[points.length-1]]);
    traverse(root, drawNode);
}



// When mouse click is detected on the canvas, create a point in the location of the click.
canvas.addEventListener("click", function(e) {
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    points.push(new Point(x, y));
    render();
});

};


// https://www.tutorialspoint.com/quadtrees-in-data-structure





