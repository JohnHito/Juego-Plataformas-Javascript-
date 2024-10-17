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

        this.solidCollisions = []
        for (let i = 0; i < collisionsArray.length; i += 50) {
            this.solidCollisions.push(collisionsArray.slice(i, i + 50))
        }
        this.plataformCollisions = []
        for (let i = 0; i < collisionsArray2.length; i += 50) {
            this.plataformCollisions.push(collisionsArray2.slice(i, i + 50))
        }

    }

    preload() {

        //Se añade el pluguin del joystick
        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);


        //Imagenes
        //Fondo
        this.load.image('level1Bg', '/assets/levels/level1.png');
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
    }


    create() {
        //Crea nueva clase de Background, solo agrega la imagen de fondo
        this.bg = new Background(this, 0, 0, 'level1Bg')

        //Crea a un nuevo jugador, y le manda la escena, cordenadas y el sprite sheet
        this.player = new Player(this, 440, 440, 'playerSheet')

        //Le crea una hitbox extra al jugador para las detecciones de ataque
        this.player.attackHitbox = new Effect(this, 0, 0, 'effect_hammer_smash')
        this.player.speed = 320;
        this.player.scale = 0.7;

        //Agrega 5 enemigos al array de enemigos (Temporal)
        this.enemies.push(new Enemy(this, 480, 460, 'enemySheet', this.player, 100));
        this.enemies.push(new Enemy(this, 580, 460, 'enemySheet', this.player, 150));
        this.enemies.push(new Enemy(this, 680, 460, 'enemySheet', this.player, 120));
        this.enemies.push(new Enemy(this, 780, 460, 'enemySheet', this.player, 170));
        this.enemies.push(new Enemy(this, 880, 460, 'enemySheet', this.player, 200));

        //Le manda el array de enemies al jugador
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

        //Le manda los controles al jugador
        this.player.setControls(this.cursors, this.joystickCursors);

        //Crea colisiones
        this.colliders = this.physics.add.staticGroup();

        //Llama al metodo generateWorld que se encarga de recorrer un array de cordenadas
        //y les agrega colision en cada posicion
        this.generateWorld(this.solidCollisions, true);
        this.generateWorld(this.plataformCollisions, false);

        //Crea los limites del mundo
        this.physics.world.setBounds(0, 0, this.bg.width, this.bg.height);
        //Agrega limite a la camara, para cuando llegue al borde no se salga
        this.cameras.main.setBounds(0, 0, this.bg.width, this.bg.height);
        //Pone a la camara a seguir al jugador
        this.cameras.main.startFollow(this.player, true, 0.08,0.08)

        //Gui de celular
        const btn1 = this.add.image(500, 300, 'btn_attack').setInteractive().setScrollFactor(0).setAlpha(0.7);
        const btn2 = this.add.image(560, 200, 'btn_jump').setInteractive().setScrollFactor(0).setAlpha(0.7);
        this.player.btn1 = btn1;
        this.player.btn2 = btn2;

        //Gui
        const gui = this.add.image(140, 60, 'gui').setInteractive().setScrollFactor(0).setAlpha(0.7);
        gui.scale = 0.7
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

    //Este metodo se encarga de recorrer un array de cordenadas, el cual por cada coordenada crea una
    //collision en la posicion correspondiente
    generateWorld(collisions, isSolid) {
        collisions.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                if (symbol != 0) {
                    // Añade un hitbox de 32x32 que corresponde al tamaño de cada tile visual
                    const box = this.colliders.create(colIndex * 32, rowIndex * 32, null)
                        .setOrigin(0, 0)
                        .setDisplaySize(32, 32)
                        .refreshBody() // Refrescar el cuerpo de la física
                        .setVisible(true);// Hace las colisiones invisibles

                    //Si es no es solid, desactiba las colisiones del box menos las de arriba, permitiendo
                    //al jugador pasar a travez de la plataforma desde abajo o los lados pero pararse en esta si esta arriba
                    if (!isSolid) {
                        box.body.checkCollision.down = false;
                        box.body.checkCollision.left = false;
                        box.body.checkCollision.right = false;
                    }

                    //Añade colision entre las plataformas. el jugador y los enemigos
                    this.physics.add.collider(this.player, this.colliders);
                    this.physics.add.collider(this.enemies, this.colliders);
                }
            });
        });
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
    },
    input: {
        activePointers: 5 // Permitir hasta 5 dedos simultáneamente
    }
}

// Create a new Phaser game instance
const game = new Phaser.Game(config);
