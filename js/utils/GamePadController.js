export default class GamePadController {
  constructor(scene) {
    this.scene = scene;

    // Create gamepad axes
    this.up = { isDown: false, isUp: true };
    this.down = { isDown: false, isUp: true };
    this.left = { isDown: false, isUp: true };
    this.right = { isDown: false, isUp: true };

    // Listen for gamepad connection
    this.scene.input.gamepad.on("connected", (pad) => {
      this.isConnected = true;
      console.log("CONTROL CONNECTED");
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
      this.left.isDown = gamepad.axes[0].getValue() < -0.1; // Threshold for left
      this.right.isDown = gamepad.axes[0].getValue() > 0.1; // Threshold for right
      this.up.isDown = gamepad.axes[1].getValue() < -0.1; // Threshold for up
      this.down.isDown = gamepad.axes[1].getValue() > 0.1; // Threshold for down

      // Log axis values for debugging
      console.log("Axis X:", gamepad.axes[0].getValue());
      console.log("Axis Y:", gamepad.axes[1].getValue());

      // Log button states
      for (let i = 0; i < gamepad.buttons.length; i++) {
        if (gamepad.buttons[i].pressed) {
          console.log(`Button ${i} pressed`);
        }
      }

      // Update isUp property based on the state
      this.left.isUp = !this.left.isDown;
      this.right.isUp = !this.right.isDown;
      this.up.isUp = !this.up.isDown;
      this.down.isUp = !this.down.isDown;
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
  }
}
