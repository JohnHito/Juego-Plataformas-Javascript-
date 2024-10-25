//Import de clases
import Player from "/js/entities/Player.js";
import Effect from "/js/entities/Effect.js";
import RoomController from "./utils/RoomController.js";
import GamePadController from "./utils/GamePadController.js";

class Main extends Phaser.Scene {
  //Metodo constructor
  constructor() {
    super({ key: "Main" });

    this.player = null;
    this.bg = null;

    this.clock = 0;
    this.clockRate = 3;
    this.gamePadController = null;
  }

  preload() {
    //Se añade el pluguin del joystick
    let url =
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js";
    this.load.plugin("rexvirtualjoystickplugin", url, true);

    //Imagenes
    //Fondo
    this.load.image("left_bottom1", "/assets/levels/left_bottom1.png");
    this.load.image("bottom1", "/assets/levels/bottom1.png");
    this.load.image("left_bottom1", "/assets/levels/left_bottom1.png");
    this.load.image("bottom1", "/assets/levels/bottom1.png");
    this.load.image("right_bottom1", "/assets/levels/right_bottom1.png");
    this.load.image("left", "/assets/levels/left.png");
    this.load.image("middle", "/assets/levels/middle1.png");
    this.load.image("right", "/assets/levels/right1.png");
    this.load.image("left_top", "/assets/levels/left_top1.png");
    this.load.image("top", "/assets/levels/top1.png");
    this.load.image("right_top", "/assets/levels/right_top1.png");

    //Gui
    this.load.image("btn_jump", "/assets/sprites/btn_jump.png");
    this.load.image("btn_attack", "/assets/sprites/btn_attack.png");
    this.load.image("btn_summon", "/assets/sprites/btn_summon.png");
    this.load.image("btn_fall", "/assets/sprites/btn_fall.png");
    this.load.image("gui", "/assets/sprites/gui.png");

    //Spritesheets
    //Entidades
    this.load.spritesheet("playerSheet", "/assets/sprites/player_sheet.png", {
      frameWidth: 270,
      frameHeight: 164,
    });
    this.load.spritesheet("enemySheet", "/assets/sprites/enemy_sheet.png", {
      frameWidth: 270,
      frameHeight: 164,
    });

    //Effectos
    this.load.spritesheet(
      "effect_hammer_smash",
      "/assets/sprites/hammer_smash.png",
      { frameWidth: 270, frameHeight: 164 }
    );
    this.load.spritesheet("torch", "/assets/sprites/torch.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("water", "/assets/sprites/water.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    //Instancia a la clase que controla los niveles
    this.roomController = new RoomController(this, 0, 0);
    //Llama el metodo create, el cual llama al metodo para dibujar la parte visual del nivel
    this.roomController.create();
    // Crear un grupo para los jugadores
    this.playersGroup = this.physics.add.group();

    //Crea a un nuevo jugador, y le manda la escena, cordenadas y el sprite sheet
    //this.player = new Player(this, 420, 440, "playerSheet");
    this.player2 = new Player(this, 440, 440, "playerSheet");
     this.player3 = new Player(this, 460, 440, "playerSheet");

    // this.player2.setTint(0x90ee90);
      this.player3.setTint(0xadd8e6);

    // Añadir los jugadores al grupo
    //this.playersGroup.add(this.player);
    this.playersGroup.add(this.player2);
     this.playersGroup.add(this.player3);

    //Controles de teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    //Controles de gamePads
    this.gamePadController = new GamePadController(this);

    //Crea un joystick para moverse desde celular a partir de un pluguin
    this.joyStick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 350,
      radius: 80,
      base: this.add.circle(0, 0, 70, 0x5c65c0).setAlpha(0.5), // El valor 0.5 hace el color semitransparente
      thumb: this.add.circle(0, 0, 25, 0x6f95ff).setAlpha(0.5),
    });
    this.joystickCursors = this.joyStick.createCursorKeys();

    //Gui de celular
    const btn1 = this.add
      .image(635, 390, "btn_attack")
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(0.7);

    const btn2 = this.add
      .image(730, 280, "btn_jump")
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(0.7);

    //Gui
    const gui = this.add
      .image(140, 60, "gui")
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(0.7);
    gui.scale = 0.7;

