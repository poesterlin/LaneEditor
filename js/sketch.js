const lanes = new Array(3).fill(null).map((_, idx) => new Lane(5, 'U' + (idx + 1), idx, 'start station', 'stop station'));
let wasDragged = false;
let dragConnection = {
  from: undefined,
  section: 0
}


function setup() {
  createCanvas(400, 800);
  lanes[1].x = 100;
  lanes[2].x = 120;
  lanes[0].connections.push({
    from: 3,
    to: 4,
    of: lanes[1],
    type: 'waitpath'
  });
  lanes[0].connections.push({
    from: 5,
    to: 0,
    of: lanes[2],
    type: 'footpath'
  });
}

function draw() {
  background(255);
  lanes.forEach(l => l.draw())
}


function mouseClicked(event) {
  if (wasDragged) {
    wasDragged = false;
    dragConnection = {};
    return;
  }
  if (event.ctrlKey) {
    const lane = lanes.findIndex(l => l.clicked());
    if (lane) {
      lanes.splice(lane, 1);
      return;
    }

    // const section = lanes.find(l => l.sectionClicked());
    // if (section) {
    //   const n = section.sectionClicked();
    //   section.connections.splice(section.connections.findIndex(c => c.from === n || c.to === n), 1);
    // }
  } else {
    const lane = new Lane(~~(Math.random() * 5 + 4), 'U6', ~~(Math.random() * 3), 'start', 'stop');
    lane.x = mouseX;
    lane.y = mouseY;
    lanes.push(lane);
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
    dragConnection.from.drawDragPath(dragConnection.section);
    if (section && section !== dragConnection.from) {
      dragConnection.from.connections.push({
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
