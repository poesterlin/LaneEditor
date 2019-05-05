const lanes = new Array(3).fill(null).map((_, idx) => new Lane(5, 'U' + (idx + 1), idx, 'start station', 'stop station'));
let wasDragged = false;

function setup() {
  createCanvas(400, 800);
}

function draw() {
  background(255);
  lanes.forEach(l => l.draw())
}


function mouseClicked(event) {
  if (wasDragged) {
    wasDragged = false;
    return;
  }
  if (event.ctrlKey) {
    const lane = lanes.findIndex(l => l.clicked());
    lanes.splice(lane, 1);
  } else {
    const lane = new Lane(~~(Math.random() * 5 + 4), 'U6', ~~(Math.random() * 3), 'start', 'stop');
    lane.x = mouseX;
    lane.y = mouseY;
    lanes.push(lane);
  }
}

function mouseDragged() {
  wasDragged = true;
  const lane = lanes.find(l => l.clicked());
  lane.x = mouseX;
  lane.y = mouseY;
}
