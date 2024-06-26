let monsterBossCACImages = [];
let reverseBossMonsterCACImages = [];


class MonsterBossCAC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.path = []; // Chemin que le monstre doit suivre pour atteindre le joueur
        this.speed = 0.001;
        this.health = 500;
        this.isDead = false;
        this.reach = 1;
        this.strenght = 10;
        this.refreshFrame = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
    }

    display() {
        if (!this.isDead){
            fill(255, 0, 0);
            // ellipse(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize, tileSize);
            if (player.x <= this.x) {
                image(reverseBossMonsterCACImages[currentFrame], this.x*32, (this.y-0.2)*32, 40, 40);
            } else if (player.x >= this.x) {
                image(monsterBossCACImages[currentFrame], this.x*32, (this.y-0.2)*32, 40, 40);
            }


            // Dessiner la barre de vie au-dessus du monstre
            let barWidth = tileSize * 1.3;
            let barHeight = 5;
            let barX = this.x * tileSize + (tileSize - barWidth) / 2;
            let barY = this.y * tileSize - 10;

            // Dessiner la barre de vie
            fill(160, 255, 0);
            rect(barX, barY, barWidth * (this.health / 500), barHeight);
            noFill();
            stroke(0);
            rect(barX, barY, barWidth, barHeight);
        }

    }
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    findShortestPath() {
        let targetX, targetY;
        if(!player.isDead){
            targetX = player.x + this.getRandomArbitrary(-1, 1)
            targetY = player.y + this.getRandomArbitrary(-1, 1)
        } else {
            targetX = this.baseX
            targetY = this.baseY
        }

        if (!this.isDead){
            let startX = Math.floor(this.x);
            let startY = Math.floor(this.y);
            targetX = Math.floor(targetX);
            targetY = Math.floor(targetY);
            let openSet = [];
            let closedSet = new Set();
            let cameFrom = new Map();
            let gScore = new Map();
            let fScore = new Map();

            // Initialisation
            openSet.push({ x: startX, y: startY });
            gScore.set(`${startX},${startY}`, 0);
            fScore.set(`${startX},${startY}`, this.heuristic(startX, startY, targetX, targetY));

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
                    this.path = this.smoothPath(path);
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

    }

    smoothPath(path) {
        // Ajoute des étapes intermédiaires au chemin en fonction de la vitesse du monstre
        let smoothedPath = [path[0]]; // Commencer avec le premier point du chemin
        let lastIndex = 0;
        for (let i = 1; i < path.length; i++) {
            let dx = path[i].x - path[lastIndex].x;
            let dy = path[i].y - path[lastIndex].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance >= this.speed) {
                let steps = Math.floor(distance / this.speed);
                let stepX = dx / distance * this.speed;
                let stepY = dy / distance * this.speed;
                for (let j = 1; j <= steps; j++) {
                    let step = {
                        x: path[lastIndex].x + stepX * j,
                        y: path[lastIndex].y + stepY * j
                    };
                    smoothedPath.push(step);
                }
                lastIndex = i;
            }
        }
        smoothedPath.push(path[path.length - 1]); // Ajouter le dernier point du chemin
        return smoothedPath;
    }

    heuristic(x1, y1, x2, y2) {
        // Heuristique de distance de Manhattan
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
    euclidienne(x1, y1, x2, y2) {
        // Heuristique de distance de Manhattan
        return Math.sqrt(Math.pow(x2- x1, 2) + Math.pow(y2 - y1, 2));
    }
    move() {
        if (!this.isDead){
            // Déplacer le monstre selon le chemin calculé
            if (this.path.length > 0) {
                let nextPos = this.path.shift(); // Prendre la prochaine étape du chemin
                if (nextPos == undefined){
                    return
                }

                //ATTACK PLAYER
                if(this.euclidienne(nextPos.x, nextPos.y, player.x, player.y) <= this.reach){
                    this.attack(this.strenght, player);
                    return
                }

                // Vérifier si la nouvelle position est valide pour le monstre
                if (isValidMove(nextPos.x, nextPos.y) && !this.isCollidingWithOtherMonsters(nextPos.x, nextPos.y) && !this.isCollidingWithPlayer(nextPos.x, nextPos.y)) {
                    this.x = nextPos.x;
                    this.y = nextPos.y;
                }
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
            { dx: 0, dy: 1 },  // bas
            { dx: -1, dy: -1 }, // diagonale haut-gauche
            { dx: 1, dy: -1 },  // diagonale haut-droite
            { dx: -1, dy: 1 }, // diagonale bas-gauche
            { dx: 1, dy: 1 }   // diagonale bas-droite
        ];

        for (let dir of directions) {
            let nx = x + dir.dx;
            let ny = y + dir.dy;
            // Assurez-vous que les coordonnées des voisins sont des entiers
            nx = Math.floor(nx);
            ny = Math.floor(ny);
            if (nx >= 0 && nx < mapData.width && ny >= 0 && ny < mapData.height) {
                let index = nx + ny * mapData.width;
                let tile = mapData.layers[0].data[index];
                let isCollisionWithMonster = false;
                for (let monster of monsters) {
                    if (monster !== this && monster.x === nx && monster.y === ny) {
                        isCollisionWithMonster = true;
                        break;
                    }
                }
                if (tile === 0 && !isCollisionWithMonster) {
                    neighbors.push({ x: nx, y: ny });
                }
            }
        }

        return neighbors;
    }


    takeDamage(damage) {
        if (isInstantKill){
            this.death()
        }
        // Enlever des points de vie
        this.health -= damage;
        if (this.health <= 0) {
            this.death()
        }
    }

    heal(amount) {
        // Augmenter la santé du monstre
        this.health += amount;
        // S'assurer que la santé ne dépasse pas 100
        if (this.health > 100) {
            this.health = 100;
        }
    }

    death() {
        this.isDead = true;
        bloodbonus.push(new BloodBonus(this.x, this.y))
    }

    attack(damageAmount, target){
        target.takeDamage(damageAmount)
    }
}