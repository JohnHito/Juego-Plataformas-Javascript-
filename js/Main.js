//Import de clases
import Player from '/js/Player.js';
import Enemy from '/js/Enemy.js';
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
        this.load.spritesheet("playerSheet", "/assets/sprites/player_sheet.png", {
            //Se mandan las dimensiones de la mascara para cada frame de las animaciones
            frameWidth: 270,
            frameHeight: 164,
        });

        //Se precarga spritesheet del enemigo
        this.load.spritesheet("enemySheet", "/assets/sprites/enemy_sheet.png", {
            //Se mandan las dimensiones de la mascara para cada frame de las animaciones
            frameWidth: 270,
            frameHeight: 164,
        });
    }


    create() {
        //Crea nueva clase de Background, solo agrega la imagen de fondo
        this.bg = new Background(this, 0, 0, 'level1Bg')

        //Crea a un nuevo jugador, y le manda la escena, cordenadas y el sprite sheet
        this.player = new Player(this, 440, 440, 'playerSheet')
        this.player.setSpeed(400);
        this.player.scale = 0.7;

        //Agrega 2 enemigos al array de enemigos
        this.enemies.push(new Enemy(this, 480, 460, 'enemySheet', this.player, 100));
        this.enemies[0].scale = 0.7;
          

        this.btnA = this.add.sprite(550, 280, 'button').setInteractive();
        this.btnA.setScale(0.5);

        //Controles de teclado
        this.cursors = this.input.keyboard.createCursorKeys();
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
        // Iterate over the collisions2D array to draw red rectangles for elements with a value of 10
      
      
        this.colliders = this.physics.add.staticGroup();

        this.collisions2D.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                if (symbol === 10) {
                    // Añadir el rectángulo rojo a la física
                    const box = this.colliders.create(colIndex * 32, rowIndex * 32, null)
                        .setOrigin(0, 0)  // Establecer el origen para que sea desde la esquina superior izquierda
                        .setDisplaySize(32, 32)
                        .refreshBody(); // Refrescar el cuerpo de la física
                        box.setVisible(false);

                    this.physics.add.collider(this.player, this.colliders);
                    this.physics.add.collider(this.enemies, this.colliders);
                }
            });
        });

        
        this.physics.world.setBounds(0, 0, this.bg.width, this.bg.height);
        this.cameras.main.setBounds(0, 0, this.bg.width, this.bg.height);
        this.cameras.main.startFollow(this.player)
    }

    update() {
        this.player.update();

        //Recorre el array de enemigos
        this.enemies.forEach(enemy => {
            //por cada enemigo llama al metodo update de este
            enemy.update();
            //Por cada enemigo checa si hay colision con el jugador y le manda la informacion al enemigo
            if (this.checkCollision(this.player, enemy)) {
                enemy.attack(true);
            }
        });

    }

    //Metodo de checkeo de colisiones
    checkCollision(player, enemy) {
        const playerBounds = player.getBounds();
        const enemyBounds = enemy.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, enemyBounds);
    }
}

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
    }
}

// Create a new Phaser game instance
const game = new Phaser.Game(config);
