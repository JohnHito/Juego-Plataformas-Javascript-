//Import de clases
import Player from '/js/entities/Player.js';
import Effect from '/js/entities/Effect.js';
import RoomController from './utils/RoomController.js';

class Main extends Phaser.Scene {

    //Metodo constructor
    constructor() {
        super({ key: "Main" })

        this.player = null;
        this.bg = null;

        this.clock = 0;
        this.clockRate = 3;
    }

    preload() {
        //Se añade el pluguin del joystick
        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);


        //Imagenes
        //Fondo
        this.load.image('left_bottom1', '/assets/levels/left_bottom1.png');
        this.load.image('bottom1', '/assets/levels/bottom1.png');
        this.load.image('left_bottom1', '/assets/levels/left_bottom1.png');
        this.load.image('bottom1', '/assets/levels/bottom1.png');
        this.load.image('right_bottom1', '/assets/levels/right_bottom1.png');
        this.load.image('left', '/assets/levels/left.png');
        this.load.image('middle', '/assets/levels/middle1.png');
        this.load.image('right', '/assets/levels/right1.png');
        this.load.image('left_top', '/assets/levels/left_top1.png');
        this.load.image('top', '/assets/levels/top1.png');
        this.load.image('right_top', '/assets/levels/right_top1.png');

        //Gui
        this.load.image("btn_jump", "/assets/sprites/btn_jump.png");
        this.load.image("btn_attack", "/assets/sprites/btn_attack.png");
        this.load.image("btn_summon", "/assets/sprites/btn_summon.png");
        this.load.image("btn_fall", "/assets/sprites/btn_fall.png");
        this.load.image("gui", "/assets/sprites/gui.png");

        //Spritesheets
        //Entidades
        this.load.spritesheet("playerSheet", "/assets/sprites/player_sheet.png", { frameWidth: 270, frameHeight: 164, });
        this.load.spritesheet("enemySheet", "/assets/sprites/enemy_sheet.png", { frameWidth: 270, frameHeight: 164, });
        
        //Effectos
        this.load.spritesheet("effect_hammer_smash", "/assets/sprites/hammer_smash.png", { frameWidth: 270, frameHeight: 164, });
        this.load.spritesheet("torch", "/assets/sprites/torch.png", { frameWidth: 32, frameHeight: 32, });
        this.load.spritesheet("water", "/assets/sprites/water.png", { frameWidth: 32, frameHeight: 32, });
    }


    create() {
        //Instancia a la clase que controla los niveles
        this.roomController = new RoomController(this, 0, 0);
        //Llama el metodo create, el cual llama al metodo para dibujar la parte visual del nivel
        this.roomController.create();

        //Crea a un nuevo jugador, y le manda la escena, cordenadas y el sprite sheet
        this.player = new Player(this, 440, 440, 'playerSheet')
        //Le crea una hitbox extra al jugador para las detecciones de ataque
        this.player.attackHitbox = new Effect(this, 0, 0, 'effect_hammer_smash')
        this.player.speed = 350;
        this.player.scale = 0.7;

        //Controles de teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        //Crea un joystick para moverse desde celular a partir de un pluguin
        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 100,
            y: 450,
            radius: 80,
            base: this.add.circle(0, 0, 70, 0x5C65C0).setAlpha(0.5), // El valor 0.5 hace el color semitransparente
            thumb: this.add.circle(0, 0, 25, 0x6F95FF).setAlpha(0.5),
        });
        this.joystickCursors = this.joyStick.createCursorKeys();

        //Le manda los controles al jugador
        this.player.setControls(this.cursors, this.joystickCursors);

        //Crea colisiones
        this.colliders = this.physics.add.staticGroup();

        //le manda por referencia al controlador de niveles el jugador y las colisiones
        this.roomController.colliders = this.colliders;
        this.roomController.player = this.player;
        //Crea las colisiones del nivel
        this.roomController.generateRoom();
        //Le manda al jugador los enemigos generados
        this.player.enemies = this.roomController.enemies;

        //Agrega limite a la camara, para cuando llegue al borde no se salga
        this.cameras.main.setBounds(0, 0, 960 * this.roomController.roomSizeX, 960 * this.roomController.roomSizeY + 32 * 3);

        //Pone a la camara a seguir al jugador
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08)

        //Gui de celular
        const btn1 = this.add.image(635, 450, 'btn_attack').setInteractive().setScrollFactor(0).setAlpha(0.7);
        const btn2 = this.add.image(700, 350, 'btn_jump').setInteractive().setScrollFactor(0).setAlpha(0.7);
        this.player.btn1 = btn1;
        this.player.btn2 = btn2;

        //Gui
        const gui = this.add.image(140, 60, 'gui').setInteractive().setScrollFactor(0).setAlpha(0.7);
        gui.scale = 0.7
    }

    update() {
        //Esto se encarga de reducir el llamado al update del nivel para reducir
        //consumo de recursos
        if (this.clock === this.clockRate) {
            //Actualiza el nivel el cual actializa al jugador
            this.roomController.update();
            this.clock = 0;
        } else { this.clock++ }

        //Actualzia al jugador
        this.player.update();
       
    }
}

//Configuracion del proyecto
const config = {
    type: Phaser.AUTO,
    width: 840,
    height: 560,
    backgroundColor: '#2a6c6d',
    scene: Main,
    //Añade fisicas 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2500 },
            debug: false
        }
    },
    fps: {
        target: 60, 
        forceSetTimeOut: true
    },
    input: {
        // Define la cantidad de dedos que pueden interactuar con la pantalla en celular a la vez
        activePointers: 5
    }
}

//Crea una nueva instancia de juego de phaser
const game = new Phaser.Game(config);
