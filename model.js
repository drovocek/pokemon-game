class Boundary {
  static width = 48;
  static height = 48;

  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    context.fillStyle = "rgba(255,0,0,0.5)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 }, sprites }) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = { ...frames, val: 0, ellapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };

    this.moving = false;
    this.sprites = sprites;
  }

  draw() {
    context.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );

    if (!this.moving) return;

    if (this.frames.max > 1) {
      this.frames.ellapsed++;
    }

    if (this.frames.ellapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++;
      } else {
        this.frames.val = 0;
      }
    }
  }
}
