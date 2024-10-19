export default class Background extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, key) {

        let image = scene.textures.get(key).getSourceImage();

        super(scene, x, y, key);

        this.setDepth(-1);

        scene.add.sprite(image.width*x-(image.width/2), image.height*y-(image.height/2), key);
    }
    
}