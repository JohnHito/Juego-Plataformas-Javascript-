export default class Background extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.setDepth(-1);

        scene.add.existing(this);

        let image = scene.textures.get(key).getSourceImage();

        this.setPosition(image.width * x - (image.width / 2), image.height * y - (image.height / 2));
    
    }

}