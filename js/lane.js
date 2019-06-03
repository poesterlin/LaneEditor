const size = 15;

class Lane {

  constructor(length, name, mode, start, goal, timeType, time) {
    this.length = length;
    this.name = name;

    this.x = 200;
    this.y = 100;
    this.start = start;
    this.goal = goal;
    this.connections = new WeakSet();
    this.time = time;
    this.timeType = timeType;

    switch (mode) {
      case 0: {
        this.color = [35, 233, 35];
        this.thicc = 3;
        break;
      }

      case 1: {
        this.color = [255, 193, 12];
        this.thicc = 6;
        break;
      }

      case 2: {
        this.color = [255, 18, 78];
        this.thicc = 7;
        break;
      }
    }
  }

  draw() {
    drawingContext.setLineDash([]);
    textSize(12);
    fill(120);
    stroke(255);
    strokeWeight(2);

    // Main body
    rect(this.x, this.y, 10, this.length * size + 9);

    // stations
    for (let i = 1; i <= this.length; i++) {
      circle(this.x + 4.5, this.y + i * size + 4, 7, 7);
    }

    // side indicator
    noStroke();
    fill(color(...this.color));
    rect(this.x + 9, this.y, this.thicc, this.length * size + 8);

    // start station inner
    strokeWeight(4);
    fill(255);
    circle(this.x + 5, this.y, 19, 19);

    // start station gray
    fill(120);
    circle(this.x + 5, this.y, 10, 10);

    // start station outer
    noFill();
    stroke(color(...this.color));
    strokeWeight(2);
    circle(this.x + 5, this.y, 20, 20);

    // line name background

    fill(0, 90, 150);
    noStroke();
    if (this.name) {
      rect(this.x - 27, this.y + 11, 20, 18);
    }

    // line name
    noStroke();
    textStyle(BOLD);
    textAlign(LEFT)
    fill(255);
    textSize(11);
    text(this.name.trim().toUpperCase(), this.x - 24, this.y + 24);

    // start station
    textSize(9);
    textAlign(RIGHT);
    fill(0);
    text(this.start, this.x - 105, this.y - 5, 100, 20);

    // goal station
    text(this.goal, this.x - 105, this.y + this.length * size - 7, 100, 20);
    textStyle(NORMAL);

    if (this.timeType === 1) {
      textSize(14);
      text(this.time, this.x + 22, this.y - 15);
    }

    if (this.timeType === 2) {
      textSize(14);
      text(this.time, this.x + 22, this.y + this.length * size + 20);
    }
  }

  drawFootpath(allLanes) {
    for (const pa of allLanes) {
      if (this === pa.of || !this.connections.has(pa) || pa.type !== 'waitpath') continue;
      stroke(40);
      strokeCap(SQUARE);
      strokeWeight(8);
      drawingContext.setLineDash([3, 3]);

      line(this.x + 5, this.y + pa.from * size + 6, (this.x + 5 + pa.of.x + 5) / 2, pa.of.y + 4 + pa.to * size);
      line((this.x + 5 + pa.of.x + 5) / 2, pa.of.y + 4 + pa.to * size, pa.of.x + 5, pa.of.y + 4 + pa.to * size);
    }
  }


  drawWaitpath(allLanes) {
    for (const pa of allLanes) {
      if (this === pa.of || !this.connections.has(pa) || pa.type !== 'footpath') continue;
      strokeCap(SQUARE);
      stroke(140);
      strokeWeight(2)
      drawingContext.setLineDash([4, 4]);
      line(this.x + 5, this.y + pa.from * size + 6, (this.x + 5 + pa.of.x + 5) / 2, pa.of.y + 4 + pa.to * size);
      line((this.x + 5 + pa.of.x + 5) / 2, pa.of.y + 4 + pa.to * size, pa.of.x + 5, pa.of.y + 4 + pa.to * size);
    }
  }

  drawDragPath(section) {
    strokeCap(SQUARE);
    stroke(140);
    strokeWeight(2);
    drawingContext.setLineDash([4, 4]);
    line(this.x + 5, this.y + section * size, (this.x + 5 + mouseX / scalingFactor + 5) / 2, mouseY / scalingFactor);
    line((this.x + 5 + mouseX / scalingFactor + 5) / 2, mouseY / scalingFactor, mouseX / scalingFactor + 5, mouseY / scalingFactor);
  }


  clicked() {
    return Math.sqrt((this.x - mouseX / scalingFactor) * (this.x - mouseX / scalingFactor) + (this.y - mouseY / scalingFactor) * (this.y - mouseY / scalingFactor)) < 20;
  }

  sectionClicked() {
    stroke(255, 0, 0);
    if (this.intersects(this.x, this.y - size / 2, 10, this.length * size + 15, mouseX / scalingFactor, mouseY / scalingFactor)) {
      return ~~((mouseY / scalingFactor - this.y) / size);
      // circle(this.x + 4.5, this.y + section * size, 5.5, 5.5);
    }
    return -1;
  }


  intersects(x1, y1, x2, y2, xi, yi) {
    return x1 < xi && x1 + x2 > xi && y1 < yi && y1 + y2 > yi;
  }

}