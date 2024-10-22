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

        this.speed = speed;
        this.player = player;
        this.attacking = false;
        this.attackingRange = false;
        this.health = 5;
        this.stop = false;
        this.inmmune = false;
        this.scale = 0.7
        this.maxVelocityY = 3000;

        this.setDepth(0);

        //Si el enemigo esta atacando
        this.on('animationcomplete-attack', () => {
            this.attacking = false;
        });
        this.on('animationcomplete-dead', () => {
            this.body.destroy()
        });

        this.on('animationupdate', (animation, frame) => {
            if (animation.key === 'attack' && !this.attackingRange && frame.index === 7) {
                if (this.checkMeleeCollision()) {
                    this.player.setVelocityX(this.flipX ? -800 : 800)
                    this.player.setVelocityY(-300)
                    this.player.setTint(0xff0000);
                    this.player.reset()
                    this.scene.cameras.main.shake(50, 0.009);

                    setTimeout(() => {
                        this.player.clearTint()
                    }, 500)
                }
            }
        });
    }
    createAnimations() {

        //Crea variables constantes con una key, y con los frames necesairos desde el player sheet
        const walk = {
            key: "walk",
            frames: this.anims.generateFrameNumbers("enemySheet", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 8,
            repeat: -1
        }
        const idle = {
            key: "idle",
            frames: this.anims.generateFrameNumbers("enemySheet", { frames: [13, 14, 15, 16, 17, 18] }),
            frameRate: 16,
            repeat: -1
        }
        const attack = {
            key: "attack",
            frames: this.anims.generateFrameNumbers("enemySheet", { frames: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51] }),
            frameRate: 20,
            repeat: 0
        }
        const dead = {
            key: "dead",
            frames: this.anims.generateFrameNumbers("enemySheet", { frames: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36] }),
            frameRate: 8,
            repeat: 0
        }


        //Utiliza funcciones del Phaser para crear las animaciones anteriormente definidas
        this.anims.create(walk)
        this.anims.create(attack)
        this.anims.create(dead)
        this.anims.create(idle)
        //this.play("dead", true);

    }

    attack(collision) {
        this.attacking = collision;
    }

    update() {
        if (this.body.velocity.y > this.maxVelocityY) {
            this.body.velocity.y = this.maxVelocityY;
        }
        this.setVelocityX(0); this
        //IA
        if (!this.stop) {
            if (this.checkMeleeCollision()) {
                this.attacking = true;
            }
            

            if (this.attacking) {
                this.play("attack", true);
            }

            if (this.player.x > this.x + 10 && !this.attacking) {
                this.setVelocityX(this.speed);
                if (this.body.velocity.x != 0) {
                    this.play("walk", true);
                } else {
                    this.play("idle", true);
                }
                this.flipX = false;
            } else if (this.player.x < this.x - 10 && !this.attacking) {
                this.setVelocityX(this.speed * -1);
                if (this.body.velocity.x != 0) {
                    this.play("walk", true);
                } else {
                    this.play("idle", true);
                }
                this.flipX = true;
            } else if (!this.attacking) {
                this.play("idle", true);
            }
        }

        if (this.health <= 0 && !this.stop) {
            this.dead()
        }
    }

    dead() {
        this.stop = true;
        this.play("dead", true)
    }
    takeDamage(damage) {
        if (!this.inmmune) {
            this.health -= damage;
            this.inmmune = true;
            if (this.player.flipX) {
                this.setVelocityX(-1600)
            } else {
                this.setVelocityX(1600)
            }

            this.setVelocityY(-500)
            this.setTint(0xff0000);
            this.reset()
            setTimeout(() => {
                this.clearTint()
                this.inmmune = false
            }, 400)
        }
    }

    reset() {
        this.attacking = false;
        this.attackingRange = false;
    }
    //Metodo de checkeo de colisiones
    checkMeleeCollision() {
        const playerBounds = this.player.body;  // Access the player's body hitbox
     
    }
    checkRangeCollision() {
        const playerBounds = this.player.body;  // Access the player's body hitbox
       
    }
}