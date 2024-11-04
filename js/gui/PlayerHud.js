export default class PlayerHud {
  constructor(scene, player, pos, tint, tint2) {
    this.pos = pos;
    this.scene = scene;
    this.player = player;
    // Initial health values
    this.maxHealth = player.health;
    this.currentHealth = player.health; // Set current health here
    this.tint = tint;
    this.tint2 = tint2;
    // Create the health bar background and health bar
    this.healthBg = null;
    this.health = null;

    this.drawHealthBar(); // Draw the initial health bar
  }

  create() {}

  drawHealthBar() {
    var x = 0;
    var y = 0;
    switch (this.pos) {
      case 1:
        x = 10;
        y = 10;
        break;
      case 2:
        x = 600;
        y = 10;
        break;
      case 3:
        x = 10;
        y = 400;
        break;
      case 4:
        break;
    }
    // Clear previous graphics
    this.healthBg = this.scene.add.graphics();
    this.health = this.scene.add.graphics();

    // Draw background
    this.healthBg.fillStyle(this.tint, 1); // Background color
    this.healthBg.fillRoundedRect(x, y, 200, 35, 5); // Draw rounded rectangle
    
    // Draw health bar
    const healthBarWidth = (this.currentHealth / this.maxHealth) * 200; // Calculate width based on current health
    this.health.fillStyle(this.tint2, 1); // Health color
    this.health.fillRoundedRect(x, y, healthBarWidth, 35, 5); // Draw rounded rectangle
  }

  updateHealth() {
    const newHealth = this.player.health;
    this.currentHealth = Math.max(0, Math.min(newHealth, this.maxHealth)); // Clamp health between 0 and max
    this.drawHealthBar(); // Redraw health bar with updated value
  }

  // You can call this method to simulate health loss
  decreaseHealth(amount) {
    this.updateHealth(this.currentHealth - amount);
  }

  // Add any other methods you need for updating or managing health
}
