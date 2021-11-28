let width = 750
let height = 750

let g = 0.1
let preview = true;
let elasticity = 0.5

let nodes;
let edges;

let edge_node_buffer;

function setup() {
    createCanvas(width, height);
    nodes = [];
    edges = [];
    edge_node_buffer = [];
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
    nodes.forEach(function (node, index) {
        node.display();
    });
    edges.forEach(function (edge, index) {
        edge.display();
    });
}

function mouseClicked() {
    if (keyIsDown(69)) {
        for (let index = 0; index < nodes.length; index++) {
            if (Math.pow(mouseX - nodes[index].position.x, 2) + Math.pow(mouseY - nodes[index].position.y, 2) <= 100) {
                edge_node_buffer.push(nodes[index]);
                break;
            }
        }
        if (edge_node_buffer.length >= 2) {
            edges.push(new Edge(edge_node_buffer[0], edge_node_buffer[1]))
            edge_node_buffer = []
        }
    }
    else {
        nodes.push(new Node(mouseX, mouseY, keyIsDown(SHIFT)))
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        preview = !preview;
    }
}

class Node {
    constructor(x, y, fixed = false) {
        this.position = createVector(x, y);
        this.old_position = createVector(x, y);
        this.acceleration = createVector(0, g);
        this.fixed = fixed
    }

    update() {
        if (!this.fixed) {
            let temp_pos = this.position.copy();
            let vel = this.position.copy().sub(this.old_position);
            this.position.add(vel);
            this.position.add(this.acceleration);
            this.old_position = temp_pos.copy();
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
            let vel_y = this.position.y - this.old_position.y
            this.position.y = (height - 5);
            this.old_position.y = this.position.y + (vel_y * elasticity);
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
        if (!this.src.fixed) {
            this.src.position = this.center.copy().add(this.dir.copy().mult(this.length / 2)).copy();
        }
        if (!this.dest.fixed) {
            this.dest.position = this.center.copy().add(this.dir.copy().mult(this.length / -2)).copy();
        }
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