import Proyectile from "../entities/Proyectile.js";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, y, x, key, player, speed) {
    super(scene, y, x, key);
    //Se añade a si mismo a la escena existente
    scene.add.existing(this);
    this.scene = scene;
    //Se añade a si mismo a las fisicas de la escena existente
    scene.physics.add.existing(this);

    //Modifica el tamaño de la hitbox del enemigo
    this.body.setSize(50, 110);
    this.body.setOffset(110, 53);

    //Llama a la funcion para crear las animaciones
    this.createAnimations();

    //Variables para controlar el enemigo
    this.speed = speed;
    this.playersGroup = player;
    this.attacking = false;
    this.attackingRange = false;
    this.health = 8;
    this.stop = false;
    this.inmmune = false;
    this.scale = 0.8;
    this.maxVelocityY = 3000;
    this.closestTarget = null;
    this.closestDistance = Infinity;
    this.meleeRange = 150;
    this.firstHit = true;
    this.jumpState = true;
    this.dash = true;
    this.block = true;
    this.sourceDamage = null;
    // Create attack hitbox
    this.pathHitbox = this.scene.add.rectangle(this.x, this.y, 30, 200);
    this.scene.physics.add.existing(this.pathHitbox);
    this.pathHitbox.body.setAllowGravity(false);

    this.FXsword1 = this.scene.sound.add("sword1", {
      volume: 0.2, // Set volume
      rate: 1, // Playback rate
    });
    this.FXsword2 = this.scene.sound.add("sword2", {
      volume: 0.2, // Set volume
      rate: 1, // Playback rate
    });
    this.FXscream = this.scene.sound.add("scream1", {
      volume: 0.2, // Set volume
      rate: 1, // Playback rate
    });

    //Si el enemigo esta atacando, detecta si la animacion termino
    this.on("animationcomplete-attack", () => {
      //Cuando la animacion termina, pone a atacando como false
      if (this.firstHit) {
        this.play("attack2");
        this.FXsword2.play();

      } else {
        this.attacking = false;
        this.stop = false;
      }
    });
    this.on("animationcomplete-attack2", () => {
      //Cuando la animacion termina, pone a atacando como false
      this.attacking = false;
      this.stop = false;
      this.firstHit = false;
      this.defensive = true;
      setTimeout(() => {
        this.defensive = false;
      }, 2000);
    });

    //Detecta si se esta reproduciendo la animacion de morir
    this.on("animationcomplete-dead", () => {
      //Si termina, destruye las fisicas del enemigo para no gastar recursos innecesarios
      this.body.destroy();
    });

    //Este metodo controla el ataque del enemigo pero esta desabilitado por ahora, se esta cambiando
    //el como se controla el ataque del enemigo para mejor rendimiento
    this.on("animationupdate", (animation, frame) => {
      if (animation.key === "attack" && frame.index === 7) {
        if (this.flipX) {
          this.setVelocityX(-2000);
        } else {
          this.setVelocityX(2000);
        }
        if (this.closestDistance < this.meleeRange) {
          this.closestTarget.takeDamage(1);
          this.firstHit = true;
        }
      }
    });

    this.on("animationupdate", (animation, frame) => {
      if (animation.key === "attack2" && frame.index === 2) {
        if (this.flipX) {
          this.setVelocityX(-2000);
        } else {
          this.setVelocityX(2000);
        }
        if (this.closestDistance < this.meleeRange) {
          this.closestTarget.takeDamage(1);
        }
      }
    });
  }

  //Crea las animaciones del enemigo
  createAnimations() {
    //Crea variables constantes con una key, y con los frames necesairos desde el player sheet
    const walk = {
      key: "walk",
      frames: this.anims.generateFrameNumbers("knightSheet", {
        start: 55,
        end: 62,
      }),
      frameRate: 8,
      repeat: -1,
    };
    const walkReverse = {
      key: "walkReverse",
      frames: this.anims.generateFrameNumbers("knightSheet", {
        start: 62,
        end: 55,
      }),
      frameRate: 8,
      repeat: -1,
    };
    const idle = {
      key: "idle",
      frames: this.anims.generateFrameNumbers("knightSheet", {
        start: 44,
        end: 50,
      }),
      frameRate: 16,
      repeat: -1,
    };
    const attack = {
      key: "attack",
      frames: this.anims.generateFrameNumbers("knightSheet", {
        start: 12,
        end: 22,
      }),
      frameRate: 14,
      repeat: 0,
    };
    const attack2 = {
      key: "attack2",
      frames: this.anims.generateFrameNumbers("knightSheet", {
        start: 23,
        end: 29,
      }),
      frameRate: 14,
      repeat: 0,
    };
    const dead = {
      key: "dead",
      frames: this.anims.generateFrameNumbers("knightSheet", {
        start: 0,
        end: 10,
      }),
      frameRate: 8,
      repeat: 0,
    };
    const dashStart = {
      key: "dashStart",
      frames: this.anims.generateFrameNumbers("knightSheet", {
        start: 34,
        end: 35,
      }),
      frameRate: 8,
      repeat: 0,
    };
    const dashEnd = {
      key: "dashEnd",
      frames: this.anims.generateFrameNumbers("knightSheet", {
        start: 35,
        end: 34,
      }),
      frameRate: 8,
      repeat: 0,
    };
    const block = {
      key: "block",
      frames: this.anims.generateFrameNumbers("knightSheet", {
        frames: [31],
      }),
      frameRate: 1,
      repeat: 0,
    };

    //Utiliza funcciones del Phaser para crear las animaciones anteriormente definidas
    this.anims.create(walk);
    this.anims.create(walkReverse);
    this.anims.create(dashEnd);
    this.anims.create(dashStart);
    this.anims.create(attack);
    this.anims.create(attack2);
    this.anims.create(dead);
    this.anims.create(idle);
    this.anims.create(block);
    //this.play("dead", true);
  }

  jump() {
    if (this.jumpState) {
      this.setVelocityY(-700);
      if (this.flipX) {
        this.setVelocityX(-900);
      } else {
        this.setVelocityX(900);
      }
      this.jumpState = false;
      setTimeout(() => {
        this.jumpState = true;
      }, 2000);
    }
  }

  update() {
    if (this.flipX) {
      this.pathHitbox.x = this.x - 40;
    } else {
      this.pathHitbox.x = this.x + 40;
    }
    this.pathHitbox.y = this.y + 180;

    //Limita la velocidad maxima a la que el enemigo puede caer
    if (this.body.velocity.y > this.maxVelocityY) {
      this.body.velocity.y = this.maxVelocityY;
    }

    //Resetea la velocidad en X si el enemigo no deberia de estar moviendose
    this.setVelocityX(0);
    this;

    //Logica para morir cuando el enemigo pierde toda su vida
    if (this.health <= 0 && !this.stop) {
      this.dead();
    }

    this.pathFind(this.determineTarget());
  }

  pathFind(target) {
    //IA
    if (target) {
      if (target.closestPlayer.x > this.x + 10 && !this.stop) {
        this.flipX = false;
      } else if (target.closestPlayer.x < this.x - 10 && !this.stop) {
        this.flipX = true;
      }
      if (!this.defensive) {
        if (
          this.body.velocity.x == 0 &&
          this.y > target.closestPlayer.y + 10 &&
          target.closestDistance < 300
        ) {
          this.jump();
        }

        if (!this.stop) {
          // Si se encontró un jugador cercano, mover hacia él
          if (target.closestPlayer) {
            if (target.closestPlayer.x > this.x + 10 && !this.stop) {
              this.flipX = false;

              if (this.detectCollision()) {
                this.setVelocityX(this.speed);
              }

              if (this.body.velocity.x !== 0 && this.detectCollision()) {
                this.play("walk", true);
              } else {
                this.play("idle", true);
              }
            } else if (target.closestPlayer.x < this.x - 10 && !this.stop) {
              this.flipX = true;

              if (this.detectCollision()) {
                this.setVelocityX(-this.speed);
              }

              if (this.body.velocity.x !== 0) {
                this.play("walk", true);
              } else {
                this.play("idle", true);
              }
            } else if (!this.stop) {
              this.play("idle", true);
            }

            if (target.closestDistance < this.meleeRange) {
              this.stop = true;
              this.play("attack");

              this.FXsword1.play();
            }
          }
        }
      }
      //Si el enemigo esta a la defensiva se intentara alejar del jugador
      //camiando hacia atras
      else if (target.closestPlayer) {
        if (target.closestPlayer.x > this.x + 10 && !this.stop) {
          this.flipX = false;

          if (this.detectCollision()) {
            this.setVelocityX(-this.speed / 1.5);
          }

          if (this.body.velocity.x !== 0 && this.detectCollision()) {
            this.play("walkReverse", true).reverse = true;
          } else {
            this.play("idle", true);
          }
        } else if (target.closestPlayer.x < this.x - 10 && !this.stop) {
          this.flipX = true;

          if (this.detectCollision()) {
            this.setVelocityX(this.speed / 1.5);
          }

          if (this.body.velocity.x !== 0) {
            this.play("walkReverse", true);
          } else {
            this.play("idle", true);
          }
        }
      }
    }
  }
  determineTarget() {
    this.closestDistance = Infinity;
    this.closestTarget = null;
    // Iterar sobre los hijos del grupo de jugadores
    this.playersGroup.children.iterate((player) => {
      if (player.alive) {
        // Calcular la distancia entre este enemigo y el jugador
        const distance = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          player.x,
          player.y
        );

        // Comprobar si este jugador es el más ceracano
        if (distance < this.closestDistance) {
          this.closestDistance = distance;
          this.closestTarget = player;
        }
      }
    });
    return this.closestTarget
      ? {
          closestDistance: this.closestDistance,
          closestPlayer: this.closestTarget,
        }
      : null;
  }

  detectCollision() {
    return this.scene.physics.overlap(this.pathHitbox, this.scene.colliders);
  }

  //Metodo para matar al enemigo
  dead() {
    this.inmmune = true;
    this.stop = true;
    this.sourceDamage.kill(this);
    this.play("dead", true);
    this.FXscream.play();
  }

  reward() {
    let randomNumber = Math.floor(Math.random() * 4);
    let coins = Math.floor(Math.random() * (200 - 10 + 1)) + 10;

    let key = 0;
    switch (randomNumber) {
      case (0, 1, 2):
        break;

      case 4:
        key++;
        break;
    }

    return { coins, key };
  }

  //Metodo para que el enemigo reciba daño
  takeDamage(damage, sourceDamage) {
    if (this.block && !this.inmmune) {
      this.play("block");
      this.scene.FXparry.play({
        seek: 0.7, // Start playback from 2 seconds
      });
      this.stop = true;
      this.setTint(0xf9f9ff);

      setTimeout(() => {
        this.play("idle");
        this.block = false;
        this.stop = false;
        this.clearTint();
      }, 400);

      setTimeout(() => {
        this.block = true;
      }, 5000);
    } else {
      //Reduce la vida del enemigo
      this.health -= damage;
      //Lo vuelve inmmune momentanemente
      this.inmmune = true;

      //Aplica un ligero empuje en la direccion en la que el jugador
      //Esta atacando para mas dinamismo
      if (this.flipX) {
        this.setVelocityX(-1600);
      } else {
        this.setVelocityX(1600);
      }
      this.setVelocityY(-500);

      //Tiñe temporalmente al enemigo en rojo
      this.setTint(0xff0000);
      //Resetea el tinte y la inmmunidad del enemigo despues de cierto tiempo
      this.reset();
      setTimeout(() => {
        this.clearTint();
        this.inmmune = false;
      }, 400);
      this.sourceDamage = sourceDamage;
      this.scene.playRandomHurtSound();

    }
  }

  //Si el enemigo esta en medio ataque y es atacado, se resetea
  reset() {
    this.attacking = false;
    this.attackingRange = false;
  }
}
