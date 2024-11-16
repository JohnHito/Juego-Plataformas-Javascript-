import PlayerHud from "./PlayerHud.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene", active: false });
    this.player = null;
    this.score = 0;
    this.mainScene = null;
    this.huds = [];
    this.pauseScene = null;
    this.timer = "0:00";
    this.gameScene = null;
    this.allDead = true;
    this.bg_music = null;
  }

  init(player) {
    // Retrieve the parameter from the `data` object
    this.player = player;
  }

  newPlayer(player, pos, type) {
    this.huds.push(new PlayerHud(this, player, pos, type));
  }

  create() {
    this.bg_music = this.sound.add("bg_music", {
      volume: 0.05, // Set volume (0 to 1)
      loop: true, // Loop the sound
      rate: 1.2, // Playback rate (1 is normal speed)
    });
    this.bg_music.play();

    this.timeLeft = 0;
    this.timeMinutes = 0;

    this.mainScene = this.scene.get("Game");
    this.pauseScene = this.scene.get("PauseScene");

    this.timerText = this.add
      .text(440, 440, this.timer, { fontSize: "20px", color: "#ffffff" })
      .setOrigin(0.5);

    this.timeEvent = this.time.addEvent({
      delay: 30, // Cada 1000 ms (1 segundo)
      callback: this.updateTimer,
      callbackScope: this,
      loop: true, // Se repite continuamente
    });

    this.mainScene.events.on("hurt", (damage) => {
      this.huds.forEach((hud) => hud.updateHealth());
    });

    this.mainScene.events.on("kill", () => {
      this.huds.forEach((hud) => hud.updateText());
    });

    this.mainScene.events.on("dead", () => {
      this.scene.launch("DeadScene");

      if (!this.scene.isPaused("Game") && this.allDead) {
        this.allDead = false;
        this.mainMenu = this.scene.get("Main");
        this.gameScene = this.scene.get("Game");
        this.mainMenu.saveNewGameRun(this.gameScene.playersGroup);
        console.log(this.gameScene.playersGroup);
      }
    });

    // Draw the pause button
    this.pauseBtn = this.add.image(440, 35, "btn_pause").setInteractive();
    this.pauseBtn.setScale(0.5); // Adjust scale as needed
    // Add click event listener for the pause button
    this.pauseBtn.on("pointerup", () => {
      this.scene.launch("PauseScene");
      this.bg_music.pause();
    });
  }

  updateTimer() {
    if (!this.scene.isPaused("Game")) {
      this.timeLeft++;
      if (this.timeLeft == 60) {
        this.timeLeft = 0;
        this.timeMinutes++;
      }
      if (this.timeLeft <= 9) {
        this.timer = `${this.timeMinutes}:0${this.timeLeft}`;
      } else {
        this.timer = `${this.timeMinutes}:${this.timeLeft}`;
      }
      // Actualizar el texto del temporizador
      this.timerText.setText(this.timer);

      // Verificar si el tiempo se ha acabado
      this.player.time = this.timer;
    }
  }
}
