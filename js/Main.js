// Game configuration
import Player from '/js/Player.js';
//import playerSheet from "/assets/sprites/player_sheet.png";

class Main extends Phaser.Scene {


    constructor() {
        super({ key: "Main" })
        this.player = null;
        this.falling = false;
        this.isHitGroundComplete = false;
        this.isJumpComplete = false;
    }
    preload() {

        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);

        this.load.image('ground', '/assets/sprites/ground.png');
        let playerSheet = this.load.spritesheet("playerSheet", "/assets/sprites/player_sheet-min.png", {

            frameWidth: 270,
            frameHeight: 164,
        });
    }


    create() {

        



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

        this.anims.create(run)
        this.anims.create(idle)
        this.anims.create(startJump)
        this.anims.create(goingUp)
        this.anims.create(falling)
        this.anims.create(hitGround)
        this.anims.create(attack)

        this.player = this.physics.add.sprite(100, 100, "playerSheet");

        this.player.play("idle", true)

        this.player.on('animationcomplete-hitGround', () => {
            this.isHitGroundComplete = true; // Set flag to true when animation completes
        });
        this.player.on('animationcomplete-startJump', () => {
            this.isJumpComplete = true; // Set flag to true when animation completes
        });

        //Align.scaleToGameW(this.player,0.15,this)
        this.cursors = this.input.keyboard.createCursorKeys();

        this.platform = this.physics.add.staticGroup();
        this.platform2 = this.physics.add.staticGroup();
        this.platform.create(100, 300, 'ground').refreshBody();  // Static platform
        this.platform2.create(400, 200, 'ground').refreshBody();  // Static platform
        // Add collision between the player and the static platform
        this.physics.add.collider(this.player, this.platform);
        this.physics.add.collider(this.player, this.platform2);

        this.player.scaleX = 0.7;
        this.player.scaleY = 0.7;

        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 80,
            y: 280,
            radius: 80,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 15, 0xcccccc),
        });
        this.joystickCursors = this.joyStick.createCursorKeys();
    }

    message() {
        this.player.play("run", true)
    }
    update() {
        this.player.update();

        this.player.setVelocityX(0); this


        if (!this.player.body.blocked.down) {
            if (this.player.body.velocity.y < 0) {
                this.player.play("goingUp", true);
            } else if (this.player.body.velocity.y > 0) {
                this.player.play("falling", true);
                this.falling = true;
            }
        } else if (this.falling) {
            this.player.play("hitGround", true);
            this.falling = false;
            this.isHitGroundComplete = false;

        } else if (this.player.body.velocity.x == 0 && this.isHitGroundComplete && !this.cursors.up.isDown && !this.cursors.down.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.player.play("idle", true);
        }

        if (this.cursors.up.isDown == true || this.joystickCursors.up.isDown) {
            this.player.play("startJump", true);
            if (this.isJumpComplete) {
                this.player.setVelocityY(-300);
                this.isJumpComplete = false;
            }
        }
        if (this.cursors.right.isDown == true || this.joystickCursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.play("run", true);
            this.player.flipX = false;
        }
        if (this.cursors.left.isDown == true || this.joystickCursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.play("run", true);
            this.player.flipX = true;
        }

        if (this.cursors.down.isDown == true || this.joystickCursors.down.isDown) {
            this.player.play("attack", true);
        }

        if (this.player.body.velocity.y < 0) {
            this.player.play("goingUp", true);
        } else if (this.player.body.velocity.y > 0) {
            this.player.play("falling", true);
        }
    }

}




const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    backgroundColor: '#2a6c6d',
    scene: Main,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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