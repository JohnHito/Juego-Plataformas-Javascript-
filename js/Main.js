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

        //Se precarga spritesheet del jugador
        this.load.spritesheet("playerSheet", "/assets/sprites/player_sheet-min.png", {
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
        //Crea la detecicon de teclas
        this.cursors = this.input.keyboard.createCursorKeys();

        //Crea un joystick para moverse desde celular a partir de un pluguin
        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 80,
            y: 280,
            radius: 80,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 15, 0xcccccc),
        });
        this.joystickCursors = this.joyStick.createCursorKeys();

        //Crea a un nuevo jugador, y le manda la escena, cordenadas, el sprite sheet, el controlador de teclas y el joystick
        this.player = new Player(this, 40, 40, 'playerSheet', this.cursors, this.joystickCursors)
        this.player.setSpeed(600);
        
        //escala el tamaño del jugador
        this.player.scale = 0.7;

        //Agrega 2 enemigos al array de enemigos
        this.enemies.push(new Enemy(this, 80, 60, 'enemySheet', this.player, 50));
        this.enemies.push(new Enemy(this, 80, 60, 'enemySheet', this.player, 150));
        //escala a los 2 enemigos
        this.enemies[0].scale = 0.7;
        this.enemies[1].scale = 0.6;

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


/*
let player;
let cursors;

// Preload function (if you want to load images or assets, put it here)
function preload() { }

// Create function to set up the player and controls
function create() {
    // Create the player as a simple rectangle using graphics
    const graphics = this.add.graphics({ fillStyle: { color: 0x00ff00 } }); // Green rectangle
    graphics.fillRect(0, 0, 50, 50); // Rectangle at position (0, 0), with width 50 and height 50

    // Add physics body to the player
    player = this.physics.add.existing(graphics);
    player.body.setCollideWorldBounds(true); // Prevent the player from leaving the game bounds

    // Enable keyboard input (arrow keys)
    cursors = this.input.keyboard.createCursorKeys();

    // Optional: If you want to use WASD controls too
    this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
}

// Update function, runs every frame
function update() {
    const speed = 2000; // Player movement speed

    // Reset the player's velocity to 0 (so they stop when no keys are pressed)
    player.body.setVelocity(0);

    // Move left/right
    if (cursors.left.isDown || this.input.keyboard.keys[65].isDown) { // Arrow key left or 'A'
        player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown || this.input.keyboard.keys[68].isDown) { // Arrow key right or 'D'
        player.body.setVelocityX(speed);
    }

    // Move up/down
    if (cursors.up.isDown || this.input.keyboard.keys[87].isDown) { // Arrow key up or 'W'
        player.body.setVelocityY(-speed * 20);
    } else if (cursors.down.isDown || this.input.keyboard.keys[83].isDown) { // Arrow key down or 'S'
        player.body.setVelocityY(speed);
    }
}
*/