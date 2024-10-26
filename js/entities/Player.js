import Effect from "/js/entities/Effect.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, y, x, key) {
    super(scene, y, x, key);
    //Se añade a si mismo a la escena existente
    scene.add.existing(this);
    this.scene = scene;

    //Se añade a si mismo a las fisicas de la escena existente
    scene.physics.add.existing(this);

    //Modifica el tamaño de la hitbox del jugador
    this.body.setSize(50, 125);
    this.body.setOffset(110, 40);

    //Variables
    //Controles / GUI
    this.cursors = null;
    this.joystickCursors = null;
    this.btn1Down = false;
    this.btn2Down = false;
    this.btn1 = null;
    this.btn2 = null;

    //Control para animaciones y mecanicas
    this.falling = false;
    this.isHitGroundComplete = false;
    this.isJumpComplete = true;
    this.attacking = false;
    this.canJump = true;
    this.hasWeapon = false;
    this.inGround = false;
    this.summoning = false;
    this.stop = false;

    //Atributos del personaje
    this.jumpHight = 1100;
    this.speed = 350;
    this.maxVelocityY = 3000;
    this.inmmune = false;
    this.scale = 0.7;
    this.attackHitbox = new Effect(this.scene, 0, 0, "effect_hammer_smash");

    //Array de enemigos
    this.enemies = null;

    //Llama a la funcion para crear las animaciones
    this.createAnimations();

    this.normalTint=null;
  }

  controlFisicas() {
    //Limita la velocidad maxima a la que el jugador puede caer
    if (this.body.velocity.y > this.maxVelocityY) {
      this.body.velocity.y = this.maxVelocityY;
    }
    //Reseta la velocidad en X, de lo contrario no se detiene
    this.setVelocityX(0);
    this;

    //Mueve la hitbox de ataque a su area correspondiente
    this.attackHitbox.x = this.x + (this.flipX ? -80 : 80); //Aqui se usa un Operador Ternario, es como un if, el ? idica si el this.flipX es true va a dar un valor o si es false va a dar el otro
    this.attackHitbox.y = this.y - 20;
  }

  controlAnimaciones() {
    //Detectan si una animacion se termino. para ejecutar algo
    //Detecta la animacion del jugador para caer al suelo
    this.on("animationcomplete-hitGround", () => {
      this.isHitGroundComplete = true;
    });
    this.on("animationcomplete-weaponHitGround", () => {
      this.isHitGroundComplete = true;
    });

    //Si termino de atacar
    this.on("animationcomplete-attack", () => {
      this.stop = false;
      this.attacking = false;
    });
    //Si termino de invocar el arma
    this.on("animationcomplete-weaponSummon", () => {
      this.stop = false;
      this.hasWeapon = true;
      this.speed = 300;
    });
    //Control de animacion si el jugador esta saltando
    if (!this.inGround) {
      if (this.body.velocity.y < 0) {
        if (this.hasWeapon) {
          this.play("weaponGoingUp", true);
        } else {
          this.play("goingUp", true);
        }

        //Control de animacion Si el jugador esta callendo
      } else if (this.body.velocity.y > 0) {
        if (this.hasWeapon) {
          this.play("weaponFalling", true);
        } else {
          this.play("falling", true);
        }
        this.falling = true;
      }

      //Animacion al caer
    } else if (this.falling) {
      if (this.hasWeapon) {
        this.play("weaponHitGround", true);
      } else {
        this.play("hitGround", true);
      }
      this.falling = false;
      this.isHitGroundComplete = false;
    }

    //Controlar animacion idle
    if (
      !this.stop &&
      this.body.velocity.x == 0 &&
      this.body.velocity.y == 0 &&
      this.isHitGroundComplete &&
      !this.cursors.up.isDown &&
      !this.cursors.down.isDown &&
      !this.cursors.left.isDown &&
      !this.cursors.right.isDown &&
      !this.btn2Down &&
      !this.btn1Down
    ) {
      if (this.hasWeapon) {
        this.play("weaponIdle", true);
      } else {
        this.play("idle", true);
      }
    }
  }

  controlMovimiento1() {
    //Control si el jugador esta colisionando con el suelo
    if (this.body.blocked.down) {
      this.inGround = true;

      //Espera un momento para resetearle el salto al jugador
      setTimeout(() => {
        if (this.body.blocked.down) {
          this.canJump = true;
        }
      }, 200);
    } else {
      this.inGround = false;
    }

    // Control animation of attack
    if (this.attacking) {
      this.play("attack", true);
      //Detecta si la animacion de ataque esta en un frame especifico
      if (
        this.anims.currentAnim.key === "attack" &&
        this.anims.currentFrame.index === 7
      ) {
        //Reactiva la colision de ataque
        this.attackHitbox.body.enable = true;
        //Utiliza los grupos de phaser para detectar si esta colisionando con un enemigo, y llama al metodo onEnemyHit
        this.scene.physics.add.overlap(
          this.attackHitbox,
          this.enemies,
          this.onEnemyHit,
          null,
          this
        );
        //Reproduce el efecto de "explosion" en la colision de ataque
        this.attackHitbox.play("hammerSmash", true);
        //Hace un ligero movimiento de la camara para dar un efecto visual
        this.scene.cameras.main.shake(180, 0.03);
      }
    } else {
      //Desactiva la hitbox del ataque para reducir gasto de recursos
      this.attackHitbox.body.enable = false;
    }

    //Control para saltar
    if (
      (!this.stop && this.cursors.up.isDown == true) ||
      (!this.stop && this.btn2Down)
    ) {
      if (this.canJump) {
        this.setVelocityY(this.jumpHight * -1);
        this.canJump = true;
        console.log(this.canJump);
      }
    }
    //Control de los controles en pantalla para celular
    /*this.btn1.on("pointerdown", () => {
      this.btn1Down = true;
    });
    this.btn1.on("pointerup", () => {
      this.btn1Down = false;
    });
    this.btn2.on("pointerdown", () => {
      this.btn2Down = true;
    });
    this.btn2.on("pointerup", () => {
      this.btn2Down = false;
    });*/

    //Controles de movimiento y animacion de derecha
    if (
      (!this.stop && this.cursors.right.isDown == true) ||
      (!this.stop && this.joystickCursors.right.isDown)
    ) {
      this.setVelocityX(this.speed);
      this.flipX = false;
      //Si no esta en el aire y ya termino la animacion de caer se ejecuta la animacion de correr
      if (this.body.velocity.y == 0 && this.isHitGroundComplete) {
        if (this.hasWeapon) {
          this.play("weaponRun", true);
        } else {
          this.play("run", true);
        }
      }
    }
    //Controles de movimiento y animacion de izquierda
    if (
      (!this.stop && this.cursors.left.isDown == true) ||
      (!this.stop && this.joystickCursors.left.isDown)
    ) {
      this.setVelocityX(this.speed * -1);
      this.flipX = true;
      //Si no esta en el aire y ya termino la animacion de caer se ejecuta la animacion de correr
      if (this.body.velocity.y == 0 && this.isHitGroundComplete) {
        if (this.hasWeapon) {
          this.play("weaponRun", true);
        } else {
          this.play("run", true);
        }
      }
    }

    //Animacion de ataque
    if (!this.stop && this.isReadyToAttack()) {
      this.stop = true;
      this.attacking = true;
    }

    //Habilidad especial de invocar el arma
    if (!this.stop && this.btn1Down && this.inGround && !this.hasWeapon) {
      this.stop = true;
      this.play("weaponSummon", true);
    }
    //Control de los botones de gui en celular
    if (this.hasWeapon) {
      if (this.body.velocity.y > 1000) {
        this.btn1.setTexture("btn_fall");
      } else {
        this.btn1.setTexture("btn_attack");
      }
    } else {
      this.btn1.setTexture("btn_summon");
    }
    if (this.canJump) {
      this.btn2.setAlpha(0.7);
    } else {
      this.btn2.setAlpha(0.3);
    }
  }
  controlMovimiento() {
    //Control si el jugador esta colisionando con el suelo
    if (this.body.blocked.down) {
      this.inGround = true;

      //Espera un momento para resetearle el salto al jugador
      setTimeout(() => {
        if (this.body.blocked.down) {
          this.canJump = true;
        }
      }, 200);
    } else {
      this.inGround = false;
    }

    // Control animation of attack
    if (this.attacking) {
      this.play("attack", true);
      //Detecta si la animacion de ataque esta en un frame especifico
      if (
        this.anims.currentAnim.key === "attack" &&
        this.anims.currentFrame.index === 7
      ) {
        //Reactiva la colision de ataque
        this.attackHitbox.body.enable = true;
        //Utiliza los grupos de phaser para detectar si esta colisionando con un enemigo, y llama al metodo onEnemyHit
        this.scene.physics.add.overlap(
          this.attackHitbox,
          this.enemies,
          this.onEnemyHit,
          null,
          this
        );
        //Reproduce el efecto de "explosion" en la colision de ataque
        this.attackHitbox.play("hammerSmash", true);
        //Hace un ligero movimiento de la camara para dar un efecto visual
        this.scene.cameras.main.shake(180, 0.03);
      }
    } else {
      //Desactiva la hitbox del ataque para reducir gasto de recursos
      this.attackHitbox.body.enable = false;
    }

    //Control para saltar
    if (
      (!this.stop && this.cursors.up.isDown == true) ||
      (!this.stop && this.btn2Down)
    ) {
      if (this.canJump) {
        this.setVelocityY(this.jumpHight * -1);
        this.canJump = false;
        console.log(this.canJump);
      }
    }
    //Controles de movimiento y animacion de derecha
    if (!this.stop && this.cursors.right.isDown == true) {
      this.setVelocityX(this.speed);
      this.flipX = false;
      //Si no esta en el aire y ya termino la animacion de caer se ejecuta la animacion de correr
      if (this.body.velocity.y == 0 && this.isHitGroundComplete) {
        if (this.hasWeapon) {
          this.play("weaponRun", true);
        } else {
          this.play("run", true);
        }
      }
    }
    //Controles de movimiento y animacion de izquierda
    if (!this.stop && this.cursors.left.isDown == true) {
      this.setVelocityX(this.speed * -1);
      this.flipX = true;
      //Si no esta en el aire y ya termino la animacion de caer se ejecuta la animacion de correr
      if (this.body.velocity.y == 0 && this.isHitGroundComplete) {
        if (this.hasWeapon) {
          this.play("weaponRun", true);
        } else {
          this.play("run", true);
        }
      }
    }

    //Animacion de ataque
    if (!this.stop && this.isReadyToAttack()) {
      this.stop = true;
      this.attacking = true;
    }

    //Habilidad especial de invocar el arma
    if (!this.stop && this.btn1Down && this.inGround && !this.hasWeapon) {
      this.stop = true;
      this.play("weaponSummon", true);
    }
    //Control de los botones de gui en celular
    if (this.hasWeapon) {
      if (this.body.velocity.y > 1000) {
        this.btn1.setTexture("btn_fall");
      } else {
       //! this.btn1.setTexture("btn_attack");
      }
    } else {
     //! this.btn1.setTexture("btn_summon");
    }
    if (this.canJump) {
     //! this.btn2.setAlpha(0.7);
    } else {
      //!this.btn2.setAlpha(0.3);
    }
  }
  update() {
    this.controlFisicas();
    this.controlAnimaciones();
    this.controlMovimiento();
  }

  onEnemyHit(attackHitbox, enemy) {
    //Provoca daño al enemigo
    enemy.takeDamage(1);
    console.log("Enemy hit!");
    //Apaga la hitbox de ataque para reducir consumo de recursos
    this.attackHitbox.body.enable = false;
  }

  //Controla si el jugador puede atacar
  isReadyToAttack() {
    return (
      (this.cursors.down.isDown &&
        this.inGround &&
        this.hasWeapon &&
        this.isHitGroundComplete) ||
      (this.btn1Down &&
        this.inGround &&
        this.hasWeapon &&
        this.isHitGroundComplete)
    );
  }
  //Crea una hitbox para la deetccion de ataque melee del jugador
  createHitBox(attackHitbox) {
    this.attackHitbox = attackHitbox;
    scene.physics.add.existing(this.attackHitbox);
    this.attackHitbox.body.setAllowGravity(false);
  }

  //Metodo para guardar los controles y controlarlos deste esta misma clase
  //!Original v
  /*!setControls(cursors, joystickCursors) {
        this.cursors = cursors;
        this.joystickCursors = joystickCursors;
    }*/
  setControls(cursors, btn1, btn2) {
    this.cursors = cursors;
    this.btn1 = btn1;
    this.btn2 = btn2;
  }
  //Metodo para que el jugador tome daño
  takeDamage(damage) {
    if (!this.inmmune) {
      this.health -= damage;
      this.inmmune = true;
      if (this.flipX) {
        this.setVelocityX(1600);
      } else {
        this.setVelocityX(-1600);
      }

      this.setVelocityY(-500);
      this.setTint(0xff0000);
      this.reset();
      setTimeout(() => {
        if(this.normalTint){
          this.setTint(this.normalTint);
        }else{ this.clearTint();}
        this.inmmune = false;
      }, 100);
    }
  }

  //Resetea al jugador concelando lo que este haciendo si es atacado
  reset() {
    this.summoning = false;
    this.attacking = false;
    this.stop = false;
  }

  createAnimations() {
    //Crea variables constantes con una key, y con los frames necesairos desde el player sheet
    //Animaciones Base
    const run = {
      key: "run",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      }),
      frameRate: 16,
      repeat: -1,
    };
    const idle = {
      key: "idle",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [48, 49, 50, 51, 52, 53],
      }),
      frameRate: 16,
      repeat: -1,
    };

    //Animaciones de salto
    const goingUp = {
      key: "goingUp",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [30] }),
      frameRate: 16,
      repeat: -1,
    };
    const falling = {
      key: "falling",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [35] }),
      frameRate: 16,
      repeat: -1,
    };
    const hitGround = {
      key: "hitGround",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [40, 41, 42, 43, 44],
      }),
      frameRate: 18,
      repeat: 0,
    };

    //Animaciones con arma
    const weaponSummon = {
      key: "weaponSummon",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [
          56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
          73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88,
        ],
      }),
      frameRate: 12,
      repeat: 0,
    };
    const weaponRun = {
      key: "weaponRun",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107],
      }),
      frameRate: 18,
      repeat: 0,
    };
    const weaponIdle = {
      key: "weaponIdle",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [90, 91, 92, 93],
      }),
      frameRate: 10,
      repeat: 0,
    };
    const attack = {
      key: "attack",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      }),
      frameRate: 18,
      repeat: 0,
    };

    //Animaciones de salto con arma
    const weaponGoingUp = {
      key: "weaponGoingUp",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [113] }),
      frameRate: 16,
      repeat: -1,
    };
    const weaponFalling = {
      key: "weaponFalling",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [120] }),
      frameRate: 16,
      repeat: -1,
    };
    const weaponHitGround = {
      key: "weaponHitGround",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [122, 123, 124, 125, 126, 127],
      }),
      frameRate: 18,
      repeat: 0,
    };

    //Utiliza funcciones del Phaser para crear las animaciones anteriormente definidas
    this.anims.create(run);
    this.anims.create(idle);
    this.anims.create(goingUp);
    this.anims.create(falling);
    this.anims.create(hitGround);
    this.anims.create(attack);
    this.anims.create(weaponSummon);
    this.anims.create(weaponRun);
    this.anims.create(weaponIdle);
    this.anims.create(weaponGoingUp);
    this.anims.create(weaponFalling);
    this.anims.create(weaponHitGround);
  }
}