    //Le manda los controles al jugador
    //this.player.setControls(this.cursors, this.btn1, this.btn2);
    this.player2.setControls(this.joystickCursors, this.btn1, this.btn2);
    this.player3.setControls(this.gamePadController, this.btn1, this.btn2);

    //Crea colisiones
    this.colliders = this.physics.add.staticGroup();

    //le manda por referencia al controlador de niveles el jugador y las colisiones
    this.roomController.colliders = this.colliders;
    this.roomController.player = this.playersGroup;
    //Crea las colisiones del nivel
    this.roomController.generateRoom();
    //Le manda al jugador los enemigos generados
    this.playersGroup.enemies = this.roomController.enemies;

    //Agrega limite a la camara, para cuando llegue al borde no se salga
    this.cameras.main.setBounds(
      0,
      0,
      960 * this.roomController.roomSizeX,
      960 * this.roomController.roomSizeY + 32 * 3
    );

    //Pone a la camara a seguir al jugador
    //this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  update() {
    //Esto se encarga de reducir el llamado al update del nivel para reducir
    //consumo de recursos
    if (this.clock === this.clockRate) {
      //Actualiza el nivel el cual actializa al jugador
      this.roomController.update();
      this.clock = 0;
    } else {
      this.clock++;
    }

    //Actualzia al jugador
    this.playersGroup.children.iterate((player) => {
      if (player) {
        player.update(); // Llamar al método update de cada jugador
      }
    });

    this.updateCameraToPlayers();

    if (this.gamePadController.up.isDown) {
      // Move player up
      console.log("Moving Up");
    }
    if (this.gamePadController.down.isDown) {
      // Move player down
      console.log("Moving Down");
    }
    if (this.gamePadController.left.isDown) {
      // Move player left
      console.log("Moving Left");
    }
    if (this.gamePadController.right.isDown) {
      // Move player right
      console.log("Moving Right");
    }
    this.gamePadController.update();
  }

  calculateBoundsForPlayers() {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    this.playersGroup.children.iterate((player) => {
      if (player) {
        minX = Math.min(minX, player.x);
        minY = Math.min(minY, player.y);
        maxX = Math.max(maxX, player.x);
        maxY = Math.max(maxY, player.y);
      }
    });

    return { minX, minY, maxX, maxY };
  }
  updateCameraToPlayers() {
    let bounds = this.calculateBoundsForPlayers();

    // Calculate the center of the area that contains the players
    let centerX = (bounds.minX + bounds.maxX) / 2;
    let centerY = (bounds.minY + bounds.maxY) / 2;

    // Calculate the size of the area
    let width = bounds.maxX - bounds.minX;
    let height = bounds.maxY - bounds.minY;

    // Adjust the camera's position to the center
    this.cameras.main.centerOn(centerX, centerY);

    // Calculate the zoom factor
    let zoomX = this.cameras.main.width / (width + 200); // Add a small margin
    let zoomY = this.cameras.main.height / (height + 150); // Add a small margin
    let targetZoom = Math.min(zoomX, zoomY);

    // Smoothly interpolate the zoom level
    this.smoothZoom(targetZoom);
  }
  smoothZoom(targetZoom) {
    const currentZoom = this.cameras.main.zoom;
    const zoomSpeed = 0.03; // Adjust this value to make zooming faster or slower
    const maxZoom = 1; // Set your maximum zoom level here
    const minZoom = 0.5; // Set your minimum zoom level here

    // Clamp the target zoom to the maximum and minimum zoom levels
    targetZoom = Math.min(Math.max(targetZoom, minZoom), maxZoom);

    // Gradually approach the target zoom
    if (Math.abs(currentZoom - targetZoom) > 0.005) {
      this.cameras.main.setZoom(
        currentZoom + (targetZoom - currentZoom) * zoomSpeed
      );
    } else {
      this.cameras.main.setZoom(targetZoom); // Set to exact target zoom when close enough
    }
  }
}

//Configuracion del proyecto
const config = {
  type: Phaser.AUTO,
  width: 840,
  height: 460,
  backgroundColor: "#2a6c6d",
  scene: Main,
  //Añade fisicas
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2500 },
      debug: false,
    },
  },
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
  input: {
    // Define la cantidad de dedos que pueden interactuar con la pantalla en celular a la vez
    activePointers: 5,
    gamepad: true,
  },
};

//Crea una nueva instancia de juego de phaser
const game = new Phaser.Game(config);
