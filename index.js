class Boundary {
  static width = 48;
  static height = 48;

  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = frames;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
    context.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const offset = {
  x: -738,
  y: -600,
};

const step = 3;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "./img/Pellet Town.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2 + 20,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

let lastKey;
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

const testBoundary = new Boundary({
  position: {
    x: 400,
    y: 400,
  },
});

const collisionsMap = [];
const boundaries = [];
const movables = [background];

window.onload = () => {
  for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
  }

  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025) {
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
      }
    });
  });

  movables.push(...boundaries);

  animate();
};

function animate() {
  console.log("animate");

  window.requestAnimationFrame(this.animate);
  background.draw();

  boundaries.forEach((boundary) => boundary.draw());

  player.draw();

  const step = 3;
  if (keys.w.pressed && lastKey === "w") {
    if (this.checkMoving(boundaries, player, "w")) {
      movables.forEach((movable) => (movable.position.y += step));
    }
  } else if (keys.a.pressed && lastKey === "a") {
    if (this.checkMoving(boundaries, player, "a")) {
      movables.forEach((movable) => (movable.position.x += step));
    }
  } else if (keys.s.pressed && lastKey === "s") {
    if (this.checkMoving(boundaries, player, "s")) {
      movables.forEach((movable) => (movable.position.y -= step));
    }
  } else if (keys.d.pressed && lastKey === "d") {
    if (this.checkMoving(boundaries, player, "d")) {
      movables.forEach((movable) => (movable.position.x -= step));
    }
  } else if (keys.w.pressed) {
    if (this.checkMoving(boundaries, player, "w")) {
      movables.forEach((movable) => (movable.position.y += step));
    }
  } else if (keys.a.pressed) {
    if (this.checkMoving(boundaries, player, "a")) {
      movables.forEach((movable) => (movable.position.x += step));
    }
  } else if (keys.s.pressed) {
    if (this.checkMoving(boundaries, player, "s")) {
      movables.forEach((movable) => (movable.position.y -= step));
    }
  } else if (keys.d.pressed) {
    if (this.checkMoving(boundaries, player, "d")) {
      movables.forEach((movable) => (movable.position.x -= step));
    }
  }
}

function checkMoving(boundaries, rectangle1, key) {
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i];
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: this.getNextPositionByKey(boundary, key),
        },
      })
    ) {
      return false;
    }
  }
  return true;
}

function getNextPositionByKey(boundary, key) {
  if (key === "w") {
    return { x: boundary.position.x, y: boundary.position.y + step };
  } else if (key === "a") {
    return { x: boundary.position.x + step, y: boundary.position.y };
  } else if (key === "s") {
    return { x: boundary.position.x, y: boundary.position.y - step };
  } else if (key === "d") {
    return { x: boundary.position.x - step, y: boundary.position.y };
  } else {
    return { x: boundary.position.x, y: boundary.position.y };
  }
}
