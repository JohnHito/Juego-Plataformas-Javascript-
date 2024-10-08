//Import de clases
import Player from '/js/Player.js';
import Enemy from '/js/Enemy.js';

class Main extends Phaser.Scene {

    //Metodo constructor
    constructor() {
        super({ key: "Main" })
        //Crea una variable de player vaciamomentaneamente
        this.player = null;

        //Crea dos array vacios, uno para las colisiones y otro para los enemigos
        this.platforms = [];
        this.enemies = [];
    }
    preload() {

        //Se añade el pluguin del joystick
        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);

        //Se precarga la imagen de las plataformas
        this.load.image('ground', '/assets/sprites/ground.png');
        this.load.image('button', '/assets/sprites/button.png');

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

        //Crea a un nuevo jugador, y le manda la escena, cordenadas y el sprite sheet
        this.player = new Player(this, 40, 40, 'playerSheet')
        this.player.setSpeed(400);

        //escala el tamaño del jugador
        this.player.scale = 0.7;


        //Agrega 2 enemigos al array de enemigos
        this.enemies.push(new Enemy(this, 80, 60, 'enemySheet', this.player, 50));
        /*
        this.enemies.push(new Enemy(this, 90, 60, 'enemySheet', this.player, 150));
        this.enemies.push(new Enemy(this, 100, 60, 'enemySheet', this.player, 10));
        this.enemies.push(new Enemy(this, 120, 60, 'enemySheet', this.player, 80));
        this.enemies.push(new Enemy(this, 130, 60, 'enemySheet', this.player, 100));
        */
        //escala a los 2 enemigos
        this.enemies[0].scale = 0.7;
        /*
        this.enemies[1].scale = 0.6;
        this.enemies[2].scale = 0.55;
        this.enemies[3].scale = 0.5;
        this.enemies[4].scale = 0.45;
        */


        //Crea un array de cprdenadas para las plataformas
        const platformPositions = [
            { x: 100, y: 300 },
            { x: 260, y: 300 },
            { x: 420, y: 300 },
            { x: 580, y: 300 },
            { x: 320, y: 150 }
        ];

        // Crea las plataformas a partir de las coordenadas del array anterior y también las añade al mundo físico
        platformPositions.forEach(pos => {
            //Crea una plataforma vacia estatica
            const platform = this.physics.add.staticGroup();
            //Crea la plataforma en la escena con sus cordenadas y textura
            platform.create(pos.x, pos.y, 'ground').refreshBody();
            //añade esta plataforma al array de plataformas
            this.platforms.push(platform);
        });

        //Recorre el array de plataformas y le añade colision con el jugador a cada una
        this.platforms.forEach(platform => {
            this.physics.add.collider(this.player, platform);
        });

        //Recorre el array de enemigos, y por cada enemigo recorre el array de plataformas y le agrega colision
        this.enemies.forEach(enemy => {
            this.platforms.forEach(platform => {
                this.physics.add.collider(enemy, platform);
            });
        });

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
            } else {
                enemy.attack(false);
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
            debug: false
        }
    }
}

// Create a new Phaser game instance
const game = new Phaser.Game(config);
