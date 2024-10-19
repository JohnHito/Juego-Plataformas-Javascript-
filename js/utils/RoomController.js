import bottom from '../data/bottom.js';
import left_bottom from '../data/left_bottom.js';
import right_bottom from '../data/right_bottom.js';
import left from '../data/left.js';
import middle from '../data/middle.js';
import right from '../data/right.js';
import left_top from '../data/left_top.js';
import top from '../data/top.js';
import right_top from '../data/right_top.js';
import Background from '/js/Background.js';
import Effect from '/js/entities/Effect.js';
import Enemy from '/js/entities/Enemy.js';

export default class LevelController extends Phaser.GameObjects.Container {
    constructor(scene, y, x) {
        super(scene, x, y);
        this.scene = scene;

        this.colliders = null;
        this.player = null;

        this.roomSizeX =5//Math.floor(Math.random() * (9 - 2 + 1)) + 2;
        this.roomSizeY =5//Math.floor(Math.random() * (9 - 2 + 1)) + 2;

        this.rooms = Array.from({ length: this.roomSizeY }, () => Array(this.roomSizeX).fill(0));

        //Crea dos array vacios, uno para las colisiones y otro para los enemigos
        this.enemies = [];
        //Agrega enemigos al array de enemigos (Temporal)
        this.enemiesAmout = 25;

        //PC 25 enemigos / room 10x10
        //CEL -8 enemigos / room 4x4

    }


    loadCollisions(data, num) {
        this.solidCollisions = [];

        // Load solid collisions
        for (let i = 0; i < data[num].fullCollisions.length; i += 30) {
            this.solidCollisions.push(data[1].fullCollisions.slice(i, i + 30));
        }

        // Load platform collisions
        this.plataformCollisions = [];
        for (let i = 0; i < data[num].plataformCollisions.length; i += 30) {
            this.plataformCollisions.push(data[1].plataformCollisions.slice(i, i + 30));
        }

        // Load platform collisions
        this.torchs = [];
        for (let i = 0; i < data[num].torchs.length; i += 30) {
            this.torchs.push(data[1].torchs.slice(i, i + 30));
        }

        this.water = [];
        for (let i = 0; i < data[num].water.length; i += 30) {
            this.water.push(data[1].water.slice(i, i + 30));
        }
        this.spawns = [];
        for (let i = 0; i < data[num].spawns.length; i += 30) {
            this.spawns.push(data[1].spawns.slice(i, i + 30));
        }

        // Return an object containing both collision types
        return {
            solidCollisions: this.solidCollisions,
            plataformCollisions: this.plataformCollisions,
            torchs: this.torchs,
            water: this.water,
            spawns: this.spawns,
        };
    }
    create() {
        this.generateRoomBg();

    }

    update() {
        //Recorre el array de enemigos

        this.enemies.forEach(enemy => {
            enemy.update();

            if (!this.scene.cameras.main.worldView.contains(enemy.x, enemy.y)) {
                enemy.body.enable = false; // Desactiva físicas fuera de pantalla

            }else{
                enemy.body.enable = true;
                enemy.update();
            }
       
        });

    }


