export default class Proyectile extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, y, x, key,) {
        super(scene, y, x, key);
        //Se añade a si mismo a la escena existente
        scene.add.existing(this);
        //Se añade a si mismo a las fisicas de la escena existente
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setSize(170, 105);
        this.body.setOffset(40, 55);
        const effect = {
            key: "effect",
            frames: this.anims.generateFrameNumbers("effect_hammer_smash", { frames: [1, 2, 3, 0] }),
            frameRate: 18,
            repeat: 0
        }
        this.anims.create(effect)
    }
}