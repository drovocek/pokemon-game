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

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObjects.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";
const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";
const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";
const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2 + 20,
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    right: playerRightImage,
    down: playerDownImage,
    left: playerLeftImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x + 432,
    y: offset.y + 144,
  },
  image: foregroundImage,
});

const battle = {
  initiated: false,
};

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
const battleZonesMap = [];
const boundaries = [];
const battleZones = [];
const movables = [background];

window.onload = () => {
  for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
  }

  for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, i + 70));
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

  battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025) {
        battleZones.push(
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
  movables.push(...battleZones);
  movables.push(foreground);

  animate();

  console.log(document.getElementById("overlapping"));
  gsap.to("#overlapping", {
    opacity: 0.5,
    repeat: 3,
    yoyo: true,
  });
};

function animate() {
  window.requestAnimationFrame(this.animate);
  background.draw();

  battleZones.forEach((boundary) => boundary.draw());
  boundaries.forEach((boundary) => boundary.draw());

  player.draw();

  foreground.draw();

  if (battle.initiated) {
    player.moving = false;
    return;
  }

  if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
    battle.initiated = this.checkBattle(battleZones, player);
  }

  const step = 3;
  player.moving = false;
  if (keys.w.pressed && lastKey === "w") {
    if (this.checkMoving(boundaries, player, "w")) {
      player.moving = true;
      player.image = player.sprites.up;
      movables.forEach((movable) => (movable.position.y += step));
    }
  } else if (keys.a.pressed && lastKey === "a") {
    if (this.checkMoving(boundaries, player, "a")) {
      player.moving = true;
      player.image = player.sprites.left;
      movables.forEach((movable) => (movable.position.x += step));
    }
  } else if (keys.s.pressed && lastKey === "s") {
    if (this.checkMoving(boundaries, player, "s")) {
      player.moving = true;
      player.image = player.sprites.down;
      movables.forEach((movable) => (movable.position.y -= step));
    }
  } else if (keys.d.pressed && lastKey === "d") {
    if (this.checkMoving(boundaries, player, "d")) {
      player.moving = true;
      player.image = player.sprites.right;
      movables.forEach((movable) => (movable.position.x -= step));
    }
  } else if (keys.w.pressed) {
    if (this.checkMoving(boundaries, player, "w")) {
      player.moving = true;
      player.image = player.sprites.up;
      movables.forEach((movable) => (movable.position.y += step));
    }
  } else if (keys.a.pressed) {
    if (this.checkMoving(boundaries, player, "a")) {
      player.moving = true;
      player.image = player.sprites.left;
      movables.forEach((movable) => (movable.position.x += step));
    }
  } else if (keys.s.pressed) {
    if (this.checkMoving(boundaries, player, "s")) {
      player.moving = true;
      player.image = player.sprites.down;
      movables.forEach((movable) => (movable.position.y -= step));
    }
  } else if (keys.d.pressed) {
    if (this.checkMoving(boundaries, player, "d")) {
      player.moving = true;
      player.image = player.sprites.right;
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

function checkBattle(battleZones, rectangle1) {
  for (let i = 0; i < battleZones.length; i++) {
    const battleZone = battleZones[i];
    const overlappingArea =
      (Math.min(
        player.position.x + player.width,
        battleZone.position.x + battleZone.width
      ) -
        Math.max(player.position.x, battleZone.position.x)) *
      (Math.min(
        player.position.y + player.height,
        battleZone.position.y + battleZone.height
      ) -
        Math.max(player.position.y, battleZone.position.y));
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: battleZone,
      }) &&
      overlappingArea > (player.width * player.height) / 2 &&
      Math.random() < 0.01
    ) {
      console.log("battle");
      return true;
    }
  }
  return false;
}