    generateRoomBg() {

        this.rooms.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                let collisions;
                let bg;
                if (rowIndex === this.roomSizeY - 1 && colIndex === 0) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'left_bottom1')
                    collisions = this.loadCollisions(left_bottom, 1);

                } else if ((rowIndex === this.roomSizeY - 1 && colIndex > 0 && colIndex < this.roomSizeX - 1)) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'bottom1')
                    collisions = this.loadCollisions(bottom, 1);

                } else if (rowIndex === this.roomSizeY - 1 && colIndex === this.roomSizeX - 1) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'right_bottom1')
                    collisions = this.loadCollisions(right_bottom, 1);

                } else if (colIndex === 0 && rowIndex > 0 && rowIndex < this.roomSizeY - 1) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'left')
                    collisions = this.loadCollisions(left, 1);

                } else if (rowIndex > 0 && rowIndex < this.roomSizeY - 1 && colIndex > 0 && colIndex < this.roomSizeX - 1) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'middle')
                    collisions = this.loadCollisions(middle, 1);

                } else if (colIndex === this.roomSizeX - 1 && rowIndex > 0 && rowIndex < this.roomSizeY - 1) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'right')
                    collisions = this.loadCollisions(right, 1);

                } else if (rowIndex === 0 && colIndex === 0) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'left_top')
                    collisions = this.loadCollisions(left_top, 1);

                } else if (rowIndex === 0 && colIndex > 0 && colIndex < this.roomSizeX - 1) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'top')
                    collisions = this.loadCollisions(top, 1);

                } else if (rowIndex === 0 && colIndex === this.roomSizeX - 1) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'right_top')
                    collisions = this.loadCollisions(right_top, 1);

                }
                bg.setTint(0xff0000);

                this.generateDeco(collisions.torchs, "torch", colIndex, rowIndex)
                this.generateDeco(collisions.water, "water", colIndex, rowIndex)



            });
        });

    }
    generateEnemies(array, segmentX, segmentY) {
        array.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                if (symbol != 0 && this.enemiesAmout > 0) {
                    this.enemies.push(new Enemy(this.scene, (colIndex + 1) * 32 + (960 * segmentX), (rowIndex + 1) * 32 + (960 * segmentY) - 64, 'enemySheet', this.player, 90));
                    this.enemiesAmout--;
                    console.log("New Enemy: " + this.enemies)
                }
            });
        });

    }
    generateRoom() {
        this.enemies = this.player.enemies;

        this.rooms.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                let collisions;
                if (rowIndex === this.roomSizeY - 1 && colIndex === 0) {
                    collisions = this.loadCollisions(left_bottom, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);

                } else if ((rowIndex === this.roomSizeY - 1 && colIndex > 0 && colIndex < this.roomSizeX - 1)) {
                    collisions = this.loadCollisions(bottom, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);

                } else if (rowIndex === this.roomSizeY - 1 && colIndex === this.roomSizeX - 1) {
                    collisions = this.loadCollisions(right_bottom, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);

                } else if (colIndex === 0 && rowIndex > 0 && rowIndex < this.roomSizeY - 1) {
                    collisions = this.loadCollisions(left, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);

                } else if (rowIndex > 0 && rowIndex < this.roomSizeY - 1 && colIndex > 0 && colIndex < this.roomSizeX - 1) {
                    collisions = this.loadCollisions(middle, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);

                } else if (colIndex === this.roomSizeX - 1 && rowIndex > 0 && rowIndex < this.roomSizeY - 1) {
                    collisions = this.loadCollisions(right, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);

                } else if (rowIndex === 0 && colIndex === 0) {
                    collisions = this.loadCollisions(left_top, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);

                } else if (rowIndex === 0 && colIndex > 0 && colIndex < this.roomSizeX - 1) {
                    collisions = this.loadCollisions(top, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);

                } else if (rowIndex === 0 && colIndex === this.roomSizeX - 1) {
                    collisions = this.loadCollisions(right_top, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);

                }
                this.generateEnemies(collisions.spawns, colIndex, rowIndex)
            });
        });

    }

    generateDeco(array, key, segmentX, segmentY) {

        array.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                let deco;
                if (symbol != 0) {

                    deco = new Effect(this.scene, (colIndex + 1) * 32 + (960 * segmentX) - 16, (rowIndex + 1) * 32 + (960 * segmentY), key)
                    deco.play(key);

                }
            });
        });
    }
    generateRoomSegment(collisions, isSolid, segmentX, segmentY) {
        let sizeX = 32;
        let sizeY = 32;
        let colStart = null;
        let rowStart = null;
        let meshing = false;

        collisions.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                if (symbol != 0) {
                    if (colStart === null) {
                        colStart = colIndex;
                    } else {
                        sizeX += 32;
                    }
                    meshing = true;

                } else if (meshing) {
                    if (sizeX > 32) {
                        this.generateMeshCollision(colStart + 0.2, rowIndex, sizeY, sizeX - 18, isSolid, segmentX, segmentY);
                        console.log(`Row: ${rowIndex}, Col: ${colIndex}, Symbol: ${symbol}, colStart: ${colStart}, sizeX: ${sizeX}`);
                    }

                    colStart = null;
                    sizeX = 32;
                    meshing = false;
                }

                if (colIndex === row.length - 1 && meshing) {
                    // Finalize the mesh for the last column in the row
                    if (sizeX > 32) {
                        this.generateMeshCollision(colStart + 0.2, rowIndex, sizeY, sizeX - 18, isSolid, segmentX, segmentY);
                        console.log(`Last col mesh: Row: ${rowIndex}, colStart: ${colStart}, sizeX: ${sizeX}`);
                    }

                    colStart = null;
                    sizeX = 32;
                    meshing = false;
                }
            });
        });

        // Reset variables for vertical meshing
        sizeX = 32;
        colStart = null;

        // Vertical meshing logic
        collisions[0].forEach((_, colIndex) => {
            rowStart = null;
            sizeY = 32;

            for (let rowIndex = 0; rowIndex < collisions.length; rowIndex++) {
                let symbol = collisions[rowIndex][colIndex];

                if (symbol != 0 && rowIndex < collisions.length - 1 && collisions[rowIndex + 1][colIndex] != 0) {

                    if (rowStart === null) {
                        rowStart = rowIndex; // Start a new mesh vertically
                        console.log(`START NEW VERTICAL MESH at col: ${colIndex}, row: ${rowStart}`);
                    } else {
                        sizeY += 32; // Increment height if we continue vertically
                    }
                } else if (rowStart !== null) {
                    // Generate vertical mesh when there's a gap
                    console.log(`END VERTICAL MESH at col: ${colIndex}, row: ${rowIndex}`);
                    this.generateMeshCollision(colIndex + 0.2, rowStart, sizeY, sizeX, isSolid, segmentX, segmentY);
                    rowStart = null;
                    sizeY = 32; // Reset sizeY for the next vertical block
                }
            }

            // If the last symbol in the column was part of a mesh, generate it
            if (rowStart !== null) {
                console.log(`END OF COLUMN, finalizing vertical mesh at col: ${colIndex}`);
                this.generateMeshCollision(colIndex + 0.2, rowStart, sizeY, sizeX, isSolid, segmentX, segmentY);
            }
        });

    }

    generateMeshCollision(posY, posX, sizeY, sizeX, isSolid, chunkX, chunkY) {
        const box = this.colliders.create(posY * 32 + (32 * 30 * chunkX), posX * 32 + (32 * 30 * chunkY), null)
            .setOrigin(0, 0)
            .setDisplaySize(sizeX, sizeY)
            .refreshBody() // Refrescar el cuerpo de la física
            .setVisible(false);// Hace las colisiones invisibles

        //Si es no es solid, desactiba las colisiones del box menos las de arriba, permitiendo
        //al jugador pasar a travez de la plataforma desde abajo o los lados pero pararse en esta si esta arriba
        if (!isSolid) {
            box.body.checkCollision.down = false;
            box.body.checkCollision.left = false;
            box.body.checkCollision.right = false;
        }

        //Añade colision entre las plataformas. el jugador y los enemigos
        this.scene.physics.add.collider(this.player, this.colliders);
        this.scene.physics.add.collider(this.enemies, this.colliders);

    }
}