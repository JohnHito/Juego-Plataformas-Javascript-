import Proyectile from "/js/entities/Proyectile.js";

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
    this.health = 5;
    this.stop = false;
    this.inmmune = false;
    this.scale = 0.7;
    this.maxVelocityY = 3000;
    this.closestTarget = null;
    this.closestDistance = Infinity;
    this.meleeRange = 100;
    this.attackingRange = 800;
    this.timerStarted = false;
    // Create attack hitbox
    this.pathHitbox = this.scene.add.rectangle(this.x, this.y, 30, 200);
    this.scene.physics.add.existing(this.pathHitbox);
    this.pathHitbox.body.setAllowGravity(false);

    //Si el enemigo esta atacando, detecta si la animacion termino
    this.on("animationcomplete-attack", () => {
      //Cuando la animacion termina, pone a atacando como false
      this.attacking = false;
      this.stop = false;
    });
    this.on("animationcomplete-tpIn", () => {
      //Cuando la animacion termina, pone a atacando como false
      this.stop = false;
    });
    //Si el enemigo esta atacando, detecta si la animacion termino
    this.on("animationcomplete-tpOut", () => {
      //Cuando la animacion termina, pone a atacando como false
      this.teleport(this.closestTarget);
      this.play("tpIn");
    });
    this.on("animationcomplete-attack2", () => {
      //Cuando la animacion termina, pone a atacando como false
      this.attacking = false;
      this.stop = false;
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
        console.log("try attack");
        if (this.closestDistance < this.meleeRange) {
          this.closestTarget.takeDamage(1);
          console.log("ATTACK HIT");
        }
      }
    });

    this.on("animationupdate", (animation, frame) => {
      if (animation.key === "attack2" && frame.index === 8) {
        console.log("try attack");
        this.shotFireBall(this.closestTarget);
      }
    });
  }

  //Crea las animaciones del enemigo
  createAnimations() {
    //Crea variables constantes con una key, y con los frames necesairos desde el player sheet
    const walk = {
      key: "walk",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    };
    const idle = {
      key: "idle",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        start: 13,
        end: 18,
      }),
      frameRate: 16,
      repeat: -1,
    };
    const attack = {
      key: "attack",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        start: 39,
        end: 51,
      }),
      frameRate: 16,
      repeat: 0,
    };
    const attack2 = {
      key: "attack2",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        start: 91,
        end: 103,
      }),
      frameRate: 8,
      repeat: 0,
    };
    const dead = {
      key: "dead",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        start: 26,
        end: 36,
      }),
      frameRate: 8,
      repeat: 0,
    };
    const tpOut = {
      key: "tpOut",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        start: 52,
        end: 77,
      }),
      frameRate: 16,
      repeat: 0,
    };
    const tpIn = {
      key: "tpIn",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        start: 78,
        end: 88,
      }),
      frameRate: 16,
      repeat: 0,
    };

    //Utiliza funcciones del Phaser para crear las animaciones anteriormente definidas
    this.anims.create(walk);
    this.anims.create(tpIn);
    this.anims.create(tpOut);
    this.anims.create(attack);
    this.anims.create(attack2);
    this.anims.create(dead);
    this.anims.create(idle);
    //this.play("dead", true);
  }

  update() {
    if (
      !this.timerStarted &&
      this.closestDistance < this.attackingRange &&
      this.closestDistance > 200
    ) {
      setTimeout(() => {
        const randomNum = Math.floor(Math.random() * 4) + 1;
        switch (randomNum) {
          case 1:
            if (this.scene.projectilesGroup.children.size < 5) {
              this.stop = true;
              this.play("attack2");
            }

            break;
          case 2:
            this.play("tpOut");
            this.stop = true;

            break;
        }

        this.timerStarted = false;
      }, 3000);
      this.timerStarted = true;
    }

    if (this.flipX) {
      this.pathHitbox.x = this.x - 40;
    } else {
      this.pathHitbox.x = this.x + 40;
    }
    this.pathHitbox.y = this.y + 160;

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

  shotFireBall(target) {
    this.proyectile = new Proyectile(this.scene, this.x, this.y, null, target);
    this.scene.projectilesGroup.add(this.proyectile);
  }

  teleport(target) {
    this.x = target.x;
    this.y = target.y - 50;
  }
  pathFind(target) {
    //IA
    if (target) {
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
            console.log(target.closestDistance);
          }
        }
      }
    }
  }
  determineTarget() {
    this.closestDistance = Infinity;
    this.closestTarget = null;
    let secondClosestDistance = Infinity;
    let secondClosestTarget = null;

    // Iterate over the players in the group
    this.playersGroup.children.iterate((player) => {
      // Check if this player has a body
      if (player.alive) {
        const distance = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          player.x,
          player.y
        );

        // Check if this player is the closest so far
        if (distance < this.closestDistance) {
          // Update second closest before updating the closest
          secondClosestDistance = this.closestDistance;
          secondClosestTarget = this.closestTarget;

          // Set new closest player
          this.closestDistance = distance;
          this.closestTarget = player;
        }
        // Check if this is the second closest
        else if (distance < secondClosestDistance) {
          secondClosestDistance = distance;
          secondClosestTarget = player;
        }
      }
    });

    // If the closest target doesn't have a body, fall back to the second closest
    if (!this.closestTarget || !this.closestTarget.alive) {
      this.closestDistance = secondClosestDistance;
      this.closestTarget = secondClosestTarget;
    }

    // Return the closest player with a body, or null if no valid target
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
    this.stop = true;
    this.play("dead", true);
  }

  //Metodo para que el enemigo reciba daño
  takeDamage(damage) {
    if (!this.inmmune) {
      //Reduce la vida del enemigo
      this.health -= damage;
      //Lo vuelve inmmune momentanemente
      this.inmmune = true;

      //Aplica un ligero empuje en la direccion en la que el jugador
      //Esta atacando para mas dinamismo
      if (this.player.flipX) {
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
    }
  }

  //Si el enemigo esta en medio ataque y es atacado, se resetea
  reset() {
    this.attacking = false;
    this.attackingRange = false;
  }
}
