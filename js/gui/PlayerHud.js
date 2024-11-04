export default class PlayerHud {
  constructor(scene, player, pos, type) {
    this.type = type;
    this.pos = pos;
    this.scene = scene;
    this.player = player;
    // Initial health values
    this.maxHealth = player.health;
    this.currentHealth = player.health; // Set current health here
    this.tint = null;
    this.tint2 = null;
    // Create the health bar background and health bar
    this.healthBg = null;
    this.health = null;
    this.side = "";
    this.guiContainer = this.scene.add.container(0, 0);
    this.drawHealthBar(); // Draw the initial health bar

    this.coinCounter = null;
    this.killCounter = null;
    this.keyCounter = null;
  }

  create() {}

  drawHealthBar() {
    var x = 0;
    var y = 0;
    switch (this.pos) {
      case 1:
        x = 70;
        y = 10;
        this.tint = "0x84dcff";
        this.tint2 = "0x34adff";
        break;
      case 2:
        x = 875;
        y = 10;
        this.tint = "0x8be78b";
        this.tint2 = "0x26bb65";

        break;
      case 3:
        x = 70;
        y = 590;
        this.tint = "0xffe66f";
        this.tint2 = "0xccb758";

        break;
      case 4:
        x = 875;
        y = 590;
        this.tint = "0xff6d68";
        this.tint2 = "0xb24c48";

        break;
    }
    // Clear previous graphics
    this.healthBg = this.scene.add.graphics();
    this.health = this.scene.add.graphics();

    this.guiContainer.add(this.healthBg);
    this.guiContainer.add(this.health);

    // Draw background
    this.healthBg.fillStyle(this.tint, 1); // Background color
    this.healthBg.fillRoundedRect(x, y, 250, 30, 5); // Draw rounded rectangle

    // Draw health bar
    const healthBarWidth = (this.currentHealth / this.maxHealth) * 200; // Calculate width based on current health
    this.health.fillStyle(this.tint2, 1); // Health color
    this.health.fillRoundedRect(x, y, healthBarWidth, 30, 5); // Draw rounded rectangle

    if (this.pos === 1) {
      const imgFace = this.scene.add.image(x - 32, y + 25, "gui_face");
      imgFace.setScale(0.4);
      imgFace.setTint(this.tint);

      const imgCoins = this.scene.add.image(x - 30, y + 75, "gui_coin");
      imgCoins.setScale(0.5);
      const imgKills = this.scene.add.image(x + 20, y + 75, "gui_skull");
      imgKills.setScale(0.5);
      const imgKeys = this.scene.add.image(x + 70, y + 75, "gui_key");
      imgKeys.setScale(0.5);

      this.coinCounter = this.scene.add.text(x - 55, y + 60, "900", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.coinCounter.setScale(0.5);

      this.killCounter = this.scene.add.text(x - 15, y + 60, "90", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.killCounter.setScale(0.5);

      this.keyCounter = this.scene.add.text(x + 25, y + 60, "9", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.keyCounter.setScale(0.5);

      const btnJump = this.scene.add.image(x + 130, y + 75, "btn_jump");
      btnJump.setScale(0.5);
      const btnSummon = this.scene.add.image(x + 185, y + 75, "btn_summon");
      btnSummon.setScale(0.5);
      const btnAttack = this.scene.add.image(x + 240, y + 75, "btn_attack");
      btnAttack.setScale(0.5);

      this.guiContainer.add(imgFace);
      this.guiContainer.add(imgCoins);
      this.guiContainer.add(imgKills);
      this.guiContainer.add(imgKeys);
      this.guiContainer.add(btnJump);
      this.guiContainer.add(btnSummon);
      this.guiContainer.add(btnAttack);

      if (this.type === "wasd") {
        const keyJump = this.scene.add.image(x + 130, y + 105, "key_W");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 185, y + 105, "key_E");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 240, y + 105, "key_S");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      } else if (this.type === "arrows") {
        const keyJump = this.scene.add.image(x + 130, y + 105, "key_up");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 185, y + 105, "key_shift");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 240, y + 105, "key_down");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      } else if (this.type === "gamepad") {
        const keyJump = this.scene.add.image(x + 130, y + 105, "btn_A");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 185, y + 105, "btn_X");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 240, y + 105, "key_down");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      }
    } else if (this.pos === 2) {
      const imgFace = this.scene.add.image(x + 285, y + 25, "gui_face");
      imgFace.setScale(0.4);
      imgFace.setTint(this.tint);

      const imgCoins = this.scene.add.image(x + 285, y + 75, "gui_coin");
      imgCoins.setScale(0.5);
      const imgKills = this.scene.add.image(x + 230, y + 75, "gui_skull");
      imgKills.setScale(0.5);
      const imgKeys = this.scene.add.image(x + 175, y + 75, "gui_key");
      imgKeys.setScale(0.5);

      this.coinCounter = this.scene.add.text(x - 75, y + 60, "900", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.coinCounter.setScale(0.5);

      this.killCounter = this.scene.add.text(x - 110, y + 60, "90", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.killCounter.setScale(0.5);

      this.keyCounter = this.scene.add.text(x - 140, y + 60, "9", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.keyCounter.setScale(0.5);

      const btnJump = this.scene.add.image(x + 115, y + 75, "btn_jump");
      btnJump.setScale(0.5);
      const btnSummon = this.scene.add.image(x + 65, y + 75, "btn_summon");
      btnSummon.setScale(0.5);
      const btnAttack = this.scene.add.image(x + 15, y + 75, "btn_attack");
      btnAttack.setScale(0.5);

      this.guiContainer.add(imgFace);
      this.guiContainer.add(imgCoins);
      this.guiContainer.add(imgKills);
      this.guiContainer.add(imgKeys);
      this.guiContainer.add(btnJump);
      this.guiContainer.add(btnSummon);
      this.guiContainer.add(btnAttack);

      if (this.type === "wasd") {
        const keyJump = this.scene.add.image(x + 115, y + 105, "key_W");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 65, y + 105, "key_E");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 15, y + 105, "key_S");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      } else if (this.type === "arrows") {
        const keyJump = this.scene.add.image(x + 115, y + 105, "key_up");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 65, y + 105, "key_shift");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 15, y + 105, "key_down");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      } else if (this.type === "gamepad") {
        const keyJump = this.scene.add.image(x + 115, y + 105, "btn_A");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 65, y + 105, "btn_X");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 15, y + 105, "key_down");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      }
    } else if (this.pos === 3) {
      const imgFace = this.scene.add.image(x - 32, y + 25, "gui_face");
      imgFace.setScale(0.4);
      imgFace.setTint(this.tint);

      const imgCoins = this.scene.add.image(x - 30, y - 30, "gui_coin");
      imgCoins.setScale(0.5);
      const imgKills = this.scene.add.image(x + 20, y - 30, "gui_skull");
      imgKills.setScale(0.5);
      const imgKeys = this.scene.add.image(x + 70, y - 30, "gui_key");
      imgKeys.setScale(0.5);

      this.coinCounter = this.scene.add.text(x - 55, y - 225, "900", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.coinCounter.setScale(0.5);

      this.killCounter = this.scene.add.text(x - 15, y - 225, "90", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.killCounter.setScale(0.5);

      this.keyCounter = this.scene.add.text(x + 25, y - 225, "9", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.keyCounter.setScale(0.5);

      this.keyCounter.setScale(0.5);
      const btnJump = this.scene.add.image(x + 130, y - 30, "btn_jump");
      btnJump.setScale(0.5);
      const btnSummon = this.scene.add.image(x + 185, y - 30, "btn_summon");
      btnSummon.setScale(0.5);
      const btnAttack = this.scene.add.image(x + 240, y - 30, "btn_attack");
      btnAttack.setScale(0.5);

      this.guiContainer.add(imgFace);
      this.guiContainer.add(imgCoins);
      this.guiContainer.add(imgKills);
      this.guiContainer.add(imgKeys);
      this.guiContainer.add(btnJump);
      this.guiContainer.add(btnSummon);
      this.guiContainer.add(btnAttack);

      if (this.type === "wasd") {
        const keyJump = this.scene.add.image(x + 130, y - 60, "key_W");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 185, y - 60, "key_E");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 240, y - 60, "key_S");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      } else if (this.type === "arrows") {
        const keyJump = this.scene.add.image(x + 130, y - 60, "key_up");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 185, y - 60, "key_shift");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 240, y - 60, "key_down");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      } else if (this.type === "gamepad") {
        const keyJump = this.scene.add.image(x + 130, y - 60, "btn_A");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 185, y - 60, "btn_X");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 240, y - 60, "key_down");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      }
    } else if (this.pos === 4) {
        const imgFace = this.scene.add.image(x + 285, y + 25, "gui_face");
        imgFace.setScale(0.4);
      imgFace.setTint(this.tint);

      const imgCoins = this.scene.add.image(x + 285, y - 30, "gui_coin");
      imgCoins.setScale(0.5);
      const imgKills = this.scene.add.image(x + 230, y - 30, "gui_skull");
      imgKills.setScale(0.5);
      const imgKeys = this.scene.add.image(x + 175, y - 30, "gui_key");
      imgKeys.setScale(0.5);

      this.coinCounter = this.scene.add.text(x - 75, y -225, "900", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.coinCounter.setScale(0.5);

      this.killCounter = this.scene.add.text(x - 110, y -225, "90", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.killCounter.setScale(0.5);

      this.keyCounter = this.scene.add.text(x - 140, y -225, "9", {
        font: "24px Arial", // Font size and font family
        fill: "#ffffff", // Text color
        align: "center", // Alignment (center, left, right)
      });
      this.keyCounter.setScale(0.5);

      this.keyCounter.setScale(0.5);
      const btnJump = this.scene.add.image(x + 115, y -30, "btn_jump");
      btnJump.setScale(0.5);
      const btnSummon = this.scene.add.image(x + 65, y -30, "btn_summon");
      btnSummon.setScale(0.5);
      const btnAttack = this.scene.add.image(x + 15, y -30, "btn_attack");
      btnAttack.setScale(0.5);

      this.guiContainer.add(imgFace);
      this.guiContainer.add(imgCoins);
      this.guiContainer.add(imgKills);
      this.guiContainer.add(imgKeys);
      this.guiContainer.add(btnJump);
      this.guiContainer.add(btnSummon);
      this.guiContainer.add(btnAttack);

      if (this.type === "wasd") {
        const keyJump = this.scene.add.image(x + 115, y -60, "key_W");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 65, y -60, "key_E");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 15, y -60, "key_S");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      } else if (this.type === "arrows") {
        const keyJump = this.scene.add.image(x + 115, y -60, "key_up");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 65, y -60, "key_shift");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 15, y -60, "key_down");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      } else if (this.type === "gamepad") {
        const keyJump = this.scene.add.image(x + 115, y -60, "btn_A");
        keyJump.setScale(0.5);
        const keySummon = this.scene.add.image(x + 65, y -60, "btn_X");
        keySummon.setScale(0.5);
        const keyAttack = this.scene.add.image(x + 15, y -60, "key_down");
        keyAttack.setScale(0.5);

        this.guiContainer.add(keyJump);
        this.guiContainer.add(keySummon);
        this.guiContainer.add(keyAttack);
      }
    }

    this.guiContainer.setScale(0.7);
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
