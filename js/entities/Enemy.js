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
    this.closestPlayer = null;
    this.closestDistance = Infinity;

    //Si el enemigo esta atacando, detecta si la animacion termino
    this.on("animationcomplete-attack", () => {
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
      console.log("Checking closest player:", this.closestPlayer);

      console.log(animation.key +" : "+ this.anims.currentFrame.index)
      if (animation.key === "attack" && frame.index === 7) {
        console.log("try attack");
        
          this.closestPlayer.takeDamage(1);
          console.log("ATTACK HIT", this.anims.currentFrame.index);
        
      }
      this.closestDistance = Infinity;
      this.closestPlayer = null;
    });
  }

  //Metodo de checkeo de colisiones, Desabilitados por ahora
  checkMeleeCollision() {
    //const playerBounds = this.player.body;
  }
  checkRangeCollision() {
    //const playerBounds = this.player.body;
  }

  //Crea las animaciones del enemigo
  createAnimations() {
    //Crea variables constantes con una key, y con los frames necesairos desde el player sheet
    const walk = {
      key: "walk",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
      }),
      frameRate: 8,
      repeat: -1,
    };
    const idle = {
      key: "idle",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        frames: [13, 14, 15, 16, 17, 18],
      }),
      frameRate: 16,
      repeat: -1,
    };
    const attack = {
      key: "attack",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        frames: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
      }),
      frameRate: 16,
      repeat: 0,
    };
    const dead = {
      key: "dead",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        frames: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
      }),
      frameRate: 8,
      repeat: 0,
    };

    //Utiliza funcciones del Phaser para crear las animaciones anteriormente definidas
    this.anims.create(walk);
    this.anims.create(attack);
    this.anims.create(dead);
    this.anims.create(idle);
    //this.play("dead", true);
  }

  //Desabilitado por ahora
  attack(collision) {
    this.attacking = collision;
  }

  update() {
    
    //Limita la velocidad maxima a la que el enemigo puede caer
    if (this.body.velocity.y > this.maxVelocityY) {
      this.body.velocity.y = this.maxVelocityY;
    }
    //Resetea la velocidad en X si el enemigo no deberia de estar moviendose
    this.setVelocityX(0);
    this;

    //IA
    if (!this.stop) {
      // Iterar sobre los hijos del grupo de jugadores
      this.playersGroup.children.iterate((player) => {
        // Calcular la distancia entre este enemigo y el jugador
        const distance = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          player.x,
          player.y
        );

        // Comprobar si este jugador es el más cercano
        if (distance < this.closestDistance) {
          this.closestDistance = distance;
          this.closestPlayer = player;
        }
      });

      // Si se encontró un jugador cercano, mover hacia él
      if (this.closestPlayer) {
        if (this.closestPlayer.x > this.x + 10 && !this.stop) {
          this.setVelocityX(this.speed);
          if (this.body.velocity.x !== 0) {
            this.play("walk", true);
          } else {
            this.play("idle", true);
          }
          this.flipX = false;
        } else if (this.closestPlayer.x < this.x - 10 && !this.stop) {
          this.setVelocityX(-this.speed);
          if (this.body.velocity.x !== 0) {
            this.play("walk", true);
          } else {
            this.play("idle", true);
          }
          this.flipX = true;
        } else if (!this.stop) {
          this.play("idle", true);
        }

        if (this.closestDistance < 50) {
          this.stop = true;
          this.play("attack");
          console.log(this.closestDistance);
        }
      }
    }

    //Logica para morir cuando el enemigo pierde toda su vida
    if (this.health <= 0 && !this.stop) {
      this.dead();
    }
  }

  //MNetodo para matar al enemigo
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
