import bottom from '../data/bottom.js';
import left_bottom from '../data/left_bottom.js';
import Background from '/js/Background.js';

export default class LevelController extends Phaser.GameObjects.Container {
    constructor(scene, y, x) {
        super(scene, x, y);
        this.scene = scene;

        this.colliders = null;
        this.player = null;
        this.enemies = null;

        this.roomSizeX = Math.floor(Math.random() * (9 - 2 + 1)) + 2;
        this.roomSizeY = Math.floor(Math.random() * (9 - 2 + 1)) + 2;

        this.rooms = Array.from({ length: this.roomSizeY }, () => Array(this.roomSizeX).fill(0));
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

        // Return an object containing both collision types
        return {
            solidCollisions: this.solidCollisions,
            plataformCollisions: this.plataformCollisions
        };
    }
    create() {
        this.generateRoomBg();
    }


    generateRoomBg() {

        this.rooms.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                let bg;
                if (rowIndex === this.roomSizeY - 1 && colIndex === 0) {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'left_bottom1')
                } else {
                    bg = new Background(this.scene, colIndex + 1, rowIndex + 1, 'bottom1')
                }
                bg.setDepth(-1);
            });
        });

    }
    generateRoom() {
        this.enemies = this.player.enemies;

        this.rooms.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                let collisions;
                let bg;
                if (rowIndex === this.roomSizeY - 1 && colIndex === 0) {
                    collisions = this.loadCollisions(left_bottom, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);
                } else {
                    collisions = this.loadCollisions(bottom, 1);
                    this.generateRoomSegment(collisions.solidCollisions, true, colIndex, rowIndex);
                    this.generateRoomSegment(collisions.plataformCollisions, false, colIndex, rowIndex);
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
            .setVisible(true);// Hace las colisiones invisibles

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


    //Este metodo se encarga de recorrer un array de cordenadas, el cual por cada coordenada crea una
    //collision en la posicion correspondiente
    /*  generateWorld(collisions, isSolid) {
          collisions.forEach((row, rowIndex) => {
              row.forEach((symbol, colIndex) => {
                  if (symbol != 0) {
                      // Añade un hitbox de 32x32 que corresponde al tamaño de cada tile visual
                      const box = this.colliders.create(colIndex * 32, rowIndex * 32, null)
                          .setOrigin(0, 0)
                          .setDisplaySize(32, 32)
                          .refreshBody() // Refrescar el cuerpo de la física
                          .setVisible(true);// Hace las colisiones invisibles
  
                      //Si es no es solid, desactiba las colisiones del box menos las de arriba, permitiendo
                      //al jugador pasar a travez de la plataforma desde abajo o los lados pero pararse en esta si esta arriba
                      if (!isSolid) {
                          box.body.checkCollision.down = false;
                          box.body.checkCollision.left = false;
                          box.body.checkCollision.right = false;
                      }
  
                      //Añade colision entre las plataformas. el jugador y los enemigos
                      this.physics.add.collider(this.player, this.colliders);
                      this.physics.add.collider(this.enemies, this.colliders);
                  }
              });
          });
      }*/
}