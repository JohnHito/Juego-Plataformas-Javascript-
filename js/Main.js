//Import de clases
import Player from "/js/entities/Player.js";
import Effect from "/js/entities/Effect.js";
import Proyectile from "/js/entities/Proyectile.js";
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
    this.gamePadControlls = null;
    this.keyboardControlls2Active = false;
  }

  preload() {
    //Se añade el pluguin del joystick
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "../js/vendor/joysticlPlugin.min.js",
      true
    );

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
    this.load.image("fire_spark", "/assets/sprites/fire_spark.png");

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
    this.load.spritesheet("knightSheet", "/assets/sprites/knight_sheet.png", {
      frameWidth: 291,
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

  newPlayer(cursors) {
    this.player = new Player(
      this,
      this.playersGroup.getFirstAlive().x,
      this.playersGroup.getFirstAlive().y,
      "playerSheet"
    );
    this.playersGroup.add(this.player);
    this.player.setControls(cursors, this.btn1, this.btn2);
    this.player.normalTint = "0x8be78b";
    this.player.setTint("0x8be78b");
  }

  create() {
    //Instancia a la clase que controla los niveles
    this.roomController = new RoomController(this, 0, 0);
    //Llama el metodo create, el cual llama al metodo para dibujar la parte visual del nivel
    this.roomController.create();
    // Crear un grupo para los jugadores
    this.playersGroup = this.physics.add.group();
    this.projectilesGroup = this.physics.add.group();

    //Crea a un nuevo jugador, y le manda la escena, cordenadas y el sprite sheet
    this.player = new Player(this, 420, 440, "playerSheet");
    this.playersGroup.add(this.player);

    //this.player2 = new Player(this, 440, 440, "playerSheet");
    // this.player3 = new Player(this, 460, 440, "playerSheet");

    // this.player2.setTint(0x90ee90);
    //this.player3.normalTint = 0xadd8e6;

    // Añadir los jugadores al grupo
    //this.playersGroup.add(this.player2);
    //this.playersGroup.add(this.player3);

    //Controles de teclado
    this.keyboardControlls2 = this.input.keyboard.createCursorKeys();
    this.keyboardExtraControlls2 = this.input.keyboard.addKeys({
      btn1: Phaser.Input.Keyboard.KeyCodes.E,
      up: Phaser.Input.Keyboard.KeyCodes.w,
      down: Phaser.Input.Keyboard.KeyCodes.S,
    });

    this.keyboardControlls = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.keyboardExtraControlls = this.input.keyboard.addKeys({
      btn1: Phaser.Input.Keyboard.KeyCodes.E,
      up: Phaser.Input.Keyboard.KeyCodes.w,
      down: Phaser.Input.Keyboard.KeyCodes.S,
    });

    //Controles de gamePads
    this.gamePadControlls = new GamePadController(this);

    //Gui
    const gui = this.add
      .image(140, 60, "gui")
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(0.7);
    gui.scale = 0.7;

    //Le manda los controles al jugador
    this.player.setControls(this.keyboardControlls, this.btn1, this.btn2);
    //this.player2.setControls(this.tactileControlls, this.btn1, this.btn2);
    //this.player3.setControls(this.gamePadControlls, this.btn1, this.btn2);

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

    //?POSIBLE MAP
    //this.UI_CAM_1 = this.cameras.add(-150,-150 ,300,300);
    //this.UI_CAM_1.setZoom(0.05);

    if (this.hasTouchScreen()) {
      this.createTouchControls();
    }
  }

  createTouchControls() {
    //Crea un joystick para moverse desde celular a partir de un pluguin
    this.joyStick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 350,
      radius: 80,
      base: this.add.circle(0, 0, 70, 0x5c65c0).setAlpha(0.5), // El valor 0.5 hace el color semitransparente
      thumb: this.add.circle(0, 0, 25, 0x6f95ff).setAlpha(0.5),
    });
    this.tactileControlls = this.joyStick.createCursorKeys();

    //this.joyStick.thumb.setVisible(false);
    //this.joyStick.base.setVisible(false);
    // this.tactileControlls.setVisible(false);
    //Gui de celular

    this.btn1 = this.add
      .image(635, 390, "btn_attack")
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(0.7);
    this.btn2 = this.add
      .image(730, 280, "btn_jump")
      .setInteractive()
      .setScrollFactor(0)
      .setAlpha(0.7);

    this.btn1.visible = true;
    this.btn2.visible = true;
    this.joyStick.thumb.setVisible(true);
    this.joyStick.base.setVisible(true);
    this.playersGroup.getFirst(true).cursors = this.tactileControlls;
  }
  hasTouchScreen() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }
  update() {
    if (
      (this.keyboardControlls2.up.isDown ||
        this.keyboardControlls2.down.isDown ||
        this.keyboardControlls2.left.isDown ||
        this.keyboardControlls2.right.isDown) &&
      !this.keyboardControlls2Active
    ) {
      this.newPlayer(this.keyboardControlls2);
      this.keyboardControlls2Active = true;
    }
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

    this.projectilesGroup.children.iterate((proyectile) => {
      if (proyectile) {
        proyectile.update(); // Llamar al método update de cada jugador
      }
    });

    this.updateCameraToPlayers();

    this.gamePadControlls.update();
  }
  calculateBoundsForPlayers() {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity,
      hasAlive = false,
      lastAlive = null;

    this.playersGroup.children.iterate((player) => {
      if (player && player.alive) {
        minX = Math.min(minX, player.x);
        minY = Math.min(minY, player.y);
        maxX = Math.max(maxX, player.x);
        maxY = Math.max(maxY, player.y);
        hasAlive = true;
      }
      lastAlive = player;
    });
    if (!hasAlive && lastAlive) {
      minX = Math.min(minX, lastAlive.x);
      minY = Math.min(minY, lastAlive.y);
      maxX = Math.max(maxX, lastAlive.x);
      maxY = Math.max(maxY, lastAlive.y);
    }
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
    let zoomY = this.cameras.main.height / (height + 500); // Add a small margin
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
