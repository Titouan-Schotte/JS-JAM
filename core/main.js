let player;
let monsters = [];
let tileSize = 32;
let playerSpeed = 1; // Vitesse de déplacement du joueur
let monsterSpeed = 1; // Vitesse de déplacement du monstre
let lastMonsterMoveTime = 0;
let monsterMoveInterval = 1000; // Interval de déplacement du monstre en millisecondes

function setup() {
    createCanvas(mapData.width * tileSize, mapData.height * tileSize);
    player = new Player(0, 0); // Position initiale du joueur (0, 0) à modifier selon votre carte
    monsters.push(new Monster(mapData.width - 1, mapData.height - 1)); // Position initiale du premier monstre (coin opposé)
    monsters.push(new Monster(3, 3)); // Ajout d'un second monstre à une position différente
    frameRate(20); // Définit le nombre de frames par seconde (FPS)
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
    // Dessiner le joueur
    player.display();

    // Déplacer le joueur en fonction des touches enfoncées
    if (keyIsDown(LEFT_ARROW)) {
        player.move(-playerSpeed, 0);
    } else if (keyIsDown(RIGHT_ARROW)) {
        player.move(playerSpeed, 0);
    }
    if (keyIsDown(UP_ARROW)) {
        player.move(0, -playerSpeed);
    } else if (keyIsDown(DOWN_ARROW)) {
        player.move(0, playerSpeed);
    }

    // Déplacer les monstres à intervalles réguliers
    let currentTime = millis();
    if (currentTime - lastMonsterMoveTime > monsterMoveInterval) {
        for (let monster of monsters) {
            // Calculer le nouveau chemin du monstre
            monster.findShortestPath(player.x, player.y);
        }
        lastMonsterMoveTime = currentTime;
    }

    // Déplacer chaque monstre selon le chemin calculé
    for (let monster of monsters) {
        monster.move();
        // Dessiner le monstre
        monster.display();
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    display() {
        fill(0, 0, 255);
        ellipse(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize, tileSize);
    }

    move(dx, dy) {
        // Vérifie si le déplacement est valide
        let newX = this.x + dx;
        let newY = this.y + dy;

        // Limite les mouvements à l'intérieur de la zone de jeu
        newX = constrain(newX, 0, mapData.width - 1);
        newY = constrain(newY, 0, mapData.height - 1);

        if (this.isValidMove(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
    }

    isValidMove(x, y) {
        // Vérifie si la position (x, y) est valide sur la carte
        // Ici, vous devez vérifier si la position correspond à une case vide sur la couche de collision
        let index = x + y * mapData.width;
        let tile = mapData.layers[0].data[index];
        return tile === 0; // Renvoie true si la case est vide, sinon false
    }
}

class Monster {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.path = []; // Chemin que le monstre doit suivre pour atteindre le joueur
    }

    display() {
        fill(255, 0, 0);
        ellipse(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize, tileSize);
    }

    findShortestPath(targetX, targetY, playerX, playerY) {
        let openSet = [];
        let closedSet = new Set();
        let cameFrom = new Map();
        let gScore = new Map();
        let fScore = new Map();

        // Initialisation
        openSet.push({ x: this.x, y: this.y });
        gScore.set(`${this.x},${this.y}`, 0);
        fScore.set(`${this.x},${this.y}`, this.heuristic(this.x, this.y, targetX, targetY));

        while (openSet.length > 0) {
            // Trouver le noeud avec le coût le plus bas estimé (fScore)
            let current = openSet.reduce((minNode, node) => (fScore.get(`${node.x},${node.y}`) < fScore.get(`${minNode.x},${minNode.y}`)) ? node : minNode);

            if (current.x === targetX && current.y === targetY) {
                // Construire le chemin
                let path = [];
                while (cameFrom.has(`${current.x},${current.y}`)) {
                    path.unshift(current);
                    current = cameFrom.get(`${current.x},${current.y}`);
                }
                this.path = path;
                return;
            }

            openSet = openSet.filter(node => !(node.x === current.x && node.y === current.y));
            closedSet.add(`${current.x},${current.y}`);

            // Parcourir les voisins
            let neighbors = this.getNeighbors(current.x, current.y);
            for (let neighbor of neighbors) {
                if (!closedSet.has(`${neighbor.x},${neighbor.y}`)) {
                    let tentative_gScore = gScore.get(`${current.x},${current.y}`) + 1;
                    if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                        openSet.push(neighbor);
                    } else if (tentative_gScore >= gScore.get(`${neighbor.x},${neighbor.y}`)) {
                        continue;
                    }

                    // Ce chemin est le meilleur jusqu'à présent
                    cameFrom.set(`${neighbor.x},${neighbor.y}`, { x: current.x, y: current.y });
                    gScore.set(`${neighbor.x},${neighbor.y}`, tentative_gScore);
                    fScore.set(`${neighbor.x},${neighbor.y}`, tentative_gScore + this.heuristic(neighbor.x, neighbor.y, targetX, targetY));
                }
            }
        }

        // Aucun chemin trouvé
        this.path = [];
    }


    heuristic(x1, y1, x2, y2) {
        // Heuristique de distance de Manhattan
        return abs(x1 - x2) + abs(y1 - y2);
    }

    move() {
        // Déplacer le monstre selon le chemin calculé
        if (this.path.length > 0) {
            let nextPos = this.path.shift(); // Prendre la prochaine étape du chemin
            // Vérifier si la nouvelle position est valide pour le monstre
            if (this.isValidMove(nextPos.x, nextPos.y) && !this.isCollidingWithOtherMonsters(nextPos.x, nextPos.y) && !this.isCollidingWithPlayer(nextPos.x, nextPos.y)) {
                this.x = nextPos.x;
                this.y = nextPos.y;
            }
        }
    }

// Ajoutez une méthode pour vérifier la collision avec d'autres monstres
    isCollidingWithOtherMonsters(x, y) {
        for (let monster of monsters) {
            if (monster !== this && monster.x === x && monster.y === y) {
                return true; // Collision détectée avec un autre monstre
            }
        }
        return false; // Aucune collision détectée
    }
    isCollidingWithPlayer(x, y) {
        // Vérifie si la position (x, y) est occupée par le joueur
        return x === player.x && y === player.y;
    }

    getNeighbors(x, y) {
        let neighbors = [];
        let directions = [
            { dx: -1, dy: 0 }, // gauche
            { dx: 1, dy: 0 },  // droite
            { dx: 0, dy: -1 }, // haut
            { dx: 0, dy: 1 }   // bas
        ];

        for (let dir of directions) {
            let nx = x + dir.dx;
            let ny = y + dir.dy;
            if (nx >= 0 && nx < mapData.width && ny >= 0 && ny < mapData.height) {
                let index = nx + ny * mapData.width;
                let tile = mapData.layers[0].data[index];
                if (tile === 0) {
                    neighbors.push({ x: nx, y: ny });
                }
            }
        }

        return neighbors;
    }

    isValidMove(x, y) {
        // Vérifie si la position (x, y) est valide sur la carte pour le monstre
        // Ici, vous devez vérifier si la position correspond à une case vide sur la couche de collision
        let index = x + y * mapData.width;
        let tile = mapData.layers[0].data[index];
        return tile === 0; // Renvoie true si la case est vide, sinon false
    }
}
