export default class Proyectile extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, y, x, key,) {
        super(scene, y, x, key);
        //Se añade a si mismo a la escena existente
        scene.add.existing(this);
        //Se añade a si mismo a las fisicas de la escena existente
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.createAnimations();
        setTimeout(() => {
            this.destroy();
        },400)
    }

    createAnimations() {
        //Crea variables constantes con una key, y con los frames necesairos desde el player sheet
        //Animaciones Base
        const loop = {
            key: "loop",
            frames: this.anims.generateFrameNumbers("proyectile", { frames: [0,1,2,3,4,5,6] }),
            frameRate: 32,
            repeat: -1
        }
        this.anims.create(loop)
        this.play("loop", true)

    }

    update(){
    }
}