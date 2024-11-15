import PlayerHud from "./PlayerHud.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene", active: false });

    this.player = null;
    this.score = 0;
    this.mainScene = null;
    this.huds = [];
    this.pauseScene = null;
   
  }

  init(player) {
    // Retrieve the parameter from the `data` object
    this.player = player;
  }

  newPlayer(player, pos, type){
    this.huds.push(new PlayerHud(this, player, pos, type));
  }

  create() {
    this.mainScene = this.scene.get("Game");
    this.pauseScene = this.scene.get("PauseScene");
    
    this.mainScene.events.on("hurt", (damage) => {
      this.huds.forEach(hud => hud.updateHealth());
    });

    this.mainScene.events.on("kill", () => {
      this.huds.forEach(hud => hud.updateText());
    });

     // Draw the pause button
     this.pauseBtn = this.add.image(440, 35, "btn_pause").setInteractive();
     this.pauseBtn.setScale(0.5);  // Adjust scale as needed
     // Add click event listener for the pause button
     this.pauseBtn.on("pointerup", () => {
       this.scene.launch("PauseScene");
     });
  }

 
}
