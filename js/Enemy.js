export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, y, x, key, player, speed) {
        super(scene, y, x, key);
        //Se añade a si mismo a la escena existente
        scene.add.existing(this);

        //Se añade a si mismo a las fisicas de la escena existente
        scene.physics.add.existing(this);

        //Llama a la funcion para crear las animaciones
        this.createAnimations();

        this.speed = speed;
        this.player = player;
        this.attacking = false;

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
            frameRate: 16,
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
        //Reseta la velocidad en X, de lo conbtrario no se detiene
        this.setVelocityX(0); this

        //IA
        //Si el enemigo esta 
        if (this.attacking) {
            this.play("attack", true);
        } else if (this.player.x > this.x+10) {
            this.setVelocityX(this.speed);
            this.play("walk", true);
            this.flipX = false;
        } else if (this.player.x < this.x-10) {
            this.setVelocityX(this.speed*-1);
            this.play("walk", true);
            this.flipX = true;
        } else {
            this.play("idle", true);

        }

    }
}