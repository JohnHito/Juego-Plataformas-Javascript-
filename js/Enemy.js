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

        //Crea una hitbox para la deetccion de ataque melee del enemigo
        this.attackHitbox = scene.add.rectangle(this.x, this.y, 80, 100);
        scene.physics.add.existing(this.attackHitbox);
        this.attackHitbox.body.setAllowGravity(false);

        //Crea una hitbox para la deetccion de ataque a distancia del enemigo
        this.rangeAttackHitbox = scene.add.rectangle(this.x, this.y, 450, 100);
        scene.physics.add.existing(this.rangeAttackHitbox);
        this.rangeAttackHitbox.body.setAllowGravity(false);

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
        this.play("dead", true);

    }

    attack(collision) {
        this.attacking = collision;
    }

    update() {
        this.attackHitbox.x = this.x + (this.flipX ? -40 : 40); //Aqui se usa un Operador Ternario, es como un if, el ? idica si el this.flipX es true va a dar un valor o si es false va a dar el otro
        this.attackHitbox.y = this.y;
        this.rangeAttackHitbox.x = this.x + (this.flipX ? -380 : 380); //Aqui se usa un Operador Ternario, es como un if, el ? idica si el this.flipX es true va a dar un valor o si es false va a dar el otro
        this.rangeAttackHitbox.y = this.y;
        //Reseta la velocidad en X, de lo conbtrario no se detiene
        this.setVelocityX(0); this
        //IA
        if (!this.stop) {
            if (this.checkMeleeCollision()) {
                this.attacking = true;
            }
            //Si el enemigo esta atacando
            this.on('animationcomplete-attack', () => {
                this.attacking = false;
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
        this.attackHitbox.destroy()
        this.rangeAttackHitbox.destroy()
        this.body.destroy()
    }
    takeDamage(damage) {
        if (!this.inmmune) {
            this.health -= damage;
            this.inmmune = true;
            if (this.flipX) {
                this.setVelocityX(-6000)
            } else {
                this.setVelocityX(6000)
            }

            this.setVelocityY(-300)
            this.setTint(0xff0000);
            this.reset()
            setTimeout(() => {
                this.clearTint()
                this.inmmune = false
            }, 1000)
        }
    }

    reset() {
        this.attacking = false;
        this.attackingRange = false;
    }
    //Metodo de checkeo de colisiones
    checkMeleeCollision() {
        const playerBounds = this.player.body;  // Access the player's body hitbox
        const meleBounds = this.attackHitbox.body;    // Access the enemy's body hitbox

        // Check if the hitboxes (bodies) intersect
        return Phaser.Geom.Intersects.RectangleToRectangle(
            new Phaser.Geom.Rectangle(playerBounds.x, playerBounds.y, playerBounds.width, playerBounds.height),
            new Phaser.Geom.Rectangle(meleBounds.x, meleBounds.y, meleBounds.width, meleBounds.height)
        );
    }
    checkRangeCollision() {
        const playerBounds = this.player.body;  // Access the player's body hitbox
        const rangeBounds = this.rangeAttackHitbox.body;    // Access the enemy's body hitbox

        // Check if the hitboxes (bodies) intersect
        return Phaser.Geom.Intersects.RectangleToRectangle(
            new Phaser.Geom.Rectangle(playerBounds.x, playerBounds.y, playerBounds.width, playerBounds.height),
            new Phaser.Geom.Rectangle(rangeBounds.x, rangeBounds.y, rangeBounds.width, rangeBounds.height)
        );
    }
}