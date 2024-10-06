export default class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, y, x, key) {
        super(scene, y, x, key);
        scene.add.existing(this);

        this.speed = 2;
    }

    update(){
        this.x += this.speed;
    }
}