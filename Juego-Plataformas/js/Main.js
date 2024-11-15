import Game from "./Game.js";
import UIScene from "./gui/UIScene.js";
import PauseScene from "./gui/PauseScene.js";
import DeadScene from "./gui/DeadScene.js";
export default class Main extends Phaser.Scene {
  //Metodo constructor
  constructor() {
    super({ key: "Main" });
    this.user = null;
  }

  preload() {
    this.load.image("logo", "../img/logo.png");
  }

  async create() {
    const logo = this.add.image(440, 100, "logo");
    logo.setScale(0.7);

    const playBtn = this.createBtn(440, 200, 100, 50, "PLAY", 0x34adff, 0.5);
    // Add button click functionality
    playBtn.on("pointerdown", () => {
      console.log("CLICK");
      this.scene.start("Game");
      this.stop;
    });

    // Wait for the login check to complete
    const data = await this.checkLoginStatus();
    if (data) {
      console.log("LOGGED IN");
      const userBtn = this.createBtn(
        40,
        420,
        50,
        50,
        this.user.username,
        0x34adff,
        0
      );

      const logout = this.createBtn(780, 420, 100, 50, "Logout", 0x34adff, 0.5);
      logout.on("pointerdown", () => {
        console.log("CLICK");
        this.logOut();
        this.stop;
      });
    } else {
      console.log("no LOGGED");

      const login = this.createBtn(60, 420, 100, 50, "Login", 0x34adff, 0.5);
      login.on("pointerdown", () => {
        console.log("CLICK");
        window.location.href = "../../login.php";
        this.stop;
      });
    }
  }

  createBtn(x, y, w, h, text, color, Xorigin) {
    // Add a blue rectangle button with text "Resume"
    const btn = this.add
      .rectangle(x, y, w, h, color) // Blue color in hex
      .setInteractive();

    // Add "Resume" text centered on the button
    const textObject = this.add
      .text(x, y, text, {
        fontSize: "24px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(Xorigin, 0.5);
    if (Xorigin === 0) {
      textObject.setX(x + w / 2 + 10);
    }

    return btn;
  }

  async saveNewGameRun(player) {
    // Generate a random seed (you can use any logic to generate a seed)
    const seed = "default"; // Random seed between 0 and 999999

    // Create a game_run object
    const gameRun = {
      user_id: this.user.id,
      total_score: player.kills + player.coins + player.keys, // Initial score, can be updated
      keys: player.keys, // Initial coins, can be updated
      coins: player.coins, // Initial coins, can be updated
      kills: player.kills, // Initial kills, can be updated as the game progresses
      seed: seed
    };

    // Send the game_run object to the backend (PHP) to store in the database
    console.log("Sending game run data:", JSON.stringify(gameRun));

    try {
      const response = await fetch("../../save_game_run.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameRun), // Send the gameRun object as JSON
      });

      const result = await response.json();

      if (result.success) {
        console.log("Game run created successfully:", result);
      } else {
        console.log("Failed to create game run:", result.message);
      }
    } catch (error) {
      console.error("Error creating game run:", error);
    }
  //  window.location.href = "../../save_game_run.php";
  }

  async checkLoginStatus() {
    try {
      const response = await fetch("../../checkLogin.php"); // This will check the login status
      const data = await response.json(); // Parse the JSON response
        this.user = data;
      if (data.loggedIn) {
        console.log("User is logged in. Username: " + data.username + " Id:" +data.id );
        return data; // Return true if logged in
      } else {
        console.log("User is not logged in.");
        return false; // Return false if not logged in
      }
    } catch (error) {
      console.error("Error:", error);
      return false; // In case of an error, assume not logged in
    }
  }

  async logOut() {
    try {
      const response = await fetch("../../logout.php", {
        method: "GET", // You can also use POST if needed
      });
      const data = await response.json();

      if (data.loggedOut) {
        console.log("User logged out successfully.");
        // Perform any additional actions like redirecting to the login page
        window.location.href = "../html/game.html"; // Example redirection to login page
      } else {
        console.log("Error logging out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
}

//Configuracion del proyecto
const config = {
  type: Phaser.AUTO,
  width: 840,
  height: 460,
  backgroundColor: "#292f4b",
  scene: [Main, Game, UIScene, PauseScene, DeadScene],
  //Añade fisicas
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2500 },
      debug: true,
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
const gameInstance = new Phaser.Game(config);
console.log("config");
