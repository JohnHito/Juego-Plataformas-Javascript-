export default class Effect extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, y, x, key) {
        super(scene, y, x, key);
        //Se añade a si mismo a la escena existente
        scene.add.existing(this);
        //Se añade a si mismo a las fisicas de la escena existente
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        
        this.body.setSize(170, 105);
        this.body.setOffset(40, 55);

        if(key!="effect_hammer_smash"){
            this.body.destroy();
        }
        const hammerSmash = {
            key: "hammerSmash",
            frames: this.anims.generateFrameNumbers("effect_hammer_smash", { frames: [1, 2, 3, 0] }),
            frameRate: 18,
            repeat: 0
        }
        const torch = {
            key: "torch",
            frames: this.anims.generateFrameNumbers("torch", { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 8,
            repeat: -1
        }
        const water = {
            key: "water",
            frames: this.anims.generateFrameNumbers("water", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }),
            frameRate: 8,
            repeat: -1
        }

        this.anims.create(hammerSmash);
        this.anims.create(torch);
        this.anims.create(water);
    }
}