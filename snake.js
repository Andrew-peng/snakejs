"use strict";
let boxSize = 25;
let topScore = 0;
// arrow keys + WASD
let LEFT_KEYCODES = [37, 65];
let RIGHT_KEYCODES = [39, 68];
let UP_KEYCODES = [38, 87];
let DOWN_KEYCODES = [40, 83];
class SnakeApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.sleepMs = 100;
        this.direction = 0;
        this.gameover = false;
        this.seenDirection = 0;
        this.snake = [[5, 10], [4, 10], [3, 10]];
        this.fruit = this.newFruit();
        this.draw();
    }
    restartGame() {
        this.score = 0;
        this.sleepMs = 100;
        this.direction = 0;
        this.seenDirection = 0;
        this.gameover = false;
        this.snake = [[5, 10], [4, 10], [3, 10]];
        this.fruit = this.newFruit();
    }
    newFruit() {
        let fruit = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
        for (let i = 0; i < this.snake.length; i++) {
            if (this.snake[i][0] == fruit[0] && this.snake[i][1] == fruit[1]) {
                return this.newFruit();
            }
        }
        return fruit;
    }
    drawGrid() {
        this.ctx.fillStyle = "#D3D3D3";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "white";
        for (let i = 0; i < this.canvas.width / boxSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * boxSize, 0);
            this.ctx.lineTo(i * boxSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i < this.canvas.height / boxSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * boxSize);
            this.ctx.lineTo(this.canvas.width, i * boxSize);
            this.ctx.stroke();
        }
    }
    drawFruit() {
        this.ctx.fillStyle = "#e74c3c";
        this.ctx.strokeStyle = "#c0392b";
        this.ctx.fillRect(this.fruit[0] * boxSize, this.fruit[1] * boxSize, boxSize, boxSize);
        this.ctx.strokeRect(this.fruit[0] * boxSize, this.fruit[1] * boxSize, boxSize, boxSize);
    }
    drawSnake() {
        for (let i = 0; i < this.snake.length; i++) {
            let coord = this.snake[i];
            this.ctx.fillStyle = "#73c6b6";
            this.ctx.strokeStyle = "#16a085";
            this.ctx.fillRect(coord[0] * boxSize, coord[1] * boxSize, boxSize, boxSize);
            this.ctx.strokeRect(coord[0] * boxSize, coord[1] * boxSize, boxSize, boxSize);
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawSnake();
        this.drawFruit();
        document.getElementById("score").innerHTML = "score: " + this.score;
        document.getElementById("max-score").innerHTML = "max score: " + topScore;
        this.seenDirection = this.direction;
    }
    gameOver() {
        let pos = this.snake[0];
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i][0] == pos[0] && this.snake[i][1] == pos[1]) {
                return true;
            }
        }
        return !(pos[0] >= 0 && pos[1] >= 0 && pos[0] < this.canvas.width / boxSize && pos[1] < this.canvas.height / boxSize);
    }
    moveSnake() {
        let newHead = [...this.snake[0]];
        switch (this.direction) {
            case 0:
                newHead[0] += 1;
                break;
            case 1:
                newHead[1] -= 1;
                break;
            case 2:
                newHead[0] -= 1;
                break;
            case 3:
                newHead[1] += 1;
                break;
        }
        if (newHead[0] == this.fruit[0] && newHead[1] == this.fruit[1]) {
            this.score += 1;
            if (this.score % 5 == 0) {
                this.sleepMs = Math.max(this.sleepMs - 10, 30);
            }
            this.fruit = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
        }
        else {
            this.snake.pop();
        }
        this.snake.unshift(newHead);
    }
    run() {
        setTimeout(() => {
            this.moveSnake();
            if (this.gameOver()) {
                topScore = Math.max(this.score, topScore);
                this.restartGame();
            }
            this.draw();
            this.run();
        }, this.sleepMs);
    }
}
let app = new SnakeApp();
this.addEventListener('keydown', (event) => {
    if (LEFT_KEYCODES.includes(event.keyCode)) {
        if (app.seenDirection % 2 != 0) {
            app.direction = 2;
        }
    }
    if (RIGHT_KEYCODES.includes(event.keyCode)) {
        if (app.seenDirection % 2 != 0) {
            app.direction = 0;
        }
    }
    if (UP_KEYCODES.includes(event.keyCode)) {
        if (app.seenDirection % 2 != 1) {
            app.direction = 1;
        }
    }
    if (DOWN_KEYCODES.includes(event.keyCode)) {
        if (app.seenDirection % 2 != 1) {
            app.direction = 3;
        }
    }
});
app.run();
