import PlayerHud from "/js/gui/PlayerHud.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene", active: false });

    this.player = null;
    this.score = 0;
    this.mainScene = null;
    this.huds = [];
  }

  init(player) {
    // Retrieve the parameter from the `data` object
    this.player = player;
  }

  newPlayer(player, pos, tint, tint2){
    this.huds.push(new PlayerHud(this, player, pos, tint, tint2));
  }

  preload() {
    //  Load images, sprites, audio, etc.
    this.load.image("gui", "/assets/sprites/gui.png");
  }
  create() {
    this.mainScene = this.scene.get("Main");

    this.mainScene.events.on("hurt", (damage) => {
      console.log(`Player took ${damage} damage.`);
      this.huds.forEach(hud => hud.updateHealth());
    });

    //  Our Text object to display the Score
    /* const info = this.add.text(10, 10, "Score: 0", {
        font: "48px Arial",
        fill: "#000000",
      });*/

    //  Grab a reference to the Game Scene
    //Gui
    /*this.gui = this.add
        .image(140, 60, "gui")
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
  
      this.gui.scale = 0.7;
      //  Listen for events from it
      ourGame.events.on(
        "addScore",
        function () {
          this.score += 10;
  
          info.setText(`Score: ${this.score}`);
        },
        this
      );*/
  }
}
