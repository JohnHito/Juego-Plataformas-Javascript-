export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, y, x, key,) {
        super(scene, y, x, key);
        //Se añade a si mismo a la escena existente
        scene.add.existing(this);

        //Se añade a si mismo a las fisicas de la escena existente
        scene.physics.add.existing(this);

        //Crea variables locales que guarden las variables recibidas por parametro
        this.cursors = null;
        this.joystickCursors = null;
        //Agrega la deteccion de la tecla A
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        //Variables para controlar animaciones
        this.falling = false;
        this.isHitGroundComplete = false;
        this.isJumpComplete = true;

        //Otras variables
        this.stop = false;
        this.attacking = false;
        this.canJump = true;
        this.hasWeapon = false;
        this.inGround = false;
        this.summoning = false;

        this.jumpHight = 1000;
        this.speed = 70;
        //Llama a la funcion para crear las animaciones
        this.createAnimations();
    }
    createAnimations() {
        //Crea variables constantes con una key, y con los frames necesairos desde el player sheet
        //Animaciones Base
        const run = {
            key: "run",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] }),
            frameRate: 16,
            repeat: -1
        }
        const idle = {
            key: "idle",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [48, 49, 50, 51, 52, 53] }),
            frameRate: 16,
            repeat: -1
        }
        //Animaciones base de salto
        /*const startJump = {
            key: "startJump",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [25, 26, 27, 28, 29] }),
            frameRate: 16,
            repeat: 0
        }*/
        const goingUp = {
            key: "goingUp",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [30] }),
            frameRate: 16,
            repeat: -1
        }
        const falling = {
            key: "falling",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [35] }),
            frameRate: 16,
            repeat: -1
        }
        const hitGround = {
            key: "hitGround",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [40, 41, 42, 43, 44] }),
            frameRate: 18,
            repeat: 0
        }


        //Animaciones con arma
        const weaponSummon = {
            key: "weaponSummon",
            frames: this.anims.generateFrameNumbers("playerSheet", {
                frames: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88]
            }),
            frameRate: 12,
            repeat: 0
        }
        const weaponRun = {
            key: "weaponRun",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107] }),
            frameRate: 18,
            repeat: 0
        }
        const weaponIdle = {
            key: "weaponIdle",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [90, 91, 92, 93] }),
            frameRate: 10,
            repeat: 0
        }
        const attack = {
            key: "attack",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }),
            frameRate: 16,
            repeat: 0
        }
        //Animaciones de salto con arma
        /* const weaponStartJump = {
             key: "startJump",
             frames: this.anims.generateFrameNumbers("playerSheet", { frames: [25, 26, 27, 28, 29] }),
             frameRate: 16,
             repeat: 0
         }*/
        const weaponGoingUp = {
            key: "weaponGoingUp",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [113] }),
            frameRate: 16,
            repeat: -1
        }
        const weaponFalling = {
            key: "weaponFalling",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [120] }),
            frameRate: 16,
            repeat: -1
        }
        const weaponHitGround = {
            key: "weaponHitGround",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [122, 123, 124, 125, 126, 127] }),
            frameRate: 18,
            repeat: 0
        }

        //Utiliza funcciones del Phaser para crear las animaciones anteriormente definidas
        this.anims.create(run)
        this.anims.create(idle)
        this.anims.create(goingUp)
        this.anims.create(falling)
        this.anims.create(hitGround)
        this.anims.create(attack)
        this.anims.create(weaponSummon)
        this.anims.create(weaponRun)
        this.anims.create(weaponIdle)
        this.anims.create(weaponGoingUp)
        this.anims.create(weaponFalling)
        this.anims.create(weaponHitGround)
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setControls(cursors, joystickCursors, btnA) {
        this.cursors = cursors;
        this.joystickCursors = joystickCursors;
        this.btnA = btnA;
        //Agrega la deteccion de la tecla A
    }

    update() {
        //Reseta la velocidad en X, de lo conbtrario no se detiene
        this.setVelocityX(0); this

        //Detecta si una animacion se termino. para ejecutar algo
        this.on('animationcomplete-hitGround', () => {
            this.isHitGroundComplete = true;
        });
        this.on('animationcomplete-weaponHitGround', () => {
            this.isHitGroundComplete = true;
        });
        this.on('animationcomplete-attack', () => {
            this.stop = false;
            this.attacking = false;
        });
        this.on('animationcomplete-weaponSummon', () => {
            this.stop = false;
            this.hasWeapon = true;
            this.setSpeed(200);
        });

        //Control si el jugador esta colisionando con algo
        if (this.body.blocked.down) {
            this.inGround = true;
            this.canJump = true;
        } else {
            this.inGround = false;
        }

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
        if (!this.stop && this.body.velocity.x == 0 && this.body.velocity.y == 0
            && this.isHitGroundComplete && !this.cursors.up.isDown && !this.cursors.down.isDown
            && !this.cursors.left.isDown && !this.cursors.right.isDown && !this.joystickCursors.up.isDown
            && !this.joystickCursors.down.isDown && !this.joystickCursors.left.isDown && !this.joystickCursors.right.isDown) {

            if (this.hasWeapon) {
                this.play("weaponIdle", true);
            } else {
                this.play("idle", true);
            }

        }

        //Control animacion de ataque
        if (this.attacking) { this.play("attack", true); }

        //Control para saltar
        if (!this.stop && this.cursors.up.isDown == true || !this.stop && this.joystickCursors.up.isDown) {
            if (this.canJump) {
                this.setVelocityY(this.jumpHight * -1);
                this.canJump = false;
                console.log(this.canJump)
            }

        }

        //Controles de movimiento y animacion de izquierda y derecha
        if (!this.stop && this.cursors.right.isDown == true || !this.stop && this.joystickCursors.right.isDown) {
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
        if (!this.stop && this.cursors.left.isDown == true || !this.stop && this.joystickCursors.left.isDown) {
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
        if (!this.stop && this.cursors.down.isDown == true && this.inGround && this.hasWeapon || !this.stop && this.joystickCursors.down.isDown && this.inGround && this.hasWeapon) {
            if (this.isHitGroundComplete) {
                this.stop = true;
                this.attacking = true;
            }

        }

        //Habilidad especial
        if (!this.stop && this.keyA.isDown && this.inGround && !this.hasWeapon) {
            this.stop = true;
            this.play("weaponSummon", true);
        }

        this.btnA.on('pointerdown', () => {
            if (!this.stop && this.inGround && !this.hasWeapon) {
                this.stop = true;
                this.play("weaponSummon", true);
            }

        });


    }
}