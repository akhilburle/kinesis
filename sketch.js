let width = 750
let height = 750

let g = 0.0005
let preview = true;
let elasticity = 0.4

let nodes;
let edges;

function setup() {
    createCanvas(width, height);
    nodes = [];
    edges = [];
}

function draw() {
    background(0);
    stroke(0);
    strokeWeight(2);

    if (!preview) {
        update()
    }
    render();
}

function update() {
    nodes.forEach(function (node, index) {
        node.update();
        node.checkEdges();

    });
    for (let i = 0; i < 5; i++) {
        edges.forEach(function (edge, index) {
            edge.update();
        });
        nodes.forEach(function (node, index) {
            node.checkEdges();
        });
    }
}

function render() {
    if (edges.length < nodes.length - 1 && nodes.length == 4) {
        edges.push(new Edge(nodes[nodes.length - 1], nodes[nodes.length - 2]))
        edges.push(new Edge(nodes[nodes.length - 2], nodes[nodes.length - 3]))
        edges.push(new Edge(nodes[nodes.length - 3], nodes[nodes.length - 4]))
        edges.push(new Edge(nodes[nodes.length - 4], nodes[nodes.length - 1]))
        edges.push(new Edge(nodes[nodes.length - 1], nodes[nodes.length - 3]))
    }
    nodes.forEach(function (node, index) {
        node.display();
    });
    edges.forEach(function (edge, index) {
        edge.display();
    });
}

function mouseClicked() {
    nodes.push(new Node(mouseX, mouseY, keyIsDown(SHIFT)))
}

function keyPressed() {
    if (keyCode === ENTER) {
        preview = !preview;
    }
}

class Node {
    constructor(x, y, fixed = false) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, g);
        this.fixed = fixed
    }

    update() {
        if (!this.fixed) {
            let new_pos = this.position.copy().add(this.velocity.copy().mult(deltaTime).add(this.acceleration.copy().mult(deltaTime * deltaTime * 0.5)))
            let new_vel = this.velocity.copy().add(this.acceleration.copy().mult(deltaTime))
            this.position = new_pos;
            this.velocity = new_vel;
        }
    }

    display() {
        stroke(255);
        strokeWeight(2);
        if (!this.fixed) {
            fill(51);
        }
        else {
            fill('rgb(100%,0%,10%)');
        }
        ellipse(this.position.x, this.position.y, 10, 10);
    };

    checkEdges() {
        if (this.position.y > (height - 5)) {
            // A little dampening when hitting the bottom
            this.velocity.y *= -elasticity;
            this.position.y = (height - 5);
        }
    };
}

class Edge {
    constructor(nodeA, nodeB) {
        this.src = nodeA
        this.dest = nodeB
        this.dir = this.src.position.copy().sub(this.dest.position).normalize();
        this.length = this.src.position.copy().sub(this.dest.position).mag()
        this.center = this.src.position.copy().add(this.dest.position).div(2)
    }

    update() {
        this.center = this.src.position.copy().add(this.dest.position).div(2);
        this.dir = this.src.position.copy().sub(this.dest.position).normalize();
        // stroke('rgb(100%,0%,10%)');
        // fill('rgb(100%,0%,10%)');
        // ellipse(this.center.x, this.center.y, 10, 10);
        // drawArrow(this.center, this.dir.copy().mult(35), 'red')
        if (!this.src.fixed) {
            this.src.position = this.center.copy().add(this.dir.copy().mult(this.length / 2)).copy();
        }
        if (!this.dest.fixed) {
            this.dest.position = this.center.copy().add(this.dir.copy().mult(this.length / -2)).copy();
        }
        // stroke('rgb(0%,0%,100%)');
        // fill('rgb(0%,0%,100%)');
        // ellipse(this.src.position.x, this.src.position.y, 10, 10);
        // stroke('rgb(0%,100%,0%)');
        // fill('rgb(0%,100%,0%)');
        // ellipse(this.dest.position.x, this.dest.position.y, 10, 10);
    }

    display() {
        stroke(255);
        strokeWeight(2);
        line(
            this.src.position.x,
            this.src.position.y,
            this.dest.position.x,
            this.dest.position.y
        );
    }
}

function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}