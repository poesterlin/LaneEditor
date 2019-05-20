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
  type: 0
}


function setup() {
  createCanvas(400, 400);

  createInput('Start Station').input((event) => inputs.start = event.target.value);
  createInput('Destination').input((event) => inputs.destination = event.target.value);
  createInput('Name').input((event) => inputs.name = event.target.value);
  createInput(0, 'number').input((event) => inputs.length = event.target.value);

  const sel = createSelect();
  sel.option('green');
  sel.option('orange');
  sel.option('red');
  sel.changed(event => inputs.type = event.target.selectedIndex);

  createButton('create').mousePressed(createLane);
  createButton('save').mousePressed(()=> saveCanvas('route', 'jpg'));

  lanes[1].x = 100;
  lanes[2].x = 120;

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