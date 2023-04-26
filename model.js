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
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    isEnemy = false,
    rotation = 0,
  }) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = { ...frames, val: 0, ellapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };

    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;
    this.rotation = rotation;
  }

  draw() {
    context.save();

    context.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    context.rotate(this.rotation);
    context.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

    context.globalAlpha = this.opacity;

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

    context.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.ellapsed++;
    }

    if (this.frames.ellapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++;
      } else {
        this.frames.val = 0;
      }
    }
  }

  attack({ attack, recipient, renderedSprites }) {
    this.health -= attack.damage;

    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) {
      healthBar = "#playerHealthBar";
    }

    switch (attack.name) {
      case "Tackle":
        this.tackleAttack({ recipient, healthBar });
        break;
      case "Fireball":
        this.fireballAttack({ recipient, healthBar, renderedSprites });
        break;
    }
  }

  tackleAttack({ recipient, healthBar }) {
    const tl = gsap.timeline();

    let movementDistance = 20;

    if (this.isEnemy) {
      movementDistance = -20;
    }

    tl.to(this.position, {
      x: this.position.x - movementDistance,
    })
      .to(this.position, {
        x: this.position.x + movementDistance * 2,
        duration: 0.1,
        onComplete: () => {
          gsap.to(healthBar, {
            width: this.health + "%",
          });

          gsap.to(recipient.position, {
            x: recipient.position.x + 10,
            yoyo: true,
            repeat: 5,
            duration: 0.08,
          });

          gsap.to(recipient, {
            opacity: 0,
            yoyo: true,
            repeat: 5,
            duration: 0.08,
          });
        },
      })
      .to(this.position, {
        x: this.position.x,
      });
  }

  fireballAttack({ recipient, healthBar, renderedSprites }) {
    let rotation = 1;
    if (this.isEnemy) {
      rotation = -1;
    }
    const fireballImage = new Image();
    fireballImage.src = "./img/fireball.png";
    const fireball = new Sprite({
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      image: fireballImage,
      frames: {
        max: 4,
        hold: 20,
      },
      animate: true,
      rotation: rotation,
    });

    renderedSprites.splice(1, 0, fireball);

    gsap.to(fireball.position, {
      x: recipient.position.x,
      y: recipient.position.y,
      onComplete: () => {
        gsap.to(healthBar, {
          width: this.health + "%",
        });

        gsap.to(recipient.position, {
          x: recipient.position.x + 10,
          yoyo: true,
          repeat: 5,
          duration: 0.08,
        });

        gsap.to(recipient, {
          opacity: 0,
          yoyo: true,
          repeat: 5,
          duration: 0.08,
        });
        renderedSprites.splice(1, 1);
      },
    });
  }
}
