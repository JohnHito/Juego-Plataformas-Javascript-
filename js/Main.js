//Import de clases
import Player from '/js/Player.js';

class Main extends Phaser.Scene {

    //Metodo constructor
    constructor() {
        super({ key: "Main" })
        this.player = null;
    }
    preload() {

        //Se añade el pluguin del joystick
        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);

        //Se precarga la imagen de las plataformas y el spritesheet del jugador
        this.load.image('ground', '/assets/sprites/ground.png');
        this.load.spritesheet("playerSheet", "/assets/sprites/player_sheet-min.png", {
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

        //Crea a un nuevo jugar, y le manda la escena, cordenadas, el sprite shee, el controlador de teclas y el joystick
        this.player = new Player(this, 40, 40, 'playerSheet', this.cursors, this.joystickCursors)

        this.player.scaleX = 0.7;
        this.player.scaleY = 0.7;

        //Crea objectos vacios con fisica estatica      
        this.platform = this.physics.add.staticGroup();
        this.platform2 = this.physics.add.staticGroup();

        //A los objetos anteriores los añade en una posicion y con una textura y los actualiza
        this.platform.create(100, 300, 'ground').refreshBody();  
        this.platform2.create(400, 200, 'ground').refreshBody();  

        //Añade colisiones entre el jugador y las plataformas
        this.physics.add.collider(this.player, this.platform);
        this.physics.add.collider(this.player, this.platform2);
    }

    update() {
        this.player.update();
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
            gravity: { y: 3000},
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