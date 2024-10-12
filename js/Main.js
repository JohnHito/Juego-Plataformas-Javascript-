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
        this.load.image('button', '/assets/sprites/button.png');
        this.load.image('level1Bg', '/assets/levels/level1.png');

        //Se precarga spritesheet del jugador
        this.load.spritesheet("playerSheet", "/assets/sprites/player_sheet.png", { frameWidth: 270, frameHeight: 164, });
        //Se precarga spritesheet del jugador
        this.load.spritesheet("effect_hammer_smash", "/assets/sprites/hammer_smash.png", { frameWidth: 270, frameHeight: 164, });
        //Se precarga spritesheet del enemigo
        this.load.spritesheet("enemySheet", "/assets/sprites/enemy_sheet.png", { frameWidth: 270, frameHeight: 164, });
        //Se precarga spritesheet del enemigo
        this.load.spritesheet("proyectile", "/assets/sprites/fire_ball.png", { frameWidth: 96, frameHeight: 32, });
    }


    create() {
        //Crea nueva clase de Background, solo agrega la imagen de fondo
        this.bg = new Background(this, 0, 0, 'level1Bg')

        //Crea a un nuevo jugador, y le manda la escena, cordenadas y el sprite sheet
        this.player = new Player(this, 440, 440, 'playerSheet')
        this.player.attackHitbox = new Effect(this, 0, 0, 'effect_hammer_smash')
        this.player.speed = 300;
        this.player.scale = 0.7;
        //Agrega 2 enemigos al array de enemigos
        this.enemies.push(new Enemy(this, 480, 460, 'enemySheet', this.player, 100));
        this.enemies.push(new Enemy(this, 580, 460, 'enemySheet', this.player, 150));
        this.enemies.push(new Enemy(this, 680, 460, 'enemySheet', this.player, 120));
        this.enemies.push(new Enemy(this, 780, 460, 'enemySheet', this.player, 170));
        this.enemies.push(new Enemy(this, 880, 460, 'enemySheet', this.player, 200));


        this.player.enemies = this.enemies

        this.btnA = this.add.sprite(550, 280, 'button').setInteractive();
        this.btnA.setScale(0.5);

        //Controles de teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        //Boton tactil
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        //Crea un joystick para moverse desde celular a partir de un pluguin
        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 80,
            y: 280,
            radius: 80,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 15, 0xcccccc),
        });
        this.joystickCursors = this.joyStick.createCursorKeys();

        this.player.setControls(this.cursors, this.joystickCursors, this.btnA);


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
            debug: false
        }
    }
}

// Create a new Phaser game instance
const game = new Phaser.Game(config);
