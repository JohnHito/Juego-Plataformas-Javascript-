export default class Proyectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, y, x, key, target) {
    super(scene, y, x, key);
    //Se añade a si mismo a la escena existente
    scene.add.existing(this);
    //Se añade a si mismo a las fisicas de la escena existente
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.target = target;
    this.FXfire_in_air = null;
    this.FXfire_hit = null;
    this.create();
  }

  create() {
    this.FXfire_in_air = this.scene.sound.add("fire_in_air", {
      volume: 0.2, // Set volume
      rate: 0.7, // Playback rate
    });
    this.FXfire_in_air.play({
      seek: 1, // Start playback from 2 seconds
    });

    this.FXfire_hit = this.scene.sound.add("fire_hit", {
      volume: 1, // Set volume
      rate: 1.2, // Playback rate
    });

    this.particles = this.scene.add.particles(9, 0, "fire_spark", {
      speed: 80,
      scale: { start: 0.2, end: 0 },
      blendMode: "ADD",
      alpha: { start: 1, end: 0 },
    });

    this.particles.startFollow(this);
    this.visible = false;

    setTimeout(() => {
      this.particles.explode(16);
      this.FXfire_hit.play({
        seek: 5.2, // Start playback from 2 seconds
      });
      this.destroy();
      setTimeout(() => {
        this.particles.destroy();
        setTimeout(() => {
          this.FXfire_hit.stop();
        }, 2000);
      }, 1000);
    }, 4000);
  }

  update() {
    if (!this.body) return;

    if (this.target) {
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.target.x,
        this.target.y
      );
      if (distance <= 40) {
        this.target.takeDamage(1);
        this.particles.explode(16);
        this.FXfire_in_air.stop();
        this.FXfire_hit.play({
          seek: 5.2, // Start playback from 2 seconds
        });
        this.destroy();

        setTimeout(() => {
          this.particles.destroy();
          setTimeout(() => {
            this.FXfire_hit.stop();
          }, 2000);
        }, 1000);
      } else {
        // Calculate the angle between the projectile and the target
        const angle = Phaser.Math.Angle.Between(
          this.x,
          this.y,
          this.target.x,
          this.target.y
        );

        // Set velocity based on the angle to the target
        const speed = 320; // Adjust the speed as needed
        this.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      }
    }
  }
}
