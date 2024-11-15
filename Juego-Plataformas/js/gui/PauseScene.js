export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene", active: false });

    this.player = null;
    this.score = 0;
    this.mainScene = null;
    this.huds = [];
    this.pauseBtn = null;
    this.overlay = null;
  }

  preload() {}

  create() {
    this.pauseGame();
    // Add a blue rectangle button with text "Resume"
    const resumeButton = this.createBtn(440, 300, 200, 50, "Resume", 0x34adff, 0.5);
    const mainButton = this.createBtn(440, 200, 200, 50, "Main Menu", 0x34adff, 0.5);


    // Add button click functionality
    resumeButton.on("pointerdown", () => {
      this.scene.resume("Game"); // Add resume functionality here
      this.scene.stop();
    });
    // Add button click functionality
    mainButton.on("pointerdown", () => {
      window.location.href = "../html/game.html"; // Add resume functionality here
    });
  }

  createBtn(x, y, w, h, text, color, Xorigin) {
    // Add a blue rectangle button with text "Resume"
    const btn = this.add
      .rectangle(x, y, w, h, color) // Blue color in hex
      .setInteractive();

    // Add "Resume" text centered on the button
    this.add
      .text(x, y, text, {
        fontSize: "24px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(Xorigin, 0.5);

    return btn;
  }

  pauseGame() {
    // Pause the main scene
    this.scene.pause("Game");

    // Create a semi-transparent overlay to darken the scene
    this.overlay = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.5 // Adjust opacity as needed
    );
    this.overlay.setScrollFactor(0);
  }
}
