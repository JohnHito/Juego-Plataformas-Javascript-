//Import de clases
import Player from '/js/Player.js';
import Enemy from '/js/Enemy.js';
import Effect from '/js/Effect.js';
import Background from '/js/Background.js';

class Main extends Phaser.Scene {

    //Metodo constructor
    constructor() {
        super({ key: "Main" })

        //Crea una variable de player vaciamomentaneamente
        this.player = null;
        this.bg = null;

        //Crea dos array vacios, uno para las colisiones y otro para los enemigos
        this.enemies = [];

        this.collisions2D = []
        for (let i = 0; i < collisions.length; i += 50) {
            this.collisions2D.push(collisions.slice(i, i + 50))
        }

    }

    preload() {

        //Se añade el pluguin del joystick
        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);

        //Se precarga la imagen de las plataformas
        this.load.image('level1Bg', '/assets/levels/level1.png');

        //Se precarga spritesheet del jugador
        this.load.spritesheet("playerSheet", "/assets/sprites/player_sheet.png", { frameWidth: 270, frameHeight: 164, });
        //Se precarga spritesheet del jugador
        this.load.spritesheet("effect_hammer_smash", "/assets/sprites/hammer_smash.png", { frameWidth: 270, frameHeight: 164, });
        //Se precarga spritesheet del enemigo
        this.load.spritesheet("enemySheet", "/assets/sprites/enemy_sheet.png", { frameWidth: 270, frameHeight: 164, });

        this.load.image("proyectile", "/assets/sprites/fire_ball.png");
        this.load.image("btn_jump", "/assets/sprites/btn_jump.png");
        this.load.image("btn_attack", "/assets/sprites/btn_attack.png");
        this.load.image("btn_summon", "/assets/sprites/btn_summon.png");
        this.load.image("btn_fall", "/assets/sprites/btn_fall.png");
        this.load.image("gui", "/assets/sprites/gui.png");
    }


    create() {
        //Crea nueva clase de Background, solo agrega la imagen de fondo
        this.bg = new Background(this, 0, 0, 'level1Bg')

        //Crea a un nuevo jugador, y le manda la escena, cordenadas y el sprite sheet
        this.player = new Player(this, 440, 440, 'playerSheet')
        this.player.attackHitbox = new Effect(this, 0, 0, 'effect_hammer_smash')
        this.player.speed = 320;
        this.player.scale = 0.7;
        //Agrega 2 enemigos al array de enemigos
        this.enemies.push(new Enemy(this, 480, 460, 'enemySheet', this.player, 100));
        this.enemies.push(new Enemy(this, 580, 460, 'enemySheet', this.player, 150));
        this.enemies.push(new Enemy(this, 680, 460, 'enemySheet', this.player, 120));
        this.enemies.push(new Enemy(this, 780, 460, 'enemySheet', this.player, 170));
        this.enemies.push(new Enemy(this, 880, 460, 'enemySheet', this.player, 200));


        this.player.enemies = this.enemies
        //Controles de teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        //Crea un joystick para moverse desde celular a partir de un pluguin
        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 80,
            y: 280,
            radius: 80,
            base: this.add.circle(0, 0, 70, 0x5C65C0).setAlpha(0.5), // El valor 0.5 hace el color semitransparente
            thumb: this.add.circle(0, 0, 25, 0x6F95FF).setAlpha(0.5),
        });
        this.joystickCursors = this.joyStick.createCursorKeys();

        this.player.setControls(this.cursors, this.joystickCursors);


        this.colliders = this.physics.add.staticGroup();
        this.collisions2D.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                if (symbol === 10) {
                    // Añadir el rectángulo rojo a la física
                    const box = this.colliders.create(colIndex * 32, rowIndex * 32, null)
                        .setOrigin(0, 0)  // Establecer el origen para que sea desde la esquina superior izquierda
                        .setDisplaySize(32, 32) //El tama;o de cada cuadro de colision
                        .refreshBody(); // Refrescar el cuerpo de la física
                    box.setVisible(false);

                    this.physics.add.collider(this.player, this.colliders);
                    this.physics.add.collider(this.enemies, this.colliders);
                }
            });
        });

        //Crea los limites del mundo
        this.physics.world.setBounds(0, 0, this.bg.width, this.bg.height);
        //Agrega limite a la camara, para cuando llegue al borde no se salga
        this.cameras.main.setBounds(0, 0, this.bg.width, this.bg.height);
        //Pone a la camara a seguir al jugador
        this.cameras.main.startFollow(this.player)

        const btn1 = this.add.image(500, 300, 'btn_attack').setInteractive().setScrollFactor(0).setAlpha(0.7);
        const btn2 = this.add.image(560, 200, 'btn_jump').setInteractive().setScrollFactor(0).setAlpha(0.7);
        const gui = this.add.image(140, 60, 'gui').setInteractive().setScrollFactor(0).setAlpha(0.7);
        gui.scale = 0.7

        this.player.btn1=btn1;
        this.player.btn2=btn2;
    }

    update() {
        //Actualzia al jugador
        this.player.update();

        //Recorre el array de enemigos
        this.enemies.forEach(enemy => {
            //por cada enemigo llama al metodo update de este
            if (!enemy.stop) {
                enemy.update();
            }
        });

    }
}


//Array de colisiones
//Configuracion del proyecto
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    backgroundColor: '#2a6c6d',
    scene: Main,
    //Añade fisicas 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 3000 },
            debug: true
        }
    },
    input: {
        activePointers: 5 // Permitir hasta 5 dedos simultáneamente (puedes cambiar este número)
    }
}

// Create a new Phaser game instance
const game = new Phaser.Game(config);
