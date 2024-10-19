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
        this.jumpHight = 900;
        this.speed = 80;

        //Array de enemigos
        this.enemies = [];

        //Llama a la funcion para crear las animaciones
        this.createAnimations();
    }

    update() {
        //Reseta la velocidad en X, de lo conbtrario no se detiene
        this.setVelocityX(0); this

        //Mueve la hitbox de ataque a su area correspondiente
        this.attackHitbox.x = this.x + (this.flipX ? -80 : 80); //Aqui se usa un Operador Ternario, es como un if, el ? idica si el this.flipX es true va a dar un valor o si es false va a dar el otro
        this.attackHitbox.y = this.y - 20;
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
            this.speed = 300;
        });

        //Control si el jugador esta colisionando con algo
        if (this.body.blocked.down) {
            this.inGround = true;
            setTimeout(() => {
                if (this.body.blocked.down) {
                    this.canJump = true;
                }
            }, 200)

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

        this.btn1.on('pointerdown', () => {
            this.btn1Down = true;
        });
        this.btn1.on('pointerup', () => {
            this.btn1Down = false;
        });
        this.btn2.on('pointerdown', () => {
            this.btn2Down = true;
        });
        this.btn2.on('pointerup', () => {
            this.btn2Down = false;
        });

        //Controlar animacion idle
        if (!this.stop && this.body.velocity.x == 0 && this.body.velocity.y == 0
            && this.isHitGroundComplete && !this.cursors.up.isDown && !this.cursors.down.isDown
            && !this.cursors.left.isDown && !this.cursors.right.isDown && !this.btn2Down
            && !this.btn1Down && !this.joystickCursors.left.isDown && !this.joystickCursors.right.isDown) {

            if (this.hasWeapon) {
                this.play("weaponIdle", true);
            } else {
                this.play("idle", true);
            }

        }

        //Control animacion de ataque
        if (this.attacking) {
            this.play("attack", true);
            if (this.anims.currentAnim.key === 'attack' && this.anims.currentFrame.index === 7) {
                this.checkMeleeCollision();
                this.attackHitbox.play("hammerSmash", true);
                this.scene.cameras.main.shake(180, 0.03);

            }
        }

        //Control para saltar
        if (!this.stop && this.cursors.up.isDown == true || !this.stop && this.btn2Down) {
            if (this.canJump) {
                this.setVelocityY(this.jumpHight * -1);
                this.canJump = true;
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
        if (!this.stop && this.isReadyToAttack()) {
            this.stop = true;
            this.attacking = true;
        }

        //Habilidad especial
        if (!this.stop && this.btn1Down && this.inGround && !this.hasWeapon) {
            this.stop = true;
            this.play("weaponSummon", true);
        }
        if (this.hasWeapon) {
            if (this.body.velocity.y > 1000) {
                this.btn1.setTexture("btn_fall")
            } else {
                this.btn1.setTexture("btn_attack")
            }
        } else {
            this.btn1.setTexture("btn_summon")
        }

        if (this.canJump) {
            this.btn2.setAlpha(0.7);
        } else {
            this.btn2.setAlpha(0.3);
        }
    }
    isReadyToAttack() {
        return (this.cursors.down.isDown && this.inGround && this.hasWeapon && this.isHitGroundComplete) ||
            (this.btn1Down && this.inGround && this.hasWeapon && this.isHitGroundComplete);
    }
    //Crea una hitbox para la deetccion de ataque melee del jugador
    createHitBox(attackHitbox) {
        this.attackHitbox = attackHitbox;
        scene.physics.add.existing(this.attackHitbox);
        this.attackHitbox.body.setAllowGravity(false);
    }

    setControls(cursors, joystickCursors) {
        this.cursors = cursors;
        this.joystickCursors = joystickCursors;
        //Agrega la deteccion de la tecla A
    }

    reset() {
        this.summoning = false;
        this.attacking = false;
        this.stop = false;
    }

    checkMeleeCollision() {
        const meleeBounds = this.attackHitbox.body;
        const enemiesHit = [];
        // Check collisions with enemies only once per attack
        for (let enemy of this.enemies) {
            const enemyBounds = enemy.body;
            if (Phaser.Geom.Intersects.RectangleToRectangle(
                new Phaser.Geom.Rectangle(meleeBounds.x, meleeBounds.y, meleeBounds.width, meleeBounds.height),
                new Phaser.Geom.Rectangle(enemyBounds.x, enemyBounds.y, enemyBounds.width, enemyBounds.height)
            )) {
                if (!enemiesHit.includes(enemy)) { // Avoid hitting the same enemy multiple times
                    enemiesHit.push(enemy);
                    enemy.takeDamage(1); // Deal damage to enemy
                }
            }
        }

        if (enemiesHit.length > 0) {
            console.log('Hit enemies:', enemiesHit);
        }
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

        //Animaciones de salto
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
            frameRate: 18,
            repeat: 0
        }

        //Animaciones de salto con arma
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

}