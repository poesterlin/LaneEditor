const lanes = new Array(3).fill(null).map((_, idx) => new Lane(5, 'U' + (idx + 1), idx, 'start station', 'stop station'));
const connections = [];

let wasDragged = false;
let dragConnection = {
  from: undefined,
  section: 0
}

let inputs = {
  start: 'start',
  destination: 'dest',
  name: 'u1',
  length: 4,
  type: 0,
  trip: {
    start: 'trip start',
    destination: 'trip stop'
  }
}


function setup() {
  createCanvas(600, 600);

  let temp = undefined;
  temp = createInput('').input((event) => inputs.start = event.target.value);
  temp.elt.placeholder = 'Start Station'
  temp = createInput('').input((event) => inputs.destination = event.target.value);
  temp.elt.placeholder = 'Destination Station'
  temp = createInput('').input((event) => inputs.name = event.target.value);
  temp.elt.placeholder = 'Name'
  temp = createInput(0, 'number').input((event) => inputs.length = event.target.value);
  temp.elt.placeholder = 'number of stations'
  
  temp = createInput('').input((event) => inputs.trip.start = event.target.value);
  temp.elt.placeholder = 'trip start'
  temp = createInput('').input((event) => inputs.trip.destination = event.target.value);
  temp.elt.placeholder = 'trip destination'

  const sel = createSelect();
  sel.option('green');
  sel.option('orange');
  sel.option('red');
  sel.changed(event => inputs.type = event.target.selectedIndex);

  createButton('create').mousePressed(createLane);
  createButton('save').mousePressed(() => saveCanvas('route', 'jpg'));
  createButton('reconnect').mousePressed(() => {
    lanes.forEach(lane => lane.connections = new WeakSet());
  });
  createButton('clear').mousePressed(() => lanes.splice(0, lanes.length));


  lanes[0].x = 350;
  lanes[1].x = 200;
  lanes[1].y = 250;
  lanes[2].x = 220;
  lanes[2].y = 400;

  addConnection(lanes[0], {
    from: 3,
    to: 4,
    of: lanes[1],
    type: 'waitpath'
  })
  addConnection(lanes[0], {
    from: 5,
    to: 0,
    of: lanes[2],
    type: 'footpath'
  });
}

function draw() {
  background(255);
  lanes.forEach(l => l.drawFootpath(connections))
  lanes.forEach(l => l.drawWaitpath(connections))
  lanes.forEach(l => l.draw())


  if (dragConnection.from) {
    dragConnection.from.drawDragPath(dragConnection.section);
  }

  fill(0);
  stroke(0);
  textSize(22);
  drawingContext.setLineDash([3, 3]);
  line(22, 50, 22, 550);
  drawingContext.setLineDash([]);
  textAlign(LEFT);

  stroke(255);
  text(inputs.trip.start, 20, 40);
  text(inputs.trip.destination, 20, 575);
}


function mouseClicked(event) {
  if (wasDragged) {
    wasDragged = false;
    dragConnection = {};
    return;
  }
  if (event.ctrlKey) {
    const idx = lanes.findIndex(l => l.clicked());
    if (idx > -1) {
      connections.filter(c => c.of === lanes[idx]).forEach(c => removeConnection(lanes[idx], c))
      lanes.splice(idx, 1);
    }
  }
}

function mouseDragged() {
  wasDragged = true;
  let s = 0;
  const section = lanes.find(l => {
    s = l.sectionClicked();
    return s > -1;
  });

  if (dragConnection.from) {
    if (section && section !== dragConnection.from) {
      addConnection(dragConnection.from, {
        from: dragConnection.section,
        to: s,
        of: section,
        type: ~~(Math.random() * 2) ? 'footpath' : 'waitpath'
      });
      dragConnection = {};
    }
    return;
  }

  if (section && s > 0) {
    dragConnection.from = section;
    dragConnection.section = s;
    return;
  }

  const lane = lanes.find(l => l.clicked());
  if (lane) {
    lane.x = mouseX;
    lane.y = mouseY;
  }
}

function createLane() {
  lanes.push(new Lane(inputs.length, inputs.name, inputs.type, inputs.start, inputs.destination))
}


function addConnection(lane, connection) {
  connections.push(connection);
  lane.connections.add(connection);
}

function removeConnection(lane, connection) {
  connections.splice(connections.findIndex(c => c === connection), 1);
  lane.connections.delete(connection);
}