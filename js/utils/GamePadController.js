export default class GamePadController {
  constructor(scene) {
    this.scene = scene;

    // Create gamepad axes
    this.up = { isDown: false, isUp: true };
    this.down = { isDown: false, isUp: true };
    this.left = { isDown: false, isUp: true };
    this.right = { isDown: false, isUp: true };
    this.btn1 = { isDown: false, isUp: true };

    this.lastButtonStates = Array(10).fill(false); // Assuming a max of 10 buttons

    // Listen for gamepad connection
    this.scene.input.gamepad.on("connected", (pad) => {
      this.isConnected = true;
      console.log("CONTROL CONNECTED");
      this.scene.newPlayer(this, this);
    });

    // Listen for gamepad disconnection
    this.scene.input.gamepad.on("disconnected", () => {
      this.isConnected = false;
      console.log("CONTROL DISCONNECTED");
      this.resetInputs();
    });
  }

  update() {
    const gamepad = this.scene.input.gamepad.gamepads[0];

    if (gamepad) {
      // Update axes for left/right and up/down
      this.left.isDown = gamepad.axes[0].getValue() < -0.1;
      this.right.isDown = gamepad.axes[0].getValue() > 0.1;
    //  this.up.isDown = gamepad.axes[1].getValue() < -0.1;
      this.down.isDown = gamepad.axes[1].getValue() > 0.1;

      this.btn1.isDown = gamepad.buttons[2]?.pressed || false;
      this.up.isDown = gamepad.buttons[0]?.pressed || false;

      // Log button states only when changed
      for (let i = 0; i < gamepad.buttons.length; i++) {
        if (gamepad.buttons[i].pressed && !this.lastButtonStates[i]) {
          console.log(`Button ${i} pressed`);
        }
        this.lastButtonStates[i] = gamepad.buttons[i].pressed; // Track last state
      }

      // Update isUp properties
      this.left.isUp = !this.left.isDown;
      this.right.isUp = !this.right.isDown;
      this.up.isUp = !this.up.isDown;
      this.down.isUp = !this.down.isDown;
      this.btn1.isUp = !this.btn1.isDown;
    } else {
      // Reset inputs if no gamepad is connected
      this.resetInputs();
    }
  }

  // Method to reset inputs
  resetInputs() {
    this.left.isDown = false;
    this.left.isUp = true;
    this.right.isDown = false;
    this.right.isUp = true;
    this.up.isDown = false;
    this.up.isUp = true;
    this.down.isDown = false;
    this.down.isUp = true;
    this.btn1.isDown = false;
    this.btn1.isUp = true;

  }
}
