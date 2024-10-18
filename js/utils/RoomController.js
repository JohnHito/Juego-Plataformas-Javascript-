export default class LevelController {
    constructor(scene, y, x, key) {

        
    }



    generateRoom() {
        const roomSizeX = Math.floor(Math.random() * (9 - 2 + 1)) + 2;
        const roomSizeY = Math.floor(Math.random() * (9 - 2 + 1)) + 2;

        const room = Array.from({ length: roomSizeY }, () => Array(roomSizeX).fill(0));

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
        this.physics.add.collider(this.player, this.colliders);
        this.physics.add.collider(this.enemies, this.colliders);

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