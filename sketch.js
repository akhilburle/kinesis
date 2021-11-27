let width = 750
let height = 750

let g = 0.1
let preview = true;

let nodes;

function setup() {
    createCanvas(width, height);
    nodes = [];
}

function draw() {
    background(0);
    stroke(0);
    strokeWeight(2);

    nodes.forEach(function (node, index) {
        if (!preview) {
            node.update();
            node.checkEdges();
        }
        node.display();
    });
}

function mouseClicked() {
    nodes.push(new Node(mouseX, mouseY))
}

function keyPressed() {
    if (keyCode === ENTER) {
        preview = !preview;
    }
}

class Node {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, g);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    }

    display() {
        stroke(255);
        strokeWeight(2);
        fill(51);
        ellipse(this.position.x, this.position.y, 10, 10);
    };

    checkEdges() {
        if (this.position.y > (height - 5)) {
            // A little dampening when hitting the bottom
            this.velocity.y *= -0.9;
            this.position.y = (height - 5);
        }
    };
}

class Edge {
    constructor(nodeA, nodeB) {
        this.dir = createVector(nodeA, nodeB).normalize();
        this.src = nodeA
        this.dest = nodeB
    }
}