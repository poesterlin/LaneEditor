const size = 20;

class Lane {

  constructor(length, name, mode, start, goal) {
    this.length = length;
    this.name = name;

    this.x = 200;
    this.y = 20 + mode * 150;
    this.start = start;
    this.goal = goal;

    switch (mode) {
      case 0: {
        this.color = 'lightgreen';
        this.thicc = 4;
        break;
      }

      case 1: {
        this.color = 'orange';
        this.thicc = 10;
        break;
      }

      case 2: {
        this.color = 'red';
        this.thicc = 15;
        break;
      }
    }
  }

  draw() {
    drawingContext.setLineDash([]);
    fill(120);
    stroke(255);
    strokeWeight(2);

    // Main body
    rect(this.x, this.y, 10, this.length * size + 5);

    // stations
    for (let i = 1; i <= this.length; i++) {
      circle(this.x + 4.5, this.y + i * size, 5.5, 5.5);
    }

    // start station inner
    strokeWeight(4);
    circle(this.x + 5, this.y, 8, 8);

    // start station outer
    noFill();
    stroke(color(this.color));
    strokeWeight(2);
    circle(this.x + 5, this.y, 10, 10);

    // side indicator
    noStroke();
    fill(color(this.color));
    rect(this.x + 9, this.y + 5, this.thicc, this.length * size - 1);

    // line name background
    fill(0, 90, 150);
    rect(this.x - 27, this.y + 11, 20, 18);

    // line name
    fill(255);
    text(this.name, this.x - 26, this.y + 25, 20);

    // start station
    textAlign(RIGHT);
    fill(0);
    text(this.start, this.x - 105, this.y - 5, 100, 20);

    // goal station
    text(this.goal, this.x - 105, this.y + this.length * size - 7, 100, 20);

    // wait path
    // stroke(140);
    // strokeWeight(2)
    // drawingContext.setLineDash([4, 4]);
    // line(this.x + 5, this.y + this.length * size + 6, this.x + 5, this.y + this.length * size + 50);

    // foot path  
    stroke(40);
    strokeCap(SQUARE);
    strokeWeight(8);
    drawingContext.setLineDash([3, 3]);
    line(this.x + 5, this.y + this.length * size + 6, this.x + 5, this.y + this.length * size + 45);
  }


  clicked() {
    return Math.sqrt((this.x - mouseX) * (this.x - mouseX) + (this.y - mouseY) * (this.y - mouseY)) < 20;
  }
}