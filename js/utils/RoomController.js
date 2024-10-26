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
import Mage from '/js/entities/Mage.js';

export default class LevelController extends Phaser.GameObjects.Container {
    constructor(scene, y, x) {
        super(scene, x, y);
        this.scene = scene;

        this.colliders = null;
        this.player = null;

        //Crea el tamaño aleatorio del nivel
        this.roomSizeX = Math.floor(Math.random() * (6 - 2 + 1)) + 2;
        this.roomSizeY = Math.floor(Math.random() * (6 - 2 + 1)) + 2;

        //Crea un array con el tamaño aleatorio creado
        this.rooms = Array.from({ length: this.roomSizeY }, () => Array(this.roomSizeX).fill(0));

        //Crea un grupo usando metodos de phaser para gaurdar enemigos
        this.enemies = this.scene.physics.add.group();
        //La cantidad de enemigos que se pueden generar en el nivel
        this.enemiesAmout = 20;
        //Genera un tinte random para aplicarle al nivel
        this.randomTint = this.getRandomTint();

    }

    //Este metodo se encarga de cargar las colisiones y decoraciones de los niveles en la carpeta data
    loadCollisions(data, num) {
        this.solidCollisions = [];

        //Guarda las colisiones solidas
        for (let i = 0; i < data[num].fullCollisions.length; i += 30) {
            this.solidCollisions.push(data[1].fullCollisions.slice(i, i + 30));
        }

        //Guarda las colisiones de las plataformas
        this.plataformCollisions = [];
        for (let i = 0; i < data[num].plataformCollisions.length; i += 30) {
            this.plataformCollisions.push(data[1].plataformCollisions.slice(i, i + 30));
        }

        //Guarda las posiiones de las antorchas 
        this.torchs = [];
        for (let i = 0; i < data[num].torchs.length; i += 30) {
            this.torchs.push(data[1].torchs.slice(i, i + 30));
        }

        //Guarda las posiiones del agua
        this.water = [];
        for (let i = 0; i < data[num].water.length; i += 30) {
            this.water.push(data[1].water.slice(i, i + 30));
        }

        //Guarda las posiiones de los spawns de los enemigos
        this.spawns = [];
        for (let i = 0; i < data[num].spawns.length; i += 30) {
            this.spawns.push(data[1].spawns.slice(i, i + 30));
        }

        // retorna los arrays guardados
        return {
            solidCollisions: this.solidCollisions,
            plataformCollisions: this.plataformCollisions,
            torchs: this.torchs,
            water: this.water,
            spawns: this.spawns,
        };
    }
    create() {
        //Llama al metodo encargado de dibujar lo meramente visual
        this.generateRoomBg();
    }

    update() {
        //Recorre el array de enemigos
        if (this.enemies && this.enemies.children) {
            this.enemies.children.iterate(enemy => {
                if (enemy) {
                    //Detecta si el enemigo esta en pantalla, si lo esta, llama a su update,
                    //de lo contrario lo ignora, esto ayuda al performance ya que no se gasta 
                    //procesado innecesario
                    if (!this.scene.cameras.main.worldView.contains(enemy.x, enemy.y)) {
                        enemy.body.enable = false;
                    } else {
                        enemy.body.enable = true;
                        enemy.update();
                    }
                }
            });
        }
    }


