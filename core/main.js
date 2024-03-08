let player;
let monsters = [];
let tileSize = 32;
let playerSpeed = 0.1; // Vitesse de déplacement du joueur
let layer = [];
let layerImages = [];

var tiledmap;

function preload() {
    tiledmap = loadTiledMap("map1", "core");
}

function setup() {
    createCanvas(mapData.width * tileSize, mapData.height * tileSize);
    player = new Player(3, 3); // Position initiale du joueur (0, 0) à modifier selon votre carte
    monsters.push(new Monster(mapData.width - 3, mapData.height - 3)); // Position initiale du premier monstre (coin opposé)
    monsters.push(new Monster(3, 15)); // Ajout d'un second monstre à une position différente
    monsters.push(new Monster(15, 15)); // Ajout d'un second monstre à une position différente
    frameRate(60); // Définit le nombre de frames par seconde (FPS)
    layer = getTilemapLayers(tiledmap);
    layerImages = getTilemapImages(tiledmap);
}

function draw() {
    background(255);
    // Afficher la carte
    for (let x = 0; x < mapData.width; x++) {
        for (let y = 0; y < mapData.height; y++) {
            let index = x + y * mapData.width;
            let tile = mapData.layers[0].data[index];
            if (tile !== 0) {
                // Dessiner la tuile
                fill(100);
                rect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
    image(layerImages[0], 0, 0);
    image(layerImages[1], 0, 0);
    // Dessiner le joueur
    player.display();

    // Déplacer le joueur en fonction des touches enfoncées
    if (keyIsDown(LEFT_ARROW)) {
        player.move(-playerSpeed, 0, "l");
    } else if (keyIsDown(RIGHT_ARROW)) {
        player.move(playerSpeed, 0, "r");
    }
    if (keyIsDown(UP_ARROW)) {
        player.move(0, -playerSpeed, "u");
    } else if (keyIsDown(DOWN_ARROW)) {
        player.move(0, playerSpeed, "d");
    }
    if (frameCount % 20 === 0) {
        // Déplacer les monstres à intervalles réguliers
        for (let monster of monsters) {
            // Calculer le nouveau chemin du monstre
            monster.display();
            monster.findShortestPath(player.x, player.y);
            monster.move();
            // Dessiner le monstre
            //monster.takeDamage(1)
        }

    }
    // Dessinez les monstres
    else {
        // Déplacer les monstres à intervalles réguliers
        for (let monster of monsters) {
            // Dessiner le monstre
            monster.display();
        }

    }

    player.displayHealthBar();
}
