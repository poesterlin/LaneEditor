const size = 20;

class Lane {

  constructor(length, name, mode, start, goal) {
    this.length = length;
    this.name = name;

    this.x = 200;
    this.y = 20 + mode * 150;
    this.start = start;
    this.goal = goal;
    this.connections = [];

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

    this.drawFootpath();
    this.drawWaitpath();
  }

  drawFootpath() {
    this.connections.filter(c => c.type === 'footpath').forEach(pa => {
      stroke(40);
      strokeCap(SQUARE);
      strokeWeight(8);
      drawingContext.setLineDash([3, 3]);

      line(this.x + 5, this.y + pa.from * size + 6, (this.x + 5 + pa.of.x + 5) / 2, pa.of.y + pa.to * size);
      line((this.x + 5 + pa.of.x + 5) / 2, pa.of.y + pa.to * size, pa.of.x + 5, pa.of.y + pa.to * size);
    });
  }


  drawWaitpath() {
    this.connections.filter(c => c.type === 'waitpath').forEach(pa => {
      strokeCap(SQUARE);
      stroke(140);
      strokeWeight(2)
      drawingContext.setLineDash([4, 4]);
      line(this.x + 5, this.y + pa.from * size + 6, (this.x + 5 + pa.of.x + 5) / 2, pa.of.y + pa.to * size);
      line((this.x + 5 + pa.of.x + 5) / 2, pa.of.y + pa.to * size, pa.of.x + 5, pa.of.y + pa.to * size);
    });
  }

  drawDragPath(section) {
    strokeCap(SQUARE);
    stroke(140);
    strokeWeight(2)
    drawingContext.setLineDash([4, 4]);
    line(this.x + 5, this.y + section * size + 6, (this.x + 5 + mouseX + 5) / 2, mouseY);
    line((this.x + 5 + mouseX + 5) / 2, mouseY, mouseX + 5, mouseY);
  }


  clicked() {
    return Math.sqrt((this.x - mouseX) * (this.x - mouseX) + (this.y - mouseY) * (this.y - mouseY)) < 20;
  }

  sectionClicked() {
    stroke(255, 0, 0);
    if (this.intersects(this.x, this.y, 10, this.length * size + 5, mouseX, mouseY)) {
      return ~~((mouseY - this.y) / size);
      // circle(this.x + 4.5, this.y + section * size, 5.5, 5.5);
    }
    return -1;
  }


  intersects(x1, y1, x2, y2, xi, yi) {
    return x1 < xi && x1 + x2 > xi && y1 < yi && y1 + y2 > yi;
  }

}