    //Este metodo se llama de primero, se encarga de dibujar solo lo visual del nivel,
    //como los fondos, decoraciones como las antorhas, el agua y eso
    generateRoomBg() {
        this.rooms.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                //Detecta cual segmento se necesita en que posiciones del nivel aleatorio y dibuja lo necesario
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
                //Despues de haber dibujado el fondo, aplica un tinte al nivel
                bg.setTint(this.randomTint);
                //Llama al metodo de dibujar las decoraciones
                this.generateDeco(collisions.torchs, "torch", colIndex, rowIndex)
                this.generateDeco(collisions.water, "water", colIndex, rowIndex)
            });
        });

    }

    //Genera un tinte aleatorio, con unos valores rgb minimos para que
    //el tinte resultante no sea tan oscuro, tambien dtermina cual es el
    //valor rgb mayor y aplica ese tinte, esto para que los colores sean
    //mas saturados
    getRandomTint() {
        /*Este metodo fue generado con IA
        Prompts
        1.Give a rndom tint

        2.ok change this to a more simple way, isntead of random number from 0 to 256, do one
        from 0 to a 100, and add that random number to a base number that will be 156
        
        3.add beforethat, 3 random numbers betwin 0-1, or random bol idk if theres that, so 
        that first will roll 50/50 or 33/63 to determine if it adds a tint, then will randomly 
        will determine witch rgb values will use
        */

        // Roll to determine if we should apply a tint (50/50 chance)
        if (Math.random() < 0.7) { // 50% chance to apply a tint
            // Generate a random number from 0 to 100
            const randomValue = Math.floor(Math.random() * 101); // Random value between 0 and 100
            const baseValue = 156; // Base value

            // Initialize RGB values
            let red = baseValue;
            let green = baseValue;
            let blue = baseValue;

            // Randomly choose which RGB values to modify (33/67 chance)
            for (let i = 0; i < 3; i++) {
                const randomChannel = Math.random();
                if (randomChannel < 0.33) {
                    red = Math.min(baseValue + randomValue, 255); // Modify red
                } else if (randomChannel < 0.67) {
                    green = Math.min(baseValue + randomValue, 255); // Modify green
                } else {
                    blue = Math.min(baseValue + randomValue, 255); // Modify blue
                }
            }

            // Convert RGB to hex for Phaser tinting
            return (red << 16) + (green << 8) + blue;
        } else {
            // Return a default tint if no tint is applied (e.g., no tint)
            return 0xffffff; // No tint (white)
        }
    }

    //Recorre el array de spawns del segmento enviado por parametro, para
    //generar enemigos en esta posicion
    generateEnemies(array, segmentX, segmentY) {
        array.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                if (symbol != 0 && this.enemiesAmout > 0) {
                    let enemy = new Mage(
                        this.scene,
                        (colIndex + 1) * 32 + (960 * segmentX),
                        (rowIndex + 1) * 32 + (960 * segmentY) - 64,
                        'enemySheet',
                        this.player,
                        90 + Math.floor(Math.random() * (109 - 0 + 1))
                    );
                    this.enemies.add(enemy); // Add enemy to the group
                    this.enemiesAmout--;
                }
            });
        });
    }

    //Este array se encarga de generar las colisiones necesarias de cada segmento
    generateRoom() {
        this.rooms.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                let collisions;
                /*Determina que piesa necesita cada segmento, por ejemplo si necesita una esquina superior izquierda
                esquina inferior derecha, una piezasolo del borde izquierdo, derwevcho, una pieza que va en el medio etc...
                por ahora solo hay una pieza de cada, pero ya esta la logica para tener piezas aleatorias*/
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

    //Recorre el array de decoraciones anviado por paramtro para dibujarlas
    generateDeco(array, key, segmentX, segmentY) {
        array.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                let deco;
                if (symbol != 0) {
                    deco = new Effect(this.scene, (colIndex + 1) * 32 + (960 * segmentX) - 16, (rowIndex + 1) * 32 + (960 * segmentY), key)
                    deco.play(key);
                    deco.setTint(this.randomTint);
                }
            });
        });
    }

    //Genera los colisiones del mapa y las plataformas para cada segmento, y aplica la tecnica de
    //optimizacion de meshing, unificando colisiones en unas solas, para reducir procesado
    //innecesario
    generateRoomSegment(collisions, isSolid, segmentX, segmentY) {
        //va guardando el tamaño de cada colisiones
        let sizeX = 32;
        let sizeY = 32;
        //guarda desde donde inicia a crear un meshing
        let colStart = null;
        let rowStart = null;
        //guarda si esta haciendo meshing
        let meshing = false;

        //Creacion de collisiones con meshing horizontales
        collisions.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                //Detecta si la posicion actual es diferente a 0
                if (symbol != 0) {
                    //si es diferente a 0 y aun no a empezado a hacer meshing, guarda la cordenada de inicio
                    if (colStart === null) {
                        colStart = colIndex;
                    } else {
                        //de lo contrario, si ya empezo a hacer mehsing la añade al tamaño del que va a ser la colision
                        sizeX += 32;
                    }
                    meshing = true;

                    //De lo contrario, si ya la posicion actual es 0, Y estaba haciendo meshing, va a dibujar la
                    //colision con las dimenciones necesarias en la posicion necesaria
                } else if (meshing) {
                    if (sizeX > 32) {
                        this.generateMeshCollision(colStart + 0.2, rowIndex, sizeY, sizeX - 18, isSolid, segmentX, segmentY);
                    }
                    //Reinicia las variables
                    colStart = null;
                    sizeX = 32;
                    meshing = false;
                }

                //Esto controla si ya llego al final de la row, y estaba haciendo meshing
                if (colIndex === row.length - 1 && meshing) {
                    if (sizeX > 32) {
                        this.generateMeshCollision(colStart + 0.2, rowIndex, sizeY, sizeX - 18, isSolid, segmentX, segmentY);
                    }
                    //Reinicia las variables
                    colStart = null;
                    sizeX = 32;
                    meshing = false;
                }
            });
        });

        //Reinicia para empezar el meshing vertical
        sizeX = 32;
        colStart = null;

        //Creacion de collisiones con meshing verticales
        collisions[0].forEach((_, colIndex) => {
            rowStart = null;
            sizeY = 32;

            for (let rowIndex = 0; rowIndex < collisions.length; rowIndex++) {
                let symbol = collisions[rowIndex][colIndex];

                //Detecta si la posicion actual es diferente a 0 y es menor al lenght en row, y en el siguiente row hay una colision
                if (symbol != 0 && rowIndex < collisions.length - 1 && collisions[rowIndex + 1][colIndex] != 0) {

                    //Si no a empezado a hacer meshing, guarda la posicion inicial
                    if (rowStart === null) {
                        rowStart = rowIndex;

                        //De lo contrario, añade al tamaño del que va a ser la colision
                    } else {
                        sizeY += 32;
                    }

                    //Se lo contrario, si la posicion actual es 0, y se empezo a hacer meshing va a dibujar la colisio con el tamaño indicado
                } else if (rowStart !== null) {
                    this.generateMeshCollision(colIndex + 0.2, rowStart, sizeY, sizeX, isSolid, segmentX, segmentY);
                    rowStart = null;
                    sizeY = 32;
                }
            }

            //controla si ya llego al final y queda una colision por dibujar pendiente
            if (rowStart !== null) {
                this.generateMeshCollision(colIndex + 0.2, rowStart, sizeY, sizeX, isSolid, segmentX, segmentY);
            }
        });

    }

    //Genera la colision individual
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