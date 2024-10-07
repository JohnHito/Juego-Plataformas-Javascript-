export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, y, x, key, cursors, joystickCursors) {
        super(scene, y, x, key);
        //Se añade a si mismo a la escena existente
        scene.add.existing(this);

        //Se añade a si mismo a las fisicas de la escena existente
        scene.physics.add.existing(this);

        //Crea variables locales que guarden las variables recibidas por parametro
        this.cursors = cursors;
        this.joystickCursors = joystickCursors;

        //Variables para controlar animaciones
        this.falling = false;
        this.isHitGroundComplete = false;
        this.isJumpComplete = true;
        this.inGround = false;

        //Otras variables
        this.jumps = true;
        this.speed = 100;

        //Llama a la funcion para crear las animaciones
        this.createAnimations();
    }
    createAnimations() {

        //Crea variables constantes con una key, y con los frames necesairos desde el player sheet
        const run = {
            key: "run",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33] }),
            frameRate: 16,
            repeat: -1
        }
        const idle = {
            key: "idle",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [66, 67, 68, 69, 70, 71] }),
            frameRate: 16,
            repeat: -1
        }
        const startJump = {
            key: "startJump",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [44, 45, 46, 47, 48, 49] }),
            frameRate: 16,
            repeat: 0
        }
        const goingUp = {
            key: "goingUp",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [51, 52, 53, 54] }),
            frameRate: 16,
            repeat: -1
        }
        const falling = {
            key: "falling",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [56, 57, 58, 59] }),
            frameRate: 16,
            repeat: -1
        }
        const hitGround = {
            key: "hitGround",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [60, 61, 62, 63, 64] }),
            frameRate: 16,
            repeat: 0
        }
        const attack = {
            key: "attack",
            frames: this.anims.generateFrameNumbers("playerSheet", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }),
            frameRate: 16,
            repeat: 0
        }

        //Utiliza funcciones del Phaser para crear las animaciones anteriormente definidas
        this.anims.create(run)
        this.anims.create(idle)
        this.anims.create(startJump)
        this.anims.create(goingUp)
        this.anims.create(falling)
        this.anims.create(hitGround)
        this.anims.create(attack)
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    update() {
        //Reseta la velocidad en X, de lo conbtrario no se detiene
        this.setVelocityX(0); this

        //Detecta si la animaicon "hitGround" se completo
        this.on('animationcomplete-hitGround', () => {
            this.isHitGroundComplete = true;
        });

        //Control si el jugador esta colisionando con algo
        if (this.body.blocked.down) {
            this.inGround = true;
            this.jumps = true;
        } else {
            this.inGround = false;
        }

        //Control de animacion si el jugador esta saltando
        if (!this.inGround) {
            if (this.body.velocity.y < 0) {
                this.play("goingUp", true);

                //Control de animacion Si el jugador esta callendo
            } else if (this.body.velocity.y > 0) {
                this.play("falling", true);
                this.falling = true;
            }

            //Animacion al caer 
        } else if (this.falling) {
            this.play("hitGround", true);
            this.falling = false;
            this.isHitGroundComplete = false;
        }

        //Controlar animacion idle
        if (this.body.velocity.x == 0 && this.body.velocity.y == 0 && this.isHitGroundComplete && !this.cursors.up.isDown && !this.cursors.down.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.play("idle", true);
        }

        //Control para saltar
        if (this.cursors.up.isDown == true || this.joystickCursors.up.isDown) {
            if (this.jumps) {
                this.setVelocityY(-1000);
                this.jumps = false;
                console.log(this.jumps)
            }

        }

        //Controles de movimiento y animacion de izquierda y derecha
        if (this.cursors.right.isDown == true || this.joystickCursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.flipX = false;
            //Si no esta en el aire, se ejecuta la animacion de correr
            if (this.body.velocity.y == 0) { this.play("run", true); }
        }
        if (this.cursors.left.isDown == true || this.joystickCursors.left.isDown) {
            this.setVelocityX(this.speed*-1);
            this.flipX = true;
            //Si no esta en el aire, se ejecuta la animacion de correr
            if (this.body.velocity.y == 0) { this.play("run", true); }
        }

        //Animacion de ataque
        if (this.cursors.down.isDown == true || this.joystickCursors.down.isDown) {
            this.play("attack", true);
        }



    }
}